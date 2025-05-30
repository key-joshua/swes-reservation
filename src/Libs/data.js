const employees = [
  {
    id: 1,
    employeeID: "IT-3049",
    name: "Joe Doe",
    department: "Information Technology",
  },
  {
    id: 2,
    employeeID: "HR-6235",
    name: "Alice Milla",
    department: "Human Resource",
  },
  {
    id: 3,
    employeeID: "FIN-7821",
    name: "Michael Carter",
    department: "Finance",
  },
  {
    id: 4,
    employeeID: "MKT-4567",
    name: "Sarah Johnson",
    department: "Marketing",
  },
  {
    id: 5,
    employeeID: "OPS-8901",
    name: "David Wilson",
    department: "Operations",
  },
]

const items = [
    {
        id: 1,
        name: 'Laptop'
    },
    {
        id: 2,
        name: 'Work Boots'
    },
    {
        id: 3,
        name: 'Office Chair'
    },
    {
        id: 4,
        name: 'Desk'
    },
    {
        id: 5,
        name: 'Printer'
    },
    {
        id: 6,
        name: 'Scanner'
    },
    {
        id: 7,
        name: 'Projector'
    },
    {
        id: 8,
        name: 'Whiteboard'
    },
    {
        id: 9,
        name: 'Router'
    },
    {
        id: 10,
        name: 'Server Rack'
    },
    {
        id: 11,
        name: 'Headset'
    },
    {
        id: 12,
        name: 'Smartphone'
    },
    {
        id: 13,
        name: 'Office Supplies'
    },
    {
        id: 14,
        name: 'Boots'
    },
    {
        id: 15,
        name: 'Gloves'
    },
    {
        id: 16,
        name: 'Safety Goggles'
    },
    {
        id: 17,
        name: 'Hard Hat'
    },
    {
        id: 18,
        name: 'Toolbox'
    },
    {
        id: 19,
        name: 'Drill Machine'
    },
    {
        id: 20,
        name: 'Multimeter'
    },
    {
        id: 21,
        name: 'Desktop Computer'
    },
    {
        id: 22,
        name: 'Safety Gloves'
    },
    {
        id: 23,
        name: 'Hard Hat'
    },
    {
        id: 24,
        name: 'Reflective Vest'
    },
    {
        id: 25,
        name: 'Coveralls'
    },
    {
        id: 26,
        name: 'Face Mask'
    },
    {
        id: 27,
        name: 'Safety Goggles'
    },
    {
        id: 28,
        name: 'Hearing Protection (Ear Muffs/Ear Plugs)'
    },
    {
        id: 29,
        name: 'Tool Belt'
    },
    {
        id: 30,
        name: 'Fire-Resistant Clothing'
    },
    {
        id: 31,
        name: 'Knee Pads'
    },
    {
        id: 32,
        name: 'Respirator'
    },
    {
        id: 33,
        name: 'First Aid Kit'
    },
    {
        id: 34,
        name: 'Work Apron'
    },
    {
        id: 35,
        name: 'Steel-Toe Shoes'
    }
];

const reservations = [
    {
      id: 1,
      employeeID: "IT-3049",
      employeeName: "Joe Doe",
      department: "Information Technology",
      itemId: 5,
      itemName: "Printer",
      reservationStartDate: "2025-06-12",
      reservationEndDate: "2025-06-15",
      submittedAt: "2025-01-10T10:23:45Z",
      status: "Pending",
    },
    {
      id: 2,
      employeeID: "HR-6235",
      employeeName: "Alice Milla",
      department: "Human Resource",
      itemId: 1,
      itemName: "Laptop",
      reservationStartDate: "2025-05-25",
      reservationEndDate: "2025-05-27",
      submittedAt: "2025-01-08T14:15:30Z",
      status: "Returned",
    },
    {
      id: 3,
      employeeID: "FIN-7821",
      employeeName: "Michael Carter",
      department: "Finance",
      itemId: 3,
      itemName: "Office Chair",
      reservationStartDate: "2025-05-25",
      reservationEndDate: "2025-05-27",
      submittedAt: "2025-01-05T16:45:12Z",
      status: "Overdue",
    },
    {
      id: 4,
      employeeID: "MKT-4567",
      employeeName: "Sarah Johnson",
      department: "Marketing",
      itemId: 7,
      itemName: "Projector",
      reservationStartDate: "2025-06-06",
      reservationEndDate: "2025-06-08",
      submittedAt: "2025-01-15T09:30:00Z",
      status: "Pending",
    },
    {
      id: 5,
      employeeID: "OPS-8901",
      employeeName: "David Wilson",
      department: "Operations",
      itemId: 14,
      itemName: "Safety Boots",
      reservationStartDate: "2025-05-28",
      reservationEndDate: "2025-05-29",
      submittedAt: "2025-01-03T11:20:15Z",
      status: "Returned",
    },
    {
      id: 6,
      employeeID: "IT-3049",
      employeeName: "Joe Doe",
      department: "Information Technology",
      itemId: 17,
      itemName: "Hard Hat",
      reservationStartDate: "2025-06-25",
      reservationEndDate: "2025-06-29",
      submittedAt: "2025-01-20T13:45:30Z",
      status: "Pending",
    },
];

export { employees, items, reservations }
