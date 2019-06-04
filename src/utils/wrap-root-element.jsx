import React from 'react';
import { MDXProvider } from '@mdx-js/tag';
import rangeParser from 'parse-numeric-range';
import { Code } from '../components/code';
import Grid from '../components/Grid';
import { Provider as ThemeProvider } from './theme-context';
import { Provider as DataProvider } from './context';
import styles from './wrap.module.scss';

const preToCodeBlock = (preProps) => {
  if (
    // children is MDXTag
    preProps.children &&
    // MDXTag props
    preProps.children.props &&
    // if MDXTag is going to render a <code>
    preProps.children.props.name === 'code'
  ) {
    // we have a <pre><code> situation
    const {
      children: codeString,
      props: { className, ...props },
    } = preProps.children.props;
    let language;
    let highlightLines;
    if (typeof className === 'string') {
      const matched = className.trim().match(/^language-([^{}]+)(\{(.+)\}){0,1}$/);
      if (matched) {
        let option;
        [, language, , option] = matched;
        if (typeof option === 'string' && option.match(/^[0-9,-.]+$/)) {
          try {
            highlightLines = rangeParser.parse(option);
          } catch (err) {
            // ignore
          }
        }
      }
    }
    return {
      codeString: codeString.trim(),
      language,
      highlightLines,
      ...props,
    };
  }
  return null;
};

const GRID = 'grid';
const GRID_WRAPPER = 'row';

const parseNode = (() => {
  const pattern = /^gatsby--([^\s]+)$/;
  return (node) => {
    const { type, key, props } = node;
    if (typeof type === 'string' && type.search(pattern) === 0) {
      const [, tagName] = type.match(pattern);
      let tag = tagName.replace(/end$/, '');
      const open = tagName === tag;
      if (tag === GRID && open === false) {
        tag = GRID_WRAPPER;
      }
      return { tag, open, key, props };
    }
    return { tag: null, type: null, node };
  };
})();

const getParent = (stack) => stack.slice(-1)[0] || {};

const getCursor = (stack, root) => getParent(stack).cursor || root;

const getChildProps = (tag, props = {}) => {
  const { id, className, args = [], params = {} } = props;

  const styleKeys = ['background', 'color', 'overflow', 'minHeight', 'maxHeight', 'height'];

  const childStyle = Object.keys(params)
    .filter((e) => styleKeys.indexOf(e) !== -1)
    .reduce((accum, key) => ({ ...accum, [key]: params[key] }), {});

  const dataProps = Object.keys(params)
    .filter((e) => e.search(/^@/) !== -1)
    .reduce((accum, key) => ({ ...accum, [key.replace(/^@/, 'data-')]: params[key] }), {});

  const childProps = {
    ...dataProps,
    className: [`gatsby--${tag}`, ...[tag, ...(args || []).map((e) => `${tag}_${e}`)].map((e) => styles[e]), className]
      .filter((e) => e)
      .join(' '),
  };

  if (id) {
    childProps.id = id;
  }
  if (Object.keys(childStyle).length > 0) {
    childProps.style = childStyle;
  }

  return childProps;
};

// components is its own object outside of render so that the references to
// components are stable
const components = {
  pre: (preProps) => {
    const props = preToCodeBlock(preProps);
    // if there's a codeString and some props, we passed the test
    if (props) {
      return <Code {...props} />;
    }
    // it's possible to have a pre without a code in it
    return <pre {...preProps} />;
  },
  wrapper: (gridProps) => {
    const children = Array.isArray(gridProps.children) ? gridProps.children : [gridProps.children];

    return children.reduce(
      (accum, child, i) => {
        const { tag, key, props, open } = parseNode(child);
        const { stack, root } = accum;

        if (tag) {
          const parent = getParent(stack);
          if (open) {
            // same as the previous tag, create it as a sibling node.
            if (parent && parent.tag === tag) {
              stack.pop();
            }
            if (tag === GRID && getParent(stack).tag !== GRID_WRAPPER) {
              const columns = [];
              const childProps = getChildProps(GRID_WRAPPER);
              getCursor(stack, root).push(
                <div key={key} {...childProps} data-snippet-tag={GRID_WRAPPER}>
                  {columns}
                </div>,
              );
              stack.push({ tag: GRID_WRAPPER, cursor: columns });
            }
            const childNodes = [];
            const childProps = getChildProps(tag, props);
            let next = (
              <div key={key} {...childProps} data-snippet-tag={tag}>
                {childNodes}
              </div>
            );
            if (tag === 'context') {
              next = <DataProvider>{next}</DataProvider>;
            } else if (tag === GRID) {
              next = (
                <div key={key} {...childProps} data-snippet-tag={tag}>
                  <Grid {...props.params}>{childNodes}</Grid>
                </div>
              );
            }
            getCursor(stack, root).push(next);
            stack.push({ tag, cursor: childNodes });
          } else {
            let curr;
            do {
              curr = stack.pop();
            } while (curr && curr.tag !== tag);
          }
        } else {
          getCursor(stack, root).push(child);
        }
        return accum;
      },
      { root: [], stack: [] },
    ).root;
  },
};

export const wrapRootElement = ({ element }) => (
  <ThemeProvider>
    <MDXProvider components={components}>{element}</MDXProvider>
  </ThemeProvider>
);
