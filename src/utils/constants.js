export const KEY_INFO_USER = "info_user"




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


//CloneColumn
export const cloneColumn = (col) => ({
    ...col,
    cardOrder: [...col.cardOrder],
    cards: [...col.cards]
});

//Create ghost Card or Column
export function createGhostCardOrColumn(element, mouseX, mouseY, dx, dy) {
    const clone = element.cloneNode(true)
    clone.setAttribute('id', 'ghost-card')
    clone.classList.add('ghost-card');
    clone.style.position = 'absolute'
    clone.style.left = `${mouseX - dx}px`
    clone.style.top = `${mouseY - dy}px`
    clone.style.pointerEvents = 'none'
    clone.style.zIndex = 1000
    clone.style.width = `${Number(element.offsetWidth - 23)}px` // optional: giữ đúng kích thước thẻ
    clone.style.height = `${element.offsetHeight}px - 6px`
    document.body.appendChild(clone)
    return clone
}


//RESET 
export function resetDataDrag(dragStartRef, dragEndRef, distanceXFirst, distanceYFirst) {
    dragStartRef.current = {
        sourceCardId: null,
        sourceColumnId: null,
        isDragging: false
    }
    dragEndRef.current = {
        targetCardId: null,
        targetColumnId: null,
        isInsertEnd: false
    }
    if (distanceXFirst) distanceXFirst.current = 0;
    if (distanceYFirst) distanceYFirst.current = 0;

    document.body.classList.remove("dragging");
    let cardDrag = document.querySelector(".isPlaceholderCard");
    cardDrag && cardDrag.classList.remove("isPlaceholderCard");
    let placeholderColumnBorder = document.querySelector(".isPlaceholderColumnBorder");
    placeholderColumnBorder && placeholderColumnBorder.classList.remove("isPlaceholderColumnBorder");
    let ghostCard = document.getElementById("ghost-card")
    ghostCard && ghostCard.remove()
    let columnDrag = document.querySelector(".isPlaceholderColumn");
    columnDrag && columnDrag.classList.remove("isPlaceholderColumn");
}

//UPDATE ColumnsRef Card
export function updateColumnsInRef(current, newSourceCol, newTargetCol = null) {
    const updatedColumns = current.columns.map(col => {
        // Trường hợp chỉ truyền 2 tham số → chỉ cập nhật newSourceCol
        if (!newTargetCol) {
            return col.id === newSourceCol?.id ? newSourceCol : col;
        }
        // Trường hợp truyền cả 3 tham số
        if (col.id === newSourceCol?.id) return newSourceCol;
        if (col.id === newTargetCol?.id && newTargetCol?.id !== newSourceCol?.id) return newTargetCol;

        return col;
    });

    return {
        ...current,
        columns: updatedColumns
    };
}


// Hàng trên: 5 màu cơ bản
export const topRowColors = [
    '#4bbf6b', // light blue
    '#0079bf', // blue
    '#dc2626', // blue
    '#89609e', // dark blue
    '#6a7378ff'  // light purple
];

// Hàng dưới: 6 màu bổ sung
export const bottomRowColors = [
    'linear-gradient(to bottom, #833ab4, #fd1d1d, #fcb045)',
    'linear-gradient(to bottom, #fdfc47, #24fe41)',
    'linear-gradient(to bottom, #ff00cc, #333399)',
    'linear-gradient(to bottom, #fc4a1a, #f7b733)',
    'linear-gradient(to bottom, #373b44, #4286f4)',
    'linear-gradient(to bottom, #00c9ff, #92fe9d)',
];

