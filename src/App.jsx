import './App.css'
import BoardHeader from './components/BoardHeader/BoardHeader'
import BoardContent from './components/BoardContent/BoardContent'
import AppHeader from './components/AppHeader/AppHeader'
import "./style.scss";
import React, { useCallback, useEffect, useMemo, useState } from 'react';


function App() {
  const [count, setCount] = useState(0);

  const handleClick = useCallback(() => {
    console.log("Clicked"); setCount(n => n + 1)
  }, []);




  return (
    <>
      <div className='trello-container'>
        <AppHeader />
        <BoardHeader />
        <BoardContent />
      </div>
    </>
  )
}

export default App
