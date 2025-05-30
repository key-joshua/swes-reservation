import { Link } from "react-router-dom"
import Navbar from "../Components/Navbar"

const MainPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-white">
      <Navbar />

      <div className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center fade-in">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Welcome to <span className="text-yellow-500">SWES</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Smart Workplace Equipment System - Streamline your equipment reservations with ease
            </p>

            <div className="slide-up">
              <Link
                to="/reservation"
                className="inline-flex items-center px-8 py-4 bg-yellow-500 hover:bg-yellow-600 text-white font-semibold rounded-lg shadow-lg transform transition-all duration-200 hover:scale-105 pulse-animation"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                Make a Reservation
              </Link>
            </div>
          </div>
        </div>

        <div className="absolute top-20 left-10 w-20 h-20 bg-yellow-200 rounded-full opacity-20 animate-bounce"></div>
        <div className="absolute top-40 right-20 w-16 h-16 bg-yellow-300 rounded-full opacity-30 animate-pulse"></div>
        <div
          className="absolute bottom-20 left-1/4 w-12 h-12 bg-yellow-400 rounded-full opacity-25 animate-bounce"
          style={{ animationDelay: "1s" }}
        ></div>
      </div>

      <div className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 slide-up">
            <h2 className="text-3xl md:text-4xl font-bold text-yellow-600 mb-4">STAFF WEAR & EQUIPMENT SCHEDULER</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Our system makes equipment reservation simple, efficient, and transparent
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6 rounded-lg hover:shadow-lg transition-shadow duration-300 slide-up">
              <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Fast & Easy</h3>
              <p className="text-gray-600">Quick reservation with intuitive interface</p>
            </div>

            <div
              className="text-center p-6 rounded-lg hover:shadow-lg transition-shadow duration-300 slide-up"
              style={{ animationDelay: "0.2s" }}
            >
              <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Reliable</h3>
              <p className="text-gray-600">Secure and dependable equipment tracking</p>
            </div>

            <div
              className="text-center p-6 rounded-lg hover:shadow-lg transition-shadow duration-300 slide-up"
              style={{ animationDelay: "0.4s" }}
            >
              <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">24/7 Available</h3>
              <p className="text-gray-600">Make reservations anytime, anywhere</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MainPage
