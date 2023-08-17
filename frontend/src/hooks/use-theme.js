import { useSelector } from 'react-redux';

export function useTheme() {
  const local = useSelector((state) => state.local);


  /*const isFilledProfile = () => {
    for (let [_, value] of Object.entries(profile)) {
      if (value === null) return false;
    }
    return true;
  };*/

  return { theme: local.theme, isDark: local.theme === 'dark' };//, isFilledProfile];
}
