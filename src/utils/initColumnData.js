export const initDataBoard = {
    id: '1412',
    title: 'gì đó',
    columnOrder: ['cột1', 'cột2', 'cột3', 'cột4'],
    columns: [
        {
            boardId: '1412',
            id: "cột3",
            title: "cột 3",
            cardOrder: ['card5', 'card6'],
            cards: [
                { id: 'card6', columnId: 'cột3', title: '6 6 6' },
                { id: 'card5', columnId: 'cột3', title: '5    5     5' },
            ]
        }, {
            boardId: '1412',
            id: "cột2",
            title: "cột 2",
            cardOrder: ['card4',],
            cards: [
                { id: 'card4', columnId: 'cột2', title: '444' },

            ]
        }, {
            boardId: '1412',
            id: "cột1",
            title: "cột 1",
            cardOrder: ['card1', 'card2', 'card3'],
            cards: [
                { id: 'card2', columnId: 'cột1', title: '2' },
                { id: 'card3', columnId: 'cột1', title: '3333' },
                { id: 'card1', columnId: 'cột1', title: '1111' },
            ]
        }, {
            boardId: '1412',
            id: "cột4",
            title: "cột rỗng",
            cardOrder: [],
            cards: []
        }

    ]
}







export const listBoard = {
    board: { id: "b1", title: "Dự án A", columnOrder: ["c1", "c2"] },
    columns: [
        { id: "c1", title: "To Do", cardOrder: ["card1", "card2"] },
        { id: "c2", title: "Doing", cardOrder: ["card3"] }
    ],
    cards: [
        { id: "card1", title: "Task 1", columnId: "c1" },
        { id: "card2", title: "Task 2", columnId: "c1" },
        { id: "card3", title: "Task 3", columnId: "c2" }
    ]
}


const data = {
    id: 'board123',
    title: 'Dự án Website Trello Clone',
    color: ['#08479e', '#084293', '#0b4aa2'],
    ownerId: 'userA',
    members: [
        {
            id: 'userA',
            name: 'Nguyễn Văn A',
            email: 'a@example.com'
        },
        {
            id: 'userB',
            name: 'Trần Văn B',
            email: 'b@example.com'
        }
    ],
    columnOrder: ['col1', 'col2', 'col3'],
    columns: [
        {
            id: 'col1',
            title: 'Việc cần làm',
            cardOrder: ['card1', 'card2'],
            cards: [
                {
                    id: 'card1',
                    columnId: 'col1',
                    title: 'Thiết kế giao diện',
                    description: 'Dùng Figma để thiết kế',
                    status: false,
                },
                {
                    id: 'card2',
                    columnId: 'col1',
                    title: 'Phân tích chức năng',
                    description: '',
                    status: true,
                }
            ]
        },
        {
            id: 'col2',
            title: 'Đang thực hiện',
            cardOrder: [],
            cards: []
        },
        {
            id: 'col3',
            title: 'Hoàn thành',
            cardOrder: [],
            cards: []
        }
    ]

}

// const newColumn = {
//     id: "column-" + uuidv4(),        // tự generate tạm
//     boardId: currentBoard.id,
//     title: "Tên cột mới",
//     cardOrder: [],
//     cards: []
// }
// const newCard = {
//     id: "card-" + uuidv4(),
//     columnId: column.id,
//     title: "Tên thẻ mới",
//     description: "",
//     labels: [],
//     dueDate: null,
//     attachments: [],
//     comments: []
// }


