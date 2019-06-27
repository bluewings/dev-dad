import React from 'react';
import { Link, graphql } from 'gatsby';
import { MDXRenderer } from 'gatsby-mdx';
import { DiscussionEmbed } from 'disqus-react';
import Bio from '../components/Bio';
import Layout from '../components/Layout';
import SEO from '../components/SEO';
import { rhythm, scale } from '../utils/typography';
import { codeToLanguage, createLanguageLink, getLangKeyDefault } from '../utils/i18n';

const langKeyDefault = getLangKeyDefault();

function Translations(props: any) {
  const { translations, lang, languageLink, editUrl } = props;
  return (
    <p
      style={{
        fontSize: '1em',
        border: '1px solid var(--hr)',
        borderRadius: '0.3em',
        padding: '0.75em',
        background: 'var(--translation-bg)',
        wordBreak: 'keep-all',
      }}
    >
      <span>Translated by readers into: </span>
      {translations.map((l: any, i: number) => (
        <React.Fragment key={l}>
          {l === lang ? <b>{codeToLanguage(l)}</b> : <Link to={languageLink(l)}>{codeToLanguage(l)}</Link>}
          {i === translations.length - 1 ? '' : ' • '}
        </React.Fragment>
      ))}
      {lang !== langKeyDefault && (
        <>
          <br />
          <Link to={languageLink(langKeyDefault)}>Read the original</Link>
          {' • '}
          <a href={editUrl} target="_blank" rel="noopener noreferrer">
            Improve this translation
          </a>
          {' • '}
          <Link to={`/${lang}`}>View all translated posts</Link>{' '}
        </>
      )}
    </p>
  );
}

function BlogPostTemplate(props: any) {
  const {
    location,
    data: {
      site: {
        siteMetadata: {
          title: siteTitle,
          social: { disqusShortname },
          github: { owner, repository },
        },
      },
      mdx: post,
    },
    pageContext: { slug, previous, next, translations: translations_, fileExt },
  } = props;
  const lang = post.fields.langKey;
  const languageLink = createLanguageLink(slug, lang);
  const defaultSlug = languageLink(langKeyDefault);
  const editUrl = `https://github.com/${owner}/${repository}/edit/master/content/blog/${defaultSlug.slice(
    1,
    defaultSlug.length - 1,
  )}/index${lang === langKeyDefault ? '' : `.${lang}`}.${fileExt}`;
  const translations = translations_.slice();
  translations.sort((a: any, b: any) => (codeToLanguage(a) < codeToLanguage(b) ? -1 : 1));

  return (
    <Layout location={location} title={siteTitle} maxWidth={post.frontmatter.max_width}>
      <SEO title={post.frontmatter.title} description={post.excerpt} />
      <h1>{post.frontmatter.title}</h1>
      <p
        className="date"
        style={{
          ...scale(-1 / 5),
          display: `block`,
          marginBottom: rhythm(1),
          marginTop: rhythm(-0.75),
        }}
      >
        {post.frontmatter.date}
      </p>
      {translations.length > 0 && (
        <Translations translations={translations} editUrl={editUrl} languageLink={languageLink} lang={lang} />
      )}
      <MDXRenderer>{post.code.body}</MDXRenderer>
      <footer>
        <p style={{ marginTop: rhythm(2.5) }}>
          <a href={editUrl} target="_blank" rel="noopener noreferrer">
            Edit on GitHub
          </a>
        </p>
      </footer>
      <hr
        style={{
          marginBottom: rhythm(1),
        }}
      />
      <Bio />

      <ul
        style={{
          display: `flex`,
          flexWrap: `wrap`,
          justifyContent: `space-between`,
          listStyle: `none`,
          padding: 0,
        }}
      >
        <li>
          {previous && (
            <Link to={previous.fields.slug} rel="prev">
              ← {previous.frontmatter.title}
            </Link>
          )}
        </li>
        <li>
          {next && (
            <Link to={next.fields.slug} rel="next">
              {next.frontmatter.title} →
            </Link>
          )}
        </li>
      </ul>
      {disqusShortname && (
        <DiscussionEmbed
          shortname={disqusShortname}
          config={{
            identifier: post.id,
            title: post.frontmatter.title,
          }}
        />
      )}
    </Layout>
  );
}

export default BlogPostTemplate;

export const pageQuery = graphql`
  query BlogPostBySlug($slug: String!) {
    site {
      siteMetadata {
        title
        author
        social {
          disqusShortname
        }
        github {
          owner
          repository
        }
      }
    }
    mdx(fields: { slug: { eq: $slug } }) {
      id
      excerpt(pruneLength: 160)
      code {
        body
      }
      frontmatter {
        title
        date(formatString: "MMMM DD, YYYY")
        max_width
      }
      fields {
        slug
        langKey
      }
    }
  }
`;
