// ColumnTitle.jsx
import React, { useState, useRef, useEffect } from 'react'
import { IoIosMore } from "react-icons/io";
import MiniPopConfirm from './MiniPopConfirm';
import { Popconfirm } from 'antd';
import useClickOutside from '@utils/customHooks/useClickOutside';

const ColumnTitle = ({ column, onChangeTitle, handleMouseDownColumn, handleDeleteColumn }) => {
  const [editing, setEditing] = useState(false)
  const [newTitle, setNewTitle] = useState(column.title)
  const inputRef = useRef(null)
  const wrapperRef = useRef(null)

  // Auto focus when editing
  useEffect(() => {
    if (editing) inputRef.current?.focus()
  }, [editing])

  useClickOutside({
    ref: wrapperRef,
    callback: () => {
      confirmChange()
    },
    active: editing,
    deps: [newTitle]
  })


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
      <Popconfirm
        placement="right"
        title="Delete the column"
        description="Are you sure?"
        okText="Yes"
        cancelText="No"
        onConfirm={(e) => {
          e.stopPropagation()
          handleDeleteColumn(column.id)
        }}
      >
        <div
          className="delete-column-btn"
        >
          <IoIosMore />
        </div>
      </Popconfirm>
    </div>

  )
}

export default ColumnTitle
