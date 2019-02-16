import { combineReducers } from "redux";
import cardsById from "./cardsById";
import listsById from "./listsById";
import boardsById from "./boardsById";
import user from "./user";
import isGuest from "./isGuest";
import currentBoardId from "./currentBoardId";
import authReducer from "./authReducer";
import userDataReducer from "./userDataReducer";
import studiesDataReducer from "./studiesDataReducer";

export default combineReducers({
  cardsById,
  listsById,
  boardsById,
  user,
  isGuest,
  currentBoardId,
  authReducer, 
  userDataReducer,
  studiesDataReducer
});
