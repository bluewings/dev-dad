/* eslint-disable no-underscore-dangle */
import React, { useState, useMemo } from 'react';

function __getTheme() {
  try {
    return window.__getTheme();
  } catch (err) {
    /* ignore */
  }
  return '';
}

const ThemeContext = React.createContext({});

function ThemeProvider(props) {
  const [theme, setTheme] = useState(__getTheme());
  const value = useMemo(() => ({ theme, setTheme }), [theme, setTheme]);

  const { children } = props;
  return <ThemeContext.Provider value={value}>{value && children}</ThemeContext.Provider>;
}

const Context = ThemeContext;
const Provider = ThemeProvider;

export { Context, Provider };
