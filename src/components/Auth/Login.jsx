import React, { useState } from 'react'
import './auth.scss'
import TextInput from './common/TextInput'
import ButtonForm from './common/ButtonForm'
import PasswordInput from './common/PasswordInput'
import { Link, useNavigate } from 'react-router-dom'
import { loginAPI } from 'service/apis'
import { useAuth } from '@contexts/AuthContext'
import { message } from "antd";

const LoginForm = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { loginContext } = useAuth()
    const navigate = useNavigate()

    const handleSubmit = async (e) => {
        e.preventDefault();

        const data = {
            email: email.trim(),
            password: password.trim(),
        };

        try {
            const res = await loginAPI(data);
            if (res) {
                const { accessToken, refreshToken, user } = res;
                localStorage.setItem("accessToken", accessToken);
                localStorage.setItem("refreshToken", refreshToken);
                loginContext(user);
                message.success("Đăng nhập thành công!");
                navigate("/");
            } else {
                message.error("Thông tin đăng nhập không đúng");
            }
        } catch (err) {
            const errorMsg = err?.message || "Đăng nhập thất bại!";
            message.error(errorMsg);
            console.error("Login error:", err);
        }
    };


    return (
        <div className="form-container">
            <form className="form-box" onSubmit={handleSubmit}>
                <h1>Log In</h1>
                <p className="subtitle">to start learning</p>

                <TextInput
                    label="Email"
                    type="email"
                    name="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                />

                <PasswordInput
                    label="Password"
                    name="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="●●●●●●●●"
                />

                <ButtonForm text="Log in →" />

                <div className="redirect">
                    <span>Don’t have an account?</span> <Link to="/signup">Sign up now!</Link>
                    <div className="or-back">
                        or <Link to="/">Back to Trello</Link>
                    </div>
                </div>

            </form>
        </div>
    )
}

export default LoginForm
