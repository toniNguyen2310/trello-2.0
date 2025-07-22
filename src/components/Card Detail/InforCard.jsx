import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom'
import { IoCloseSharp } from "react-icons/io5";
import './InforCard.scss'
import { useNavigate } from 'react-router-dom';
import { getCardDetail, updateDetailCardById } from 'service/apis';
import _ from 'lodash';
import { LuChartNoAxesColumnDecreasing } from "react-icons/lu";
import Checklist from '@components/Checklist/Checklist';
import LoadingComponent from '@components/LoadingComponent/LoadingComponent ';

const InforCard = () => {
    const { boardId, id } = useParams()
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [editableFields, setEditableFields] = useState({
        title: '',
        description: '',
        checklist: []
    });
    const [metaFields, setMetaFields] = useState({
        columnTitle: '',
        status: false,
        columnId: ''
    });
    const [originalData, setOriginalData] = useState(null);

    const closeModal = () => {
        navigate(`/board/${boardId}`);
        setEditableFields(originalData);
    };

    const handleSave = (e) => {
        const hasChanges = !_.isEqual(editableFields, originalData);

        if (hasChanges) {
            try {
                localStorage.setItem(`card-${id}`, JSON.stringify({
                    id,
                    ...editableFields,
                    ...metaFields
                }));
                updateDetailCardById({ cardId: id, data: editableFields })
                setOriginalData(editableFields); // cập nhật dữ liệu gốc
                closeModal(); // tắt modal
            } catch (err) {
                console.error('Lỗi khi lưu card:', err);
            }
        } else {
            closeModal();
        }
    };

    useEffect(() => {
        const fetchCardDetail = async () => {
            setLoading(true);
            try {
                const cachedCard = JSON.parse(localStorage.getItem(`card-${id}`) || 'null');
                if (cachedCard && cachedCard.id) {
                    console.log('cachedCard>> ', cachedCard)
                    setEditableFields({
                        title: cachedCard.title,
                        description: cachedCard.description,
                        checklist: cachedCard.checklist
                    });
                    setMetaFields({
                        columnTitle: cachedCard.columnTitle,
                        status: cachedCard.status,
                        columnId: cachedCard.columnId
                    });
                    setOriginalData({
                        title: cachedCard.title,
                        description: cachedCard.description,
                        checklist: cachedCard.checklist
                    });
                }

                const cardApi = await getCardDetail(id);
                console.log(cardApi)
                if (cardApi && !_.isEqual(cachedCard, cardApi)) {
                    setEditableFields({
                        title: cardApi.title,
                        description: cardApi.description,
                        checklist: cardApi.checklist
                    });

                    setMetaFields({
                        columnTitle: cardApi.columnTitle,
                        status: cardApi.status,
                        columnId: cardApi.columnId
                    });
                    setOriginalData({
                        title: cardApi.title,
                        description: cardApi.description,
                        checklist: cardApi.checklist
                    });
                    localStorage.setItem(`card-${id}`, JSON.stringify(cardApi));
                }

                // 4. Nếu không có cả API và local thì quay về board
                if (!cardApi && !cachedCard) {
                    navigate(`/board/${boardId}`);
                }
            } catch (err) {
                console.error('Lỗi khi lấy chi tiết card:', err);
                navigate(`/board/${boardId}`);
            } finally {
                setLoading(false);
            }


        }

        fetchCardDetail()
    }, [id, boardId, navigate])

    if (loading) {
        return (
            <LoadingComponent />
        );
    }

    return (
        <>
            <div className="modal-overlay">
                <div className="modal-content">
                    {/* Header */}
                    <div className="modal-header">
                        <div className="header-left">
                            <LuChartNoAxesColumnDecreasing />
                            <span>{metaFields?.columnTitle}</span>
                        </div>
                        <div onClick={closeModal} className="close-button">
                            <IoCloseSharp />
                        </div>
                    </div>

                    {/* BODY */}
                    <div className="modal-body">
                        {/* Title */}
                        <div className="body-section">
                            <label className="title-label">Title</label>
                            <input className="title-input"
                                type="text"
                                value={editableFields.title}
                                onChange={(e) => setEditableFields({ ...editableFields, title: e.target.value })}
                            />
                        </div>

                        {/* Description */}
                        <div className="body-section">
                            <label className="title-label">Description </label>
                            <textarea
                                type="text"
                                value={editableFields.description}
                                onChange={(e) => setEditableFields({ ...editableFields, description: e.target.value })}
                                className="title-textarea"
                                placeholder="Nhập gì đó...."
                                rows="3"
                            />
                        </div>

                        <Checklist checklist={editableFields.checklist} onChange={(newChecklist) =>
                            setEditableFields(prev => ({
                                ...prev,
                                checklist: newChecklist
                            }))
                        } />

                    </div>

                    {/* FOOTER */}
                    <div className="modal-footer">
                        <button onClick={closeModal} className="cancel-button">
                            Cancel
                        </button>
                        <button onClick={(e) => handleSave(e)} className="save-button">
                            Save
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default InforCard;