/* eslint-disable prefer-destructuring */
const path = require(`path`);
const { createFilePath } = require(`gatsby-source-filesystem`);
const { getSlugAndLang } = require('ptz-i18n');
const { supportedLanguages, langKeyDefault, pagesPaths } = require('./i18n');

exports.createPages = ({ graphql, actions }) => {
  const { createPage } = actions;

  // Create index pages for all supported languages
  Object.keys(supportedLanguages).forEach((langKey) => {
    createPage({
      path: langKey === langKeyDefault ? '/' : `/${langKey}/`,
      component: path.resolve('./src/templates/blog-index.jsx'),
      context: {
        langKey,
      },
    });
  });

  const blogPost = path.resolve(`./src/templates/blog-post.jsx`);
  return graphql(
    `
      {
        allMdx(sort: { fields: [frontmatter___date], order: DESC }, limit: 1000) {
          edges {
            node {
              fields {
                slug
                langKey
                directoryName
                fileExt
              }
              frontmatter {
                title
              }
            }
          }
        }
      }
    `,
  ).then((result) => {
    if (result.errors) {
      throw result.errors;
    }

    // Create blog posts pages.
    const posts = result.data.allMdx.edges;

    const translationsByDirectory = posts.reduce((accum, post) => {
      const { directoryName, langKey } = post.node.fields;
      if (directoryName && langKey && langKey !== langKeyDefault) {
        (accum[directoryName] || (accum[directoryName] = [])).push(langKey);
      }
      return accum;
    }, {});

    const defaultLangPosts = posts.filter(({ node }) => node.fields.langKey === langKeyDefault);
    defaultLangPosts.forEach((post, index) => {
      const previous = index === defaultLangPosts.length - 1 ? null : defaultLangPosts[index + 1].node;
      const next = index === 0 ? null : defaultLangPosts[index - 1].node;
      const { slug, directoryName, fileExt } = post.node.fields;
      const translations = translationsByDirectory[directoryName] || [];
      createPage({
        path: slug,
        component: blogPost,
        context: {
          slug,
          previous,
          next,
          translations,
          fileExt,
        },
      });
    });

    const otherLangPosts = posts.filter(({ node }) => node.fields.langKey !== langKeyDefault);
    otherLangPosts.forEach((post) => {
      const { slug, directoryName, fileExt } = post.node.fields;
      const translations = translationsByDirectory[directoryName] || [];
      createPage({
        path: slug,
        component: blogPost,
        context: {
          slug,
          translations,
          fileExt,
        },
      });
    });
  });
};

exports.onCreateNode = ({ node, actions, getNode }) => {
  const { createNodeField } = actions;

  if (node.internal.type === `Mdx`) {
    const [directoryName, fileExt] = node.fileAbsolutePath.split('/').slice(-2) || [];
    let slug;
    let langKey = langKeyDefault;
    const slugAndLang = getSlugAndLang({ langKeyDefault, pagesPaths }, node.fileAbsolutePath);
    if (slugAndLang) {
      langKey = slugAndLang.langKey;
      slug = slugAndLang.slug;
    } else {
      slug = createFilePath({ node, getNode });
    }

    createNodeField({ node, name: 'directoryName', value: directoryName });
    createNodeField({ node, name: 'fileExt', value: fileExt.split('.').pop() });
    createNodeField({ node, name: 'langKey', value: langKey });
    createNodeField({ node, name: `slug`, value: slug });
  }
};
