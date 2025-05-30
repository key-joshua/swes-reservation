import { Routes, Route } from "react-router-dom"

import Home from "./Pages/Home"
import Reservation from "./Pages/Reservation"
import Calendar from "./Pages/Calendar"
import EquipmentHistory from "./Pages/EquipmentHistory"

const Router = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/reservation" element={<Reservation />} />
      <Route path="/equipment-history" element={<EquipmentHistory />} />
      <Route path="/calendar" element={<Calendar />} />
    </Routes>
  )
}

export default Router
