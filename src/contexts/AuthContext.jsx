import { createContext, useContext, useState, useEffect } from "react"
import { getInfoUserLocal, passLocalStorage } from "@utils/passLocalStorage"
import { KEY_INFO_USER } from "@utils/constants"
import { useNavigate } from "react-router-dom"
import { LS_KEY } from "@utils/customHooks/useBoardsWithCache"

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(getInfoUserLocal())
    const [appBarColor, setAppBarColor] = useState('#ffffff')
    const navigate = useNavigate()

    const loginContext = async (data) => {
        setUser(data)
        passLocalStorage.setItem(KEY_INFO_USER, data)
        navigate("/")
    }

    const signupContext = async (data) => {
        setUser(data)
        passLocalStorage.setItem(KEY_INFO_USER, data)
        navigate("/")
    }

    const logoutContext = () => {
        setUser({})
        passLocalStorage.removeItem(KEY_INFO_USER)

    }

    useEffect(() => {
        const userLocal = getInfoUserLocal()
        if (userLocal) {
            setUser(userLocal)
        }
    }, [])

    return (
        <AuthContext.Provider value={{ user, setUser, loginContext, logoutContext, signupContext, appBarColor, setAppBarColor }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => useContext(AuthContext)
