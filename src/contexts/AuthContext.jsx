import { createContext, useContext, useState, useEffect } from "react"
import { getInfoUserLocal, passLocalStorage } from "@utils/passLocalStorage"
import { useNavigate } from "react-router-dom"
import instance, { STORAGE_KEY } from "service/axiosInstance"
import { clearTrelloCache } from "@utils/clearTrelloCache"
import axios from "axios"

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(getInfoUserLocal()?.user)
    const [appBarColor, setAppBarColor] = useState('#1976d2')

    const navigate = useNavigate()

    const loginContext = async (data) => {
        setUser(data.user)
        passLocalStorage.setItem(STORAGE_KEY, data)
        navigate("/")
    }

    const signupContext = async (data) => {
        setUser(data.user)
        passLocalStorage.setItem(STORAGE_KEY, data)
        navigate("/")
    }

    const logoutContext = () => {
        setUser(null)
        passLocalStorage.removeItem(STORAGE_KEY)
        clearTrelloCache()
        navigate("/login");
    }

    useEffect(() => {
        const localUser = getInfoUserLocal()?.user
        if (localUser && localUser._id) {
            setUser(localUser)
        } else {
            setUser(null)
        }
        // const user = getInfoUserLocal();
        // if (user.accessToken) {
        //     axios.defaults.headers.common["Authorization"] = `Bearer ${user.accessToken}`;
        //     setUser(user?.user)
        // } else { setUser(null) }
    }, [])

    const value = {
        user,
        setUser,
        loginContext,
        signupContext,
        logoutContext,
        appBarColor,
        setAppBarColor
    }
    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => useContext(AuthContext)
