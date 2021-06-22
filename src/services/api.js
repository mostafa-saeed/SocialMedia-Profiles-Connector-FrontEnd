import { getToken } from './auth';

const { VUE_APP_API_ENDPOINT } = process.env;

const ApiError = function (message) {
  this.name = 'API_ERROR';
  this.message = message;
};

ApiError.prototype = Error.prototype;

export default async (method, path, data) => {
  const response = await fetch(VUE_APP_API_ENDPOINT + path, {
    method,
    body: JSON.stringify(data),
    headers: {
      'Content-Type': 'application/json',
      Authorization: getToken(),
    },
  });

  const json = await response.json();

  if (!response.ok) {
    throw new ApiError(json.message);
  }

  return json;
};
