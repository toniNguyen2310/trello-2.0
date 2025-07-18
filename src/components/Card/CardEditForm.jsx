import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom';

const CardEditForm = ({ card, title, onClose, onSave, onDelete }) => {
    const [value, setValue] = useState(title)
    const textareaRef = useRef(null)
    const navigate = useNavigate();

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
        <div className="edit-container">
            <textarea
                ref={textareaRef}
                value={value}
                className="edit-textarea"
                placeholder="Nhập tiêu đề thẻ..."
                onChange={(e) => setValue(e.target.value)}
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
                <button className="edit-actions-btn del-btn" onClick={onDelete}>DELETE</button>
                <button className="edit-actions-btn detail-btn" onClick={() => navigate(`card/${card.id}`)} >DETAIL</button>
            </div>
        </div>

    )
}

export default CardEditForm
