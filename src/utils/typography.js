import Typography from 'typography';
import Wordpress2016 from 'typography-theme-wordpress-2016';

Wordpress2016.overrideThemeStyles = () => {
  return {
    'a.gatsby-resp-image-link': {
      boxShadow: `none`,
    },
    body: {
      // fontFamily: `Merriweather, 'Noto Serif KR', Georgia, serif`,
      fontFamily: `'Open Sans', 'Gothic A1', 'Apple SD Gothic NEO', helvetica, sans-serif`,
    },
    'h1,h2,h3,h4,h5,h6': {
      fontFamily: `Montserrat, Black Han Sans`,
      fontWeight: 'normal',
      wordBreak: 'keep-all',
    },
    p: {
      wordBreak: 'keep-all',
    },
    '.date': {
      fontFamily: `'Montserrat SemiBold', 'Apple SD Gothic NEO', helvetica, sans-serif`,
    },
  };
};

delete Wordpress2016.googleFonts;

const typography = new Typography(Wordpress2016);

// Hot reload typography in development.
if (process.env.NODE_ENV !== `production`) {
  typography.injectStyles();
}

const { rhythm, scale } = typography;

export default typography;
export { rhythm, scale };
