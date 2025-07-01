import React, { useState, useEffect } from "react";

export const initDataTest = {
    id: 'board-test',
    columnOrder: ['c1', 'c2', 'c3'],
    columns: [
        {
            id: "c1",
            title: "cột 1",
            cardOrder: ['card1', 'card2', 'card3'],
            cards: [
                { id: 'card1', columnId: 'c1', title: 'thẻ 1 - cột 1' },
                { id: 'card2', columnId: 'c1', title: 'thẻ 2 - cột 1' },
                { id: 'card3', columnId: 'c1', title: 'thẻ 3 - cột 1' },
            ]
        },
        {
            id: "c2",
            title: "cột 2",
            cardOrder: ['card4'],
            cards: [
                { id: 'card4', columnId: 'c2', title: 'thẻ 4' },
            ]
        },
        {
            id: "c3",
            title: "cột 3",
            cardOrder: ['card5', 'card6'],
            cards: [
                { id: 'card5', columnId: 'c3', title: 'thẻ 5' },
                { id: 'card6', columnId: 'c3', title: 'thẻ 6' },
            ]
        }
    ]
};

export default function Board() {
    const [board, setBoard] = useState(initDataTest);
    const [dragging, setDragging] = useState({
        sourceCardId: null,
        sourceColumnId: null,
        isDragging: false
    });
    const [highlightCardId, setHighlightCardId] = useState(null);
    const [ghostPosition, setGhostPosition] = useState({ x: 0, y: 0 });
    const [hoveredColumnId, setHoveredColumnId] = useState(null);

    useEffect(() => {
        const handleMouseMove = (e) => {
            if (!dragging.isDragging) return;

            const mouseY = e.clientY;
            const mouseX = e.clientX;

            setGhostPosition({ x: mouseX + 10, y: mouseY + 10 });

            const columns = document.querySelectorAll("[data-column-id]");
            let foundColumnId = null;

            for (let col of columns) {
                const rect = col.getBoundingClientRect();
                if (
                    mouseX >= rect.left &&
                    mouseX <= rect.right &&
                    mouseY >= rect.top &&
                    mouseY <= rect.bottom
                ) {
                    foundColumnId = col.getAttribute("data-column-id");
                    break;
                }
            }

            if (!foundColumnId) return;
            setHoveredColumnId(foundColumnId);

            const columnEl = document.querySelector(`[data-column-id="${foundColumnId}"]`);
            const cardEls = columnEl.querySelectorAll("[data-card-id]");

            if (cardEls.length === 0) {
                setHighlightCardId(null); // Cột rỗng không cần highlight thẻ
                return;
            }

            let hoveredCardId = null;
            for (let i = 0; i < cardEls.length; i++) {
                const el = cardEls[i];
                const rect = el.getBoundingClientRect();
                const midY = rect.top + rect.height / 2;
                if (mouseY < midY) {
                    hoveredCardId = el.getAttribute("data-card-id");
                    break;
                }
            }

            if (hoveredCardId !== highlightCardId) {
                setHighlightCardId(hoveredCardId);
            }
        };

        document.addEventListener("mousemove", handleMouseMove);
        return () => document.removeEventListener("mousemove", handleMouseMove);
    }, [dragging, highlightCardId]);

    const handleDropInColumn = () => {
        const { sourceCardId, sourceColumnId } = dragging;
        if (!sourceCardId || !hoveredColumnId) return;

        const newBoard = JSON.parse(JSON.stringify(board));
        const sourceCol = newBoard.columns.find(c => c.id === sourceColumnId);
        const targetCol = newBoard.columns.find(c => c.id === hoveredColumnId);

        const draggedCard = sourceCol.cards.find(card => card.id === sourceCardId);
        sourceCol.cards = sourceCol.cards.filter(card => card.id !== sourceCardId);
        sourceCol.cardOrder = sourceCol.cardOrder.filter(id => id !== sourceCardId);

        let insertIndex = 0;
        if (highlightCardId) {
            insertIndex = targetCol.cards.findIndex(card => card.id === highlightCardId);
        } else {
            insertIndex = targetCol.cards.length; // Cột rỗng hoặc thả dưới cùng
        }

        draggedCard.columnId = targetCol.id;
        targetCol.cards.splice(insertIndex, 0, draggedCard);
        targetCol.cardOrder.splice(insertIndex, 0, sourceCardId);

        setBoard(newBoard);
        setDragging({ sourceCardId: null, sourceColumnId: null, isDragging: false });
        setHighlightCardId(null);
        setHoveredColumnId(null);
    };

    return (
        <div className="flex gap-4 p-4 relative">
            {dragging.isDragging && (
                <div
                    className="pointer-events-none fixed bg-white rounded px-3 py-2 border shadow text-sm opacity-90"
                    style={{
                        top: ghostPosition.y,
                        left: ghostPosition.x,
                        zIndex: 50
                    }}
                >
                    {(() => {
                        const card = board.columns.flatMap(c => c.cards).find(c => c.id === dragging.sourceCardId);
                        return card?.title || '';
                    })()}
                </div>
            )}
            {board.columnOrder.map((columnId) => {
                const column = board.columns.find((c) => c.id === columnId);
                return (
                    <Column
                        key={column.id}
                        column={column}
                        dragging={dragging}
                        highlightCardId={highlightCardId}
                        setDragging={setDragging}
                        onDrop={handleDropInColumn}
                    />
                );
            })}
        </div>
    );
}

function Column({ column, dragging, highlightCardId, setDragging, onDrop }) {
    return (
        <div
            data-column-id={column.id}
            onMouseUp={onDrop}
            className="w-64 bg-white p-4 rounded shadow min-h-[200px]"
        >
            <h2 className="font-bold mb-2">{column.title}</h2>
            {column.cards.map((card) => (
                <Card
                    key={card.id}
                    card={card}
                    columnId={column.id}
                    isPlaceholder={highlightCardId === card.id}
                    isDraggingSource={dragging.isDragging && dragging.sourceCardId === card.id && highlightCardId === null}
                    setDragging={setDragging}
                />
            ))}
        </div>
    );
}

function Card({ card, columnId, isPlaceholder, isDraggingSource, setDragging }) {
    const handleMouseDown = (e) => {
        setDragging({
            sourceCardId: card.id,
            sourceColumnId: columnId,
            isDragging: true
        });
        e.stopPropagation();
    };

    return (
        <div
            data-card-id={card.id}
            data-column-id={columnId}
            onMouseDown={handleMouseDown}
            className={`p-3 rounded mb-2 cursor-pointer select-none transition-all duration-150
        ${isPlaceholder ? 'placeholder' : ''}
        ${isDraggingSource ? 'placeholder' : ''}
        ${!isPlaceholder && !isDraggingSource ? 'bg-blue-100' : ''}`}
        >
            {card.title}
        </div>
    );
}

// CSS (gợi ý thêm trong file CSS):
// .placeholder {
//   background-color: #e5e7eb; /* Tailwind's gray-200 */
//   color: #4b5563; /* Tailwind's gray-700 */
//   border: 2px dashed #9ca3af; /* Tailwind's gray-400 */
//   opacity: 0.9;
// }
