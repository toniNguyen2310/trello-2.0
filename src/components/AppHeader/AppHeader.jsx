import { useLocation, useNavigate } from 'react-router-dom'
import { FaRegUserCircle } from "react-icons/fa";
import { HiOutlineLogout } from "react-icons/hi";
import { BiSolidUser } from "react-icons/bi";
import './AppHeader.scss'
import { useEffect, useRef, useState } from 'react';
import { useAuth } from '@contexts/AuthContext'
import useClickOutside from '@utils/customHooks/useClickOutside';
import { passLocalStorage } from '@utils/passLocalStorage';
import { LS_KEY } from '@utils/customHooks/useBoardsWithCache';

const AppHeader = () => {
  const navigate = useNavigate()
  const [isOpen, setIsOpen] = useState(false)
  const { user } = useAuth()
  const { logoutContext, appBarColor, setAppBarColor } = useAuth()
  const location = useLocation()
  const dropdownRef = useRef(null);


  const handleLogout = () => {
    logoutContext();

  };

  const getFirstLetter = (name) => {
    return name?.charAt(0)?.toUpperCase() || 'U';
  };

  const isValidUser = (user) => {
    return user && Object.keys(user).length > 0 && user.username;
  };

  useEffect(() => {
    if (!location.pathname.startsWith('/board')) {
      setAppBarColor('#1976d2')
    }
    // Nếu là /board thì màu sẽ được set bên trong Board.jsx
  }, [location.pathname])

  useClickOutside({
    ref: dropdownRef,
    active: isOpen,
    callback: () => setIsOpen(false)
  })

  return (
    <div className="app-header" style={{
      background: appBarColor
    }}>
      <div className='app-header-logo' onClick={() => navigate('/')}>
        <img
          className="app-header-logo-img"
          src="https://trello.com/assets/d947df93bc055849898e.gif"
          alt=""
        />
      </div>

      {isValidUser(user) ?
        <div className='app-header-authen'
          ref={dropdownRef}
          onClick={() => setIsOpen(true)}
        >
          {getFirstLetter(user.username)}
          {isOpen && (
            <div className="drop-down">
              <div
                className="drop-down-box"
                onClick={() => navigate(`/user/${user._id}`)}
              >
                <BiSolidUser />
                Tài khoản
              </div>
              <div className="drop-down-box" onClick={handleLogout} >
                <HiOutlineLogout />
                Đăng xuất
              </div>
            </div>
          )}
        </div>

        : (
          <div className='app-header-user' onClick={() => navigate('/login')}>
            <FaRegUserCircle />
          </div>
        )}

    </div>
  )
}

export default AppHeader