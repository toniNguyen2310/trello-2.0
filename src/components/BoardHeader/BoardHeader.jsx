import React, { useState, useRef, useEffect } from 'react'
import { deleteBoardById, updateBoardTitle } from 'service/apis'
import { IoIosMore } from "react-icons/io";
import { useNavigate } from 'react-router-dom';
import { Popconfirm } from 'antd';
import useClickOutside from '@utils/customHooks/useClickOutside';
import { useUpdateBoardsCache } from '@utils/customHooks/useUpdateBoardsCache'

const BoardHeader = ({ board, colorOb, listColumnsRef }) => {
  const [boardName, setBoardName] = useState(board.title)
  const [editing, setEditing] = useState(false)
  const [tempName, setTempName] = useState(boardName)
  const wrapperRef = useRef(null)
  const navigate = useNavigate()
  const { removeBoardFromCache } = useUpdateBoardsCache()

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

  const deleteBoard = async () => {
    try {
      const dataDelete = {
        boardId: board._id,
        userId: board.ownerId
      }
      await deleteBoardById(dataDelete)
      removeBoardFromCache(board._id)
      localStorage.removeItem(`trelloBoard-${board._id}`);
      navigate('/')
    } catch (err) {
      console.error('Lỗi update title board:', err)
    }
  }

  useClickOutside({
    ref: wrapperRef,
    active: editing,
    deps: [tempName],
    callback: async () => {
      if (tempName.trim()) {
        await handleUpdateBoardTitle()
      }
      setEditing(false)
    }
  })

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
        <Popconfirm
          placement="left"
          title="Delete the board"
          description="Are you sure?"
          okText="Yes"
          cancelText="No"
          onConfirm={deleteBoard}
        >
          <div className='delete-board'><IoIosMore />
          </div>
        </Popconfirm>

      </div>
    </div>
  )
}

export default BoardHeader