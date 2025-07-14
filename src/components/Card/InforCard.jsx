import React, { useState } from 'react';
import { IoIosCloseCircle } from "react-icons/io";
import './InforCard.scss'
import { FiAlignLeft } from "react-icons/fi";
import { useNavigate } from 'react-router-dom';

const InforCard = () => {
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [description, setDescription] = useState(`1. SQL → visualization tool(power bi and superest) `);

    const closeModal = () => {
        navigate(-1);
        setIsEditing(false);
    };

    const handleEdit = () => setIsEditing(true);

    const handleSave = () => {
        setIsEditing(false);
        // Logic to save description
    };

    const handleCancel = () => {
        setIsEditing(false);
        // Reset to original description if needed
    };

    return (
        <>
            <div className="modal-overlay">
                <div className="modal-content">
                    {/* Header */}
                    <div className="modal-header">
                        <div className="header-left">
                            <div className="da-badge">
                                <span className="da-label">On Process</span>
                            </div>
                        </div>
                        <button onClick={closeModal} className="close-button">
                            <IoIosCloseCircle />
                        </button>
                    </div>

                    {/* Content */}
                    <div className="modal-body">
                        {/* Title */}
                        <div className="title-section">
                            <div className="title-circle"></div>
                            <h2 className="title-text">timeline học DA</h2>
                        </div>

                        {/* Description Section */}
                        <div className="description-section">
                            <div className="description-header">
                                <h3 className="description-title">
                                    <FiAlignLeft />
                                    <span>Description</span>
                                </h3>
                                {!isEditing && (
                                    <button onClick={handleEdit} className="edit-button">
                                        Edit
                                    </button>
                                )}
                            </div>

                            {!isEditing ? (
                                <div className="description-content">
                                    <div className="description-text">
                                        {description}
                                    </div>
                                </div>
                            ) : (
                                <div className="editor-container">
                                    <textarea
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                        className="editor-textarea"
                                        placeholder="Make your description even better. Type '/' to insert content, formatting, and more."
                                    />

                                    <div className="editor-actions">
                                        <div className="action-buttons">
                                            <button onClick={handleSave} className="save-button">
                                                Save
                                            </button>
                                            <button onClick={handleCancel} className="cancel-button">
                                                Cancel
                                            </button>
                                        </div>

                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default InforCard;