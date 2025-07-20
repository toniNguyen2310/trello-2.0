import { useState, useRef } from 'react'
import './AddNewCard.scss'
import { FaPlus } from "react-icons/fa";
import { IoCloseSharp } from "react-icons/io5";
import useClickOutside from '@utils/customHooks/useClickOutside';

const AddNewCard = ({ column, onAddCard }) => {
  const [adding, setAdding] = useState(false)
  const [cardText, setCardText] = useState('')
  const wrapperRef = useRef(null)
  const inputRef = useRef(null)

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

  useClickOutside({
    ref: wrapperRef,
    callback: () => {
      handleAdd()
      setAdding(false)
    },
    active: adding,
    deps: [cardText]
  })

  return (
    <>
      {!adding ? (
        <div className="add-card add-card-title" onClick={() => setAdding(true)}>
          <FaPlus /> Add a card
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
            <button onClick={handleAdd}>Add Card</button>
            <div className="cancel" onClick={() => setAdding(false)}>
              <IoCloseSharp />
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default AddNewCard
