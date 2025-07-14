import React, { useState } from 'react'
import './auth.scss'
import TextInput from './common/TextInput'
import ButtonForm from './common/ButtonForm'
import PasswordInput from './common/PasswordInput'
import { Link } from 'react-router-dom'

const LoginForm = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Login with:', { email, password });
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

                <p className="redirect">
                    <span>Don’t have an account?</span> <Link to="/signup">Sign up now!</Link>
                    <div className="or-back">
                        or <Link to="/board">Back to Trello</Link>
                    </div>
                </p>

            </form>
        </div>
    )
}

export default LoginForm
