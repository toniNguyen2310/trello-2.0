
// SWAP  COLUMNS IN REF
export const swapColumnsInRef = (ref, srcId, tgtId) => {
    const { columnOrder, columns } = ref.current;
    const i = columnOrder.indexOf(srcId), j = columnOrder.indexOf(tgtId)
    if (i === -1 || j === -1) return;

    // ✨ Hoán đổi 2 phần tử trong columnOrder
    const newOrder = [...columnOrder];
    //SwapOrder i = 1, j = 3, [1,2,3] -> [3,2,1]
    [newOrder[i], newOrder[j]] = [newOrder[j], newOrder[i]];

    // ✨ Cập nhật lại ref
    ref.current = {
        ...ref.current,
        columnOrder: newOrder,
        columns: newOrder.map((id => columns.find(c => c.id === id)))
    };
};