import { employees, items, reservations } from "./data"

let newReservations = []

export const getEmployee = (employeeID) => {
  const employee = employees.find((emp) => emp.employeeID === employeeID)
  if (!employee) {
    return { status: 404, success: false, message: "Employee not found." }
  }
  return { status: 200, success: true, data: employee }
}

export const getItems = () => {
  return { status: 200, success: true, data: items }
}

export const getReservations = () => {  
  const allReservations = [...reservations, ...newReservations]
  const sortedReservations = allReservations.sort((a, b) => b.id - a.id)
  return { status: 200, success: true, data: sortedReservations }
}

export const submitReservation = async (reservationData) => {
  await new Promise((resolve) => setTimeout(resolve, 2000))

  const existingReservations = getReservations().data
  const maxId = Math.max(...existingReservations.map((r) => r.id), 0)
  const newId = maxId + 1

  const submittedData = {
    id: newId,
    status: "Pending",
    employeeID: reservationData.employee.employeeID,
    employeeName: reservationData.employee.name,
    department: reservationData.employee.department,
    itemId: reservationData.item.id,
    itemName: reservationData.item.name,
    reservationStartDate: reservationData.reservationStartDate,
    reservationEndDate: reservationData.reservationEndDate,
    submittedAt: new Date().toISOString(),
  }

  newReservations.push(submittedData)

  return { status: 200, success: true, message: "Reservation submitted successfully", data: submittedData }
}

export const sendEmailNotification = async (reservationData) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const success = Math.random() < 0.4; 

      if (success) {
        resolve({
          status: 200,
          success: true,
          message: "Confirmation email sent successfully",
          emailDetails: { to: `${reservationData.employeeName.toLowerCase().replace(" ", ".")}@company.com`, subject: `Equipment Reservation Confirmation - ${reservationData.itemName}`, sentAt: new Date().toISOString(), }
        })
      } else {
        reject({ status: 500, success: false, message: "Failed to send confirmation email. Please contact IT support if you don't receive a confirmation.", })
      }
    }, 3000)
  })
}
