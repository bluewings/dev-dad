import React, { Fragment } from 'react';
import { StaticQuery, graphql } from 'gatsby';
import { rhythm } from '../../utils/typography';

function Footer() {
  return (
    <StaticQuery
      query={detailsQuery}
      render={(data) => {
        const { social } = data.site.siteMetadata;
        const links = Object.keys(social)
          .filter((name) => social[name])
          .map((name) => ({ name, uri: social[name] }));
        return (
          <footer style={{ marginTop: rhythm(2) }}>
            {links.map((link, i) => {
              return (
                <Fragment key={link.name}>
                  {i > 0 && <> &bull; </>}
                  <a href={link.uri} target="_blank" rel="noopener noreferrer">
                    {link.name}
                  </a>
                </Fragment>
              );
            })}
          </footer>
        );
      }}
    />
  );
}

export default Footer;

const detailsQuery = graphql`
  query FooterQuery {
    site {
      siteMetadata {
        social {
          twitter
          github
          stackOverflow
          facebook
        }
      }
    }
  }
`;
