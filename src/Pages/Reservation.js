"use client"

import { useState, useEffect } from "react"
import { useLocation } from "react-router-dom"
import { useNavigate } from "react-router-dom"

import Navbar from "../Components/Navbar"
import LoadingSpinner from "../Components/LoadingSpinner"
import { getEmployee, getItems, sendEmailNotification, submitReservation } from "../Libs/apis"

const useQuery = () => {
  const { search } = useLocation();
  return new URLSearchParams(search);
}

const Reservation = () => {
  const query = useQuery();
  const navigate = useNavigate();
  const prefilledDate = query.get("date");
  const [formData, setFormData] = useState({
    itemId: "",
    employeeID: "",
    reservationDate: "",
    reservationStartDate: "",
    reservationEndDate: "",
  })

  const [errors, setErrors] = useState({})
  const [items, setItems] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [employeeData, setEmployeeData] = useState(null)
  const [submittedData, setSubmittedData] = useState(null)
  const [showEmailSection, setShowEmailSection] = useState(true)
  const [emailStatus, setEmailStatus] = useState({ status: "idle", message: "" })

  useEffect(() => {
    if (prefilledDate) setFormData((prev) => ({ ...prev, reservationStartDate: prefilledDate, }))
  }, [prefilledDate])

  useEffect(() => {
    if (emailStatus.status === "success" || emailStatus.status === "error") {
      const timer = setTimeout(() => { setShowEmailSection(false) }, 5000)
      return () => clearTimeout(timer)
    }
  }, [emailStatus.status])

  useEffect(() => {
    const itemsResponse = getItems()
    if (itemsResponse.success) {
      setItems(itemsResponse.data)
    }
  }, [])

  const validateEmployeeID = (employeeID) => {
    if (!employeeID.trim()) {
      return "Employee ID is required"
    }

    const response = getEmployee(employeeID)
    if (!response.success) {
      return "Employee ID provided does not exist."
    }

    setEmployeeData(response.data)
    return ""
  }

  const validateForm = () => {
    const newErrors = {}

    const employeeError = validateEmployeeID(formData.employeeID)
    if (employeeError) {
      newErrors.employeeID = employeeError
    }

    if (!formData.itemId) {
      newErrors.itemId = "Please select an item"
    }

    if (!formData.reservationStartDate) {
      newErrors.reservationStartDate = "Reservation start date is required"
    } else {
      const selectedDate = new Date(formData.reservationStartDate)
      const today = new Date()
      today.setHours(0, 0, 0, 0)

      if (selectedDate < today) {
        newErrors.reservationStartDate = "Cannot select past dates"
      }
    }

    if (!formData.reservationEndDate) {
      newErrors.reservationEndDate = "Reservation end date is required"
    } else if (formData.reservationStartDate && formData.reservationEndDate) {
      const startDate = new Date(formData.reservationStartDate)
      const endDate = new Date(formData.reservationEndDate)

      if (endDate <= startDate) {
        newErrors.reservationEndDate = "End date must be after start date"
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleInputChange = (event) => {
    const { name, value } = event.target

    if (name === "reservationStartDate") {
      const newStartDate = new Date(value)
      const currentEndDate = formData.reservationEndDate ? new Date(formData.reservationEndDate) : null
      const shouldClearEndDate = currentEndDate && currentEndDate <= newStartDate

      setFormData((prev) => ({
        ...prev,
        [name]: value,
        reservationEndDate: shouldClearEndDate ? "" : prev.reservationEndDate,
      }))
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }))
    }

    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }))

    if (name === "employeeID" && value.trim()) {
      const response = getEmployee(value)
      if (response.success) {
        setEmployeeData(response.data)
      } else {
        setEmployeeData(null)
      }
    }
  }

  const retryEmailNotification = async () => {
    if (!submittedData) return
    setShowEmailSection(true)
    setEmailStatus({ status: "sending", message: "Retrying email notification..." })

    try {
      const emailResponse = await sendEmailNotification(submittedData)
      setEmailStatus({ status: "success", message: emailResponse.message, details: emailResponse.emailDetails, })
    } catch (error) {
      setEmailStatus({ status: "error", message: error.message || "Failed to send email notification", })
    }
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    if (!validateForm()) return;
    setIsLoading(true)

    try {
      const employeeResponse = getEmployee(formData.employeeID.trim())
      const selectedItem = items.find((item) => item.id === Number.parseInt(formData.itemId))
      const reservationData = { employee: employeeResponse.data, item: selectedItem, reservationStartDate: formData.reservationStartDate, reservationEndDate: formData.reservationEndDate }      
      
      const response = await submitReservation(reservationData)
      if (response.success) {
        setSubmittedData(response.data)
        setIsSubmitted(true)

        setEmailStatus({ status: "sending", message: "Sending confirmation email..." })
        try {
          const emailResponse = await sendEmailNotification(response.data)
          setEmailStatus({ status: "success", message: emailResponse.message, details: emailResponse.emailDetails, })
        } catch (emailError) {
          setEmailStatus({ status: "error", message: emailError.message || "Failed to send confirmation email", })
        }

        setFormData({ itemId: "", employeeID: "", reservationStartDate: "", reservationEndDate: "" })
        setEmployeeData(null)
        setErrors({})
      }
    } catch (error) {
      console.error("Submission error:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const resetForm = () => {
    setIsSubmitted(false)
    setSubmittedData(null)
    navigate(`/reservation`)
    setShowEmailSection(true)
    setEmailStatus({ status: "idle", message: "" })
    setFormData((prev) => ({ ...prev, reservationStartDate: "" }))
  }

  const getMinDate = () => {
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    return tomorrow.toISOString().split("T")[0]
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="mt-16 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="bg-gradient-to-r from-yellow-400 to-yellow-500 px-6 py-4">
            <div className="flex items-center">
              <svg className="w-6 h-6 text-white mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"> <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /> </svg>
              <h1 className="text-2xl font-bold text-white">Equipment Reservation</h1>
            </div>
          </div>

          <div className="p-12">
            {!isSubmitted ? (
              <form onSubmit={handleSubmit} className="space-y-10">
                <div className="grid md:grid-cols-2 gap-6">

                  <div>
                    <label htmlFor="employeeID" className="flex items-center text-sm font-medium text-gray-700 mb-2">
                      <svg className="w-4 h-4 text-yellow-500 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" > <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /> </svg>
                      Employee ID
                    </label>
                    <input type="text" id="employeeID" name="employeeID" value={formData.employeeID} onChange={handleInputChange} placeholder="Enter employee ID (e.g., IT-3049)" className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 ${ errors.employeeID ? "border-red-500" : "border-gray-300" }`} />
                    {errors.employeeID && <p className="mt-1 text-sm text-red-500">{errors.employeeID}</p>}
                    {employeeData && !errors.employeeID && ( <div className="mt-2 p-2 bg-green-50 border border-green-200 rounded-md"> <p className="text-sm text-green-700"> ✓ {employeeData.name} - {employeeData.department} </p> </div> )}
                  </div>

                  <div>
                    <label htmlFor="itemId" className="flex items-center text-sm font-medium text-gray-700 mb-2">
                      <svg className="w-4 h-4 text-yellow-500 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" > <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /> </svg>
                      Item Selection
                    </label>
                    <select id="itemId" name="itemId" value={formData.itemId} onChange={handleInputChange} className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 ${ errors.itemId ? "border-red-500" : "border-gray-300" }`} >
                      <option value="">Select an item</option>
                      {items.map((item) => ( <option key={item.id} value={item.id}> {item.name} </option> ))}
                    </select>
                    {errors.itemId && <p className="mt-1 text-sm text-red-500">{errors.itemId}</p>}
                  </div>

                </div>

                <div className="grid md:grid-cols-2 gap-6">

                  <div>
                    <label htmlFor="reservationStartDate" className="flex items-center text-sm font-medium text-gray-700 mb-2" >
                      <svg className="w-4 h-4 text-yellow-500 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" > <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /> </svg>
                      Reservation Start Date
                    </label>
                    <input type="date" id="reservationStartDate" name="reservationStartDate" value={formData.reservationStartDate} onChange={handleInputChange} min={getMinDate()} className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 ${ errors.reservationStartDate ? "border-red-500" : "border-gray-300" }`} />
                    {errors.reservationStartDate && ( <p className="mt-1 text-sm text-red-500">{errors.reservationStartDate}</p> )}
                  </div>

                  <div>
                    <label htmlFor="reservationEndDate" className="flex items-center text-sm font-medium text-gray-700 mb-2" >
                      <svg className="w-4 h-4 text-yellow-500 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" > <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /> </svg>
                      Reservation End Date
                    </label>
                    <input type="date" id="reservationEndDate" name="reservationEndDate" value={formData.reservationEndDate} onChange={handleInputChange} min={ formData.reservationStartDate ? new Date(new Date(formData.reservationStartDate).getTime() + 24 * 60 * 60 * 1000).toISOString().split("T")[0] : getMinDate() } className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 ${ errors.reservationEndDate ? "border-red-500" : "border-gray-300" }`} />
                    {errors.reservationEndDate && ( <p className="mt-1 text-sm text-red-500">{errors.reservationEndDate}</p> )}
                  </div>

                </div>

                <div className="flex justify-end">
                  <button type="submit" disabled={isLoading} className="inline-flex items-center px-6 py-3 bg-yellow-500 hover:bg-yellow-600 disabled:bg-yellow-300 text-white font-semibold rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 transition-colors duration-200" >
                    {isLoading ? ( <> <LoadingSpinner size="sm" /> <span className="ml-2">Processing...</span> </> ) : ( <> <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"> <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /> </svg> Submit Reservation </> )}
                  </button>
                </div>
              </form>
            ) : (
              <div className="text-center">
                <div className="mb-6">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Reservation Submitted Successfully!</h2>
                  <p className="text-gray-600">Your equipment reservation has been processed.</p>
                </div>

                {showEmailSection && (
                  <div className="mb-6 transition-all duration-500 ease-in-out">
                    {emailStatus.status === "success" && (
                      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                        <div className="flex items-center justify-center mb-2">
                          <svg
                            className="w-5 h-5 text-green-600 mr-2"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          <span className="text-green-700 font-medium">{emailStatus.message}</span>
                        </div>
                        {emailStatus.details && (
                          <div className="text-sm text-green-600">
                            <p>📧 Sent to: {emailStatus.details.to}</p>
                            <p>📋 Subject: {emailStatus.details.subject}</p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}

                <div className="mb-6 transition-all duration-500 ease-in-out">
                  {emailStatus.status === "sending" && (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                      <div className="flex items-center justify-center">
                        <LoadingSpinner size="sm" />
                        <span className="ml-2 text-yellow-700 font-medium">{emailStatus.message}</span>
                      </div>
                    </div>
                  )}

                  {emailStatus.status === "error" && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                      <div className="flex items-center justify-center mb-3">
                        <svg className="w-5 h-5 text-red-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" > <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /> </svg>
                        <span className="text-red-700 font-medium">{emailStatus.message}</span>
                      </div>
                      <button onClick={retryEmailNotification} disabled={emailStatus.status === "sending"} className="inline-flex items-center px-4 py-2 bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white text-sm font-medium rounded-md transition-colors duration-200" >
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"> <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /> </svg>
                        Retry Email
                      </button>
                    </div>
                  )}
                </div>

                {submittedData && (
                  <div className="bg-gray-50 rounded-lg p-6 mb-6 text-left">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Reservation Details</h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-600">Employee</p>
                        <p className="font-medium">{submittedData.employeeName}</p>
                        <p className="text-sm text-gray-500"> {submittedData.employeeID} - {submittedData.department} </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Item</p>
                        <p className="font-medium">{submittedData.itemName}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Reservation Start-Date</p>
                        <p className="font-medium"> {new Date(submittedData.reservationStartDate).toLocaleDateString('en-GB').replace(/\//g, '-')} </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Reservation End-Date</p>
                        <p className="font-medium">{new Date(submittedData.reservationEndDate).toLocaleDateString('en-GB').replace(/\//g, '-')}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Status</p>
                        <p className="font-medium">{submittedData.status}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Submitted At</p>
                        <p className="font-medium">{new Date(submittedData.submittedAt).toLocaleString()}</p>
                      </div>
                    </div>
                  </div>
                )}

                <button onClick={resetForm} className="inline-flex items-center px-6 py-3 bg-yellow-500 hover:bg-yellow-600 text-white font-semibold rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 transition-colors duration-200" >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"> <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /> </svg>
                  Make Another Reservation
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Reservation
