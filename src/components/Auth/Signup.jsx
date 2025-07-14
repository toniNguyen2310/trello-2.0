import React, { useState } from 'react'
import TextInput from './common/TextInput';
import PasswordInput from './common/PasswordInput';
import ButtonForm from './common/ButtonForm';
import './auth.scss'
import { Link } from 'react-router-dom'

function Signup() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Registering:', formData);
    };
    return (
        <div className="form-container">
            <form className="form-box" onSubmit={handleSubmit}>
                <h1>Sign Up</h1>
                <p className="subtitle">Create your account</p>

                <TextInput
                    label="Name"
                    name="name"
                    type="text"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Your full name"
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
                <p className="redirect">
                    <span> Already have an account?</span> <Link to="/login">Log in now!</Link>
                    <div className="or-back">
                        or <Link to="/board">Back to Trello</Link>
                    </div>
                </p>

            </form>
        </div>
    )
}

export default Signup