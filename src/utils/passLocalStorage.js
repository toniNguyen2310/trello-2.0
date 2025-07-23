import { STORAGE_KEY } from "service/axiosInstance"

export const passLocalStorage = {
    getItem: (key) => {
        try {
            const value = localStorage.getItem(key);
            return JSON.parse(value) || {};
        } catch {
            return {};
        }
    },
    setItem: (key, value) => {
        const val = typeof value === "string" ? value : JSON.stringify(value)
        localStorage.setItem(key, val)
    },
    removeItem: (key) => {
        localStorage.removeItem(key);
    },
}


export const getInfoUserLocal = () => {
    const infoUser = passLocalStorage.getItem(STORAGE_KEY) || {};
    return infoUser;
};




