import React, { useState, useRef, useEffect, use } from 'react'
import Column from '../Column/Column'
import { initDataBoard } from '../../utils/initColumnData'
import AddNewColumn from '../AddNewColumn/AddNewColumn'
import { resetDataDrag, sortOrder } from '../../utils/constants'
import { swapColumnsInRef } from '../../utils/swapColumnsInRef '


const BoardContent = () => {
  const [columns, setColumns] = useState([])
  const listColumnsRef = useRef({})

  //ghost ref
  const [distanceXFirst, distanceYFirst, cloneCarOrColumnRef] = [
    useRef(null),
    useRef(null),
    useRef(null),
  ];
  //value dragging
  let valueDragStartRef = useRef({
    sourceCardId: null,
    sourceColumnId: null,
    isDragging: false
  })
  let valueDragEndRef = useRef({
    targetCardId: null,
    targetColumnId: null,
    isInsertEnd: false
  })

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
      const { sourceCardId, sourceColumnId, isDragging } = valueDragStartRef.current;
      const { targetColumnId } = valueDragEndRef.current;

      // Chỉ xử lý drag column, không phải card, và phải đang drag
      if (!isDragging || sourceCardId || !sourceColumnId) return;

      //Delete Ghost
      if (cloneCarOrColumnRef.current) {
        cloneCarOrColumnRef.current.remove()
        cloneCarOrColumnRef.current = null
      }

      // Nếu chỉ click mà không kéo đi đâu
      if (!targetColumnId) {
        resetDataDrag(valueDragStartRef, valueDragEndRef);
        return
      }

      // Swap trong ref và cập nhật state
      swapColumnsInRef(listColumnsRef, sourceColumnId, targetColumnId)
      setColumns([...listColumnsRef.current.columns])
      resetDataDrag(valueDragStartRef, valueDragEndRef);

    }

    document.addEventListener("mouseup", handleMouseUpColumn);
    return () => document.removeEventListener("mouseup", handleMouseUpColumn);
  }, [])

  // --- MOUSE MOVE: xử lý ghost + placeholder (column & card) ---
  useEffect(() => {
    const handleMouseMoveColumn = (e) => {
      e.preventDefault();
      const { sourceCardId, sourceColumnId, isDragging } = valueDragStartRef.current;
      if (!isDragging) return;
      //LỖI BÔI ĐEN
      document.body.classList.add("dragging");

      // Di chuyển Ghost theo chuột
      if (cloneCarOrColumnRef.current) {
        cloneCarOrColumnRef.current.style.left = e.pageX - distanceXFirst.current + 'px'
        cloneCarOrColumnRef.current.style.top = e.pageY - distanceYFirst.current + 'px'
        cloneCarOrColumnRef.current.style.opacity = `0.8`
      }

      //Handle Placeholder Dragging
      const colEl = e.target.closest("[data-column-id]");
      const hoverColId = colEl?.dataset.columnId


      if (!sourceCardId) {
        //DRAG COLUMN: Just Hover Column
        if (hoverColId && hoverColId !== valueDragEndRef.current.targetColumnId) {
          console.log('hoverColId>> ', hoverColId)
          valueDragEndRef.current.targetColumnId = hoverColId
          // reset placeholder
          document.querySelectorAll(".isPlaceholderColumn").forEach((el) => {
            el.classList.remove("isPlaceholderColumn");
          });
          colEl.classList.add("isPlaceholderColumn");
        }
        return
      }

      // LOGIC CU
      // if (hoverColId && sourceColumnId) {
      //   // Kiểm tra nếu vị trí mới khác vị trí cũ -> so sánh 2 vị trí gần nhất và hiện tại
      //   const prev = valueDragEndRef.current;
      //   const isDifferent = !prev || prev.targetColumnId !== hoverColId;
      //   if (isDifferent) {
      //     // ✅ Cập nhật ref
      //     valueDragEndRef.current = {
      //       ...valueDragEndRef.current,
      //       targetColumnId: hoverColId
      //     }
      //     // / ✅ Xoá tất cả .isPlaceholderColumn
      //     document.querySelectorAll(".isPlaceholderColumn").forEach((el) => {
      //       el.classList.remove("isPlaceholderColumn");
      //     });
      //     // ✅ Thêm class vào thẻ đích
      //     const newColumnTargetEl = document.querySelector(
      //       `[data-column-id="${hoverColId}"]`
      //     );

      //     if (newColumnTargetEl) {
      //       newColumnTargetEl.classList.add("isPlaceholderColumn");
      //     }
      //   }



      // } else {
      //   console.log('HOVER CỘT VÀO KHOẢNG TRỐNG', valueDragEndRef.current?.targetColumnId)
      //   //nếu hover vào đây thì lấy dữ liệu từ trước trong ref
      //   //Phần này không cần làm gì cả, tuy nhiên nếu lỗi sẽ rơi vào đây

      // }
    }

    //COLUMN
    document.addEventListener("mousemove", handleMouseMoveColumn);
    return () => document.removeEventListener("mousemove", handleMouseMoveColumn);

  }, [])

  //Move Move Card
  useEffect(() => {
    const handleMouseMoveCard = (e) => {
      e.preventDefault();
      const { sourceCardId, sourceColumnId, isDragging } = valueDragStartRef.current;
      if (!isDragging) return;
      //LỖI BÔI ĐEN
      document.body.classList.add("dragging");
      // Di chuyển Ghost theo chuột
      if (cloneCarOrColumnRef.current) {
        cloneCarOrColumnRef.current.style.left = e.pageX - distanceXFirst.current + 'px'
        cloneCarOrColumnRef.current.style.top = e.pageY - distanceYFirst.current + 'px'
        cloneCarOrColumnRef.current.style.opacity = `0.8`
      }
      //Handle Placeholder Dragging
      const colEl = e.target.closest("[data-column-id]");
      const cardEl = e.target.closest("[data-card-id]");
      const hoverColId = colEl?.dataset.columnId
      const hoverCardId = cardEl?.dataset.cardId;

      // Case 1: Hover vào một thẻ
      if (hoverColId && hoverCardId) {
        if (valueDragEndRef.current.targetColumnId !== hoverColId
          || valueDragEndRef.current.targetCardId !== hoverCardId) {
          // Kiểm tra nếu vị trí mới khác vị trí cũ -> so sánh 2 vị trí gần nhất và hiện tại
          valueDragEndRef.current = {
            targetColumnId: hoverColId,
            targetCardId: hoverCardId,
            isInsertEnd: false
          }
          document.querySelectorAll('.isCardDragging')
            .forEach(el => el.classList.remove('isCardDragging'))
          cardEl.classList.add('isCardDragging')
        }
        return
      }

      //Case 2: Hover vào cột rỗng
      if (colEl && colEl.querySelectorAll('[data-card-id]').length === 0) {
        if (valueDragEndRef.current.targetColumnId !== hoverColId
          || valueDragEndRef.current.targetColumnId !== null) {
          valueDragEndRef.current = {
            targetColumnId: hoverColId,
            targetCardId: null,
            isInsertEnd: true
          };
          document.querySelectorAll('.isCardDragging')
            .forEach(el => el.classList.remove('isCardDragging'))
        }
        return
      }

      //Case 3 : Hover khoảng trống không thuộc (thẻ/cột) hoặc title/footer cột
      const isOnFooterCol = e.target.classList.contains('add-card')
      const isOnTitleCol = e.target.classList.contains('column-title-display')
      if (colEl && (isOnFooterCol || isOnTitleCol)) {
        const direction = isOnFooterCol ? 'last' : 'first'
        const column = listColumnsRef.current.columns.find(c => c.id === hoverColId)
        const cards = column?.cardOrder || []
        // Nếu cột không có thẻ -> return
        if (cards.length == 0) return

        const tgtCardId = direction === 'last' ? cards[cards.length - 1] : cards[0]

        const isFirstCardSource = colEl.querySelectorAll('[data-card-id]')?.[0]?.dataset.cardId === sourceCardId

        //Cùng cột && (cột chỉ có 1 thẻ  || sourceCardId là thẻ đầu tiên trong cột) -> return
        if (sourceColumnId === hoverColId && (cards.length === 1 || isFirstCardSource)) return
        const isSameAsCurrent = valueDragEndRef.current.targetColumnId === hoverColId
          && valueDragEndRef.current.targetCardId === tgtCardId
          && valueDragEndRef.current.isInsertEnd === (direction === 'last')
        if (!isSameAsCurrent) {
          document.querySelectorAll('.isCardDragging').forEach(el => el.classList.remove('isCardDragging'))
          valueDragEndRef.current = {
            targetColumnId: hoverColId,
            targetCardId: tgtCardId,
            isInsertEnd: direction === 'last'
          }
          const tgtCardIdEl = colEl.querySelector(`[data-card-id="${tgtCardId}"]`)
          if (tgtCardIdEl) {
            tgtCardIdEl.classList.add('isCardDragging')
          }
        }
        return
      }


      // LOGIC CŨ

      // if (!valueDragStartRef.current.isDragging || !valueDragStartRef.current.sourceCardId) return
      // //LỖI BÔI ĐEN
      // document.body.classList.add("dragging");

      // //GHOST CARD
      // const newX = e.pageX - distanceXFirst.current
      // const newY = e.pageY - distanceYFirst.current
      // if (cloneCarOrColumnRef.current) {
      //   cloneCarOrColumnRef.current.style.left = `${newX}px`
      //   cloneCarOrColumnRef.current.style.top = `${newY}px`
      //   cloneCarOrColumnRef.current.style.opacity = `0.8`
      // }

      // //Handle Placeholder Dragging
      // const colEl = e.target.closest("[data-column-id]");
      // const foundColumnId = colEl?.dataset.columnId
      // const cardEl = e.target.closest("[data-card-id]");
      // const foundCardId = cardEl?.dataset.cardId;


      // // 🧠 Trường hợp 1: Hover vào 1 thẻ (có columnId và cardId)
      // if (foundColumnId !== undefined && foundCardId !== undefined) {
      //   // Kiểm tra nếu vị trí mới khác vị trí cũ -> so sánh 2 vị trí gần nhất và hiện tại
      //   const prev = valueDragEndRef.current;
      //   const isDifferent =
      //     !prev ||
      //     prev.targetColumnId !== foundColumnId ||
      //     prev.targetCardId !== foundCardId;

      //   if (isDifferent) {
      //     // ✅ Cập nhật ref
      //     valueDragEndRef.current = {
      //       targetColumnId: foundColumnId,
      //       targetCardId: foundCardId
      //     };
      //     // ✅ Xoá tất cả .isCardDragging
      //     document.querySelectorAll(".isCardDragging").forEach((el) => {
      //       el.classList.remove("isCardDragging");
      //     });
      //     // ✅ Thêm class vào thẻ đích
      //     const newCardTargetEl = document.querySelector(
      //       `[data-card-id="${foundCardId}"][ data-card-columnid="${foundColumnId}"]`
      //     );

      //     if (newCardTargetEl) {
      //       newCardTargetEl.classList.add("isCardDragging");
      //     }

      //   }
      // }
      // // 🧠 Trường hợp 2: Hover vào cột rỗng
      // else if (foundColumnId !== undefined && colEl?.querySelectorAll("[data-card-id]").length === 0) {
      //   const prev = valueDragEndRef.current;
      //   const isDifferent =
      //     !prev ||
      //     prev.targetColumnId !== foundColumnId ||
      //     prev.targetCardId !== null;

      //   if (isDifferent) {
      //     valueDragEndRef.current = {
      //       targetColumnId: foundColumnId,
      //       targetCardId: null,
      //     };

      //     // ✅ Xoá class placeholder nếu đang có
      //     document.querySelectorAll(".isCardDragging").forEach((el) => {
      //       el.classList.remove("isCardDragging");
      //     });

      //   }

      // }
      // // 🧠 Trường hợp 3: Hover khoảng trống không thuộc thẻ/cột => bỏ qua
      // else {

      //   function getCardInColumnByPosition(columns, columnId, position = 'last') {
      //     const column = columns.find(col => col.id === columnId);
      //     if (!column || column.cardOrder.length === 0) return null;

      //     const cardId = position === 'first'
      //       ? column.cardOrder[0]
      //       : column.cardOrder[column.cardOrder.length - 1];

      //     const card = column.cards.find(card => card.id === cardId);
      //     return card || null;
      //   }

      //   // Trường hợp 1: Hover in titile  or footer title
      //   if (e.target.classList.contains('add-card')) {
      //     let lastCard = getCardInColumnByPosition(listColumnsRef.current.columns, foundColumnId, 'last')

      //     const cardEls = colEl?.querySelectorAll("[data-card-id]");
      //     const isFirstCardSource = cardEls?.[0]?.getAttribute("data-card-id") === valueDragStartRef.current.sourceCardId;

      //     if (valueDragStartRef.current.sourceColumnId === foundColumnId && cardEls.length === 1 || isFirstCardSource) {
      //       //Cùng cột, cột 1 thẻ or thẻ đó là thẻ đầu tiên-> return
      //       return
      //     }
      //     else {
      //       // ✅ Xoá class placeholder nếu đang có
      //       document.querySelectorAll(".isCardDragging").forEach((el) => {
      //         el.classList.remove("isCardDragging");
      //       });
      //       valueDragEndRef.current = {
      //         targetColumnId: foundColumnId,
      //         targetCardId: lastCard.id,
      //         isInsertEnd: true
      //       };
      //     }
      //   } else if (e.target.classList.contains('column-title-display')) {
      //     let firstCard = getCardInColumnByPosition(listColumnsRef.current.columns, foundColumnId, 'first')

      //     const cardEls = colEl?.querySelectorAll("[data-card-id]");
      //     const isFirstCardSource = cardEls?.[0]?.getAttribute("data-card-id") === valueDragStartRef.current.sourceCardId;

      //     if (valueDragStartRef.current.sourceColumnId === foundColumnId && cardEls.length === 1 || isFirstCardSource) {
      //       //Cùng cột, cột 1 thẻ or thẻ đó là thẻ đầu tiên-> return
      //       return
      //     }
      //     else {
      //       // ✅ Xoá class placeholder nếu đang có
      //       document.querySelectorAll(".isCardDragging").forEach((el) => {
      //         el.classList.remove("isCardDragging");
      //       });

      //       valueDragEndRef.current = {
      //         targetColumnId: foundColumnId,
      //         targetCardId: firstCard.id,
      //         isInsertEnd: false
      //       };
      //     }
      //   }
      // }
    }
    //CARD
    document.addEventListener("mousemove", handleMouseMoveCard);
    return () => document.removeEventListener("mousemove", handleMouseMoveCard)

  }, [])





  return (
    <div className="board-content">
      {/* Render List Column */}
      {columns.map((column, index) => (
        <Column
          key={column.id}
          columnProps={column}
          valueDragStartRef={valueDragStartRef}
          valueDragEndRef={valueDragEndRef}
          distanceXFirst={distanceXFirst}
          distanceYFirst={distanceYFirst}
          cloneCarOrColumnRef={cloneCarOrColumnRef}
          listColumnsRef={listColumnsRef}
        />
      ))}

      {/* button to create new column */}
      {/* <AddNewColumn onAddColumn={handleAddColumn} /> */}
    </div>

  )
}

export default BoardContent
