import { useAuth } from '@contexts/AuthContext'
import './User.scss'
import { useNavigate, useParams } from 'react-router-dom'
import { getUserDetail } from 'service/apis'
import { useEffect, useState } from 'react'
import { isEqual } from 'lodash'

function User() {
    const navigate = useNavigate()
    const { user, setUser } = useAuth()
    const { userId } = useParams()

    useEffect(() => {
        const fetchUser = async () => {
            if (!userId || !user?._id) return
            try {
                const fetchedUser = await getUserDetail(userId)
                if (!isEqual(user, fetchedUser)) {
                    setUser(fetchedUser)
                }
            } catch (err) {
                navigate('/not-found');
            }
        }

        fetchUser()
    }, [user?._id, userId])

    if (!user) return <p>Không tìm thấy người dùng</p>

    const formattedDate = new Date(user.createdAt).toLocaleDateString('vi-VN', {
        timeZone: 'Asia/Ho_Chi_Minh'
    })

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
                    <p>{formattedDate}</p>
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