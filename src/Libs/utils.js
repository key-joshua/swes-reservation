export function getUnavailableDatesFromReservations(reservations) {
  const unavailableDates = []

  reservations.forEach((reservation) => {
    const startDate = new Date(reservation.reservationStartDate)
    const endDate = new Date(reservation.reservationEndDate)

    const currentDate = new Date(startDate)

    while (currentDate <= endDate) {
      const year = currentDate.getFullYear()
      const month = String(currentDate.getMonth() + 1).padStart(2, "0")
      const day = String(currentDate.getDate()).padStart(2, "0")
      const dateString = `${year}-${month}-${day}`

      unavailableDates.push(dateString)
      currentDate.setDate(currentDate.getDate() + 1)
    }
  })

  return [...new Set(unavailableDates)].sort()
}

export function isDateAvailable(date, unavailableDates) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, "0")
  const day = String(date.getDate()).padStart(2, "0")
  const dateString = `${year}-${month}-${day}`

  return !unavailableDates.includes(dateString)
}

export function isToday(date) {
  const today = new Date()
  return date.toDateString() === today.toDateString()
}

export function isPastDate(date) {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  return date < today
}

export const DAYS = [
    "Sun",
    "Mon",
    "Tue",
    "Wed",
    "Thu",
    "Fri",
    "Sat"
]

export const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
]
