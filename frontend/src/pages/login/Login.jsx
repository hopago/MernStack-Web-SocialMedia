import { useContext, useRef } from 'react';
import './login.css';
import { loginCall } from '../../apiCalls';
import { AuthContext } from '../../context/AuthContext';
import { CircularProgress } from '@material-ui/core';
import { useHistory } from 'react-router-dom';


export default function Login() {

    const history = useHistory();

    const email = useRef();
    const password = useRef();

    const { user, dispatch, isFetching } = useContext(AuthContext);

    const handleLogin = async (e) => {
        e.preventDefault();

        const loginUser = {
            email: email.current.value,
            password: password.current.value
        };

        loginCall(loginUser, dispatch);

    };

    console.log(user);

    const handleSwitch = (e) => {
        e.preventDefault();

        history.push("/register");

    };

  return (
    <div className="login">
        <div className="loginWrapper">
            <div className="loginLeft">
                <h3 className="loginLogo">HopagoSocial</h3>
                <span className="loginDesc">Connect with friends and the world around you on HopagoSocial!</span>
            </div>
            <div className="loginRight">
                <form className="loginBox" onSubmit={handleLogin}>
                    <input 
                      type="email" 
                      placeholder='Email...' 
                      className="loginInput" 
                      required
                      ref={email}
                    />
                    <input 
                      type="password" 
                      placeholder='Password...' 
                      className="loginInput" 
                      required
                      ref={password}
                    />
                    {
                    isFetching
                    ?  <CircularProgress className='fetchingCircle' />
                    :  <button className="loginButton" type='submit'>Log In</button>
                    }
                    <span className="loginForgot">Forgot Id or Password</span>
                    <button className="loginRegisterButton" onMouseDown={handleSwitch}>
                        Sign In
                    </button>
                </form>
            </div>
        </div>
    </div>
  )
}
