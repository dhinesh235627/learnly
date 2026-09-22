import { Route, Routes } from "react-router-dom"
import ChatWidget from "./components/ChatWidget"
import RequireAuth from "./components/RequireAuth"
import Business from "./pages/Business"
import Cart from "./pages/Cart"
import CourseDetail from "./pages/CourseDetail"
import Home from "./pages/Home"
import Landing from "./pages/Landing"
import Learn from "./pages/Learn"
import Login from "./pages/Login"
import Profile from "./pages/Profile"
import Teach from "./pages/Teach"
import Wishlist from "./pages/Wishlist"

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/home" element={<RequireAuth><Home /></RequireAuth>} />
        <Route path="/course/:id" element={<RequireAuth><CourseDetail /></RequireAuth>} />
        <Route path="/learn/:courseId/:lectureId" element={<RequireAuth><Learn /></RequireAuth>} />
        <Route path="/wishlist" element={<RequireAuth><Wishlist /></RequireAuth>} />
        <Route path="/cart" element={<RequireAuth><Cart /></RequireAuth>} />
        <Route path="/teach" element={<Teach />} />
        <Route path="/business" element={<Business />} />
        <Route path="/profile" element={<RequireAuth><Profile /></RequireAuth>} />
      </Routes>
      <ChatWidget />
    </>
  )
}

export default App
