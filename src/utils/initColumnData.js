export const initDataBoard = {
    id: 'board-test',
    columnOrder: ['cột1', 'cột2', 'cột3', 'cột4'],
    columns: [
        {
            id: "cột3",
            title: "cột 3",
            cardOrder: ['card5', 'card6'],
            cards: [
                { id: 'card6', columnId: 'cột3', title: '6 6 6' },
                { id: 'card5', columnId: 'cột3', title: '5    5     5' },
            ]
        }, {
            id: "cột2",
            title: "cột 2",
            cardOrder: ['card4',],
            cards: [
                { id: 'card4', columnId: 'cột2', title: '444' },

            ]
        }, {
            id: "cột1",
            title: "cột 1",
            cardOrder: ['card1', 'card2', 'card3'],
            cards: [
                { id: 'card2', columnId: 'cột1', title: '2' },
                { id: 'card3', columnId: 'cột1', title: '3333' },
                { id: 'card1', columnId: 'cột1', title: '1111' },
            ]
        }, {
            id: "cột4",
            title: "cột rỗng",
            cardOrder: [],
            cards: []
        }

    ]


}