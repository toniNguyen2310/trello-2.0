import React from 'react';

const ButtonForm = ({ text, type = 'submit', onClick }) => (
    <button type={type} className="main-button" onClick={onClick}>
        {text}
    </button>
);

export default ButtonForm;