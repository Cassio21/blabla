//! REDUX.
import { resetMessage } from '../slices/photoSlice';

//? INICIO DO HOOK.
export const useResetComponentMessage = (dispatch) => {
  return () => {
    setTimeout(() => {
      dispatch(resetMessage());
    }, 2000);
  };
  //dispatch(resetMessage()); //* Chama a action creator para limpar
};
