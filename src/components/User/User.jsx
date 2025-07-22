import { useAuth } from '@contexts/AuthContext'
import './User.scss'
import { useNavigate, useParams } from 'react-router-dom'
import { getUserDetail } from 'service/apis'
import { useEffect } from 'react'
import { isEqual } from 'lodash'

function User() {
    const navigate = useNavigate()
    const { user, setUser } = useAuth()
    const { userId } = useParams()

    useEffect(() => {
        const fetchUser = async () => {
            if (!user?._id) return
            try {
                const userApi = await getUserDetail(userId)
                console.log('userApi>> ', userApi)
                // So sánh nếu khác thì cập nhật
                if (!isEqual(user, userApi)) {
                    setUser(userApi)
                }
            } catch (err) {
                console.error('Lỗi fetch user detail:', err)
            }
        }

        fetchUser()
    }, [user?._id])

    if (!user) return <div>Đang tải...</div>
    return (
        <div className="User-container">
            <div className="User-container-modal">
                <h2>Thông tin tài khoản</h2>

                <div className="user-info">
                    <label>Email</label>
                    <p>{user?.email}</p>
                </div>

                <div className="user-info">
                    <label>Họ tên</label>
                    <p>{user?.username}</p>
                </div>

                <div className="user-info">
                    <label>Thành viên từ</label>
                    <p>{new Date(user?.createdAt).toLocaleDateString('vi-VN', {
                        timeZone: 'Asia/Ho_Chi_Minh'
                    })}</p>
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