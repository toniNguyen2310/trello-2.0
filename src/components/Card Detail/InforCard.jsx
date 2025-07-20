import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom'
import { IoCloseSharp } from "react-icons/io5";
import './InforCard.scss'
import { useNavigate } from 'react-router-dom';
import { getCardDetail } from 'service/apis';
import _ from 'lodash';
import { LuChartNoAxesColumnDecreasing } from "react-icons/lu";
import CheckboxDemo from '@components/CheckDemo/CheckboxDemo';

const InforCard = () => {
    const { boardId, id } = useParams()
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [editableFields, setEditableFields] = useState({
        title: '',
        description: '',
        checklist: []
    });
    const checklist = [
        { id: 1, text: "Học bảng Pinyin (âm đầu, âm cuối, thanh điệu)", checked: true },
        { id: 2, text: "Học 150 từ vựng HSK 1", checked: false },
        { id: 3, text: "Ôn tập và làm quiz", checked: false },
    ];

    const [metaFields, setMetaFields] = useState({
        columnTitle: '',
        status: false,
        columnId: ''
    });
    useEffect(() => {
        console.log('editableFields>> ', editableFields)
        console.log('metaFields>> ', metaFields)
    }, [editableFields, metaFields])


    const closeModal = () => {
        navigate(-1);
    };

    const handleSave = () => { };
    const handleCancel = () => { };

    // const findCardWithColumnTitle = (board, cardId) => {
    //     for (const column of board.columns) {
    //         const card = column.cards.find((c) => c.id === cardId)
    //         if (card) {
    //             return {
    //                 id: card.id,
    //                 columnTitle: column.title,
    //                 status: card.status,
    //                 description: card.description,
    //                 title: card.title,
    //                 columnId: card.columnId
    //             }
    //         }
    //     }
    //     return null
    // }

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
                }


                const cardApi = await getCardDetail(id);
                console.log(cardApi)
                if (cardApi && !_.isEqual(cachedCard, cardApi)) {
                    setEditableFields({
                        title: cardApi.title,
                        description: cardApi.description,
                        checklistOrder: cardApi.checklistOrder
                    });

                    setMetaFields({
                        columnTitle: cardApi.columnTitle,
                        status: cardApi.status,
                        columnId: cardApi.columnId
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
            <div className="modal-overlay">
                <div className="modal-content loading">Loading...</div>
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
                                value={editableFields.title}
                                onChange={(e) => setEditableFields({ ...editableFields, title: e.target.value })}
                            />
                        </div>

                        {/* Description */}
                        <div className="body-section">
                            <label className="title-label">Description </label>
                            <textarea
                                value={editableFields.description}
                                onChange={(e) => setEditableFields({ ...editableFields, description: e.target.value })}
                                className="title-textarea"
                                placeholder="Nhập gì đó...."
                                rows="3"
                            />
                        </div>

                        {/* Select */}

                        <CheckboxDemo checklist={checklist} />


                    </div>

                    {/* FOOTER */}
                    <div className="modal-footer">
                        <button onClick={handleCancel} className="cancel-button">
                            Cancel
                        </button>
                        <button onClick={handleSave} className="save-button">
                            Save
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default InforCard;