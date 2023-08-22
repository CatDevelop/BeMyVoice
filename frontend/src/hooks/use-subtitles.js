import {useSelector} from 'react-redux';

export function useSubtitles() {
  return useSelector((state) => state.recognitions);
}
