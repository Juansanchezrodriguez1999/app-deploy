const checkStatus = async (response) => {
  if (response.ok) {
    return response;
  } else {
    const errorMsg = await response.json();
    const error = new Error(errorMsg.error);
    error.response = response;
    error.statusText = errorMsg.error;
    throw error;
  }
};

const Fetcher = {
  get: (url, options = {}) => {
    return fetch(url, options).then(checkStatus);
  },
  post: (url, options = {}) => {
    return fetch(url, {
      method: 'post',
      ...options,
    }).then(checkStatus);
  },
  put: (url, options = {}) => {
    return fetch(url, {
      method: 'put',
      ...options,
    }).then(checkStatus);
  },
  delete: (url, options = {}) => {
    return fetch(url, {
      method: 'delete',
      ...options,
    }).then(checkStatus);
  },
};

export { Fetcher };
