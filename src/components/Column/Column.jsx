import { useEffect, useRef, useState } from 'react'
import Card from '../Card/Card'
import AddNewCard from '../AddNewCard/AddNewCard'
import './Column.scss'
import ColumnTitle from './ColumnTitle'
import { createGhostCardOrColumn, resetDataDrag, sortOrder, updateColumnsInRef } from '../../utils/constants'


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
      let newCol = {
        ...sourceCol,
        cardOrder: [...sourceCol.cardOrder],
        cards: [...sourceCol.cards]
      };

      const sourceIndex = newCol.cardOrder.indexOf(sourceCardId)
      const targetIndex = newCol.cardOrder.indexOf(targetCardId)

      if (sourceIndex === -1 || targetIndex === -1) return [sourceCol, sourceCol]
      if (isInsertEnd) {
        // Luôn đẩy thẻ xuống cuối
        const sourceCard = newCol.cards[sourceIndex];
        // Xoá thẻ
        newCol.cardOrder.splice(sourceIndex, 1);
        newCol.cards.splice(sourceIndex, 1);
        //Thêm thẻ xuống cuối
        newCol.cardOrder.push(sourceCardId);
        newCol.cards.push(sourceCard);
      } else {
        // Swap vị trí thẻ
        const targetIndex = newCol.cardOrder.indexOf(targetCardId);
        if (targetIndex === -1) return [sourceCol, sourceCol];

        const tempId = newCol.cardOrder[sourceIndex];
        newCol.cardOrder[sourceIndex] = newCol.cardOrder[targetIndex];
        newCol.cardOrder[targetIndex] = tempId;

        const tempCard = newCol.cards[sourceIndex];
        newCol.cards[sourceIndex] = newCol.cards[targetIndex];
        newCol.cards[targetIndex] = tempCard;
      }

      // Trả về 2 bản clone riêng biệt để tránh reference lỗi
      const newSourceCol = { ...newCol, cardOrder: [...newCol.cardOrder], cards: [...newCol.cards] };
      const newTargetCol = { ...newCol, cardOrder: [...newCol.cardOrder], cards: [...newCol.cards] };

      listColumnsRef.current = updateColumnsInRef(listColumnsRef.current, newSourceCol);
      return [newSourceCol, newTargetCol];
    }
    // === CASE 2: KHÁC CỘT 
    let newSourceCol = {
      ...sourceCol,
      cardOrder: [...sourceCol.cardOrder],
      cards: [...sourceCol.cards]
    };
    let newTargetCol = {
      ...targetCol,
      cardOrder: [...targetCol.cardOrder],
      cards: [...targetCol.cards]
    };

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
    } else {
      if (!targetCardId) {
        // CASE 2.1: CỘT RỖNG khi targetCardId = null 
        newTargetCol.cardOrder.unshift(updatedSourceCard.id);
        newTargetCol.cards.unshift(updatedSourceCard);

      } else {
        // === CASE 2.2: Kéo sang cột khác có thẻ
        const targetIndex = newTargetCol.cardOrder.indexOf(targetCardId);
        if (targetIndex === -1) return [sourceCol, targetCol];

        // Thêm source vào vị trí target trong cột đích
        newTargetCol.cardOrder.splice(targetIndex, 0, updatedSourceCard.id);
        newTargetCol.cards.splice(targetIndex, 0, updatedSourceCard);

      }
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

    let draggingColumn = {
      sourceCardId: null,
      sourceColumnId: column.id,
      isDragging: true
    }
    dragStartRef.current = draggingColumn
  }

  //MOUSE UP
  useEffect(() => {
    const handleMouseUpCard = ((e) => {
      e.preventDefault();
      const { sourceCardId, sourceColumnId, isDragging } = dragStartRef.current;
      const { targetCardId, targetColumnId, isInsertEnd } = dragEndRef.current;

      if (!isDragging) return //Không kéo thì bỏ qua

      //KẾT THỨC CARD
      if (sourceCardId) {
        //Check action Click
        if (sourceCardId && sourceColumnId && !targetCardId & !targetColumnId) {
          if (cloneElRef.current) {
            cloneElRef.current.remove()
            cloneElRef.current = null
          }
          requestAnimationFrame(() => {
            resetDataDrag(dragStartRef, dragEndRef);
          });
          return
        }

        //Chỉ cột nào thực hiện Dnd mới chạy vào/ Không thì return
        if (column.id !== sourceColumnId && column.id !== targetColumnId) return;

        if (!isDragging || !sourceCardId || !sourceColumnId || !targetColumnId) return
        //Delete Ghost Card
        if (cloneElRef.current) {
          cloneElRef.current.remove()
          cloneElRef.current = null
        }

        // TH1: Dnd cùng 1 vị trí -> Cùng cột, cùng thẻ -> không thay đổi -> chỉ reset 
        if (sourceCardId === targetCardId && sourceColumnId === targetColumnId) {
          // ✅ Delay Giữ ref cho tất cả Column dùng xong rồi mới reset
          requestAnimationFrame(() => {
            resetDataDrag(dragStartRef, dragEndRef);
          });
          return
        }

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


        const isSameCol = sourceCol.id === targetCol.id;
        if (isSameCol) {
          if (column.id === sourceCol.id) {
            // console.log('cùng cột', newSourceCol)
            setCards([...newSourceCol.cards]);
            setColumn({ ...newSourceCol });

          }
        } else {
          if (column.id === sourceCol.id) {
            // console.log('1newSourceCol', newSourceCol)
            // console.log('1newTargetCol', newTargetCol)
            setCards([...newSourceCol.cards]);
            setColumn({ ...newSourceCol });
          }
          if (column.id === targetCol.id) {
            // console.log('2newSourceCol', newSourceCol)
            // console.log('2newTargetCol', newTargetCol)
            setCards([...newTargetCol.cards]);
            setColumn({ ...newTargetCol });
          }
        }
        console.log('CARD')
      } else if (sourceColumnId) {
        //KẾT THÚC COLUMN
        // if (cloneElRef .current) {
        //   cloneElRef .current.remove()
        //   cloneElRef .current = null
        // }

        // console.log("Kết thúc kéo Column");

      }

      // ✅ Delay Giữ ref cho tất cả Column dùng xong rồi mới reset
      requestAnimationFrame(() => {
        resetDataDrag(dragStartRef, dragEndRef);
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
