import React from 'react';
import { Spin } from 'antd';
import './LoadingComponent.scss';
import { LoadingOutlined } from '@ant-design/icons';

const LoadingComponent = () => {
    return (
        <div className="loading-overlay">
            <div className="loading-content">
                <Spin size="large" indicator={<LoadingOutlined spin />} className="loading-spin" />
                <span className="loading-text">Loading</span>
            </div>
        </div>
    );
};

export default LoadingComponent;