declare module 'gatsby-mdx';
declare module 'disqus-react';
declare module 'typography-theme-wordpress-2016';
declare module '@mdx-js/tag';

declare module '*.scss' {
  const classes: { [key: string]: string };
  export default classes;
}
