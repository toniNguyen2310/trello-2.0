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
        isDragging: false,
        ghostPosition: { x: 0, y: 0 },
    });
    const [placeholder, setPlaceholder] = useState({
        columnId: null,
        cardIndex: null,
    });

    useEffect(() => {
        const handleMouseMove = (e) => {
            //Lấy id của cột đang hover
            if (!dragging.isDragging) return;
            const mouseY = e.clientY;
            const mouseX = e.clientX;
            const columns = document.querySelectorAll("[data-column-id]");
            let hoveredColumnId = null;
            for (let col of columns) {
                const rect = col.getBoundingClientRect();
                if (
                    mouseX >= rect.left &&
                    mouseX <= rect.right &&
                    mouseY >= rect.top &&
                    mouseY <= rect.bottom
                ) {
                    hoveredColumnId = col.getAttribute("data-column-id");
                    break;
                }
            }
            if (!hoveredColumnId) return;

            //Lấy cards của cột hover
            const columnEl = document.querySelector(`[data-column-id="${hoveredColumnId}"]`);
            const cardEls = columnEl.querySelectorAll("[data-card-id]");

            let newIndex = cardEls.length;

            for (let i = 0; i < cardEls.length; i++) {
                const el = cardEls[i];
                const cardId = el.getAttribute("data-card-id");
                if (cardId === dragging.sourceCardId) continue;
                const rect = el.getBoundingClientRect();
                const midY = rect.top + rect.height / 2;
                if (mouseY < midY) {
                    newIndex = i;
                    break;
                }
            }

            if (
                placeholder.columnId !== hoveredColumnId ||
                placeholder.cardIndex !== newIndex
            ) {
                setPlaceholder({
                    columnId: hoveredColumnId,
                    cardIndex: newIndex,
                });
            }

            setDragging((prev) => ({
                ...prev,
                ghostPosition: { x: e.clientX + 10, y: e.clientY + 10 },
            }));
        };

        document.addEventListener("mousemove", handleMouseMove);
        return () => document.removeEventListener("mousemove", handleMouseMove);
    }, [dragging, placeholder]);

    const handleDropInColumn = () => {
        const { sourceCardId } = dragging;
        const sourceColumnId = dragging.sourceColumnId;
        const targetColumnId = placeholder.columnId;
        const targetCardIndex = placeholder.cardIndex;

        if (!sourceCardId || !sourceColumnId || !targetColumnId) return;

        const newBoard = { ...board };
        const sourceColumn = newBoard.columns.find((c) => c.id === sourceColumnId);
        const targetColumn = newBoard.columns.find((c) => c.id === targetColumnId);

        const draggedCard = sourceColumn.cards.find((c) => c.id === sourceCardId);

        sourceColumn.cards = sourceColumn.cards.filter((c) => c.id !== sourceCardId);
        sourceColumn.cardOrder = sourceColumn.cardOrder.filter((id) => id !== sourceCardId);

        draggedCard.columnId = targetColumnId;
        targetColumn.cards.splice(targetCardIndex, 0, draggedCard);
        targetColumn.cardOrder.splice(targetCardIndex, 0, sourceCardId);

        setBoard(newBoard);
        setDragging({ sourceCardId: null, sourceColumnId: null, isDragging: false, ghostPosition: { x: 0, y: 0 } });
        setPlaceholder({ columnId: null, cardIndex: null });
    };

    return (
        <div className="flex gap-4 p-4 relative">
            {board.columnOrder.map((columnId) => {
                const column = board.columns.find((c) => c.id === columnId);
                return (
                    <Column
                        key={column.id}
                        column={column}
                        dragging={dragging}
                        placeholder={placeholder}
                        setDragging={setDragging}
                        setPlaceholder={setPlaceholder}
                        onDrop={handleDropInColumn}
                    />
                );
            })}

            {dragging.isDragging && (
                <div
                    className="pointer-events-none fixed bg-blue-100 rounded shadow px-3 py-2"
                    style={{
                        top: dragging.ghostPosition.y,
                        left: dragging.ghostPosition.x,
                        zIndex: 50,
                    }}
                >
                    {board.columns
                        .flatMap((col) => col.cards)
                        .find((c) => c.id === dragging.sourceCardId)?.title}
                </div>
            )}
        </div>
    );
}

function Column({ column, dragging, placeholder, setDragging, setPlaceholder, onDrop }) {
    return (
        <div
            data-column-id={column.id}
            onMouseUp={onDrop}
            className="w-64 bg-white p-4 rounded shadow min-h-[200px]"
        >
            <h2 className="font-bold mb-2">{column.title}</h2>
            {column.cards.map((card, index) => (
                <React.Fragment key={card.id}>
                    {placeholder.columnId === column.id && placeholder.cardIndex === index && (
                        <div className="h-12 bg-gray-200 border-2 border-dashed rounded mb-2" />
                    )}
                    {!(dragging.isDragging && dragging.sourceCardId === card.id) && (
                        <Card
                            card={card}
                            columnId={column.id}
                            dragging={dragging}
                            setDragging={setDragging}
                        />
                    )}
                </React.Fragment>
            ))}
            {placeholder.columnId === column.id && placeholder.cardIndex === column.cards.length && (
                <div className="h-12 bg-gray-200 border-2 border-dashed rounded mt-2" />
            )}
        </div>
    );
}

function Card({ card, columnId, dragging, setDragging }) {
    const handleMouseDown = (e) => {
        setDragging({
            sourceCardId: card.id,
            sourceColumnId: columnId,
            isDragging: true,
            ghostPosition: { x: e.clientX + 10, y: e.clientY + 10 },
        });
        e.stopPropagation();
    };

    return (
        <div
            data-card-id={card.id}
            data-column-id={columnId}
            onMouseDown={handleMouseDown}
            className="p-3 bg-blue-100 rounded mb-2 cursor-pointer select-none"
            style={{
                position: dragging.isDragging && dragging.sourceCardId === card.id ? "absolute" : "static",
                visibility: dragging.isDragging && dragging.sourceCardId === card.id ? "hidden" : "visible",
            }}
        >
            {card.title}
        </div>
    );
}
