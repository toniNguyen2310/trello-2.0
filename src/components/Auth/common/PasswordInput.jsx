import { useState } from 'react'
import { FaRegEye } from "react-icons/fa";
import { FaRegEyeSlash } from "react-icons/fa6";


const PasswordInput = ({ label, name, value, onChange, placeholder }) => {
    const [visible, setVisible] = useState(false)
    return (
        <div className="form-group password-field">
            <label htmlFor={name} className="label">{label}</label>
            <input
                type={visible ? 'text' : 'password'}
                id={name}
                name={name}
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                required
            />
            <button
                type="button"
                className="toggle-password"
                onClick={() => setVisible(!visible)}
            >
                {visible ? <FaRegEye /> : <FaRegEyeSlash />}
            </button>
        </div>
    )
}

export default PasswordInput
