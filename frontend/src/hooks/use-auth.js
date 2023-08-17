import { useSelector, useDispatch } from 'react-redux';
import { setUser } from '../store/slices/userSlice';

export function useAuth() {
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const localUser = {
    id: localStorage.getItem('KnowledgeBase-userId'),
    login: localStorage.getItem('KnowledgeBase-login'),
    firstName: localStorage.getItem('KnowledgeBase-firstName'),
    secondName: localStorage.getItem('KnowledgeBase-secondName'),
    avatar: localStorage.getItem('KnowledgeBase-avatar'),
  };

  if (localUser.login && localUser.id) {
    dispatch(setUser(localUser));
  }

  return {
    isAuth: !!user.id,
    ...user,
  };
}
