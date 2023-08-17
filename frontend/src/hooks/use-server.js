import { useSelector } from 'react-redux';

export function useServer() {
  const local = useSelector((state) => state.local);


  /*const isFilledProfile = () => {
    for (let [_, value] of Object.entries(profile)) {
      if (value === null) return false;
    }
    return true;
  };*/

  return { isConnect: local.isConnectToServer};//, isFilledProfile];
}
