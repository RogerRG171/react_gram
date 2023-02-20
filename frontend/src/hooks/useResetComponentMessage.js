//Redux
import { resetMessage } from "../slices/PhotoSlice";

export const useResetComponentMessage = (dispatch) => {
  return () => {
    setTimeout(() => {
      dispatch(resetMessage());
    }, 2000);
  };
};
