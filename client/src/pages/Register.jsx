import React from 'react';
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import Logo from '../assets/logo.svg';
import axios from 'axios';

import {ToastContainer, toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
// toast 페이지를 지원하는 라이브러리
// toast 자체의 디자인이 있어 css도 불러와야한다.
import { registerRoute } from '../utils/APIRoutes';

const FormContainer = styled.div`
    height: 100vh;
    width: 100vw;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 1rem;
    background-color: #131324;

    .brand {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 1rem;

        img {
            height: 5rem;
        }

        h1 {
            color: white;
            text-transform: uppercase;
        }
    }

    form {
        display: flex;
        flex-direction: column;
        gap: 2rem;
        background-color: #00000076;
        border-radius: 2rem;
        padding: 3rem 5rem;

        input {
            background-color: transparent;
            padding: 1rem;
            border: 0.1rem solid #4e0eff;
            border-radius: 0.4rem;
            color: white;
            width: 100%;
            font-size: 1rem;

            &:focus {
                border: 0.1rem solid #997af0;
                outline: none;
            }
        }

        button {
            background-color: #997af0;
            color: white;
            padding: 1rem 2rem;
            border: none;
            font-weight: bold;
            cursor: pointer;
            border-radius: 0.4rem;
            font-size: 1rem;
            text-transform: uppercase;
            transition: 0.3s ease-in-out;
            &:hover {
                background-color: #4e0eff;
            }
        }
        span {
            color: white;
            text-transform: uppercase;
            a {
                color: #4e0eff;
                text-decoration: none;
                font-weight: bold;
            }
        }
    }
`


function Register() {
    const [values, setValues] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
    });

    const navigate = useNavigate();

    useEffect(() => {
        if(localStorage.getItem('chat-app-user')) {
            navigate('/');
        }
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if(handleValidation()) {
            const {username, email, password} = values;
            const {data} = await axios.post(registerRoute, {
                username,
                email,
                password,
            });
            if(data.status === false) {
                toast.error(data.msg, toastOption);
            }

            if(data.status === true) {
                localStorage.setItem('chat-app-user', JSON.stringify(data.user));
                navigate('/');
                // 전부 올바르게 처리 되었을 경우 페이지 이동
            }
        }
    };

    const toastOption = {
        position: 'bottom-right',
        autoClose: 7000,
        pauseOnHover: true,
        draggable: true,
        theme: 'dark'
    };

    const handleValidation = () => {
        const {username, email, password, confirmPassword} = values;

        if(password !== confirmPassword) {
            toast.error("Password and confirm passwod should be same.", toastOption);
            return false;
        }else if(username.length < 4) {
            toast.error("Username should be greater than 4 characters", toastOption);
            return false;
        }else if(password.length < 6) {
            toast.error("Password should be greater than 6 characters", toastOption);
            return false;
        }else if(email === '') {
            toast.error("Email is required", toastOption);
        }
        return true;
    };

    const handleChange = (e) => {
        setValues({...values, [e.target.name]: e.target.value});
    };

  return (
    <>
        <FormContainer>
            <form onSubmit={(e) => handleSubmit(e)}>
                <div className='brand'>
                    <img src={Logo} alt="Logo" />
                    <h1>Bloxxom X_X</h1>
                </div>
                <input onChange={(e) => handleChange(e)} type="text" placeholder='Username' name='username'/>
                <input onChange={(e) => handleChange(e)} type="email" placeholder='Email' name='email'/>
                <input onChange={(e) => handleChange(e)} type="password" placeholder='Password' name='password'/>
                <input onChange={(e) => handleChange(e)} type="password" placeholder='Confirm Password' name='confirmPassword'/>
                <button type='submit'>Create User</button>
                <span>Have an account ? 
                    <Link to='/login'>Login</Link>
                </span>
            </form>
        </FormContainer>
        <ToastContainer />
    </>
  )
}

export default Register