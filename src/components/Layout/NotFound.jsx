import React from 'react';

const NotFound = () => {
    const handleGoHome = () => {
        window.location.href = '/';
    };


    const containerStyle = {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        backgroundColor: '#f5f5f5',
        fontFamily: 'Arial, sans-serif'
    };

    const contentStyle = {
        textAlign: 'center',
        padding: '2rem',
        backgroundColor: '#ffffff',
        borderRadius: '8px',
        boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
        maxWidth: '400px',
        width: '90%'
    };

    const errorCodeStyle = {
        fontSize: '4rem',
        color: '#ff4757',
        fontWeight: 'bold',
        marginBottom: '1rem'
    };

    const titleStyle = {
        color: '#333',
        fontSize: '1.5rem',
        marginBottom: '0.5rem'
    };

    const messageStyle = {
        color: '#666',
        marginBottom: '1.5rem',
        lineHeight: '1.5',
        fontSize: '12px'
    };

    const buttonContainerStyle = {
        display: 'flex',
        gap: '1rem',
        justifyContent: 'center',
        flexWrap: 'wrap'
    };

    const primaryButtonStyle = {
        backgroundColor: '#007bff',
        color: 'white',
        border: 'none',
        padding: '10px 20px',
        borderRadius: '20px',
        cursor: 'pointer',
        fontSize: '1rem',
        fontWeight: '600'
    };

    const secondaryButtonStyle = {
        backgroundColor: 'transparent',
        color: '#007bff',
        border: '2px solid #007bff',
        padding: '8px 18px',
        borderRadius: '4px',
        cursor: 'pointer',
        fontSize: '1rem'
    };

    return (
        <div style={containerStyle}>
            <div style={contentStyle}>
                <div style={errorCodeStyle}>404</div>
                <h1 style={titleStyle}>Page not found</h1>
                <p style={messageStyle}>
                    The page you are looking for might have been removed had its name changed or is temporarily unavailable.
                </p>
                <div style={buttonContainerStyle}>
                    <button
                        style={primaryButtonStyle}
                        onClick={handleGoHome}
                        onMouseOver={(e) => e.target.style.backgroundColor = '#0056b3'}
                        onMouseOut={(e) => e.target.style.backgroundColor = '#007bff'}
                    >
                        GO TO HOMEPAGE
                    </button>
                </div>
            </div>
        </div>
    );
};

export default NotFound;