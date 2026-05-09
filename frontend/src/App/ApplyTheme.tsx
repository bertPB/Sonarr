import { useEffect } from 'react';
import useTheme from 'Helpers/Hooks/useTheme';

function ApplyTheme() {
  const theme = useTheme();

  useEffect(() => {
    // Clear any inline custom properties left by the old JS theme system —
    // inline styles override stylesheet rules so they must be removed first.
    const { style } = document.documentElement;
    Array.from(style)
      .filter((p) => p.startsWith('--'))
      .forEach((p) => style.removeProperty(p));

    if (theme === 'dark') {
      document.documentElement.dataset.theme = 'dark';
    } else {
      delete document.documentElement.dataset.theme;
    }
  }, [theme]);

  return null;
}

export default ApplyTheme;
