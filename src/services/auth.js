export const getToken = () => localStorage.getItem('token');
export const getUser = () => JSON.parse(localStorage.getItem('user'));

export const requireAuthentication = (to, from, next) => {
  if (!getToken()) return next({ name: 'Login' });

  return next();
};

export const setAuthentication = (token, user) => {
  localStorage.setItem('token', token);
  localStorage.setItem('user', JSON.stringify(user));
};

export const removeAuthentication = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};
