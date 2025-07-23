export const clearTrelloCache = () => {
    Object.keys(localStorage).forEach((key) => {
        if (
            key.startsWith('trelloBoard-') ||
            key.startsWith('card-') ||
            key === 'cachedBoards'
        ) {
            localStorage.removeItem(key)
        }
    })
}
