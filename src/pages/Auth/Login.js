import './Auth.css';

//! Components.
import { Link } from 'react-router-dom';
import Message from '../../components/Message';

//! Hooks.
import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';

//! Redux.
import { login, reset } from '../../slices/authSlice';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  //! Dispatchers.
  const dispatch = useDispatch();

  const { loading, error } = useSelector((state) => state.auth);

  const handleSubmit = (e) => {
    e.preventDefault();

    const user = {
      email,
      password,
    };

    dispatch(login(user));
  };

  //!  Clean all auth states.
  useEffect(() => {
    dispatch(reset());
  }, [dispatch]);

  return (
    <div id="login">
      <h2>X-AirGram</h2>
      <p className="subtitle">Log in to see if there's new.</p>
      <form onSubmit={handleSubmit}>
        {/* login */}
        <input
          type="text"
          placeholder="E-mail"
          onChange={(e) => setEmail(e.target.value)}
          value={email || ''}
        />

        <input
          type="password"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
          value={password || ''}
        />

        {!loading && <input type="submit" value="Login" />}
        {loading && <input type="submit" value="loading..." disabled />}

        {/* Error message */}
        {error && <Message msg={error} type="error" />}
      </form>
      <p>
        Don't have an account? 😓 <br /> <br />{' '}
        <Link to="/register">Click here!🤩</Link>
      </p>
    </div>
  );
};

export default Login;
