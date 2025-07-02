// ColumnTitle.jsx
import React, { useState, useRef, useEffect } from 'react'


const ColumnTitle = ({ column, title, onChangeTitle }) => {


  const [editing, setEditing] = useState(false)
  const [newTitle, setNewTitle] = useState(title)
  const inputRef = useRef(null)
  const wrapperRef = useRef(null)

  // Auto focus when editing
  useEffect(() => {
    if (editing) inputRef.current?.focus()
  }, [editing])

  // Sync title when prop changes
  useEffect(() => {
    setNewTitle(title)
  }, [title])

  // Confirm change when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        confirmChange()
      }
    }

    if (editing) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [editing])

  const confirmChange = () => {
    const trimmed = newTitle.trim()
    if (trimmed && trimmed !== title) {
      onChangeTitle(trimmed)
    }
    setEditing(false)
  }



  return (
    <div className="column-title-wrapper" ref={wrapperRef}>
      {!editing ? (
        <div className="column-title-display"
          onClick={() => setEditing(true)}
        >
          {title}
        </div>
      ) : (
        <input
          ref={inputRef}
          className="column-title-input"
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && confirmChange()}
          onBlur={confirmChange}
        />
      )}
    </div>
  )
}

export default ColumnTitle
