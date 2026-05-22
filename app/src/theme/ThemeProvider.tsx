import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { Appearance, ColorSchemeName } from 'react-native';
import { THEMES, ThemeScheme, ThemeTokens } from './tokens';

export type ThemePreference = 'system' | ThemeScheme;

interface ThemeContextValue {
  scheme: ThemeScheme;
  preference: ThemePreference;
  t: ThemeTokens;
  toggle: (nextPreference?: ThemePreference) => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

const resolveScheme = (colorScheme: ColorSchemeName): ThemeScheme =>
  colorScheme === 'light' ? 'light' : 'dark';

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [systemScheme, setSystemScheme] = useState<ThemeScheme>(() =>
    resolveScheme(Appearance.getColorScheme()),
  );
  const [preference, setPreference] = useState<ThemePreference>('dark');

  useEffect(() => {
    const subscription = Appearance.addChangeListener(({ colorScheme }) => {
      setSystemScheme(resolveScheme(colorScheme));
    });

    return () => subscription.remove();
  }, []);

  const scheme = preference === 'system' ? systemScheme : preference;

  const toggle = useCallback(
    (nextPreference?: ThemePreference) => {
      if (nextPreference) {
        setPreference(nextPreference);
        return;
      }

      setPreference(scheme === 'dark' ? 'light' : 'dark');
    },
    [scheme],
  );

  const value = useMemo(
    () => ({
      scheme,
      preference,
      t: THEMES[scheme],
      toggle,
    }),
    [preference, scheme, toggle],
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const value = useContext(ThemeContext);
  if (!value) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return value;
};
