import { createContext, useContext } from 'react';

export type Theme = 'light' | 'dark';

export const ThemeContext = createContext<{
  theme: Theme;
  setTheme: (theme: Theme) => void;
}>({
  theme: 'light',
  setTheme: () => {},
});

export const useTheme = () => useContext(ThemeContext); 