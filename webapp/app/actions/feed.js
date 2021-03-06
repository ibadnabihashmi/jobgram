import { API, API_KEY } from "../config/config";

export function fetchFeed(from) {
  return (dispatch) => {
    dispatch({
      type: 'CLEAR_MESSAGES'
    });
    dispatch({
      type: 'UPDATE_PLACEHOLDER',
      isLoaded: false
    });
    return fetch(`${API}/api/v1/feed/getFeed?from=${from}`, {
      method: 'get',
      headers: { 'Content-Type': 'application/json','key':API_KEY },
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
  }
}

export function fetchTags(page,size) {
  return (dispatch) => {
    dispatch({
      type: 'CLEAR_MESSAGES'
    });
    return fetch(`${API}/api/v1/tags?page=${page}&size=${size}`,{
      method:'get',
      headers: { 'Content-Type': 'application/json','key':API_KEY }
    }).then((response) => {
      if(response.ok){
        return response.json().then((json) => {
          dispatch({
            type: 'FETCH_TAGS_SUCCESS',
            tags: json.resp
          });
        });
      }else{
        return response.json().then((json) => {
          console.log(json);
        });
      }
    });
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
    return fetch(`${API}/api/v1/feed/getFeed?from=${from}`, {
      method: 'post',
      body: JSON.stringify(filters),
      headers: { 'Content-Type': 'application/json','key':API_KEY },
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
  }
}
