import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom'
import { IoIosCloseCircle } from "react-icons/io";
import './InforCard.scss'
import { FiAlignLeft } from "react-icons/fi";
import { useNavigate } from 'react-router-dom';
import { getCardDetail } from 'service/apis';
import _ from 'lodash';

const InforCard = () => {
    const { boardId, id } = useParams()
    const navigate = useNavigate();
    const [isEditing, setIsEditing] = useState(false);
    const [description, setDescription] = useState("");
    const [inforCard, setInforCard] = useState(null)
    const [loading, setLoading] = useState(true);

    const closeModal = () => {
        navigate(-1);
        setIsEditing(false);
        setInforCard(null);
        setDescription("")
    };

    const handleEdit = () => setIsEditing(true);
    const handleSave = () => {
        setIsEditing(false);
    };
    const handleCancel = () => {
        setIsEditing(false);
    };

    const findCardWithColumnTitle = (board, cardId) => {
        for (const column of board.columns) {
            const card = column.cards.find((c) => c.id === cardId)
            if (card) {
                return {
                    id: card.id,
                    columnTitle: column.title,
                    status: card.status,
                    description: card.description,
                    title: card.title,
                    columnId: card.columnId
                }
            }
        }
        return null
    }

    useEffect(() => {
        const fetchCardDetail = async () => {
            setLoading(true);
            let valueLS = null;
            try {
                const boardLS = localStorage.getItem(`trelloBoard-${boardId}`)

                if (boardLS) {
                    const board = JSON.parse(boardLS);
                    valueLS = findCardWithColumnTitle(board, id);
                    if (valueLS) {
                        setInforCard(valueLS);
                        setDescription(valueLS.description);
                    }
                    const valueApi = await getCardDetail(id)

                    if (!valueLS || !_.isEqual(valueLS, valueApi)) {
                        setInforCard(valueApi)
                        setDescription(valueApi.description || '')
                    }
                }
            } catch (err) {
                console.error('Không thể lấy chi tiết card:', err)

            } finally {
                setLoading(false);
            }

        }

        fetchCardDetail()
    }, [id, boardId])

    useEffect(() => {
        if (!loading && !inforCard) {
            navigate(`/board/${boardId}`);
        }
    }, [loading, inforCard]);

    if (loading) {
        return (
            <div className="modal-overlay">
                <div className="modal-content loading">Loading...</div>
            </div>
        );
    }

    if (!inforCard) {
        return (
            <div className="modal-overlay">
                <div className="modal-content error">Card not found</div>
            </div>
        );
    }

    return (
        <>
            <div className="modal-overlay">
                <div className="modal-content">
                    {/* Header */}
                    <div className="modal-header">
                        <div className="header-left">
                            <div className="da-badge">
                                <span className="da-label">{inforCard?.columnTitle}</span>
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
                            <h2 className="title-text">{inforCard?.title}</h2>
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