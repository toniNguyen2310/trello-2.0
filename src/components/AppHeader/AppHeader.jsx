import { useNavigate } from 'react-router-dom'
import { FaRegUserCircle } from "react-icons/fa";
import { HiOutlineLogout } from "react-icons/hi";
import { BiSolidUser } from "react-icons/bi";

import './AppHeader.scss'
import { useState } from 'react';
const AppHeader = () => {
  const navigate = useNavigate()
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="app-header">
      <div className='app-header-logo' onClick={() => navigate('/')}>
        <img
          className="app-header-logo-img"
          src="https://trello.com/assets/d947df93bc055849898e.gif"
          alt=""
        />
      </div>
      {/* <div className='app-header-user' onClick={() => navigate('/login')}>
        <FaRegUserCircle />
      </div> */}
      <div className='app-header-authen'
        onClick={() => setIsOpen(true)}
      >TN
        {isOpen && (
          <div className="drop-down">
            <div
              className="drop-down-box"
              onClick={() => navigate('/user')}
            >
              <BiSolidUser />
              Tài khoản
            </div>
            <div className="drop-down-box" >
              <HiOutlineLogout />
              Đăng xuất
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default AppHeader