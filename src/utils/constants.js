export const generateId = () => Date.now().toString()
//Sort array order
export const sortOrder = (array, order, key) => {
    array.sort((a, b) => order.indexOf(a[key]) - order.indexOf(b[key]));
    return array;
};

//Lấy id cột/thẻ nguồn
export let valueDragStart = {
    sourceCardId: null,
    sourceColumnId: null,
    isDragging: false
};

export let setValueDragStart = (value) => {
    dragStart = value;
};

//Lấy id cột/thẻ đích
export let valueDragEnd = {
    targetCardId: null,
    targetColumnId: null,
}

export let setValueDragEnd = (value) => {
    dragStart = value;
};

export let placeholder = {
    columnId: null,
    cardId: null,
    cardIndex: null
}

//Create ghost card
// createGhostCard.js
export function createGhostCard(card, mouseX, mouseY, dx, dy) {
    const clone = card.cloneNode(true)
    clone.setAttribute('id', 'ghost-card')
    clone.style.position = 'absolute'
    clone.style.left = `${mouseX - dx}px`
    clone.style.top = `${mouseY - dy}px`
    clone.style.pointerEvents = 'none'
    clone.style.opacity = '0.8'
    clone.style.zIndex = 1000
    clone.style.width = `${Number(card.offsetWidth - 23)}px` // optional: giữ đúng kích thước
    clone.style.height = `${card.offsetHeight}px - 6px`

    // 👇 Thêm hiệu ứng Trello-like:
    clone.style.transform = 'rotate(3deg) scale(1.05)'
    clone.style.boxShadow = '0 8px 20px rgba(0, 0, 0, 0.2)'
    clone.style.transition = 'transform 0.1s ease'

    document.body.appendChild(clone)
    return clone
}


//RESET 
export function resetDataDrag(valueDragStartRef, valueDragEndRef) {
    valueDragStartRef.current = {
        sourceCardId: null,
        sourceColumnId: null,
        isDragging: false
    }
    valueDragEndRef.current = {
        targetCardId: null,
        targetColumnId: null,
    }
    document.body.classList.remove("dragging");
    let cardDrag = document.querySelector(".isCardDragging");
    cardDrag && cardDrag.classList.remove("isCardDragging");
}

// import { useEffect } from "react";
// import { debounce } from "lodash";

// export const useColumnDragDrop = ({
//     column,
//     setColumn,
//     setCards,
//     listColumns,
//     cloneColumnDrag,
//     cloneColumnDragX,
//     cloneColumnDragY,
//     cloneCardDrag,
//     cloneCardDragX,
//     cloneCardDragY,
//     columnEmpty,
//     objColEmpty,
//     objColStart,
//     objColEnter,
//     cardStart,
//     cardEnter,
//     clickMouseY,
//     dropMouseY
// }) => {
//     useEffect(() => {
//         const handleMouseDown = (e) => {
//             clickMouseY.current = e.clientY;
//             dropMouseY.current = e.clientY;
//             if (e.target.classList[0] !== "form-control") {
//                 // handled externally
//             }
//             const clone = cloneColumnDrag.current || cloneCardDrag.current;
//             if (clone) document.body.appendChild(clone);
//         };

//         const handleDragStart = () => {
//             const node = cloneColumnDrag.current || cloneCardDrag.current;
//             if (node) {
//                 node.classList.add("dragged-item");
//                 document.body.appendChild(node);
//             }
//         };

//         const handleDragOver = (e) => {
//             e.preventDefault();
//             dropMouseY.current = e.clientY;
//             const isColumn = !!cloneColumnDrag.current;
//             const x = e.pageX - (isColumn ? 170 : 130);
//             const y = isColumn ? e.pageY : e.pageY + 10;
//             const clone = isColumn ? cloneColumnDrag.current : cloneCardDrag.current;
//             if (clone) {
//                 clone.style.left = `${x}px`;
//                 clone.style.top = `${y}px`;
//             }
//         };

//         const handleDragEnd = debounce((e) => {
//             e.target.classList.remove("is-card-dragging");

//             const updateIfMatched = (ref) => {
//                 if (ref?.id === column?.id) {
//                     setColumn({ ...ref });
//                     setCards([...ref.cards]);
//                 }
//             };

//             if (
//                 (objColEnter.current?.id === objColStart.current?.id) ||
//                 columnEmpty.current
//             ) {
//                 updateIfMatched(objColEnter.current);
//                 if (columnEmpty.current?.id === column.id) {
//                     updateIfMatched(objColEmpty.current);
//                     columnEmpty.current = null;
//                 }
//             } else {
//                 updateIfMatched(objColStart.current);
//                 updateIfMatched(objColEnter.current);
//             }

//             setTimeout(() => {
//                 columnEmpty.current = null;
//                 objColStart.current = null;
//                 objColEnter.current = null;
//                 cardStart.current = null;
//                 cardEnter.current = null;
//                 cloneColumnDrag.current = null;
//                 cloneCardDrag.current = null;
//             }, 0);

//             localStorage.setItem("listColumns", JSON.stringify(listColumns.current));
//         }, 0);

//         window.addEventListener("mousedown", handleMouseDown);
//         window.addEventListener("dragstart", handleDragStart);
//         window.addEventListener("dragover", handleDragOver);
//         window.addEventListener("dragend", handleDragEnd);
//         window.addEventListener("mouseup", (e) => {
//             if (e.target.className === "board-content") {
//                 // handle setShowAddCard(false) externally
//             }
//         });

//         return () => {
//             window.removeEventListener("mousedown", handleMouseDown);
//             window.removeEventListener("dragstart", handleDragStart);
//             window.removeEventListener("dragover", handleDragOver);
//             window.removeEventListener("dragend", handleDragEnd);
//         };
//     }, [column]);
// };
