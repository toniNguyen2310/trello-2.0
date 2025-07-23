import { useEffect, useState } from 'react';
import { IoCloseSharp } from "react-icons/io5";
import './CardInfor.scss'
import { updateDetailCardById } from 'service/apis';
import _ from 'lodash';
import { LuChartNoAxesColumnDecreasing } from "react-icons/lu";
import Checklist from '@components/Checklist/Checklist';

const getColumnTitle = (columnId, listColumnsRef) => {
    return listColumnsRef.current?.columns.find(col => col.id === columnId)?.title || ''
}

const CardInfor = ({ cardDetail, setCardDetail, onClose, listColumnsRef }) => {
    const [editableFields, setEditableFields] = useState({
        title: cardDetail.title || '',
        description: cardDetail.description || '',
        checklist: cardDetail.checklist || []
    });
    const columnTitle = getColumnTitle(cardDetail.columnId, listColumnsRef)

    const handleSave = async () => {
        const trimmedTitle = editableFields.title.trim()
        if (!trimmedTitle) {
            return
        }
        const newData = {
            title: editableFields.title,
            description: editableFields.description,
            checklist: editableFields.checklist
        }
        const oldData = {
            title: cardDetail.title,
            description: cardDetail.description,
            checklist: cardDetail.checklist
        }
        const isSame = !_.isEqual(newData, oldData)

        if (!isSame) {
            onClose()
            return
        }
        try {
            const updatedCard = { ...cardDetail, ...newData }
            setCardDetail(updatedCard)
            const column = listColumnsRef.current.columns.find(col => col.id === cardDetail.columnId)
            if (column) {
                const cardIndex = column.cards.findIndex(c => c.id === cardDetail.id)
                if (cardIndex !== -1) {
                    column.cards[cardIndex] = updatedCard
                }
                localStorage.setItem(`trelloBoard-${listColumnsRef.current._id}`, JSON.stringify(listColumnsRef.current))
            }
            updateDetailCardById({ cardId: cardDetail.id, data: newData })
            onClose()

        } catch (error) {
            console.error('Error updating card:', error)
            alert('Có lỗi xảy ra, vui lòng thử lại!')
        }
    }

    useEffect(() => {
        setEditableFields({
            title: cardDetail.title || '',
            description: cardDetail.description || '',
            checklist: cardDetail.checklist || []
        });
    }, [cardDetail]);

    return (
        <>
            <div className="modal-overlay">
                <div className="modal-content">
                    {/* Header */}
                    <div className="modal-header">
                        <div className="header-left">
                            <LuChartNoAxesColumnDecreasing />
                            <span>{columnTitle}</span>
                        </div>
                        <div className="close-button" onClick={onClose}>
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
                                onChange={(e) =>
                                    setEditableFields(prev => ({ ...prev, title: e.target.value }))
                                }
                            />
                        </div>

                        {/* Description */}
                        <div className="body-section">
                            <label className="title-label">Description </label>
                            <textarea
                                type="text"
                                value={editableFields.description}
                                onChange={(e) => setEditableFields(prev => ({ ...prev, description: e.target.value }))}
                                className="title-textarea"
                                placeholder="Nhập gì đó...."
                                rows={3}
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
                        <button className="cancel-button" onClick={onClose}>
                            Cancel
                        </button>
                        <button className="save-button" onClick={handleSave}>
                            Save
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default CardInfor;