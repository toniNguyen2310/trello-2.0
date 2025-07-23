import React from 'react';
import { Spin } from 'antd';

const ButtonForm = ({ text, type = 'submit', onClick, disabled = false, loading = false }) => (
    <button type={type} className="main-button" onClick={onClick} disabled={disabled}>
        {loading ?
            <>
                <Spin className="loading-spin" />
                <span>Loading</span>
            </>

            : text}
    </button>
);

export default ButtonForm;