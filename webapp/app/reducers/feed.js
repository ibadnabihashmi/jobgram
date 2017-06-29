const initialState = {
  jobs: {},
  isLoaded: false
};

export default function feed(state = initialState, action) {
  switch (action.type) {
    case 'FETCH_FEED_SUCCESS':
      return Object.assign({}, state, {
        jobs: action.feed
      });
    case 'UPDATE_PLACEHOLDER':
      return Object.assign({}, state, {
        isLoaded: action.isLoaded
      });
    default:
      return state;
  }
}
