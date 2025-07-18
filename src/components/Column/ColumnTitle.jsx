// ColumnTitle.jsx
import React, { useState, useRef, useEffect } from 'react'
import { IoIosMore } from "react-icons/io";
import MiniPopConfirm from './MiniPopConfirm';

const ColumnTitle = ({ column, onChangeTitle, handleMouseDownColumn, handleDeleteColumn }) => {

  const [editing, setEditing] = useState(false)
  const [newTitle, setNewTitle] = useState(column.title)
  const [showConfirm, setShowConfirm] = useState(false)
  const inputRef = useRef(null)
  const wrapperRef = useRef(null)


  // Auto focus when editing
  useEffect(() => {
    if (editing) inputRef.current?.focus()
  }, [editing])


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
  }, [editing, newTitle])

  const confirmChange = () => {
    const trimmed = newTitle.trim()
    if (trimmed && trimmed !== column.title) {
      onChangeTitle(trimmed)
    }
    setEditing(false)
  }



  return (
    <div className="column-title-wrapper"
      ref={wrapperRef}>
      {!editing ? (
        <div
          className="column-title-display"
          onClick={() => {
            setEditing(true)
          }}
          onMouseDown={handleMouseDownColumn}
        >
          {column.title}
        </div>
      ) : (
        <input
          ref={inputRef}
          className="column-title-input"
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && confirmChange()}
          onBlur={confirmChange}
          spellCheck={false}
        />
      )}


      <div
        className="delete-column-btn"
        onClick={(e) => {
          e.stopPropagation()
          setShowConfirm(true)
        }}
      >
        <IoIosMore />
      </div>
      {showConfirm && (
        <MiniPopConfirm
          message="Delete This Column?"
          onConfirm={() => {
            handleDeleteColumn(column.id)
            setShowConfirm(false)
          }}
          onCancel={() => setShowConfirm(false)}
        />
      )}


    </div>

  )
}

export default ColumnTitle
