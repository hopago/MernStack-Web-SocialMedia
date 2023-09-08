import { useRef } from 'react';
import './register.css';
import axios from 'axios';
import { useHistory } from 'react-router-dom';


const Register = () => {

    const username = useRef();
    const email = useRef();
    const password = useRef();
    const passwordAgain = useRef();

    const history = useHistory();

    const handleSignUp = async (e) => {
        e.preventDefault();

        if(password.current.value !== passwordAgain.current.value) {

            passwordAgain.current.setCustomValidity("Password don't match!");

        } else {
        
            const user = {
                username: username.current.value,
                email: email.current.value,
                password: password.current.value
            };

        try {

            await axios.post("/users/auth/register", user);

            history.push("/login");

        } catch(err) {
            console.log(err);
        }

        }

    };

    const handleSwitch = (e) => {
        e.preventDefault();

        history.push("/login");

    };

  return (
    <div className="register">
        <div className="registerWrapper">
            <div className="registerLeft">
                <h3 className="registerLogo">HopagoSocial</h3>
                <span className="registerDesc">Create new account and join the HopagoSocial!</span>
            </div>
            <div className="registerRight">
                <form className="registerBox" onSubmit={(e) => handleSignUp(e)}>
                    <input 
                      type="text" 
                      placeholder='Username...' 
                      className="registerInput" 
                      required 
                      ref={username} 
                    />
                    <input 
                      type="email" 
                      placeholder='Email...' 
                      className="registerInput" 
                      required 
                      ref={email} 
                    />
                    <input 
                      type="password" 
                      placeholder='Password...' 
                      className="registerInput" 
                      required 
                      ref={password} 
                    />
                    <input 
                      type="password" 
                      placeholder='Password Again...' 
                      className="registerInput" 
                      required 
                      ref={passwordAgain} 
                    />
                    <button className="registerButton" type='submit'>Sign up</button>
                    <button className="registerLoginBtn" onClick={(e) => {handleSwitch(e)}}>
                        Log into account
                    </button>
                </form>
            </div>
        </div>
    </div>
  )
}

export default Register;
