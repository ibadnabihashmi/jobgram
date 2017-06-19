import { combineReducers } from 'redux';
import messages from './messages';
import auth from './auth';
import feed from './feed';

export default combineReducers({
  messages,
  auth,
  feed
});
