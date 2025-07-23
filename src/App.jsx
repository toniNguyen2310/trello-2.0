import { BrowserRouter, Routes, Route } from "react-router-dom"
import './App.css'
import "./style.scss";
import 'antd/dist/reset.css'
import Board from './components/Board/Board';
import NotFound from "./components/Layout/NotFound";
import Signup from "./components/Auth/Signup";
import Login from "./components/Auth/Login";
import NavbarOnlyLayout from "./components/Layout/NavbarOnlyLayout";
import FullLayout from "./components/Layout/FullLayout";
import { AuthProvider } from './contexts/AuthContext'
import ListBoard from "./components/ListBoard/ListBoard";
import InforCard from "./components/Card Detail/InforCard";
import Pomodoro from "./components/Pomodoro/Pomodoro";
import User from "./components/User/User";
import ProtectedRoute from "@components/routes/ProtectedRoute";




function App() {

  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route element={<ProtectedRoute />}>

            <Route path="/" element={<FullLayout />}>
              <Route index element={<ListBoard />} />
              <Route path="/pomodoro" element={<Pomodoro />} />
            </Route>


            <Route element={<NavbarOnlyLayout />}>
              <Route path="/board/:boardId" element={<Board />}>
                <Route path="card/:id" element={<InforCard />} />
              </Route>
            </Route>

            <Route path="/user/:userId" element={<User />} />

          </Route>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="*" element={<NotFound />} />

        </Routes>
      </AuthProvider>
    </BrowserRouter >
  )
}

export default App
