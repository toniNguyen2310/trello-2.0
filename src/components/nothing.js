//BOARD

// Sync with localStorage
// useEffect(() => {
//   localStorage.setItem('board-data', JSON.stringify(boardData))
// }, [boardData])




// // Handle Add Column
// const handleAddColumn = (title) => {
//   const newId = generateId()
//   const newColumn = {
//     id: newId,
//     title,
//     cards: []
//   }
//   setBoardData(prev => ({
//     columnOrder: [...prev.columnOrder, newId],
//     columns: {
//       ...prev.columns,
//       [newId]: newColumn
//     }
//   }))
// }

// // Handle Title Change
// const handleChangeTitle = (columnId, newTitle) => {
//   setBoardData(prev => ({
//     ...prev,
//     columns: {
//       ...prev.columns,
//       [columnId]: {
//         ...prev.columns[columnId],
//         title: newTitle
//       }
//     }
//   }))
// }

// // Handle Add Card
// const handleAddCard = (columnId, cardText) => {
//   console.log("BC", "columnId>> ", columnId, "cardText>> ", cardText)
//   setBoardData(prev => {
//     const column = prev.columns[columnId]

//     const updatedColumn = {
//       ...column,
//       cards: [...column.cards, cardText]
//     }
//     return {
//       ...prev,
//       columns: {
//         ...prev.columns,
//         [columnId]: updatedColumn
//       }
//     }
//   })
// }









//COLUMN TITLE


// const [editing, setEditing] = useState(false)
// const [newTitle, setNewTitle] = useState(title)
// const inputRef = useRef(null)
// const wrapperRef = useRef(null)

// // Cập nhật newTitle khi title props thay đổi
// useEffect(() => {
//   setNewTitle(title)
// }, [title])

// // Focus khi bắt đầu edit
// useEffect(() => {
//   if (editing) {
//     inputRef.current?.focus()
//   }
// }, [editing])

// //Click outside để xác nhận
// useEffect(() => {
//   const handleClickOutside = (e) => {
//     if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
//       confirmChange()
//     }
//   }

//   if (editing) {
//     document.addEventListener('mousedown', handleClickOutside)
//   }

//   return () => {
//     document.removeEventListener('mousedown', handleClickOutside)
//   }
// }, [editing, newTitle])

// //Confirm change title column
// const confirmChange = () => {
//   const trimmed = newTitle.trim()
//   if (trimmed && trimmed !== title) {
//     onChangeTitle(trimmed)
//   }
//   setEditing(false)
// }




