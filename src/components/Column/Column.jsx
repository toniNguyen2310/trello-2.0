import { useEffect, useRef, useState } from 'react'
import Card from '../Card/Card'
import AddNewCard from '../AddNewCard/AddNewCard'
import './Column.scss'
import ColumnTitle from './ColumnTitle'
import { cloneColumn, createGhostCardOrColumn, resetDataDrag, sortOrder, updateColumnsInRef } from '../../utils/constants'


const Column = ({
  columnProps,
  listColumnsRef,
  onAddCard,
  onChangeColumnTitle,
  dragEndRef,
  dragStartRef,
  cloneElRef,
  distanceXFirst,
  distanceYFirst,

}) => {
  const [column, setColumn] = useState(columnProps)
  const [cards, setCards] = useState(sortOrder(columnProps.cards, columnProps.cardOrder, 'id'))
  const [titleColumn, setTitleColumn] = useState(columnProps.title)
  const cardsWrapperRef = useRef(null)

  //Handle Add New Card
  const handleAddCard = (cardText) => {
    setCards(prev => {
      const updated = [...prev, cardText]
      // Scroll to bottom column after render
      setTimeout(() => {
        const el = cardsWrapperRef.current
        if (el) {
          el.scrollTop = el.scrollHeight
        }
      }, 0)

      return updated
    })
  }

  //Handle Change Title Column
  const handleChangeTitle = (newTitle) => {
    setTitleColumn(newTitle)
  }


  //Handle MouseMoveCard
  const swapCard = (sourceCol, targetCol, sourceCardId, targetCardId, isInsertEnd) => {
    const isSameColumn = sourceCol.id === targetCol.id
    // === CASE 1: Cùng cột ===
    if (isSameColumn) {
      const newCol = cloneColumn(sourceCol);
      const { cardOrder, cards } = newCol;
      const sourceIndex = newCol.cardOrder.indexOf(sourceCardId)
      const targetIndex = newCol.cardOrder.indexOf(targetCardId)

      if (sourceIndex === -1 || targetIndex === -1) return [sourceCol, sourceCol]
      if (isInsertEnd) {
        // 1️⃣ Luôn đẩy thẻ xuống cuối
        const [movedCard] = cards.splice(sourceIndex, 1);
        cardOrder.splice(sourceIndex, 1);
        cards.push(movedCard);
        cardOrder.push(sourceCardId);
      } else {
        // 2.1: Lấy thẻ nguồn
        const [movedCard] = cards.splice(sourceIndex, 1);
        cardOrder.splice(sourceIndex, 1);

        cards.splice(targetIndex, 0, movedCard);
        cardOrder.splice(targetIndex, 0, sourceCardId);
      }

      // Trả về 2 bản clone riêng biệt để tránh reference lỗi
      let newSourceCol = cloneColumn(newCol)
      listColumnsRef.current = updateColumnsInRef(listColumnsRef.current, newSourceCol);
      return [newSourceCol, null];
    }

    // === CASE 2: KHÁC CỘT 
    const newSourceCol = cloneColumn(sourceCol);
    const newTargetCol = cloneColumn(targetCol);

    const sourceIndex = newSourceCol.cardOrder.indexOf(sourceCardId);
    if (sourceIndex === -1) return [sourceCol, targetCol];
    const sourceCard = newSourceCol.cards.find(c => c.id === sourceCardId);
    if (!sourceCard) return [sourceCol, targetCol];

    // Xoá thẻ nguồn khỏi cột nguồn
    newSourceCol.cardOrder.splice(sourceIndex, 1);
    newSourceCol.cards = newSourceCol.cards.filter(c => c.id !== sourceCardId);

    // Cập nhật columnId mới cho thẻ nguồn
    const updatedSourceCard = { ...sourceCard, columnId: newTargetCol.id };

    if (isInsertEnd) {
      // Luôn thêm vào cuối cột đích
      newTargetCol.cardOrder.push(updatedSourceCard.id);
      newTargetCol.cards.push(updatedSourceCard);

      // } else {
      //   if (!targetCardId) {
      //   // CASE 2.1: CỘT RỖNG khi targetCardId = null 
      //   newTargetCol.cardOrder.unshift(updatedSourceCard.id);
      //   newTargetCol.cards.unshift(updatedSourceCard);

      // } else {
      //   // === CASE 2.2: Kéo sang cột khác có thẻ
      //   const targetIndex = newTargetCol.cardOrder.indexOf(targetCardId);
      //   if (targetIndex === -1) return [sourceCol, targetCol];

      //   // Thêm source vào vị trí target trong cột đích
      //   newTargetCol.cardOrder.splice(targetIndex, 0, updatedSourceCard.id);
      //   newTargetCol.cards.splice(targetIndex, 0, updatedSourceCard);
      // }
    } else if (targetCardId == null) {
      // CASE 2.1: CỘT RỖNG khi targetCardId = null 
      newTargetCol.cardOrder.unshift(updatedSourceCard.id);
      newTargetCol.cards.unshift(updatedSourceCard);

    } else {
      // / === CASE 2.2: Kéo sang cột khác có thẻ
      const targetIndex = newTargetCol.cardOrder.indexOf(targetCardId);
      // Thêm source vào vị trí target trong cột đích
      newTargetCol.cardOrder.splice(targetIndex, 0, updatedSourceCard.id);
      newTargetCol.cards.splice(targetIndex, 0, updatedSourceCard);
    }

    // Cập nhật lại dữ liệu trong listColumnsRef sau khi xử lý kéo thả
    listColumnsRef.current = updateColumnsInRef(listColumnsRef.current, newSourceCol, newTargetCol);
    return [newSourceCol, newTargetCol];
  }

  const handleMouseDownColumn = (e) => {
    e.preventDefault();
    const columnTarget = e.target.closest('[data-column-id]')
    const rect = columnTarget.getBoundingClientRect()

    // Lưu lại khoảng cách giữa chuột và Cột
    distanceXFirst.current = e.clientX - rect.left
    distanceYFirst.current = e.clientY - rect.top

    //Clone Column Ghost
    const cloneColumn = createGhostCardOrColumn(columnTarget, e.pageX, e.pageY, distanceXFirst.current, distanceYFirst.current)
    cloneElRef.current = cloneColumn

    dragStartRef.current = {
      sourceCardId: null,
      sourceColumnId: column.id,
      isDragging: true
    }
  }

  //MOUSE UP
  useEffect(() => {
    const handleMouseUpCard = ((e) => {
      e.preventDefault();
      const { sourceCardId, sourceColumnId, isDragging } = dragStartRef.current;
      const { targetCardId, targetColumnId, isInsertEnd } = dragEndRef.current;

      if (!isDragging) return //Không kéo thì bỏ qua

      //Delete Ghost Card
      if (cloneElRef.current) {
        cloneElRef.current.remove()
        cloneElRef.current = null
      }


      //KẾT THỨC CARD
      // if (sourceCardId) {
      //   //Check action Click
      //   if (!targetCardId & !targetColumnId) {
      //     if (cloneElRef.current) {
      //       cloneElRef.current.remove()
      //       cloneElRef.current = null
      //     }
      //     requestAnimationFrame(() => {
      //       resetDataDrag(dragStartRef, dragEndRef);
      //     });
      //     return
      //   }

      //   //Chỉ cột nào thực hiện Dnd mới chạy vào/ Không thì return
      //   if (column.id !== sourceColumnId && column.id !== targetColumnId) return;
      //   if (!isDragging || !sourceCardId || !sourceColumnId || !targetColumnId) return



      //   // TH1: Dnd cùng 1 vị trí -> Cùng cột, cùng thẻ -> không thay đổi -> chỉ reset 
      //   if (sourceCardId === targetCardId && sourceColumnId === targetColumnId) {
      //     // ✅ Delay Giữ ref cho tất cả Column dùng xong rồi mới reset
      //     requestAnimationFrame(() => {
      //       resetDataDrag(dragStartRef, dragEndRef);
      //     });
      //     return
      //   }

      //   const sourceCol = listColumnsRef.current.columns.find(col => col.id === sourceColumnId)
      //   const targetCol = listColumnsRef.current.columns.find(col => col.id === targetColumnId)

      //   if (!sourceCol || !targetCol) return

      //   const [newSourceCol, newTargetCol] = swapCard(
      //     sourceCol,
      //     targetCol,
      //     sourceCardId,
      //     targetCardId,
      //     isInsertEnd
      //   );


      //   const isSameCol = sourceCol.id === targetCol.id;
      //   if (isSameCol) {
      //     if (column.id === sourceCol.id) {
      //       setCards([...newSourceCol.cards]);
      //       setColumn({ ...newSourceCol });

      //     }
      //   } else {
      //     if (column.id === sourceCol.id) {
      //       setCards([...newSourceCol.cards]);
      //       setColumn({ ...newSourceCol });
      //     }
      //     if (column.id === targetCol.id) {
      //       setCards([...newTargetCol.cards]);
      //       setColumn({ ...newTargetCol });
      //     }
      //   }

      // }

      if (sourceCardId && sourceColumnId && targetColumnId) {
        //CHỈ CHẠY VÀO CỘT CÓ THẺ DnD
        if (!(column.id === sourceColumnId || column.id === targetColumnId)) return;
        if (sourceCardId !== targetCardId || sourceColumnId !== targetColumnId) {
          const sourceCol = listColumnsRef.current.columns.find(col => col.id === sourceColumnId)
          const targetCol = listColumnsRef.current.columns.find(col => col.id === targetColumnId)
          if (!sourceCol || !targetCol) return

          const [newSourceCol, newTargetCol] = swapCard(
            sourceCol,
            targetCol,
            sourceCardId,
            targetCardId,
            isInsertEnd
          );

          if (sourceCol.id === targetCol.id) {
            if (column.id === newSourceCol.id) {
              setCards([...newSourceCol.cards]);
              setColumn({ ...newSourceCol });
            }
          } else {
            if (column.id === sourceCol.id) {
              setCards([...newSourceCol.cards]);
              setColumn({ ...newSourceCol });
            }
            if (column.id === targetCol.id) {
              setCards([...newTargetCol.cards]);
              setColumn({ ...newTargetCol });
            }
          }

        }
      }

      //Reset Data (requestAnimationFrame -> tránh việc reset khi kéo thẻ từ cột bên phải sang trái)
      requestAnimationFrame(() => {
        resetDataDrag(dragStartRef, dragEndRef, distanceXFirst, distanceYFirst);
      });

    })
    document.addEventListener("mouseup", handleMouseUpCard);
    return () => document.removeEventListener("mousemove", handleMouseUpCard);
  }, [])


  return (
    <div className="column " data-column-id={column.id}>
      {/* Title Column */}
      <ColumnTitle title={titleColumn} column={column} onChangeTitle={handleChangeTitle} handleMouseDownColumn={handleMouseDownColumn} />

      {/* Content Column */}
      <div className="column-cards-wrapper" ref={cardsWrapperRef}>
        {cards.map((card, index) => (
          <Card
            key={card.id}
            card={card}
            dragStartRef={dragStartRef}
            dragEndRef={dragEndRef}
            distanceXFirst={distanceXFirst}
            distanceYFirst={distanceYFirst}
            cloneElRef={cloneElRef}
          />
        ))}
      </div>

      {/* Add New Card */}
      <AddNewCard column={column} onAddCard={handleAddCard} />
    </div>
  )
}
export default Column
