
// INSERT COLUMN (move) AFTER TARGET IN REF
export const swapColumnsInRef = (ref, srcId, tgtId) => {
    const { columnOrder, columns } = ref.current;
    const srcIndex = columnOrder.indexOf(srcId);
    const tgtIndex = columnOrder.indexOf(tgtId);

    // nếu không tìm được thì thoát
    if (srcIndex === -1 || tgtIndex === -1) return;

    // 1️⃣ clone array
    const newOrder = [...columnOrder];

    // 2️⃣ xóa source tại vị trí cũ
    newOrder.splice(srcIndex, 1);
    newOrder.splice(tgtIndex, 0, srcId);

    // 4️⃣ cập nhật lại ref
    ref.current = {
        ...ref.current,
        columnOrder: newOrder,
        columns: newOrder.map(id => columns.find(c => c.id === id))
    };
};
