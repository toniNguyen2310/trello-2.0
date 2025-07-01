//initial data
export const initData = [
    { title: 'Việc cần làm nè', cards: ['Thẻ 1', 'Thẻ 2', 'thẻ 3', 'thẻ 4', 'thẻ 5', 'thẻ 6', 'thẻ 7', 'thẻ 8', 'thẻ 9', 'thẻ 10', 'thẻ 11'] },
    { title: 'Đang làm', cards: ['Thẻ 3'] },

]

export const initData2 = {
    columnOrder: [],
    columns: {}
}

export const initDataBoard = {
    id: 'board-test',
    columnOrder: ['cột1', 'cột2', 'cột3', 'cột4'],
    columns: [
        {
            id: "cột3",
            title: "cột 3",
            cardOrder: ['card5', 'card6'],
            cards: [
                { id: 'card6', columnId: 'cột3', title: 'thẻ 6' },
                { id: 'card5', columnId: 'cột3', title: 'thẻ 5' },
            ]
        }, {
            id: "cột2",
            title: "cột 2",
            cardOrder: ['card4',],
            cards: [
                { id: 'card4', columnId: 'cột2', title: 'thẻ 4' },

            ]
        }, {
            id: "cột1",
            title: "cột 1",
            cardOrder: ['card1', 'card2', 'card3'],
            cards: [
                { id: 'card2', columnId: 'cột1', title: 'thẻ 2 - cột 1' },
                { id: 'card3', columnId: 'cột1', title: 'thẻ 3 - cột 1' },
                { id: 'card1', columnId: 'cột1', title: 'thẻ 1 - cột 1' },
            ]
        }, {
            id: "cột4",
            title: "cột rỗng",
            cardOrder: [],
            cards: []
        }

    ]


}