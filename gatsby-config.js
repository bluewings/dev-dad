module.exports = {
  // pathPrefix: '/',
  // Customize your site metadata:
  siteMetadata: {
    title: [
      ['ko', '아빠는 개발자'],
      ['en', 'Dev Dad'],
    ],
    author: 'Cha Sung Won',
    description: [
      [
        'ko',
        '개발자를 꿈꾸는 아들을 둔 아빠 개발자입니다.\n데이터 시각화에 관심이 있으며, 재미있는 프로그램을 만드는 것을 좋아합니다.',
      ],
      [
        'en',
        "I am a developer dad with a son who dreams of a developer.\nI'm interested in data visualization and enjoy creating fun programs.",
      ],
    ],
    siteUrl: `https://bluewings.github.io/`,
    social: [
      {
        name: 'GitHub',
        url: 'https://github.com/bluewings',
      },
    ],
  },
  plugins: [
    // "gatsby-theme-blog",
    {
      resolve: 'gatsby-plugin-bluewings',
      options: {
        langKeyDefault: 'ko',
        editOnGithub: {
          url: 'https://github.com/bluewings/dev-dad',
          directory: '',
          branch: 'master',
        },
        disqusShortname: 'dev-dad',
      },
    },
    {
      resolve: 'gatsby-plugin-google-analytics',
      options: {
        trackingId: 'UA-87089021-5',
      },
    },
    'gatsby-plugin-sitemap',
    // {
    //   resolve: 'gatsby-plugin-manifest',
    //   options: {
    //     name: 'Gatsby Starter Blog',
    //     short_name: 'GatsbyJS',
    //     start_url: '/',
    //     background_color: '#ffffff',
    //     theme_color: '#663399',
    //     display: 'minimal-ui',
    //     icon: 'content/assets/gatsby-icon.png',
    //     icons: [],
    //   },
    // },
    'gatsby-plugin-feed-mdx',
  ],
};
