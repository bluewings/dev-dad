import React from 'react';
import Highlight, { defaultProps } from 'prism-react-renderer';
import { LiveProvider, LiveEditor, LiveError, LivePreview } from 'react-live';
import './Code.scss';

const identity = (e: any) => e;

export const Code = ({ codeString, language, highlightLines, ...props }: any) => {
  if (props['react-live']) {
    return (
      <LiveProvider code={codeString} noInline>
        <LiveEditor />
        <LiveError />
        <LivePreview />
      </LiveProvider>
    );
  }
  const overrideProps = (prev: any, type?: any) => {
    const next = { ...prev };
    delete next.style;
    if (type === 'line' && highlightLines && highlightLines.indexOf(next.key) !== -1) {
      return {
        ...next,
        className: [next.className, 'gatsby-highlight-code-line'].filter(identity).join(' '),
      };
    }
    return next;
  };
  return (
    <Highlight {...defaultProps} code={codeString} language={language}>
      {({ className, tokens, getLineProps, getTokenProps }) => (
        <div className="prism-code-wrap gatsby-highlight">
          <pre className={className}>
            {tokens.map((line, i) => (
              <div {...overrideProps(getLineProps({ line, key: i }), 'line')}>
                {line.map((token, key, arr) => {
                  let fixed = token;
                  if (token.empty && !token.content && arr.length === 1) {
                    fixed = { ...token, content: ' ' };
                  }
                  return <span {...overrideProps(getTokenProps({ token: fixed, key }))} />;
                })}
              </div>
            ))}
          </pre>
        </div>
      )}
    </Highlight>
  );
};
