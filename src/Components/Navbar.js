import { Link, useLocation } from "react-router-dom"

const Navbar = () => {
  const location = useLocation()

  return (
    <nav className="bg-white shadow-lg border-b-2 border-yellow-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2"> <div className="w-8 h-8 bg-yellow-400 rounded-lg flex items-center justify-center"> <span className="text-white font-bold text-lg">S</span> </div> <span className="text-xl font-bold text-gray-800">SWES</span> </Link>
          </div>

          <div className="flex items-center space-x-8">
            <Link to="/" className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${ location.pathname === "/" ? "text-yellow-600 bg-yellow-50" : "text-gray-700 hover:text-yellow-600 hover:bg-yellow-50" }`} > Home </Link>
            <Link to="/reservation" className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${ location.pathname === "/reservation" ? "text-yellow-600 bg-yellow-50" : "text-gray-700 hover:text-yellow-600 hover:bg-yellow-50" }`} > Reservation </Link>
            <Link to="/equipment-history" className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${ location.pathname === "/equipment-history" ? "text-yellow-600 bg-yellow-50" : "text-gray-700 hover:text-yellow-600 hover:bg-yellow-50" }`} > Equip-History </Link>
            <Link to="/calendar" className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${ location.pathname === "/calendar" ? "text-yellow-600 bg-yellow-50" : "text-gray-700 hover:text-yellow-600 hover:bg-yellow-50" }`} > Calendar </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
