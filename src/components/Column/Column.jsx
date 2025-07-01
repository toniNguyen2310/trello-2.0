import { useEffect, useRef, useState } from 'react'
import Card from '../Card/Card'
import AddNewCard from '../AddNewCard/AddNewCard'
import './Column.scss'
import ColumnTitle from './ColumnTitle'
import { resetDataDrag, sortOrder } from '../../utils/constants'


const Column = ({
  columnProps,
  listColumnsRef,
  onAddCard,
  onChangeColumnTitle,
  valueDragEndRef,
  valueDragStartRef,
  cloneCardRef,
  distanceXFirst,
  distanceYFirst
}) => {
  const [column, setColumn] = useState(columnProps)
  const [cards, setCards] = useState(sortOrder(columnProps.cards, columnProps.cardOrder, 'id'))
  // const [titleColumn, setTitleColumn] = useState(columnProps.title)
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
  const moveMoveCard = (sourceCol, targetCol, sourceCardId, targetCardId) => {
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

      // Swap cardOrder
      const tempId = newCol.cardOrder[sourceIndex];
      newCol.cardOrder[sourceIndex] = newCol.cardOrder[targetIndex];
      newCol.cardOrder[targetIndex] = tempId;

      // Swap cards
      const tempCard = newCol.cards[sourceIndex];
      newCol.cards[sourceIndex] = newCol.cards[targetIndex];
      newCol.cards[targetIndex] = tempCard;


      // Trả về 2 bản clone riêng biệt để tránh reference lỗi
      const newSourceCol = {
        ...newCol,
        cardOrder: [...newCol.cardOrder],
        cards: [...newCol.cards]
      };
      const newTargetCol = {
        ...newCol,
        cardOrder: [...newCol.cardOrder],
        cards: [...newCol.cards]
      };

      // Cập nhật lại dữ liệu trong listColumnsRef sau khi xử lý kéo thả
      listColumnsRef.current = {
        ...listColumnsRef.current,
        columns: listColumnsRef.current.columns.map(col => {
          if (col.id === newSourceCol.id) return newSourceCol;
          if (col.id === newTargetCol.id) return newTargetCol;
          return col;
        })
      };

      return [newSourceCol, newTargetCol];
    } else {
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


      if (!targetCardId) {
        // CASE 2.1: CỘT RỖNG khi targetCardId = null 
        const updatedSourceCard = { ...sourceCard, columnId: newTargetCol.id };
        newTargetCol.cardOrder.unshift(updatedSourceCard.id);
        newTargetCol.cards.unshift(updatedSourceCard);
        console.log("CỘT RỖNG", newTargetCol)

      } else {
        // === CASE 2.2: Kéo sang cột khác có thẻ
        const targetIndex = newTargetCol.cardOrder.indexOf(targetCardId);
        if (targetIndex === -1) return [sourceCol, targetCol];

        const targetCard = newTargetCol.cards.find(c => c.id === targetCardId);
        if (!targetCard) return [sourceCol, targetCol];

        // Cập nhật columnId cho cả hai thẻ
        const updatedSourceCard = { ...sourceCard, columnId: newTargetCol.id };


        // Thêm source vào vị trí target trong cột đích
        newTargetCol.cardOrder.splice(targetIndex, 0, updatedSourceCard.id);
        newTargetCol.cards.splice(targetIndex, 0, updatedSourceCard);

      }

      // Cập nhật lại dữ liệu trong listColumnsRef sau khi xử lý kéo thả
      listColumnsRef.current = {
        ...listColumnsRef.current,
        columns: listColumnsRef.current.columns.map(col => {
          if (col.id === newSourceCol.id) return newSourceCol;
          if (col.id === newTargetCol.id) return newTargetCol;
          return col;
        })
      };
      console.log(listColumnsRef.current.columns)
      return [newSourceCol, newTargetCol];
    }

  }

  //MOUSE UP
  useEffect(() => {
    const handleMouseUp = ((e) => {
      e.preventDefault();
      const { sourceCardId, sourceColumnId, isDragging } = valueDragStartRef.current;
      const { targetCardId, targetColumnId } = valueDragEndRef.current;

      //Chỉ cột nào thực hiện Dnd mới chạy vào/ Không thì return
      if (column.id !== sourceColumnId && column.id !== targetColumnId) return;

      if (!isDragging || !sourceCardId || !sourceColumnId || !targetColumnId) return
      //Delete Ghost Card
      if (cloneCardRef.current) {
        cloneCardRef.current.remove()
        cloneCardRef.current = null
      }

      // TH1: Dnd cùng 1 vị trí -> Cùng cột, cùng thẻ -> không thay đổi -> chỉ reset 
      if (sourceCardId === targetCardId && sourceColumnId === targetColumnId) {
        // ✅ Delay Giữ ref cho tất cả Column dùng xong rồi mới reset
        requestAnimationFrame(() => {
          resetDataDrag(valueDragStartRef, valueDragEndRef);
        });
        return
      }

      const sourceCol = listColumnsRef.current.columns.find(col => col.id === sourceColumnId)
      const targetCol = listColumnsRef.current.columns.find(col => col.id === targetColumnId)

      if (!sourceCol || !targetCol) return

      const [newSourceCol, newTargetCol] = moveMoveCard(
        sourceCol,
        targetCol,
        sourceCardId,
        targetCardId
      );


      const isSameCol = sourceCol.id === targetCol.id;
      if (isSameCol) {
        if (column.id === sourceCol.id) {
          // console.log('cùng cột', newSourceCol)
          setCards([...newSourceCol.cards]);
          setColumn({ ...newSourceCol });
          resetDataDrag(valueDragStartRef, valueDragEndRef)
        }
      } else {
        // console.log('AFTER>> ', newSourceCol, newTargetCol)
        // console.log('SOURCE', sourceCol, targetCol)
        // console.log('END', column.id, sourceCol, targetCol)


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

          //ĐẶT ĐÚNG CHỖ RESET

        }


      }

      // ✅ Delay Giữ ref cho tất cả Column dùng xong rồi mới reset
      requestAnimationFrame(() => {
        resetDataDrag(valueDragStartRef, valueDragEndRef);
      });

    })
    document.addEventListener("mouseup", handleMouseUp);
    return () => document.removeEventListener("mousemove", handleMouseUp);
  }, [])

  useEffect(() => {
    // console.log("columnId ", column.id, cards)
  }, [cards])

  return (
    <div className="column" data-column-id={column.id}>
      {/* Title Column */}
      {/* <ColumnTitle title={titleColumn} onChangeTitle={handleChangeTitle} /> */}

      {/* Content Column */}
      <div className="column-cards-wrapper" ref={cardsWrapperRef}>
        {cards.map((card, index) => (
          <Card
            key={card.id}
            card={card}
            valueDragStartRef={valueDragStartRef}
            valueDragEndRef={valueDragEndRef}
            distanceXFirst={distanceXFirst}
            distanceYFirst={distanceYFirst}
            cloneCardRef={cloneCardRef}
          />
        ))}
      </div>

      {/* Add New Card */}
      {/* <AddNewCard onAddCard={handleAddCard} /> */}
    </div>
    // <div className="column">
    //   {/* Column Title */}
    //   <ColumnTitle title={column.title} onChangeTitle={handleChangeTitle} />

    //   {/* Column Content */}
    //   <div className="column-cards-wrapper" ref={cardsWrapperRef}>
    //     {column.cards.map((card, index) => (
    //       <Card key={index} card={card} />
    //     ))}
    //   </div>

    //   {/* Add New Card */}
    //   <AddNewCard onAddCard={handleAddCard} />
    // </div>
  )
}
export default Column
