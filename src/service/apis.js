import axiosInstance from "./axiosInstance";

//AUTH
export const loginAPI = (data) => {
    return axiosInstance.post("/auth/login", data);
};

export const signupAPI = (data) => {
    return axiosInstance.post("/auth/signup", data);
};


//BOARDS
export const getBoardsByUser = async (userId) => {
    try {
        const res = await axiosInstance.get(`/boards/${userId}`);
        return res;
    } catch (err) {
        console.error("Lỗi lấy boards:", err);
        throw err;
    }
};

//BOARD
export const createBoardAPI = async (data) => {
    const res = await axiosInstance.post("/boards", data);
    return res;
};

export const getBoardFullData = (boardId) => {
    return axiosInstance.get(`/boards/${boardId}/full`);
};

export const updateBoardTitle = ({ boardId, newTitle }) => {
    return axiosInstance.put(`/boards/${boardId}`, {
        title: newTitle
    })
}

export const deleteBoardById = ({ boardId, userId }) => {
    return axiosInstance.delete(`/boards/${boardId}`, { data: { userId: userId } })
}

export const updateColumnOderBoard = ({ boardId, columnOrder }) => {
    return axiosInstance.put(`/boards/${boardId}/column-order`, { columnOrder })
}

//USER
export const getUserDetail = (id) => {
    return axiosInstance.get(`/users/${id}`)
}

//COLUMN
export const createColumnAPI = (data) => {
    axiosInstance.post("/columns", data);
};

export const deleteColumnApiById = ({ columnId }) => {
    axiosInstance.delete(`/columns/${columnId}`);

};

export const updateTitleColumnApi = ({ columnId, title }) => {
    axiosInstance.put(`/columns/title/${columnId}`, { title })
};

export const updateCardOrder = (data) => {
    axiosInstance.put(`/columns/update-card-order`, data)
};

//CARD
export const createCardAPI = async (data) => {
    const res = await axiosInstance.post("/cards", data);
    return res;
};

export const deleteCardById = ({ cardId }) => {
    return axiosInstance.delete(`/cards/${cardId}`)
}
export const updateCardTitleById = ({ cardId, title }) => {
    return axiosInstance.put(`/cards/${cardId}/title`, { title: title })
}

export const updateDetailCardById = ({ cardId, data }) => {
    return axiosInstance.put(`/cards/${cardId}/detail`, data)
}

export const getCardDetail = (id) => {
    return axiosInstance.get(`/cards/${id}`)
}