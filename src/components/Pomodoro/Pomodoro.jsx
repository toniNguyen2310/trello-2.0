import './Pomo.scss'
import { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Settings, Coffee, BookOpen } from 'lucide-react';


const Pomodoro = () => {
    const [timeLeft, setTimeLeft] = useState(25 * 60);
    const [isActive, setIsActive] = useState(false);
    const [mode, setMode] = useState('work');
    const [sessions, setSessions] = useState(0);
    const [showSettings, setShowSettings] = useState(false);
    const [settings, setSettings] = useState({
        workTime: 25,
        shortBreak: 5,
        longBreak: 15
    });

    const intervalRef = useRef(null);

    const modes = {
        work: {
            duration: settings.workTime * 60,
            label: 'Làm việc',
            color: 'work',
            icon: BookOpen
        },
        shortBreak: {
            duration: settings.shortBreak * 60,
            label: 'Nghỉ ngắn',
            color: 'short-break',
            icon: Coffee
        },
        longBreak: {
            duration: settings.longBreak * 60,
            label: 'Nghỉ dài',
            color: 'long-break',
            icon: Coffee
        }
    };

    useEffect(() => {
        if (isActive && timeLeft > 0) {
            intervalRef.current = setInterval(() => {
                setTimeLeft(prev => prev - 1);
            }, 1000);
        } else if (timeLeft === 0) {
            handleTimerComplete();
        } else {
            clearInterval(intervalRef.current);
        }

        return () => clearInterval(intervalRef.current);
    }, [isActive, timeLeft]);

    const handleTimerComplete = () => {
        setIsActive(false);
        playNotificationSound();

        if (mode === 'work') {
            setSessions(prev => prev + 1);
            if ((sessions + 1) % 4 === 0) {
                switchMode('longBreak');
            } else {
                switchMode('shortBreak');
            }
        } else {
            switchMode('work');
        }
    };

    const playNotificationSound = () => {
        try {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();

            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);

            oscillator.frequency.value = 800;
            oscillator.type = 'sine';

            gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);

            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.5);
        } catch (error) {
            console.log('Không thể phát âm thanh:', error);
        }
    };

    const toggleTimer = () => {
        setIsActive(!isActive);
    };

    const resetTimer = () => {
        setIsActive(false);
        setTimeLeft(modes[mode].duration);
    };

    const switchMode = (newMode) => {
        setIsActive(false);
        setMode(newMode);
        setTimeLeft(modes[newMode].duration);
    };

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const updateSettings = (newSettings) => {
        setSettings(newSettings);
        // Cập nhật lại thời gian nếu đang ở chế độ tương ứng
        if (mode === 'work') {
            setTimeLeft(newSettings.workTime * 60);
        } else if (mode === 'shortBreak') {
            setTimeLeft(newSettings.shortBreak * 60);
        } else if (mode === 'longBreak') {
            setTimeLeft(newSettings.longBreak * 60);
        }
    };

    const progress = ((modes[mode].duration - timeLeft) / modes[mode].duration) * 100;
    const circumference = 2 * Math.PI * 45;
    const strokeDashoffset = circumference - (progress / 100) * circumference;
    const currentMode = modes[mode];
    const Icon = currentMode.icon;

    return (
        <div className="pomodoro-app">
            <div className="container">
                {/* Header */}
                <div className="header">
                    <h1>Pomodoro Timer</h1>
                    <button
                        className="settings-btn"
                        onClick={() => setShowSettings(!showSettings)}
                    >
                        <Settings size={20} />
                    </button>
                </div>

                {/* Settings Panel */}
                {showSettings && (
                    <div className="settings-panel">
                        <h3>Cài đặt</h3>
                        <div className="settings-grid">
                            <div className="setting-group">
                                <label>Thời gian làm việc (phút)</label>
                                <input
                                    type="number"
                                    value={settings.workTime}
                                    onChange={(e) => updateSettings({ ...settings, workTime: parseInt(e.target.value) })}
                                    min="1"
                                    max="60"
                                />
                            </div>
                            <div className="setting-group">
                                <label>Nghỉ ngắn (phút)</label>
                                <input
                                    type="number"
                                    value={settings.shortBreak}
                                    onChange={(e) => updateSettings({ ...settings, shortBreak: parseInt(e.target.value) })}
                                    min="1"
                                    max="30"
                                />
                            </div>
                            <div className="setting-group">
                                <label>Nghỉ dài (phút)</label>
                                <input
                                    type="number"
                                    value={settings.longBreak}
                                    onChange={(e) => updateSettings({ ...settings, longBreak: parseInt(e.target.value) })}
                                    min="1"
                                    max="60"
                                />
                            </div>
                        </div>
                    </div>
                )}

                {/* Mode Tabs */}
                <div className="mode-tabs">
                    {Object.entries(modes).map(([key, modeInfo]) => (
                        <button
                            key={key}
                            className={`tab ${mode === key ? 'active' : ''}`}
                            onClick={() => switchMode(key)}
                        >
                            {modeInfo.label}
                        </button>
                    ))}
                </div>

                {/* Timer Display */}
                <div className={`timer-display ${isActive ? 'active' : ''}`}>
                    <div className="timer-circle">
                        <svg viewBox="0 0 100 100">
                            <circle
                                cx="50"
                                cy="50"
                                r="45"
                                className="bg-circle"
                            />
                            <circle
                                cx="50"
                                cy="50"
                                r="45"
                                className="progress-circle"
                                style={{
                                    strokeDasharray: circumference,
                                    strokeDashoffset: strokeDashoffset
                                }}
                            />
                        </svg>
                        <div className="timer-content">
                            <Icon size={10} className="timer-icon" />
                            <div className="timer-time">{formatTime(timeLeft)}</div>
                            <div className="timer-mode">{currentMode.label}</div>
                        </div>
                    </div>
                </div>

                {/* Controls */}
                <div className="controls">
                    <button className="control-btn play-pause" onClick={toggleTimer}>
                        {isActive ? <Pause size={32} /> : <Play size={32} />}
                    </button>
                    <button className="control-btn reset" onClick={resetTimer}>
                        <RotateCcw size={24} />
                    </button>
                </div>

                {/* Session Counter */}
                <div className="session-counter">
                    <div className="counter-label">Phiên đã hoàn thành</div>
                    <div className="counter-value">{sessions}</div>
                </div>
            </div>
        </div>
    );
};

export default Pomodoro;