import { useState, useRef, useEffect } from 'react'
import './AddNewCard.scss'
import { ImCross } from "react-icons/im";
import { FaPlus } from "react-icons/fa";

const AddNewCard = ({ column, onAddCard }) => {
  const [adding, setAdding] = useState(false)
  const [cardText, setCardText] = useState('')
  const wrapperRef = useRef(null)
  const inputRef = useRef(null)

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        handleAdd()
        setAdding(false)
      }
    }

    if (adding) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [adding, cardText])


  const handleAdd = () => {
    const trimmed = cardText.trim()

    if (!trimmed) {
      setCardText('')
      setAdding(false)
      return
    }
    onAddCard(trimmed)
    setCardText('')
    setAdding(true)
    setTimeout(() => inputRef.current?.focus(), 0)
  }

  return (
    <>
      {!adding ? (
        <div className="add-card add-card-title" onClick={() => setAdding(true)}>
          <FaPlus /> Thêm thẻ
        </div>
      ) : (
        <div className="add-card form" ref={wrapperRef}>
          <input
            ref={inputRef}
            value={cardText}
            onChange={(e) => setCardText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
            placeholder="Enter a title..."
            autoFocus
          />
          <div className="actions">
            <button onClick={handleAdd}>Unshift</button>
            <button onClick={handleAdd}>Push </button>
            <button className="cancel" onClick={() => setAdding(false)}>
              <ImCross />
            </button>
          </div>
        </div>
      )}
    </>
  )
}

export default AddNewCard
