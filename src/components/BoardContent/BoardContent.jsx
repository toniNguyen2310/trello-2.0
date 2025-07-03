import React, { useState, useRef, useEffect, use } from 'react'
import Column from '../Column/Column'
import { initDataBoard } from '../../utils/initColumnData'
import AddNewColumn from '../AddNewColumn/AddNewColumn'
import { resetDataDrag, sortOrder } from '../../utils/constants'
import { swapColumnsInRef } from '../../utils/swapColumnsInRef '


const BoardContent = () => {
  const [columns, setColumns] = useState([])
  const listColumnsRef = useRef({})
  const cloneElRef = useRef(null)
  const [distanceXFirst, distanceYFirst] = [useRef(0), useRef(0),];
  //value dragging
  let dragStartRef = useRef({ sourceCardId: null, sourceColumnId: null, isDragging: false })
  let dragEndRef = useRef({ targetCardId: null, targetColumnId: null, isInsertEnd: false })

  // --- MOUNT: load data ---
  useEffect(() => {
    //Render dữ liệu API or LS
    listColumnsRef.current = initDataBoard
    setColumns(sortOrder(initDataBoard.columns, initDataBoard.columnOrder, "id"))
  }, [])


  // Add New Column
  // const handleAddColumn = (title) => {
  //   const newColumn = { title, cards: [] }
  //   setColumns([...columns, newColumn])
  // }


  // --- MOUSE UP: swap column nếu đang kéo column ---
  useEffect(() => {
    const handleMouseUpColumn = (e) => {
      e.preventDefault();
      const { sourceCardId, sourceColumnId, isDragging } = dragStartRef.current;
      const { targetColumnId } = dragEndRef.current;

      // Chỉ xử lý drag column, không phải card, và phải đang drag
      if (!isDragging || sourceCardId || !sourceColumnId) return;

      //Delete Ghost
      if (cloneElRef.current) {
        cloneElRef.current.remove()
        cloneElRef.current = null
      }

      // Nếu chỉ click mà không kéo đi đâu
      if (!targetColumnId) {
        resetDataDrag(dragStartRef, dragEndRef);
        return
      }

      // Swap trong ref và cập nhật state
      swapColumnsInRef(listColumnsRef, sourceColumnId, targetColumnId)
      setColumns([...listColumnsRef.current.columns])
      resetDataDrag(dragStartRef, dragEndRef);

    }

    document.addEventListener("mouseup", handleMouseUpColumn);
    return () => document.removeEventListener("mouseup", handleMouseUpColumn);
  }, [])

  // --- MOUSE MOVE: xử lý ghost + placeholder (column & card) ---


  useEffect(() => {
    const onMouseMove = (e) => {
      e.preventDefault();
      const { sourceCardId, sourceColumnId, isDragging } = dragStartRef.current
      const { targetCardId, targetColumnId, isInsertEnd } = dragEndRef.current

      if (!isDragging) return

      //Fix lỗi bôi đen text khi DRAG -> cần sửa thêm (BUG)
      document.body.classList.add("dragging");


      // Di chuyển Ghost theo chuột
      if (cloneElRef.current) {
        cloneElRef.current.style.left = e.pageX - distanceXFirst.current + 'px'
        cloneElRef.current.style.top = e.pageY - distanceYFirst.current + 'px'
        cloneElRef.current.style.opacity = `0.6` //down hiện ghost ->  opacity = 0 
      }

      const colEl = e.target.closest('[data-column-id]')
      const cardEl = e.target.closest('[data-card-id]')
      const hoverColId = colEl?.dataset.columnId
      const hoverCardId = cardEl?.dataset.cardId

      //DRAG COLUMN
      if (!sourceCardId) {
        if (hoverColId && hoverColId !== targetColumnId) {
          dragEndRef.current.targetColumnId = hoverColId
          document.querySelectorAll('.isPlaceholderColumn').forEach(el => el.classList.remove('isPlaceholderColumn'))
          if (colEl) colEl.classList.add('isPlaceholderColumn')
        }
        return
      }

      // drag card: 3 cases
      // Case 1: hover on a card
      if (hoverColId && hoverCardId) {
        if (targetColumnId !== hoverColId || targetCardId !== hoverCardId) {
          dragEndRef.current = { targetColumnId: hoverColId, targetCardId: hoverCardId, isInsertEnd: false }
          document.querySelectorAll('.isCardDragging').forEach(el => el.classList.remove('isCardDragging'))
          cardEl.classList.add('isCardDragging')
        }
        return
      }

      // Case 2: hover on empty column
      if (colEl && colEl.querySelectorAll('[data-card-id]').length === 0) {
        if (targetColumnId !== hoverColId || targetCardId !== null) {
          dragEndRef.current = { targetColumnId: hoverColId, targetCardId: null, isInsertEnd: true }
          document.querySelectorAll('.isCardDragging').forEach(el => el.classList.remove('isCardDragging'))
        }
        return
      }

      // Case 3: hover on title/footer
      const isOnFooter = e.target.classList.contains('add-card')
      const isOnTitle = e.target.classList.contains('column-title-display')
      if (colEl && (isOnFooter || isOnTitle)) {
        const direction = isOnFooter ? 'last' : 'first'
        const column = listColumnsRef.current.columns.find(c => c.id === hoverColId)
        const cards = column?.cardOrder || []
        if (cards.length === 0) return

        const refCard = direction === 'last' ? cards[cards.length - 1] : cards[0]
        const firstSource = colEl.querySelectorAll('[data-card-id]')?.[0]?.dataset.cardId === sourceCardId
        if (sourceColumnId === hoverColId && (cards.length === 1 || firstSource)) return

        const same = targetColumnId === hoverColId && targetCardId === refCard && isInsertEnd === (direction === 'last')
        if (!same) {
          document.querySelectorAll('.isCardDragging').forEach(el => el.classList.remove('isCardDragging'))
          dragEndRef.current = { targetColumnId: hoverColId, targetCardId: refCard, isInsertEnd: direction === 'last' }
          const refEl = colEl.querySelector(`[data-card-id="${refCard}"]`)
          if (refEl) refEl.classList.add('isCardDragging')
        }
        return
      }

    }

    //COLUMN
    document.addEventListener("mousemove", onMouseMove);
    return () => document.removeEventListener("mousemove", onMouseMove);
  }, [])


  //Move Move Column
  // useEffect(() => {
  //   const handleMouseMoveColumn = (e) => {
  //     e.preventDefault();
  //     const { sourceCardId, sourceColumnId, isDragging } = dragStartRef.current;
  //     if (!isDragging) return;
  //     //LỖI BÔI ĐEN
  //     document.body.classList.add("dragging");

  //     // Di chuyển Ghost theo chuột
  //     if (cloneElRef.current) {
  //       cloneElRef.current.style.left = e.pageX - distanceXFirst.current + 'px'
  //       cloneElRef.current.style.top = e.pageY - distanceYFirst.current + 'px'
  //       cloneElRef.current.style.opacity = `0.8`
  //     }

  //     //Handle Placeholder Dragging
  //     const colEl = e.target.closest("[data-column-id]");
  //     const hoverColId = colEl?.dataset.columnId


  //     if (!sourceCardId) {
  //       //DRAG COLUMN: Just Hover Column
  //       if (hoverColId && hoverColId !== dragEndRef.current.targetColumnId) {
  //         dragEndRef.current.targetColumnId = hoverColId
  //         // reset placeholder
  //         document.querySelectorAll(".isPlaceholderColumn").forEach((el) => {
  //           el.classList.remove("isPlaceholderColumn");
  //         });
  //         if (colEl) colEl.classList.add('isPlaceholderColumn')
  //       }
  //       return
  //     }
  //   }

  //   //COLUMN
  //   document.addEventListener("mousemove", handleMouseMoveColumn);
  //   return () => document.removeEventListener("mousemove", handleMouseMoveColumn);

  // }, [])

  //Move Move Card
  // useEffect(() => {
  //   const handleMouseMoveCard = (e) => {
  //     e.preventDefault();
  //     const { sourceCardId, sourceColumnId, isDragging } = dragStartRef.current;
  //     if (!isDragging) return;
  //     //LỖI BÔI ĐEN
  //     document.body.classList.add("dragging");

  //     // Di chuyển Ghost theo chuột
  //     if (cloneElRef.current) {
  //       cloneElRef.current.style.left = e.pageX - distanceXFirst.current + 'px'
  //       cloneElRef.current.style.top = e.pageY - distanceYFirst.current + 'px'
  //       cloneElRef.current.style.opacity = `0.8`
  //     }


  //     //Handle Placeholder Dragging
  //     const colEl = e.target.closest("[data-column-id]");
  //     const cardEl = e.target.closest("[data-card-id]");
  //     const hoverColId = colEl?.dataset.columnId
  //     const hoverCardId = cardEl?.dataset.cardId;


  //     // Case 1: Hover vào một thẻ
  //     if (hoverColId && hoverCardId) {
  //       if (dragEndRef.current.targetColumnId !== hoverColId
  //         || dragEndRef.current.targetCardId !== hoverCardId) {
  //         // Kiểm tra nếu vị trí mới khác vị trí cũ -> so sánh 2 vị trí gần nhất và hiện tại
  //         dragEndRef.current = {
  //           targetColumnId: hoverColId,
  //           targetCardId: hoverCardId,
  //           isInsertEnd: false
  //         }
  //         document.querySelectorAll('.isCardDragging')
  //           .forEach(el => el.classList.remove('isCardDragging'))
  //         cardEl.classList.add('isCardDragging')
  //       }
  //       return
  //     }

  //     //Case 2: Hover vào cột rỗng
  //     if (colEl && colEl.querySelectorAll('[data-card-id]').length === 0) {
  //       if (dragEndRef.current.targetColumnId !== hoverColId
  //         || dragEndRef.current.targetCardId !== null) {
  //         dragEndRef.current = {
  //           targetColumnId: hoverColId,
  //           targetCardId: null,
  //           isInsertEnd: true
  //         };
  //         document.querySelectorAll('.isCardDragging')
  //           .forEach(el => el.classList.remove('isCardDragging'))
  //       }
  //       return
  //     }

  //     //Case 3 : Hover khoảng trống không thuộc (thẻ/cột) hoặc title/footer cột
  //     const isOnFooterCol = e.target.classList.contains('add-card')
  //     const isOnTitleCol = e.target.classList.contains('column-title-display')
  //     if (colEl && (isOnFooterCol || isOnTitleCol)) {
  //       const direction = isOnFooterCol ? 'last' : 'first'
  //       const column = listColumnsRef.current.columns.find(c => c.id === hoverColId)
  //       const cards = column?.cardOrder || []
  //       // Nếu cột không có thẻ -> return
  //       if (cards.length == 0) return

  //       const tgtCardId = direction === 'last' ? cards[cards.length - 1] : cards[0]

  //       const isFirstCardSource = colEl.querySelectorAll('[data-card-id]')?.[0]?.dataset.cardId === sourceCardId

  //       //Cùng cột && (cột chỉ có 1 thẻ  || sourceCardId là thẻ đầu tiên trong cột) -> return
  //       if (sourceColumnId === hoverColId && (cards.length === 1 || isFirstCardSource)) return
  //       const isSameAsCurrent = dragEndRef.current.targetColumnId === hoverColId
  //         && dragEndRef.current.targetCardId === tgtCardId
  //         && dragEndRef.current.isInsertEnd === (direction === 'last')
  //       if (!isSameAsCurrent) {
  //         document.querySelectorAll('.isCardDragging').forEach(el => el.classList.remove('isCardDragging'))
  //         dragEndRef.current = {
  //           targetColumnId: hoverColId,
  //           targetCardId: tgtCardId,
  //           isInsertEnd: direction === 'last'
  //         }
  //         const tgtCardIdEl = colEl.querySelector(`[data-card-id="${tgtCardId}"]`)
  //         if (tgtCardIdEl) {
  //           tgtCardIdEl.classList.add('isCardDragging')
  //         }
  //       }
  //       return
  //     }
  //   }

  //   document.addEventListener("mousemove", handleMouseMoveCard);
  //   return () => document.removeEventListener("mousemove", handleMouseMoveCard)

  // }, [])





  return (
    <div className="board-content">
      {/* Render List Column */}
      {columns.map((column, index) => (
        <Column
          key={column.id}
          columnProps={column}
          dragStartRef={dragStartRef}
          dragEndRef={dragEndRef}
          distanceXFirst={distanceXFirst}
          distanceYFirst={distanceYFirst}
          cloneElRef={cloneElRef}
          listColumnsRef={listColumnsRef}
        />
      ))}

      {/* button to create new column */}
      {/* <AddNewColumn onAddColumn={handleAddColumn} /> */}
    </div>

  )
}

export default BoardContent
