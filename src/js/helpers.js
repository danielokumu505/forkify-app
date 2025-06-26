import { TIMEOUT_SEC } from './config';

const timeout = function (s) {
  return new Promise(function (_, reject) {
    setTimeout(function () {
      reject(new Error(`Request took too long! Timeout after ${s} second`));
    }, s * 1000);
  });
};

export const AJAX = async function (url, uploadData = undefined) {
  try {
    const fetchPro = uploadData
      ? fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(uploadData), //actual data transfered
        })
      : fetch(url);

    const response = await Promise.race([fetchPro, timeout(TIMEOUT_SEC)]);

    const data = await response.json();

    if (!response.ok) {
      throw new Error(`${data.message} (${response.status})`);
    }

    return data;
  } catch (error) {
    throw error; //to reject the promise returned from getJSON. Enables propagation of errors to
    //... another module (model.js) to enable error handling in that particular module
  }
};

/*
export const getJSON = async function (url) {
  try {
    const response = await Promise.race([fetch(url), timeout(TIMEOUT_SEC)]);

    const data = await response.json();

    if (!response.ok) {
      throw new Error(`${data.message} (${response.status})`);
    }

    return data;
  } catch (error) {
    throw error; //to reject the promise returned from getJSON. Enables propagation of errors to
    //... another module (model.js) to enable error handling in that particular module
  }
};

export const sendJSON = async function (url, uploadData) {
  try {
    const fetchPro = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(uploadData), //actual data transfered
    });

    const response = await Promise.race([fetchPro, timeout(TIMEOUT_SEC)]);

    const data = await response.json();

    if (!response.ok) {
      throw new Error(`${data.message} (${response.status})`);
    }

    return data;
  } catch (error) {
    throw error; //to reject the promise returned from getJSON. Enables propagation of errors to
    //... another module (model.js) to enable error handling in that particular module
  }
};
*/
