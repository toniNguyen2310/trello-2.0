import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { Popconfirm } from 'antd';
import CardInfor from '@components/CardInfor/CardInfor';

const CardEditForm = ({ title, onSave, onDelete, cardDetail, setCardDetail, onClose, listColumnsRef }) => {
    const [value, setValue] = useState(title)
    const textareaRef = useRef(null)
    const [openModal, setOpenModal] = useState(false)

    useEffect(() => {
        if (textareaRef.current) {
            const len = textareaRef.current.value.length
            textareaRef.current.setSelectionRange(len, len)
            textareaRef.current.focus();
        }
    }, []);

    const handleSave = () => {
        const trimmed = value.trim()
        if (!trimmed) {
            textareaRef.current.focus()
            return
        }
        onSave(trimmed)
    }


    return (
        <>
            <div className="edit-container">
                <textarea
                    ref={textareaRef}
                    value={value}
                    className="edit-textarea"
                    placeholder="Nhập tiêu đề thẻ..."
                    onChange={(e) => setValue(e.target.value)}
                    rows={3}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') handleSave()
                    }}

                />
                <div className="edit-actions">
                    <button
                        className="edit-actions-btn save-btn"
                        onClick={handleSave}
                    >
                        SAVE
                    </button>
                    <Popconfirm
                        placement="right"
                        title="Delete the card"
                        description="Are you sure?"
                        okText="Yes"
                        cancelText="No"
                        onConfirm={onDelete}
                    >
                        <div className='edit-actions-btn del-btn'>DELETE</div>
                    </Popconfirm>
                    <button className="edit-actions-btn detail-btn" onClick={() => {
                        setOpenModal(true)
                    }} >
                        DETAIL
                    </button>
                </div>
            </div >
            {openModal && (
                <CardInfor
                    cardDetail={cardDetail}
                    setCardDetail={setCardDetail}
                    listColumnsRef={listColumnsRef}
                    onClose={() => {
                        setOpenModal(false)
                        onClose()
                    }}
                />
            )
            }

        </>

    )
}

export default CardEditForm
