import { Outlet } from "react-router-dom"
import AppHeader from "../AppHeader/AppHeader"


export default function NavbarOnlyLayout() {
    return (
        <div className='trello-container'>
            <AppHeader />
            <Outlet />
        </div>
    )
}