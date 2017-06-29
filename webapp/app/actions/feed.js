export function fetchFeed(from) {
  return (dispatch) => {
    dispatch({
      type: 'CLEAR_MESSAGES'
    });
    dispatch({
      type: 'UPDATE_PLACEHOLDER',
      isLoaded: false
    });
    setTimeout(function () {
      return fetch(`http://localhost:3001/api/v1/feed/getFeed?from=${from}`, {
        method: 'get',
        headers: { 'Content-Type': 'application/json' },
      }).then((response) => {
        if (response.ok) {
          return response.json().then((json) => {
            dispatch({
              type: 'FETCH_FEED_SUCCESS',
              feed: json.resp
            });
            dispatch({
              type: 'UPDATE_PLACEHOLDER',
              isLoaded: true
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
    },1000);
  }
}

export function applyFilters(filters,from) {
  return (dispatch) => {
    dispatch({
      type: 'CLEAR_MESSAGES'
    });
    dispatch({
      type: 'UPDATE_PLACEHOLDER',
      isLoaded: false
    });
    setTimeout(function () {
      return fetch(`http://localhost:3001/api/v1/feed/getFeed?from=${from}`, {
        method: 'post',
        body: JSON.stringify(filters),
        headers: { 'Content-Type': 'application/json' },
      }).then((response) => {
        if(response.ok) {
          return response.json().then((json) => {
            dispatch({
              type: 'FETCH_FEED_SUCCESS',
              feed: json.resp
            });
            dispatch({
              type: 'UPDATE_PLACEHOLDER',
              isLoaded: true
            });
          });
        }else{
          return response.json().then((json) => {
            dispatch({
              type: 'FETCH_FEED_SUCCESS',
              feed: json.resp
            });
          });
        }
      });
    },1000);
  }
}
