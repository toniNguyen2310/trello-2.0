import { useState } from 'react'
import './Card.scss'
import { createGhostCardOrColumn } from '../../utils/constants'
import { useNavigate } from 'react-router-dom';


const Card = ({ card, dragStartRef, dragEndRef, cloneElRef, distanceYFirst, distanceXFirst }) => {
  const [cardTitle, setCardTitle] = useState(card.title)
  const navigate = useNavigate();

  //Handle Edit Card
  const handleEditCard = () => {
    // console.log('CLICK')
  }
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
  return (
    <div
      className="card-item"
      data-card-id={card.id}
      data-card-columnid={card.columnId}
      onMouseDown={handleMouseDownCard}
      onClick={() => navigate('/board/card')
      }
    >
      {cardTitle}
    </div>
  )
}

export default Card
