export const passLocalStorage = {
    getItem: (key) => {
        const value = localStorage.getItem(key)
        try {
            return JSON.parse(value)
        } catch (e) {
            return value
        }
    },
    setItem: (key, value) => {
        const val = typeof value === "string" ? value : JSON.stringify(value)
        localStorage.setItem(key, val)
    },
    removeItem: (key) => localStorage.removeItem(key),
}

// Nếu muốn dùng chung hàm getInfoUserLocal
import { KEY_INFO_USER } from "./constants";

export const getInfoUserLocal = () => {
    const infoUser = passLocalStorage.getItem(KEY_INFO_USER) || {};
    return infoUser;
};