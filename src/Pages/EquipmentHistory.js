"use client"

import { useState, useEffect, useMemo } from "react"

import Navbar from "../Components/Navbar"
import { getReservations } from "../Libs/apis"
import LoadingSpinner from "../Components/LoadingSpinner"

const StatusDisplay = (reservationStatus) => {
    const status = reservationStatus.status || "unknown"
    const getStatusConfig = (status) => {
        switch (status.toLowerCase()) {
        case "returned":
            return {
            bgColor: "bg-green-100",
            textColor: "text-green-800",
            borderColor: "border-green-200",
            icon: (<svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20"> <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /> </svg>),
            }
        case "pending":
            return {
            bgColor: "bg-yellow-100",
            textColor: "text-yellow-800",
            borderColor: "border-yellow-200",
            icon: (<svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20"> <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" /> </svg>),
            }
        case "overdue":
            return {
            bgColor: "bg-red-100",
            textColor: "text-red-800",
            borderColor: "border-red-200",
            icon: (<svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20"> <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" /> </svg>),
            }
        default:
            return {
            bgColor: "bg-gray-100",
            textColor: "text-gray-800",
            borderColor: "border-gray-200",
            icon: (<svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20"> <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" /> </svg>),
            }
        }
    }

    const config = getStatusConfig(status)
    return (<span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${config.bgColor} ${config.textColor} ${config.borderColor}`} > {config.icon} {status} </span>)
}

const EquipmentHistoryPage = () =>{
    const [sortField, setSortField] = useState("id")
    const [isLoading, setIsLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState("")
    const [currentPage, setCurrentPage] = useState(1)
    const [itemsPerPage, setItemsPerPage] = useState(10)
    const [statusFilter, setStatusFilter] = useState([])
    const [reservations, setReservations] = useState([])
    const [endDateFilter, setEndDateFilter] = useState("")
    const [itemTypeFilter, setItemTypeFilter] = useState("")
    const [startDateFilter, setStartDateFilter] = useState("")
    const [sortDirection, setSortDirection] = useState("desc")

    useEffect(() => {
        const fetchReservations = async () => {
            setIsLoading(true)
            await new Promise((resolve) => setTimeout(resolve, 1000))

            const response = getReservations()
            if (response.success) { setReservations(response.data) }
            setIsLoading(false)
        }

        fetchReservations()
    }, [])

    const itemTypes = useMemo(() => {
        const types = [...new Set(reservations.map((r) => r.itemName))]
        return types.sort()
    }, [reservations])

    const filteredAndSortedReservations = useMemo(() => {
        const filtered = reservations.filter((reservation) => {
        const searchMatch =
            searchTerm === "" ||
            reservation.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            reservation.itemName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            reservation.employeeID.toLowerCase().includes(searchTerm.toLowerCase())

        const statusMatch = statusFilter.length === 0 || statusFilter.includes(reservation.status)

        const startDate = startDateFilter ? new Date(startDateFilter) : null
        const endDate = endDateFilter ? new Date(endDateFilter) : null
        const reservationDate = new Date(reservation.reservationStartDate)
        const dateMatch = (!startDate || reservationDate >= startDate) && (!endDate || reservationDate <= endDate)

        const itemMatch = itemTypeFilter === "" || reservation.itemName === itemTypeFilter

        return searchMatch && statusMatch && dateMatch && itemMatch
        })

        filtered.sort((a, b) => {
        let aValue = a[sortField]
        let bValue = b[sortField]

        if (sortField.includes("Date") || sortField === "submittedAt") {
            aValue = new Date(aValue).getTime()
            bValue = new Date(bValue).getTime()
        }

        if (aValue < bValue) return sortDirection === "asc" ? -1 : 1
        if (aValue > bValue) return sortDirection === "asc" ? 1 : -1
        return 0
        })

        return filtered
    }, [reservations, searchTerm, statusFilter, startDateFilter, endDateFilter, itemTypeFilter, sortField, sortDirection])

    const totalPages = Math.ceil(filteredAndSortedReservations.length / itemsPerPage)
    const paginatedReservations = filteredAndSortedReservations.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

    const handleSort = (field) => {
        if (sortField === field) {
        setSortDirection(sortDirection === "asc" ? "desc" : "asc")
        } else {
        setSortField(field)
        setSortDirection("asc")
        }
    }

    const handleStatusFilterChange = (status) => {
        setStatusFilter((prev) => (prev.includes(status) ? prev.filter((s) => s !== status) : [...prev, status]))
        setCurrentPage(1)
    }

    const clearFilters = () => {
        setSearchTerm("")
        setStatusFilter([])
        setStartDateFilter("")
        setEndDateFilter("")
        setItemTypeFilter("")
        setCurrentPage(1)
    }

    if (isLoading) {
        return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <div className="flex items-center justify-center h-96">
            <LoadingSpinner size="lg" />
            </div>
        </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />

            <div className="mt-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Equipment History</h1>
                    <p className="text-gray-600 mt-2">View and manage equipment reservations and status</p>
                </div>

                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"> <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"> <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /> </svg> </div>
                            <input type="text" placeholder="Search employees or items..." value={searchTerm} onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1) }} className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-yellow-500 focus:border-yellow-500" />
                        </div>

                        <select value={itemTypeFilter} onChange={(e) => { setItemTypeFilter(e.target.value); setCurrentPage(1) }} className="block w-full px-3 py-2 border border-gray-300 rounded-md leading-5 bg-white focus:outline-none focus:ring-1 focus:ring-yellow-500 focus:border-yellow-500" >
                        <option value="">All Items</option>
                        {itemTypes.map((type) => ( <option key={type} value={type}> {type} </option> ))}
                        </select>

                        <input type="date" placeholder="Start Date" value={startDateFilter} onChange={(e) => { setStartDateFilter(e.target.value); setCurrentPage(1) }} className="block w-full px-3 py-2 border border-gray-300 rounded-md leading-5 bg-white focus:outline-none focus:ring-1 focus:ring-yellow-500 focus:border-yellow-500" />
                        <input type="date" placeholder="End Date" value={endDateFilter} onChange={(e) => { setEndDateFilter(e.target.value); setCurrentPage(1) }} className="block w-full px-3 py-2 border border-gray-300 rounded-md leading-5 bg-white focus:outline-none focus:ring-1 focus:ring-yellow-500 focus:border-yellow-500" />
                    </div>

                    <div className="flex flex-wrap gap-4 mb-4">
                        <span className="text-sm font-medium text-gray-700">Status:</span>
                        {["Pending", "Returned", "Overdue"].map((status) => (
                            <label key={status} className="flex items-center">
                                <input type="checkbox" checked={statusFilter.includes(status)} onChange={() => handleStatusFilterChange(status)} className="h-4 w-4 text-yellow-600 focus:ring-yellow-500 border-gray-300 rounded" />
                                <span className="ml-2 text-sm text-gray-700">{status}</span>
                            </label>
                        ))}
                    </div>

                    <button onClick={clearFilters} className="text-sm text-yellow-600 hover:text-yellow-700 font-medium"> Clear all filters </button>
                </div>

                <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                    <div className="px-6 py-3 border-b border-gray-200 bg-gray-50">
                        <div className="flex items-center justify-between">
                        <h3 className="text-lg font-medium text-gray-900"> Reservations ({filteredAndSortedReservations.length}) </h3>
                        <div className="flex items-center space-x-2">
                            <span className="text-sm text-gray-700">Show:</span>
                            <select value={itemsPerPage} onChange={(e) => { setItemsPerPage(Number(e.target.value)); setCurrentPage(1) }} className="text-sm px-2 py-1  border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-yellow-500 focus:border-yellow-500" >
                                <option value={5}>5</option>
                                <option value={10}>10</option>
                                <option value={25}>25</option>
                                <option value={50}>50</option>
                            </select>
                        </div>
                        </div>
                    </div>

                    {paginatedReservations.length === 0 ? (
                        <div className="text-center py-12">
                            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"> <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /> </svg>
                            <h3 className="mt-2 text-sm font-medium text-gray-900">No reservations found</h3>
                            <p className="mt-1 text-sm text-gray-500">Try adjusting your search or filter criteria.</p>
                        </div>
                    ) : (
                        <>
                            <div className="hidden md:block overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th onClick={() => handleSort("id")} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100" >
                                                <div className="flex items-center space-x-1">
                                                    <span>ID</span>
                                                    {sortField === "id" && ( <svg className={`w-4 h-4 ${sortDirection === "asc" ? "transform rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" > <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /> </svg> )}
                                                </div>
                                            </th>
                                            <th onClick={() => handleSort("employeeName")} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100" >
                                                <div className="flex items-center space-x-1">
                                                    <span>Employee</span>
                                                    {sortField === "employeeName" && ( <svg className={`w-4 h-4 ${sortDirection === "asc" ? "transform rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" > <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /> </svg> )}
                                                </div>
                                            </th>
                                            <th onClick={() => handleSort("itemName")} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100" >
                                                <div className="flex items-center space-x-1">
                                                    <span>Item Name</span>
                                                    {sortField === "itemName" && ( <svg className={`w-4 h-4 ${sortDirection === "asc" ? "transform rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" > <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /> </svg> )}
                                                </div>
                                            </th>
                                            <th onClick={() => handleSort("reservationStartDate")} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100" >
                                                <div className="flex items-center space-x-1">
                                                    <span>Resv Start-Date</span>
                                                    {sortField === "reservationStartDate" && ( <svg className={`w-4 h-4 ${sortDirection === "asc" ? "transform rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" > <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /> </svg> )}
                                                </div>
                                            </th>
                                            <th onClick={() => handleSort("reservationEndDate")} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100" >
                                                <div className="flex items-center space-x-1">
                                                    <span>Resv End-Date</span>
                                                    {sortField === "reservationEndDate" && ( <svg className={`w-4 h-4 ${sortDirection === "asc" ? "transform rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" > <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /> </svg> )}
                                                </div>
                                            </th>
                                            <th onClick={() => handleSort("status")} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100" >
                                                <div className="flex items-center space-x-1">
                                                    <span>Status</span>
                                                    {sortField === "status" && ( <svg className={`w-4 h-4 ${sortDirection === "asc" ? "transform rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" > <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /> </svg> )}
                                                </div>
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"> Actions </th>
                                        </tr>
                                    </thead>

                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {paginatedReservations.map((reservation) => (
                                            <tr key={reservation.id} className="hover:bg-gray-50">
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                    #{reservation.id}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm font-medium text-gray-900">{reservation.employeeName}</div>
                                                    <div className="text-sm text-gray-500"> {reservation.employeeID} - {reservation.department} </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                    {reservation.itemName}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                    {new Date(reservation.reservationStartDate).toLocaleDateString('en-GB').replace(/\//g, '-')}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                    {new Date(reservation.reservationEndDate).toLocaleDateString('en-GB').replace(/\//g, '-')}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <StatusDisplay status={reservation.status} />
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                <button className="text-yellow-600 hover:text-yellow-900">
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"> <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /> <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /> </svg>
                                                </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            <div className="md:hidden">
                                {paginatedReservations.map((reservation) => (
                                    <div key={reservation.id} className="border-b border-gray-200 p-4">
                                        <div className="flex items-center justify-between mb-2">
                                            <h3 className="text-sm font-medium text-gray-900"> #{reservation.id} - {reservation.itemName} </h3>
                                            <StatusDisplay status={reservation.status} />
                                        </div>
                                        <div className="text-sm text-gray-600 space-y-1">
                                            <p>
                                                <span className="font-medium">Employee:</span> {reservation.employeeName}
                                            </p>
                                            <p>
                                                <span className="font-medium">Department:</span> {reservation.department}
                                            </p>
                                            <p>
                                                <span className="font-medium">Resv Start-Date:</span> {new Date(reservation.reservationStartDate).toLocaleDateString('en-GB').replace(/\//g, '-')}
                                            </p>
                                            <p>
                                                <span className="font-medium">Resv End-Date:</span> {new Date(reservation.reservationEndDate).toLocaleDateString('en-GB').replace(/\//g, '-')}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </>
                    )}

                    {totalPages > 1 && (
                        <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
                            <div className="flex-1 flex justify-between sm:hidden">
                                <button onClick={() => setCurrentPage(Math.max(1, currentPage - 1))} disabled={currentPage === 1} className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-bold rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed" > Previous </button>
                                <button onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))} disabled={currentPage === totalPages} className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-bold rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed" > Next </button>
                            </div>

                            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                                <div> <p className="text-sm text-gray-700"> Showing <span className="font-bold">{(currentPage - 1) * itemsPerPage + 1}</span> to <span className="font-bold"> {Math.min(currentPage * itemsPerPage, filteredAndSortedReservations.length)} </span> of <span className="font-bold">{filteredAndSortedReservations.length}</span> results </p> </div>
                                <div>
                                    <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                                        <button onClick={() => setCurrentPage(Math.max(1, currentPage - 1))} disabled={currentPage === 1} className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-bold text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed" >
                                            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"> <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /> </svg>
                                        </button>

                                        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                                            let pageNum
                                            if (totalPages <= 5) {
                                                pageNum = i + 1
                                            } else if (currentPage <= 3) {
                                                pageNum = i + 1
                                            } else if (currentPage >= totalPages - 2) {
                                                pageNum = totalPages - 4 + i
                                            } else {
                                                pageNum = currentPage - 2 + i
                                            }

                                            return (<button key={pageNum} onClick={() => setCurrentPage(pageNum)} className={`relative inline-flex items-center px-4 py-2 border text-sm font-bold ${ currentPage === pageNum ? "z-10 bg-yellow-50 border-yellow-500 text-yellow-600" : "bg-white border-gray-300 text-gray-500 hover:bg-gray-50" }`} > {pageNum} </button>)
                                        })}

                                        <button onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))} disabled={currentPage === totalPages} className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-bold text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed" >
                                            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"> <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /> </svg>
                                        </button>
                                    </nav>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default EquipmentHistoryPage
