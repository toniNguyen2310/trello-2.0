import { useEffect, useRef, useState } from 'react'
import './Card.scss'
import { createGhostCardOrColumn } from '../../utils/constants'
import { FaRegEdit } from "react-icons/fa";
import CardEditForm from './CardEditForm';
import { deleteCardById, updateCardTitleById } from 'service/apis';


const Card = ({ card, cards, setCards, dragStartRef, cloneElRef, distanceYFirst, distanceXFirst, listColumnsRef }) => {
  const [cardDetail, setCardDetail] = useState(card)
  const [isEditing, setIsEditing] = useState(false)
  const wrapperRef = useRef(null)

  //Handle Mouse Down
  const handleMouseDownCard = (e) => {
    const cardTarget = e.target
    const rect = cardTarget.getBoundingClientRect()

    // Lưu lại khoảng cách giữa chuột và thẻ
    distanceXFirst.current = e.clientX - rect.left
    distanceYFirst.current = e.clientY - rect.top
    //Clone thẻ -> tạo ghost
    const clone = createGhostCardOrColumn(cardTarget, e.pageX, e.pageY, distanceXFirst.current, distanceYFirst.current)
    cloneElRef.current = clone

    //lưu dragging
    let dragging = {
      sourceCardId: card.id,
      sourceColumnId: card.columnId,
      isDragging: true
    }
    //Save draggingStart
    dragStartRef.current = dragging
  }

  //Save title Card
  const handleSaveTitleCard = (newTitle) => {
    if (newTitle === card.title) {
      setIsEditing(false)
      return
    }
    setCardDetail({ ...cardDetail, title: newTitle })
    // setCardTitle(newTitle)
    setIsEditing(false)
    const column = listColumnsRef.current.columns.find(col => col.id === card.columnId)
    if (!column) return
    const cardToUpdate = column.cards.find(c => c.id === card.id)
    cardToUpdate && (cardToUpdate.title = newTitle)
    localStorage.setItem(`trelloBoard-${listColumnsRef.current._id}`, JSON.stringify(listColumnsRef.current))

    updateCardTitleById({ cardId: card.id, title: newTitle })
  }

  //Delete Card
  const handleDeleteCard = () => {
    const updateCards = cards.filter(c => c.id !== card.id)
    setCards(updateCards)
    const column = listColumnsRef.current.columns.find(col => col.id === card.columnId)
    column.cardOrder = column.cardOrder.filter(id => id !== card.id)
    column.cards = column.cards.filter(c => c.id !== card.id)
    localStorage.setItem(`trelloBoard-${listColumnsRef.current._id}`, JSON.stringify(listColumnsRef.current))
    deleteCardById({ cardId: card.id })
  }

  //Edit cardInfor
  const saveNewCardInfor = ({ newTitle }) => {
    if (newTitle === cardDetail.newTitle) {
      setIsEditing(false)
      return
    }
  }


  useEffect(() => {
    const handleClickOutside = (e) => {
      const clickedCardId = e.target.closest('[data-card-id]')?.dataset?.cardId
      const isOutside = wrapperRef.current && !wrapperRef.current.contains(e.target)
      const isInPopconfirm = e.target.closest('.ant-popover-content');
      const isEditIcon = e.target.closest('.edit-icon');
      const isAddCard = e.target.closest('.add-card')
      if (isEditing && clickedCardId !== card.id && isOutside && !isInPopconfirm && !isEditIcon && !isAddCard) {
        setIsEditing(false)
      }
    }

    if (isEditing) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isEditing, card.id])

  return (
    <>
      <div
        ref={wrapperRef}
        className={`card-item ${isEditing ? 'edit-mode' : ''}`}
        data-card-id={card.id}
        data-card-columnid={card.columnId}
        onMouseDown={!isEditing ? handleMouseDownCard : undefined}

      >{!isEditing ? (
        <>
          {cardDetail.title}
          < div
            className="edit-icon"
            onClick={(e) => {
              e.stopPropagation();
              setIsEditing(true)
            }}
          >
            <FaRegEdit />
          </div >
        </>
      ) :
        (
          <CardEditForm
            card={card}
            title={cardDetail.title}
            onClose={() => setIsEditing(false)}
            onSave={handleSaveTitleCard}
            onDelete={handleDeleteCard}
            cardDetail={cardDetail}
            setCardDetail={setCardDetail}
            listColumnsRef={listColumnsRef}
          />
        )}
      </div >
    </>





  )
}

export default Card
