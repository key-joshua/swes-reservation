"use client"

import { useNavigate } from "react-router-dom";
import { useState, useEffect, useMemo } from "react"

import Navbar from "../Components/Navbar"
import { getReservations } from "../Libs/apis"
import LoadingSpinner from "../Components/LoadingSpinner"
import { getUnavailableDatesFromReservations, isDateAvailable, isToday, isPastDate, DAYS, MONTHS } from "../Libs/utils"


export default function CalendarPage() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true)
  const [reservations, setReservations] = useState([])
  const [currentDate, setCurrentDate] = useState(new Date())

  useEffect(() => {
    const fetchReservations = async () => {
      setIsLoading(true)
      await new Promise((resolve) => setTimeout(resolve, 1000))

      const response = getReservations()
      if (response.success) setReservations(response.data)
      setIsLoading(false)
    }

    fetchReservations()
  }, [])

  const unavailableDates = useMemo(() => {
    const dates = getUnavailableDatesFromReservations(reservations)
    return dates
  }, [reservations])

  const calendarData = useMemo(() => {
    const year = currentDate.getFullYear()
    const month = currentDate.getMonth()

    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)

    const startDate = new Date(firstDay)
    startDate.setDate(startDate.getDate() - firstDay.getDay())

    const endDate = new Date(lastDay)
    endDate.setDate(endDate.getDate() + (6 - lastDay.getDay()))

    const days = []
    const currentDay = new Date(startDate)

    while (currentDay <= endDate) {
      days.push(new Date(currentDay))
      currentDay.setDate(currentDay.getDate() + 1)
    }

    return days
  }, [currentDate])

  const navigateMonth = (direction) => {
    setCurrentDate((prev) => {
      const newDate = new Date(prev)
      if (direction === "prev") {
        newDate.setMonth(newDate.getMonth() - 1)
      } else {
        newDate.setMonth(newDate.getMonth() + 1)
      }
      return newDate
    })
  }

  const handleDateClick = (date) => {
    const isCurrentMonth = date.getMonth() === currentDate.getMonth()
    const isAvailable = isDateAvailable(date, unavailableDates)
    const isPast = isPastDate(date)

    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, "0")
    const day = String(date.getDate()).padStart(2, "0")
    const dateString = `${year}-${month}-${day}`

    if (isCurrentMonth && isAvailable && !isPast) navigate(`/reservation?date=${dateString}`);
  }

  const getDateStyles = (date) => {
    const isCurrentMonth = date.getMonth() === currentDate.getMonth()
    const isAvailable = isDateAvailable(date, unavailableDates)
    const isPast = isPastDate(date)
    const isTodayDate = isToday(date)

    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, "0")
    const day = String(date.getDate()).padStart(2, "0")
    const dateString = `${year}-${month}-${day}`

    if (isCurrentMonth && date.getDate() <= 5) {
      console.log(`Styling date ${dateString}:`, { isCurrentMonth, isAvailable, isPast, isTodayDate, inUnavailableList: unavailableDates.includes(dateString)})
    }

    let baseStyles = "w-10 h-10 flex items-center justify-center text-sm font-medium rounded-lg transition-all duration-200 "

    if (isTodayDate && isCurrentMonth) {
      return baseStyles + "bg-blue-100 text-blue-700 font-semibold border border-blue-300"
    } if (!isCurrentMonth) {
      baseStyles += "text-gray-300 cursor-default "
    } else if (isPast) {
      baseStyles += "text-gray-500 bg-gray-200 cursor-not-allowed border border-gray-300 "
    } else if (!isAvailable) {
      baseStyles += "text-red-700 bg-red-100 cursor-not-allowed border border-red-300 font-semibold "
    } else { baseStyles += "text-green-700 bg-green-100 hover:bg-green-200 cursor-pointer border border-green-200 hover:border-green-300 hover:shadow-sm " }

    return baseStyles
  }

  const formatHeaderDate = () => {
    const month = MONTHS[currentDate.getMonth()]
    const year = currentDate.getFullYear()
    return `${month} ${year}`
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex items-center justify-center h-96"> <LoadingSpinner size="lg" /> </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="mt-16 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Calendar View</h1>
          <p className="text-gray-600 mt-2">View available dates for equipment reservations</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
            <div className="flex items-center justify-between">
              <div className="flex flex-wrap items-center gap-4 text-sm">
                <div className="flex items-center space-x-2"> <div className="w-4 h-4 bg-gray-200 border border-gray-300 rounded"></div> <span className="text-gray-500 font-medium">Past</span> </div>
                <div className="flex items-center space-x-2"> <div className="w-4 h-4 bg-blue-100 border border-blue-300 rounded"></div> <span className="text-blue-700 font-medium">Today</span> </div>
                <div className="flex items-center space-x-2"> <div className="w-4 h-4 bg-green-100 border border-green-200 rounded"></div> <span className="text-green-700 font-medium">Available</span> </div>
                <div className="flex items-center space-x-2"> <div className="w-4 h-4 bg-red-100 border border-red-200 rounded"></div> <span className="text-red-700 font-medium">Unavailable</span> </div>
              </div>

              <div className="flex items-center">
                <button onClick={() => navigateMonth("prev")} className="p-2 rounded-md hover:bg-gray-200 transition-colors duration-200" > <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"> <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /> </svg> </button>
                <div className="mx-4"> <h2 className="text-lg font-semibold text-gray-900">{formatHeaderDate()}</h2> </div>
                <button onClick={() => navigateMonth("next")} className="p-2 rounded-md hover:bg-gray-200 transition-colors duration-200" > <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"> <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /> </svg> </button>
              </div>
            </div>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-7 gap-1 mb-4">
              {DAYS.map((day) => (
                <div key={day} className="h-10 flex items-center justify-center">
                  <span className="text-sm font-medium text-gray-500">{day}</span>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-1">
              {calendarData.map((date, index) => {
                const isAvailable = isDateAvailable(date, unavailableDates)
                const isCurrentMonth = date.getMonth() === currentDate.getMonth()

                return (
                  <div key={index} className="relative">
                    <button className={getDateStyles(date)} onClick={() => handleDateClick(date)} disabled={!isCurrentMonth || !isAvailable || isPastDate(date)} > {date.getDate()} </button>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-center">
          <button onClick={() => navigate(`/reservation`)} className="inline-flex items-center justify-center px-6 py-3 bg-yellow-500 hover:bg-yellow-600 text-white font-semibold rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 transition-colors duration-200" >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"> <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /> </svg>
            Make New Reservation
          </button>
        </div>
      </div>
    </div>
  )
}
