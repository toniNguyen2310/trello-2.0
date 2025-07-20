import React, { useState, useRef, useEffect, use } from 'react'
import Column from '../Column/Column'
import { initDataBoard } from '../../utils/initColumnData'
import AddNewColumn from '../AddNewColumn/AddNewColumn'
import { resetDataDrag, sortOrder } from '../../utils/constants'
import { swapColumnsInRef } from '../../utils/swapColumnsInRef '
import { v4 as uuidv4 } from 'uuid'
import { createColumnAPI, deleteColumnApiById, updateColumnOderBoard } from 'service/apis'


const BoardContent = ({ board, colorOb, listColumnsRef }) => {
  const [columns, setColumns] = useState([])
  const cloneElRef = useRef(null)
  const [distanceXFirst, distanceYFirst] = [useRef(0), useRef(0),];
  let dragStartRef = useRef({ sourceCardId: null, sourceColumnId: null, isDragging: false })
  let dragEndRef = useRef({ targetCardId: null, targetColumnId: null, isInsertEnd: false })

  useEffect(() => {
    if (board?.columns && board?.columnOrder) {
      const sorted = sortOrder(board.columns, board.columnOrder, 'id')
      setColumns(sorted)
      console.log('boardcontent >>> ', board)
    }
  }, [board])

  // Add New Column
  const handleAddColumn = (title) => {
    const newColumn = {
      id: "column-" + uuidv4(),
      boardId: board._id,
      title: title,
      cardOrder: [],
      cards: [],
    }
    setColumns([...columns, newColumn])
    listColumnsRef.current.columnOrder.push(newColumn.id)
    listColumnsRef.current.columns.push(newColumn)
    localStorage.setItem(`trelloBoard-${board._id}`, JSON.stringify(listColumnsRef.current))
    createColumnAPI({
      idLS: newColumn.id,
      boardId: newColumn.boardId,
      title: newColumn.title,
      userId: board.ownerId
    })
  }

  //Delete Column
  const handleDeleteColumn = (columnId) => {
    const updateColumns = columns.filter(col => col.id !== columnId)
    setColumns(updateColumns)

    listColumnsRef.current.columns = listColumnsRef.current.columns.filter(
      col => col.id !== columnId
    )
    listColumnsRef.current.columnOrder = listColumnsRef.current.columnOrder.filter(
      id => id !== columnId
    )
    localStorage.setItem(`trelloBoard-${board._id}`, JSON.stringify(listColumnsRef.current))
    //api
    deleteColumnApiById({ columnId: columnId })
  }

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
      if (!targetColumnId || (sourceColumnId === targetColumnId)) {
        resetDataDrag(dragStartRef, dragEndRef, distanceXFirst, distanceYFirst);
        return
      }
      // Swap trong ref và cập nhật state
      swapColumnsInRef(listColumnsRef, sourceColumnId, targetColumnId)
      setColumns([...listColumnsRef.current.columns])
      localStorage.setItem(`trelloBoard-${board._id}`, JSON.stringify(listColumnsRef.current))

      updateColumnOderBoard({
        boardId: board._id,
        columnOrder: listColumnsRef.current.columnOrder
      })
      resetDataDrag(dragStartRef, dragEndRef, distanceXFirst, distanceYFirst);
    }

    document.addEventListener("mouseup", handleMouseUpColumn);
    return () => document.removeEventListener("mouseup", handleMouseUpColumn);
  }, [])

  // --- MOUSE MOVE: xử lý ghost + placeholder (column & card) ---
  useEffect(() => {
    const onMouseMove = (e) => {
      e.preventDefault();
      const { sourceCardId, sourceColumnId, isDragging } = dragStartRef.current
      const { targetCardId, targetColumnId } = dragEndRef.current

      if (!isDragging) return

      //Fix lỗi bôi đen text khi DRAG -> cần sửa thêm (BUG)
      document.body.classList.add("dragging");


      // Di chuyển Ghost theo chuột
      if (cloneElRef.current) {
        cloneElRef.current.style.left = e.pageX - distanceXFirst.current + 'px'
        cloneElRef.current.style.top = e.pageY - distanceYFirst.current + 'px'
        cloneElRef.current.style.opacity = `0.6`
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

      // DRAG CARD: 3 cases
      // Case 1: hover on a card
      if (hoverColId && hoverCardId) {
        if (targetColumnId !== hoverColId || targetCardId !== hoverCardId) {
          dragEndRef.current = { targetColumnId: hoverColId, targetCardId: hoverCardId, isInsertEnd: false }
          document.querySelectorAll('.isPlaceholderCard').forEach(el => el.classList.remove('isPlaceholderCard'))
          cardEl.classList.add('isPlaceholderCard')

          //BORDER COLUMN WHEN HOVER
          document.querySelectorAll('.isPlaceholderColumnBorder').forEach(el => el.classList.remove('isPlaceholderColumnBorder'))

        }
        return
      }

      // Case 2: hover on empty column
      if (colEl && colEl.querySelectorAll('[data-card-id]').length === 0) {
        if (targetColumnId !== hoverColId || targetCardId !== null) {
          dragEndRef.current = { targetColumnId: hoverColId, targetCardId: null, isInsertEnd: true }
          document.querySelectorAll('.isPlaceholderCard').forEach(el => el.classList.remove('isPlaceholderCard'))
          document.querySelectorAll('.isPlaceholderColumnBorder').forEach(el => el.classList.remove('isPlaceholderColumnBorder'))
          colEl.classList.add('isPlaceholderColumnBorder')
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

        const isFirstSource = colEl.querySelectorAll('[data-card-id]')?.[0]?.dataset.cardId === sourceCardId;
        const isLastSource = colEl.querySelectorAll('[data-card-id]')?.[cards.length - 1]?.dataset.cardId === sourceCardId;

        // 🎯 Tạo target tiếp theo để so sánh
        const nextTarget = {
          targetColumnId: hoverColId,
          targetCardId: refCard,
          isInsertEnd: direction === 'last'
        };
        const current = dragEndRef.current;
        const isSameTarget =
          current.targetColumnId === nextTarget.targetColumnId &&
          current.targetCardId === nextTarget.targetCardId &&
          current.isInsertEnd === nextTarget.isInsertEnd;

        // ✅ Nếu giống target hiện tại -> bỏ qua không cập nhật lại DOM/class
        if (isSameTarget) return;
        document.querySelectorAll('.isPlaceholderColumnBorder').forEach(el => el.classList.remove('isPlaceholderColumnBorder'))
        document.querySelectorAll('.isPlaceholderCard').forEach(el => el.classList.remove('isPlaceholderCard'));
        // ✅ Nếu hover vào TITLE và thẻ đang ở đầu hoặc cột chỉ có 1 thẻ => bỏ qua
        if (isOnTitle && sourceColumnId === hoverColId && (cards.length === 1 || isFirstSource)) {
          dragEndRef.current = {
            targetColumnId: sourceColumnId,
            targetCardId: sourceCardId,
            isInsertEnd: false
          };
          const refEl = colEl.querySelector(`[data-card-id="${sourceCardId}"]`);
          if (refEl) refEl.classList.add('isPlaceholderCard');
          return;
        }

        // ✅ Nếu hover vào FOOTER và thẻ đang ở cuối hoặc cột chỉ có 1 thẻ => bỏ qua
        if (isOnFooter && sourceColumnId === hoverColId && (cards.length === 1 || isLastSource)) {
          dragEndRef.current = {
            targetColumnId: sourceColumnId,
            targetCardId: sourceCardId,
            isInsertEnd: false
          };
          const refEl = colEl.querySelector(`[data-card-id="${sourceCardId}"]`);
          if (refEl) refEl.classList.add('isPlaceholderCard');
          return;
        }


        dragEndRef.current = nextTarget
        const refEl = colEl.querySelector(`[data-card-id="${refCard}"]`)
        if (refEl) refEl.classList.add('isPlaceholderCard')
        return
      }

    }

    //COLUMN
    document.addEventListener("mousemove", onMouseMove);
    return () => document.removeEventListener("mousemove", onMouseMove);
  }, [])

  return (
    <div className="board-content" style={{ background: colorOb.base }}>
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
          handleDeleteColumn={handleDeleteColumn}
          listColumnsRef={listColumnsRef}
        />
      ))}

      {/* button to create new column */}
      <AddNewColumn onAddColumn={handleAddColumn} />
    </div>

  )
}

export default BoardContent
