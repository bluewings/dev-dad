import React from 'react';
import { Link } from 'gatsby';
import { rhythm, scale } from '../../utils/typography';
import Toggle from '../Toggle';
import Footer from '../Footer';
import styles from './Layout.module.scss';
import '../../styles/common.css';
import '../../styles/tooltip.scss';

function Layout(props: any) {
  const { location, title, children, maxWidth, isIndexPage } = props;
  // @ts-ignore
  const rootPath = `${__PATH_PREFIX__}/`;
  let header;

  if (location.pathname === rootPath || isIndexPage) {
    header = (
      <h1
        style={{
          ...scale(1.5),
          marginBottom: rhythm(1.5),
          marginTop: 0,
        }}
      >
        <Link
          style={{
            boxShadow: `none`,
            textDecoration: `none`,
            color: `inherit`,
          }}
          to="/"
        >
          {title}
        </Link>
      </h1>
    );
  } else {
    header = (
      <h3
        style={{
          marginTop: 0,
        }}
      >
        <Link
          style={{
            boxShadow: `none`,
            textDecoration: `none`,
            color: `inherit`,
          }}
          to="/"
        >
          {title}
        </Link>
      </h3>
    );
  }
  return (
    <div className={styles.root}>
      <div
        className={styles.inner}
        style={{
          marginLeft: `auto`,
          marginRight: `auto`,
          maxWidth: maxWidth || rhythm(24),
          padding: `${rhythm(1.5)} ${rhythm(3 / 4)}`,
        }}
      >
        <header>
          {header}
          <Toggle />
        </header>
        <main>{children}</main>
        <Footer />
      </div>
    </div>
  );
}

export default Layout;
