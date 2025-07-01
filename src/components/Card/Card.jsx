import { useState } from 'react'
import './Card.scss'
import { createGhostCard } from '../../utils/constants'


const Card = ({ card, valueDragStartRef, valueDragEndRef, cloneCardRef, distanceYFirst, distanceXFirst }) => {
  const [cardTitle, setCardTitle] = useState(card.title)
  //Handle Edit Card
  const handleEditCard = () => {
    console.log('CLICK')
  }
  //Handle Mouse Down
  const handleMouseDown = (e) => {
    const cardTarget = e.target
    const rect = cardTarget.getBoundingClientRect()

    // Lưu lại khoảng cách giữa chuột và thẻ
    distanceXFirst.current = e.clientX - rect.left
    distanceYFirst.current = e.clientY - rect.top
    //Clone thẻ -> tạo ghost
    const clone = createGhostCard(cardTarget, e.pageX, e.pageY, distanceXFirst.current, distanceYFirst.current)
    cloneCardRef.current = clone

    //lưu dragging
    let dragging = {
      sourceCardId: card.id,
      sourceColumnId: card.columnId,
      isDragging: true
    }

    //Save draggingStart
    valueDragStartRef.current = dragging
  }
  return (
    <div
      className="card-item"
      data-card-id={card.id}
      data-card-columnid={card.columnId}
      onMouseDown={handleMouseDown}
      onClick={() => handleEditCard()}
    >
      {cardTitle}
    </div>
  )
}

export default Card
