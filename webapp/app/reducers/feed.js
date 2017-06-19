const initialState = {
  feed: []
};

export default function feed(state = initialState, action) {
  if (!state.hydrated) {
    state = Object.assign({}, initialState, state, { hydrated: true });
  }
  switch (action.type) {
    case 'FETCH_FEED_SUCCESS':
      console.log("**** i dont give a shit *****");
      return Object.assign({}, state, {
        feed: action.feed
      });
    case 'FETCH_FEED_FAILURE':
      return {
        error: action.messages
      };
    default:
      return state;
  }
}
