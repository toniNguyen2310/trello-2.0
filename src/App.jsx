import { BrowserRouter, Routes, Route } from "react-router-dom"
import './App.css'
import "./style.scss";
import Board from './components/Board/Board';
import NotFound from "./components/Layout/NotFound";
import Signup from "./components/Auth/Signup";
import Login from "./components/Auth/Login";
import NavbarOnlyLayout from "./components/Layout/NavbarOnlyLayout";
import FullLayout from "./components/Layout/FullLayout";


import ListBoard from "./components/ListBoard/ListBoard";
import InforCard from "./components/Card/InforCard";
import Pomodoro from "./components/Pomodoro/Pomodoro";
import User from "./components/User/User";



function App() {

  return (
    <BrowserRouter>
      <Routes>
        {/* Các route có layout chung */}
        <Route path="/" element={<FullLayout />}>
          <Route index element={<ListBoard />} />
          <Route path="/pomodoro" element={<Pomodoro />} />
        </Route>

        {/* Route chỉ có Navbar */}
        <Route element={<NavbarOnlyLayout />}>
          <Route path="/board" element={<Board />}>
            <Route path="card" element={<InforCard />} />
          </Route>
        </Route>

        {/* Route không dùng layout */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/user" element={<User />} />
        {/* <Route path="/card" element={<InforCard />} /> */}
        <Route path="*" element={<NotFound />} />
      </Routes>


    </BrowserRouter>
  )
}

export default App
