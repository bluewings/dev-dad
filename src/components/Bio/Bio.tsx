import React from 'react';
import { StaticQuery, graphql } from 'gatsby';
import Image from 'gatsby-image';
import { rhythm } from '../../utils/typography';

function Bio() {
  return (
    <StaticQuery
      query={bioQuery}
      render={(data) => {
        const { author, social } = data.site.siteMetadata;
        return (
          <div
            style={{
              display: `flex`,
              marginBottom: rhythm(2.5),
            }}
          >
            <Image
              fixed={data.avatar.childImageSharp.fixed}
              alt={author}
              style={{
                marginRight: rhythm(1 / 2),
                marginBottom: 0,
                minWidth: 50,
                borderRadius: `100%`,
              }}
              imgStyle={{
                borderRadius: `50%`,
              }}
            />
            <p style={{ marginTop: -3 }}>
              개발자를 꿈꾸는 아들을 둔 아빠 개발자입니다.
              <br />
              데이터 시각화에 관심이 있으며, 재미있는 프로그램을 만드는 것을 좋아합니다.
              {` `}
              {social.twitter && <a href={`https://twitter.com/${social.twitter}`}>You should follow him on Twitter</a>}
            </p>
          </div>
        );
      }}
    />
  );
}

const bioQuery = graphql`
  query BioQuery {
    avatar: file(absolutePath: { regex: "/profile-pic.jpg/" }) {
      childImageSharp {
        fixed(width: 50, height: 50) {
          ...GatsbyImageSharpFixed
        }
      }
    }
    site {
      siteMetadata {
        author
        social {
          twitter
        }
      }
    }
  }
`;

export default Bio;
