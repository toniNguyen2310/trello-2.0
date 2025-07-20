import React, { useState, useRef, useEffect } from 'react'
import { deleteBoardById, updateBoardTitle } from 'service/apis'
import { IoIosMore } from "react-icons/io";
import { useNavigate } from 'react-router-dom';

const BoardHeader = ({ board, colorOb, listColumnsRef }) => {
  const [boardName, setBoardName] = useState(board.title)
  const [editing, setEditing] = useState(false)
  const [tempName, setTempName] = useState(boardName)
  const wrapperRef = useRef(null)
  const navigate = useNavigate()

  const handleUpdateBoardTitle = async () => {
    try {
      const data = {
        boardId: board._id,
        newTitle: tempName.trim()
      }
      setBoardName(tempName.trim() || boardName)
      setEditing(false)
      listColumnsRef.current.title = tempName.trim()
      localStorage.setItem(`trelloBoard-${board._id}`, JSON.stringify(listColumnsRef.current))
      await updateBoardTitle(data)
    } catch (err) {
      console.error('Lỗi update title board:', err)
    }
  }

  const deleteBoard = async (e) => {
    try {
      const dataDelete = {
        boardId: board._id,
        userId: board.ownerId
      }
      await deleteBoardById(dataDelete)
      navigate('/')
    } catch (err) {
      console.error('Lỗi update title board:', err)
    }
  }

  // Xử lý click ngoài để đóng ô input
  useEffect(() => {
    const handleClickOutside = async (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        if (tempName.trim()) {
          handleUpdateBoardTitle()
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
    <div className="board-header" style={{ background: colorOb.darker1 }}>
      <div className="board-title board-title-hover" >
        {!editing ? (
          <div className='title-name' onClick={() => setEditing(true)}>{boardName}</div>
        ) : (
          <input
            value={tempName}
            onChange={(e) => setTempName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleUpdateBoardTitle()
              }
            }}
            ref={wrapperRef}
            autoFocus
          />
        )}
        <div className='delete-board' onClick={(e) => deleteBoard(e)}><IoIosMore />
        </div>
      </div>
    </div>
  )
}

export default BoardHeader