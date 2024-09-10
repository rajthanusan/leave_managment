import React, { useState } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { InputText } from 'primereact/inputtext';
import { Password } from 'primereact/password';
import Navbar from './navbar';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loginStatus, setLoginStatus] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        const adminUsername = 'admin@gmail.com';
        const adminPassword = 'Admin$123';

        try {
            if (username === adminUsername && password === adminPassword) {
                toast.success('Login successful!');
                setLoginStatus('Login successful!');
                sessionStorage.setItem('loggedInAdmin', JSON.stringify({ username }));
                window.location.href = '/homeadmin';
            } else {
                const response = await axios.post('http://localhost:8085/api/login', {
                    username,
                    password
                });

                if (response.data.message === 'Login successful') {
                    toast.success('Login successful!');
                    setLoginStatus('Login successful!');
                    sessionStorage.setItem('loggedInUser', JSON.stringify({ username }));
                    window.location.href = '/homeuser';
                } else {
                    setLoginStatus('Invalid credentials');
                    toast.error('Invalid credentials');
                }
            }
        } catch (error) {
            toast.error('Login Failed!');
            console.error('Login failed:', error);
            setLoginStatus('Login failed');
        }
    };

    return (
        <>
            <Navbar />
            <ToastContainer />
            <div className="container pt-5">
                <div className="row justify-content-center">
                    <div className="col-md-6">
                        <div className="card shadow-lg p-4">
                        <h1 className="text-center mb-4" style={{ color: 'darkblue' }}>Login</h1>
                            <hr />
                            <form onSubmit={handleSubmit}>
                                <div className="p-field">
                                    <div className="p-inputgroup flex-1">
                                        <span className="p-inputgroup-addon">
                                            <i className="pi pi-user"></i>
                                        </span>
                                        <InputText 
                                            value={username} 
                                            placeholder="Username" 
                                            onChange={(e) => setUsername(e.target.value)} 
                                        />
                                    </div>
                                </div>
                                <br />
                                <div className="p-field">
                                    <div className="p-inputgroup flex-1">
                                        <span className="p-inputgroup-addon">
                                            <i className="pi pi-lock"></i>
                                        </span>
                                        <Password 
                                            value={password} 
                                            placeholder="Password" 
                                            onChange={(e) => setPassword(e.target.value)} 
                                            feedback={false} 
                                        />
                                    </div>
                                </div>
                                <br />
                                <button type="submit" className="btn btn-primary w-100 custom-darkblue-button"  >Login</button>
                                {loginStatus && <p className="text-black mt-3">{loginStatus}</p>}
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Login;
