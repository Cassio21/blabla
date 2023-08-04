import { api, requestConfig } from '../utils/config';

//* Register an User.
const register = async (data) => {
  const config = requestConfig('POST', data);

  try {
    const res = await fetch(api + '/users/register', config)
      .then((res) => res.json())
      .catch((err) => err);

    if (res._id) {
      localStorage.setItem('user', JSON.stringify(res));
    }
    return res;
  } catch (error) {
    console.log(error);
  }
};

//* Logout an user.
const logout = () => {
  //* Remove the token and expiry time of a logged in user from local storage.
  localStorage.removeItem('user');
};

//* Sing in an user.
const login = async (data) => {
  const config = requestConfig('POST', data);

  try {
    const res = await fetch(api + '/users/login', config)
      .then((res) => res.json())
      .catch((err) => err);

    if (res._id) {
      localStorage.setItem('user', JSON.stringify(res));
    }

    return res;
  } catch (error) {
    console.log(error);
  }
};

const authServicer = {
  register,
  logout,
  login,
};

export default authServicer;
