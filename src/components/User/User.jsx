import './User.scss'
import { useNavigate } from 'react-router-dom'

function User() {
    const navigate = useNavigate()

    return (
        <div className="User-container">
            <div className="User-container-modal">
                <h2>Thông tin tài khoản</h2>

                <div className="user-info">
                    <label>Email</label>
                    <p>123x@gmail.com</p>
                </div>

                <div className="user-info">
                    <label>Họ tên</label>
                    <p>Tùng</p>
                </div>

                <div className="user-info">
                    <label>Thành viên từ</label>
                    <p>23/10</p>
                </div>
                <div className="user-actions">
                    <button className="btn-secondary" onClick={() => navigate('/')}>Đóng</button>
                    <button className="btn-primary" >Cập nhật</button>
                </div>
            </div>
        </div>

    )
}

export default User