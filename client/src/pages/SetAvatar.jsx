import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import loader from '../assets/loader.gif';
import {setAvatarRoute} from '../utils/APIRoutes';
import {ToastContainer, toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import { Buffer } from 'buffer';

const Container = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    gap: 3rem;
    background-color: #131324;
    height: 100vh;
    width: 100vw;

    .loader {
        max-inline-size: 100%;
    }

    .title-container {
        h1 {
            color: white;
        }
    }

    .avatars {
        display: flex;
        gap: 2rem;
        .avatar {
            border: 0.4rem solid transparent;
            padding: 0.4rem;
            border-radius: 5rem;
            display: flex;
            justify-content: center;
            align-items: center;
            transition: 0.3s ease-in-out;
            img {
                height: 6rem;
            }
        }

        .selected {
            border: 0.4rem solid #4e0eff;
        }
    }
    .submit-btn {
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
`


export default function SetAvatar() {

    const api = 'https://api.multiavatar.com/45678945';
    // 랜덤 이미지 생성 api
    const navigate = useNavigate();
    const [avatars, setAvatars] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedAvatar, setSelectedAvatar] = useState(undefined);
    console.log(process.env.REACT_APP_AVATAR_API_KEY)

    useEffect(() => {
        const data = [];
        const getAvatar = async (arr) => {
            for(let i = 0; i < 4; i++) {
                const image = await axios.get(`${api}/${Math.round(Math.random() * 1000)}?apikey=${process.env.REACT_APP_AVATAR_API_KEY}`);
                const buffer = new Buffer(image.data);
                console.log(buffer);
                arr.push(buffer.toString("base64"));
                console.log('data', data);
            }
            setAvatars(data);
            setIsLoading(false); 
        }
        getAvatar(data);
        
    }, []);


    useEffect(() => {
        if(!localStorage.getItem('chat-app-user')) {
            navigate('/login');
        }
    }, []);

    const toastOption = {
        position: 'bottom-right',
        autoClose: 7000,
        pauseOnHover: true,
        draggable: true,
        theme: 'dark'
    };

    const setProfilePicture = async () => {
        if(selectedAvatar === undefined) {
            toast.error('Please select an avatar', toastOption);
        }else {
            const user = await JSON.parse(localStorage.getItem("chat-app-user"));
            const {data} = await axios.post(`${setAvatarRoute}/${user._id}`, {
                image: avatars[selectedAvatar],
            })

            if(data.isSet) {
                user.isAvatarImageSet = true;
                user.avatarImage = data.image;
                localStorage.setItem('chat-app-user', JSON.stringify(user));
                navigate('/');
            }else {
                toast.error('Error setting avatar. Please try again.');
            }
        }
    };


  return (
    <>
        {
            isLoading ? 
            <Container>
                <img src={loader} alt="loader" className='loader' />
            </Container> :
            <Container>
                <div className="title-container">
                    <h1>
                        Pick an avatar as your profile picture
                    </h1>
                </div>
                <div className="avatars">
                    {
                        avatars.map((avatar, i) => {
                            return (
                                <div key={i} className={`avatar ${selectedAvatar === i ? 'selected' : ''}`}>
                                    <img src={`data:image/svg+xml;base64,${avatar}`} alt="avatar" onClick={() => setSelectedAvatar(i)} />
                                </div>
                            );
                        })
                    }
                </div>
            <button className='submit-btn' onClick={setProfilePicture}>Set as Profile Picture</button>
            </Container>
        }
        
        <ToastContainer />
    </>
  )
}
