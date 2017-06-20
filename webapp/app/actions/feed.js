export function fetchFeed() {
  return (dispatch) => {
    dispatch({
      type: 'CLEAR_MESSAGES'
    });
    return fetch('http://localhost:3001/api/v1/feed/getFeed', {
      method: 'get',
      headers: { 'Content-Type': 'application/json' },
    }).then((response) => {
      if (response.ok) {
        return response.json().then((json) => {
          dispatch({
            type: 'FETCH_FEED_SUCCESS',
            feed: json.resp
          });
        });
      } else {
        return response.json().then((json) => {
          dispatch({
            type: 'FETCH_FEED_FAILURE',
            messages: Array.isArray(json) ? json : [json]
          });
        });
      }
    });
  }
}
