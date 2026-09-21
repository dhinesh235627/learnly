import { Route, Routes } from "react-router-dom"
import ChatWidget from "./components/ChatWidget"
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
        <Route path="/home" element={<Home />} />
        <Route path="/course/:id" element={<CourseDetail />} />
        <Route path="/learn/:courseId/:lectureId" element={<Learn />} />
        <Route path="/wishlist" element={<Wishlist />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/teach" element={<Teach />} />
        <Route path="/business" element={<Business />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
      <ChatWidget />
    </>
  )
}

export default App
