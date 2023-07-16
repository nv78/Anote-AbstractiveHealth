import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import Cookies from 'js-cookie';
import '../styling/Home.css';

const LoginButton = () => {
  const [cookies, setCookie, removeCookie] = useCookies(['session_token']);
  const [isSignedIn, setIsSignedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setIsSignedIn(cookies.session_token !== undefined);
  }, [cookies]);

  const handleClick = () => {
    if (isSignedIn) {
      fetch('http://localhost:3000/api/logout', {
        method: 'GET',
      }).then((res) => {
        if (res.status === 200) {
          navigate('/');
          Cookies.remove('session_token')
          setCookie(null)
        }
      });
    } else {
      navigate('/login')
    }
  }

  return (
    <div>
      <button onClick={handleClick} className='button-container'>
        {isSignedIn ? 'Logout' : 'Login'}
      </button>
    </div>
  );
};

export default LoginButton;
