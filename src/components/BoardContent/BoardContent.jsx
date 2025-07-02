import React, { useState, useRef, useEffect, use } from 'react'
import Column from '../Column/Column'
import { initData, initData2, initDataBoard } from '../../utils/initColumnData'
import AddNewColumn from '../AddNewColumn/AddNewColumn'
import { createGhostCard, sortOrder } from '../../utils/constants'


const BoardContent = () => {
  const [columns, setColumns] = useState([])
  const listColumnsRef = useRef({})
  //ghost ref
  const [distanceXFirst, distanceYFirst, cloneCardRef] = [
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

  // Add New Column
  // const handleAddColumn = (title) => {
  //   const newColumn = { title, cards: [] }
  //   setColumns([...columns, newColumn])
  // }

  //HANDLE MOUSE DOWN
  useEffect(() => {
    const handleMouseMove = (e) => {
      e.preventDefault();
      if (!valueDragStartRef.current.isDragging && !cloneCardRef.current) return
      //LỖI BÔI ĐEN
      document.body.classList.add("dragging");

      //GHOST CARD
      const newX = e.pageX - distanceXFirst.current
      const newY = e.pageY - distanceYFirst.current

      if (cloneCardRef.current) {
        cloneCardRef.current.style.left = `${newX}px`
        cloneCardRef.current.style.top = `${newY}px`
        cloneCardRef.current.style.opacity = `0.8`
      }
      //Handle Placeholder Dragging
      const colEl = e.target.closest("[data-column-id]");
      const foundColumnId = colEl?.dataset.columnId
      const cardEl = e.target.closest("[data-card-id]");
      const foundCardId = cardEl?.dataset.cardId;


      // 🧠 Trường hợp 1: Hover vào 1 thẻ (có columnId và cardId)
      if (foundColumnId !== undefined && foundCardId !== undefined) {
        // Kiểm tra nếu vị trí mới khác vị trí cũ -> so sánh 2 vị trí gần nhất và hiện tại
        const prev = valueDragEndRef.current;
        const isDifferent =
          !prev ||
          prev.targetColumnId !== foundColumnId ||
          prev.targetCardId !== foundCardId;


        if (isDifferent) {
          // ✅ Cập nhật ref
          valueDragEndRef.current = {
            targetColumnId: foundColumnId,
            targetCardId: foundCardId
          };
          // ✅ Xoá tất cả .isCardDragging
          document.querySelectorAll(".isCardDragging").forEach((el) => {
            el.classList.remove("isCardDragging");
          });
          // ✅ Thêm class vào thẻ đích
          const newCardTargetEl = document.querySelector(
            `[data-card-id="${foundCardId}"][ data-card-columnid="${foundColumnId}"]`
          );

          if (newCardTargetEl) {
            newCardTargetEl.classList.add("isCardDragging");
          }

        }
      }
      // 🧠 Trường hợp 2: Hover vào cột rỗng
      else if (foundColumnId !== undefined && colEl?.querySelectorAll("[data-card-id]").length === 0) {
        const prev = valueDragEndRef.current;
        const isDifferent =
          !prev ||
          prev.targetColumnId !== foundColumnId ||
          prev.targetCardId !== null;

        if (isDifferent) {
          valueDragEndRef.current = {
            targetColumnId: foundColumnId,
            targetCardId: null,
          };

          // ✅ Xoá class placeholder nếu đang có
          document.querySelectorAll(".isCardDragging").forEach((el) => {
            el.classList.remove("isCardDragging");
          });

        }

      }
      // 🧠 Trường hợp 3: Hover khoảng trống không thuộc thẻ/cột => bỏ qua
      else {

        function getCardInColumnByPosition(columns, columnId, position = 'last') {
          const column = columns.find(col => col.id === columnId);
          if (!column || column.cardOrder.length === 0) return null;

          const cardId = position === 'first'
            ? column.cardOrder[0]
            : column.cardOrder[column.cardOrder.length - 1];

          const card = column.cards.find(card => card.id === cardId);
          return card || null;
        }

        // Trường hợp 1: Hover in titile  or footer title
        if (e.target.classList.contains('add-card')) {
          let lastCard = getCardInColumnByPosition(listColumnsRef.current.columns, foundColumnId, 'last')

          const cardEls = colEl?.querySelectorAll("[data-card-id]");
          const isFirstCardSource = cardEls?.[0]?.getAttribute("data-card-id") === valueDragStartRef.current.sourceCardId;

          if (valueDragStartRef.current.sourceColumnId === foundColumnId && cardEls.length === 1 || isFirstCardSource) {
            //Cùng cột, cột 1 thẻ or thẻ đó là thẻ đầu tiên-> return
            return
          }
          else {
            // ✅ Xoá class placeholder nếu đang có
            document.querySelectorAll(".isCardDragging").forEach((el) => {
              el.classList.remove("isCardDragging");
            });
            console.log('2')
            valueDragEndRef.current = {
              targetColumnId: foundColumnId,
              targetCardId: lastCard.id,
              isInsertEnd: true
            };
          }
        } else if (e.target.classList.contains('column-title-display')) {
          let firstCard = getCardInColumnByPosition(listColumnsRef.current.columns, foundColumnId, 'first')

          const cardEls = colEl?.querySelectorAll("[data-card-id]");
          const isFirstCardSource = cardEls?.[0]?.getAttribute("data-card-id") === valueDragStartRef.current.sourceCardId;

          if (valueDragStartRef.current.sourceColumnId === foundColumnId && cardEls.length === 1 || isFirstCardSource) {
            //Cùng cột, cột 1 thẻ or thẻ đó là thẻ đầu tiên-> return
            return
          }
          else {
            // ✅ Xoá class placeholder nếu đang có
            document.querySelectorAll(".isCardDragging").forEach((el) => {
              el.classList.remove("isCardDragging");
            });

            valueDragEndRef.current = {
              targetColumnId: foundColumnId,
              targetCardId: firstCard.id,
              isInsertEnd: false
            };
          }
        }
      }
    }

    document.addEventListener("mousemove", handleMouseMove);
    return () => document.removeEventListener("mousemove", handleMouseMove);



  }, [])

  useEffect(() => {
    //Render dữ liệu API or LS
    listColumnsRef.current = initDataBoard
    setColumns(sortOrder(initDataBoard.columns, initDataBoard.columnOrder, "id"))
  }, [])


  return (
    <div className="board-content">
      {/* Render List Column */}
      {columns.map((column, index) => (
        <Column
          key={index}
          columnProps={column}
          valueDragStartRef={valueDragStartRef}
          valueDragEndRef={valueDragEndRef}
          distanceXFirst={distanceXFirst}
          distanceYFirst={distanceYFirst}
          cloneCardRef={cloneCardRef}
          listColumnsRef={listColumnsRef}
        />
      ))}

      {/* button to create new column */}
      {/* <AddNewColumn onAddColumn={handleAddColumn} /> */}
    </div>

  )
}

export default BoardContent
