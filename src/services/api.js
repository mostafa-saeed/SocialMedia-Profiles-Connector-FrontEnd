const { VUE_APP_API_ENDPOINT } = process.env;

export default async (method, path, data) => {
  const response = await fetch(VUE_APP_API_ENDPOINT + path, {
    method,
    body: JSON.stringify(data),
    headers: {
      'Content-Type': 'application/json',
      Authorization: localStorage.getItem('token'),
    },
  });

  const json = await response.json();

  if (!response.ok) {
    throw json.message;
  }

  return json;
};
