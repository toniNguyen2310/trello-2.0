import { useRef, useEffect, useState } from 'react'
import './AddNewColumn.scss'
import { ImCross } from "react-icons/im";
import { FaPlus } from "react-icons/fa";
import useClickOutside from '@utils/customHooks/useClickOutside';

const AddNewColumn = ({ onAddColumn }) => {
  const [adding, setAdding] = useState(false)
  const [newTitle, setNewTitle] = useState('')
  const wrapperRef = useRef(null)
  const inputRef = useRef(null)

  useClickOutside({
    ref: wrapperRef,
    callback: () => {
      setAdding(false)
      setNewTitle('')
    },
    active: adding
  })


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
        <div className="add-column add-column-title" onClick={() => setAdding(true)}>
          <FaPlus />
          Add another list
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
            <button className="cancel" onClick={() => { setAdding(false); setNewTitle('') }}><ImCross /></button>
          </div>
        </div>
      )}
    </>
  )
}

export default AddNewColumn
