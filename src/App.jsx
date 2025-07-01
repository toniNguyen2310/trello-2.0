import './App.css'
import BoardHeader from './components/BoardHeader/BoardHeader'
import BoardContent from './components/BoardContent/BoardContent'
import AppHeader from './components/AppHeader/AppHeader'
import "./style.scss";


function App() {

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
