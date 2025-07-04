import React, { useState, useRef, useEffect } from 'react'
import './AddNewCard.scss'

const AddNewCard = ({ column, onAddCard }) => {
  const [adding, setAdding] = useState(false)
  const [cardText, setCardText] = useState('')
  const wrapperRef = useRef(null)
  const inputRef = useRef(null)

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setAdding(false)
        setCardText('')
      }
    }

    if (adding) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [adding])

  const handleAdd = () => {
    const trimmed = cardText.trim()
    return
    if (!trimmed) return
    onAddCard(trimmed)
    setCardText('')
    setAdding(true)
    setTimeout(() => inputRef.current?.focus(), 0)
  }

  return (
    <>
      {!adding ? (
        <div className="add-card" onClick={() => setAdding(true)}>
          + Thêm thẻ
        </div>
      ) : (
        <div className="add-card form" ref={wrapperRef}>
          <input
            ref={inputRef}
            value={cardText}
            onChange={(e) => setCardText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
            placeholder="Nhập tiêu đề thẻ..."
            autoFocus
          />
          <div className="actions">
            <button onClick={handleAdd}>Thêm thẻ</button>
            <button className="cancel" onClick={() => setAdding(false)}>Hủy</button>
          </div>
        </div>
      )}
    </>
  )
}

export default AddNewCard
