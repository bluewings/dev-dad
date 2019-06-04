/* eslint-disable no-param-reassign */
const visit = require(`unist-util-visit`);

const identity = (e) => e;

module.exports = ({ markdownAST }) =>
  new Promise((resolve) => {
    const pattern = /^@([^\s#.,]+)(#([^\s.,]+))?(\.[^\s,]+)?(,(.*))?$/;
    let index = 0;
    visit(markdownAST, 'paragraph', (node) => {
      // convert ruled-link to custom-grid node
      if (node.children && node.children.length === 1) {
        const child = node.children[0];
        if (child.type === 'link' && child.url && child.url.search(pattern) === 0) {
          const [, _tag, , _id, _classNames, , _params] = child.url.match(pattern);
          const [tag, ...args] = _tag.split('-');

          const params = (_params || '')
            .split(',')
            .filter(identity)
            .reduce((accum, e) => {
              const [, key, , value] = e.match(/^([^\s]+?)(=([^\s]+)){0,1}$/) || [];
              return key
                ? {
                    ...accum,
                    [key]: typeof value === 'undefined' ? true : value,
                  }
                : accum;
            }, {});

          const className = (_classNames || '')
            .split('.')
            .filter(identity)
            .join(' ');

          const key = `gatsby-snippet-${index}`;

          node.type = 'html';
          node.value = `<gatsby--${tag} key="${key}" ${_id ? `id="${_id}" ` : ''}${
            className ? `className="${className}" ` : ''
          }args={${JSON.stringify(args)}} params={${JSON.stringify(params)}} />`;

          delete node.children;

          index += 1;
        }
      }
    });
    resolve(markdownAST);
  });
