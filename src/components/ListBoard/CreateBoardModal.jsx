import { useRef, useState } from 'react';
import { IoMdClose } from "react-icons/io";
import './ListBoardScss/CreateBoardModal.scss';
import { IoIosArrowDown } from "react-icons/io";
import { bottomRowColors, topRowColors } from '../../utils/constants';
import { useAuth } from '@contexts/AuthContext';
import { message } from "antd";
import { createBoardAPI } from 'service/apis';
import { useNavigate } from 'react-router-dom';
import { useSmartPosition } from '@utils/customHooks/useSmartPosition';

const CreateBoardModal = ({ isOpen, setIsOpen, position }) => {
  const [selectedBackground, setSelectedBackground] = useState(0);
  const [boardTitle, setBoardTitle] = useState('');
  const [showError, setShowError] = useState(false);
  const [showMoreColors, setShowMoreColors] = useState(false);
  const { user } = useAuth()

  const navigate = useNavigate();

  const getSelectedColor = () => {
    if (selectedBackground < topRowColors.length) {
      return topRowColors[selectedBackground];
    }
    return bottomRowColors[selectedBackground - topRowColors.length];
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!boardTitle.trim()) {
      setShowError(true);
      return;
    }
    setShowError(false);
    // Handle form submission here
    console.log('NAME:', boardTitle, 'Background:', getSelectedColor(selectedBackground));
    try {
      const newBoard = {
        title: boardTitle.trim(),
        color: getSelectedColor(selectedBackground),
        userId: user._id,
      }
      const res = await createBoardAPI(newBoard);
      message.success("Tạo bảng thành công!");
      console.log("Board created:", res);
      navigate(`/board/${res.board._id}`)
      // setIsOpen(false)
      // TODO: redirect hoặc cập nhật UI
    } catch (error) {
      message.error("Lỗi khi tạo bảng");
      console.error(error);
    }
  };

  const handleTitleChange = (e) => {
    setBoardTitle(e.target.value);
    if (showError && e.target.value.trim()) {
      setShowError(false);
    }
  };

  return (
    <>{isOpen && isOpen &&
      <div className="modal" style={{
        left: position === 'right' ? '105%' : '0',
        right: position === 'left' ? '105%' : '0',
      }}>
        <div className="modal-header">
          <h2 className="modal-title">Create board</h2>
          <div
            className="close-btn"
            onClick={() => setIsOpen(false)}
          >
            <IoMdClose />
          </div>
        </div>

        <div className="board-preview">
          <div
            className="preview-container"
            style={{
              background: selectedBackground < topRowColors.length
                ? topRowColors[selectedBackground]
                : bottomRowColors[selectedBackground - topRowColors.length]
            }}
          >
            <div className="board-lists">
              <div className="board-list">
                <div className="list-items">
                  <div className="list-item"></div>
                </div>
              </div>
              <div className="board-list">
                <div className="list-items">
                  <div className="list-item"></div>
                  <div className="list-item"></div>
                </div>
              </div>
              <div className="board-list">
                <div className="list-items">
                  <div className="list-item"></div>
                  <div className="list-item"></div>
                  <div className="list-item"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="background-section">
          <div className="section-title">Background</div>
          <div className="background-options">
            {/* Hàng trên: 5 màu cơ bản + nút ... */}
            <div className="color-row top-row">
              {topRowColors.map((color, index) => (
                <div
                  key={index}
                  className={`background-option color-option ${selectedBackground === index ? 'selected' : ''}`}
                  onClick={() => setSelectedBackground(index)}
                  style={{ background: color }}
                />
              ))}
              <div
                className={`background-option more-option ${showMoreColors ? 'expanded' : ''}`}
                onClick={() => setShowMoreColors(!showMoreColors)}
              >
                <div className='more'><IoIosArrowDown />
                </div>
              </div>
            </div>

            {/* Hàng dưới: 6 màu bổ sung - hiển thị khi click ... */}
            {showMoreColors && (
              <div className="color-row bottom-row">
                {bottomRowColors.map((color, index) => (
                  <div
                    key={index + topRowColors.length}
                    className={`background-option color-option ${selectedBackground === index + topRowColors.length ? 'selected' : ''}`}
                    onClick={() => setSelectedBackground(index + topRowColors.length)}
                    style={{ background: color }}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="form-section">
          <div className="form-group">
            <label htmlFor="board-title" className="form-label">
              Board title <span className="required">*</span>
            </label>
            <input
              type="text"
              id="board-title"
              className={`form-input ${showError ? 'error' : ''}`}
              value={boardTitle}
              onChange={handleTitleChange}
              placeholder="Enter board title"
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  handleSubmit(e);
                }
              }}
              autoFocus
            />
            {showError && (
              <div className="error-message">
                <span className="error-icon">⚠️</span>
                Board title is required
              </div>
            )}
          </div>
        </div>
        <div className='button-create' onClick={(e) => handleSubmit(e)}>Create</div>
      </div>
    }
    </>

  );
};

export default CreateBoardModal;