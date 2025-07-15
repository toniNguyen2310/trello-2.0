const MiniPopConfirm = ({ message, onConfirm, onCancel }) => {
    return (
        <div className="mini-popconfirm">
            <div className="massage">{message}</div>
            <div className="mini-popconfirm-actions">
                <button className="no" onClick={onCancel}>No</button>
                <button className="yes" onClick={onConfirm}>Yes</button>
            </div>
        </div>
    )
}

export default MiniPopConfirm
