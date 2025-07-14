import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'
import './LayoutScss/FullLayout.scss'

import AppHeader from '../AppHeader/AppHeader'

const FullLayout = () => {
    return (
        <div className='app-layout'>
            <AppHeader />
            <div className="app-body">
                <Sidebar />
                <div className="app-content">
                    <Outlet />
                </div>
            </div>
        </div>
    )
}

export default FullLayout
