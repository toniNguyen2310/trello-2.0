import React, { useState, useRef, useEffect } from 'react'

const BoardHeader = () => {
  const [boardName, setBoardName] = useState('Bảng công việc')
  const [editing, setEditing] = useState(false)
  const [tempName, setTempName] = useState(boardName)
  const inputRef = useRef(null)
  const wrapperRef = useRef(null)

  // Xử lý click ngoài để đóng ô input
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        if (tempName.trim()) {
          setBoardName(tempName.trim())
        }
        setEditing(false)
      }
    }

    if (editing) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [editing, tempName])
  return (
    <div className="board-header">
      <div className="board-title board-title-hover" ref={wrapperRef}>
        {!editing ? (
          <h1 onClick={() => setEditing(true)}>{boardName}</h1>
        ) : (
          <input
            ref={inputRef}
            value={tempName}
            onChange={(e) => setTempName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                setBoardName(tempName.trim() || boardName)
                setEditing(false)
              }
            }}
            autoFocus
          />
        )}
      </div>
    </div>
  )
}

export default BoardHeader