import React, { useState } from 'react'
import TextInput from './common/TextInput';
import PasswordInput from './common/PasswordInput';
import ButtonForm from './common/ButtonForm';
import './auth.scss'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '@contexts/AuthContext';
import { signupAPI } from 'service/apis';
import { message } from "antd";

function Signup() {
    const { signupContext } = useAuth()
    const navigate = useNavigate()
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const data = Object.fromEntries(
            Object.entries(formData).map(([key, value]) =>
                [key, typeof value === "string" ? value.trim() : value]
            )
        )


        try {
            const res = await signupAPI(data);
            const { accessToken, refreshToken, user } = res;
            localStorage.setItem("accessToken", accessToken);
            localStorage.setItem("refreshToken", refreshToken);
            signupContext(user);
            navigate("/");
        } catch (err) {
            console.log(err.message)
            const errMsg =
                err?.message || "Đăng ký thất bại!";
            message.error(errMsg);
        }

    };
    return (
        <div className="form-container">
            <form className="form-box" onSubmit={handleSubmit}>
                <h1>Sign Up</h1>
                <p className="subtitle">Create your account</p>

                <TextInput
                    label="Name"
                    name="username"
                    type="text"
                    value={formData.username}
                    onChange={handleChange}
                    placeholder="Name"
                />

                <TextInput
                    label="Email"
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="your@email.com"
                />

                <PasswordInput
                    label="Password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="●●●●●●●●"
                />

                <ButtonForm text="Sign up →" />
                <div className="redirect">
                    <span> Already have an account?</span> <Link to="/login">Log in now!</Link>
                    <div className="or-back">
                        or <Link to="/">Back to Trello</Link>
                    </div>
                </div>

            </form>
        </div>
    )
}

export default Signup