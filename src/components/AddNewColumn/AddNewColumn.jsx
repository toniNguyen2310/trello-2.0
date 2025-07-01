import React, { useRef, useEffect, useState } from 'react'
import './AddNewColumn.scss'

const AddNewColumn = ({ onAddColumn }) => {
  const [adding, setAdding] = useState(false)
  const [newTitle, setNewTitle] = useState('')
  const wrapperRef = useRef(null)
  const inputRef = useRef(null)

  // Detect click outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setAdding(false)
        setNewTitle('')
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
    const trimmed = newTitle.trim()
    if (!trimmed) return
    onAddColumn(trimmed)
    setNewTitle('')
    setAdding(true)
    setTimeout(() => inputRef.current?.focus(), 0)
  }

  return (
    <>
      {!adding ? (
        <div className="add-column" onClick={() => setAdding(true)}>
          + Thêm danh sách khác
        </div>
      ) : (
        <div className="add-column form" ref={wrapperRef}>
          <input
            ref={inputRef}
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            placeholder="Nhập tên danh sách..."
            onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
            autoFocus
          />
          <div className="actions">
            <button onClick={handleAdd}>Thêm danh sách</button>
            <button className="cancel" onClick={() => { setAdding(false); setNewTitle('') }}>Hủy</button>
          </div>
        </div>
      )}
    </>
  )
}

export default AddNewColumn
