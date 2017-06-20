const initialState = {
  jobs: {}
};

export default function feed(state = initialState, action) {
  switch (action.type) {
    case 'FETCH_FEED_SUCCESS':
      return Object.assign({}, state, {
        jobs: action.feed
      });
    default:
      return state;
  }
}
