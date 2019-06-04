import { useContext } from 'react';
import { Context as ThemeContext } from '../utils/theme-context';

function useTheme() {
  const { theme } = useContext(ThemeContext);
  return theme;
}

export default useTheme;
