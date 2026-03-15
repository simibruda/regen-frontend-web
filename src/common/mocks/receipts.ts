export type WorkspaceReceipt = {
  id: string
  categoryId: string
  name: string
  userFirstName: string
  userLastName: string
  amount: number
  date: string
  fileName: string
}

export const receipts: WorkspaceReceipt[] = [
  {
    id: 'receipt-1',
    categoryId: 'education',
    name: 'Fuel',
    userFirstName: 'Ana',
    userLastName: 'Popescu',
    amount: 210.5,
    date: '2026-03-02',
    fileName: 'fuel-ana-2026-03-02.pdf',
  },
  {
    id: 'receipt-2',
    categoryId: 'community-support',
    name: 'Office Supplies',
    userFirstName: 'Mihai',
    userLastName: 'Ionescu',
    amount: 98.3,
    date: '2026-03-04',
    fileName: 'supplies-mihai-2026-03-04.pdf',
  },
  {
    id: 'receipt-3',
    categoryId: 'education',
    name: 'Fuel',
    userFirstName: 'Elena',
    userLastName: 'Matei',
    amount: 175.9,
    date: '2026-03-07',
    fileName: 'fuel-elena-2026-03-07.pdf',
  },
  {
    id: 'receipt-4',
    categoryId: 'family-services',
    name: 'Meals',
    userFirstName: 'Andrei',
    userLastName: 'Dobre',
    amount: 63.4,
    date: '2026-03-11',
    fileName: 'meals-andrei-2026-03-11.pdf',
  },
  {
    id: 'receipt-5',
    categoryId: 'youth-development',
    name: 'Fuel',
    userFirstName: 'Maria',
    userLastName: 'Pavel',
    amount: 189.25,
    date: '2026-03-14',
    fileName: 'fuel-maria-2026-03-14.pdf',
  },
  {
    id: 'receipt-6',
    categoryId: 'health-access',
    name: 'Medical Supplies',
    userFirstName: 'Radu',
    userLastName: 'Chiriac',
    amount: 320.0,
    date: '2026-03-15',
    fileName: 'medical-radu-2026-03-15.pdf',
  },
  {
    id: 'receipt-7',
    categoryId: 'community-support',
    name: 'Fuel',
    userFirstName: 'Ioana',
    userLastName: 'Marin',
    amount: 142.6,
    date: '2026-03-06',
    fileName: 'fuel-ioana-2026-03-06.pdf',
  },
  {
    id: 'receipt-8',
    categoryId: 'community-support',
    name: 'Protective Equipment',
    userFirstName: 'Mihai',
    userLastName: 'Ionescu',
    amount: 76.4,
    date: '2026-03-09',
    fileName: 'ppe-mihai-2026-03-09.pdf',
  },
  {
    id: 'receipt-9',
    categoryId: 'community-support',
    name: 'Meals',
    userFirstName: 'Andreea',
    userLastName: 'Nistor',
    amount: 54.0,
    date: '2026-03-12',
    fileName: 'meals-andreea-2026-03-12.pdf',
  },
  {
    id: 'receipt-10',
    categoryId: 'community-support',
    name: 'Office Supplies',
    userFirstName: 'Radu',
    userLastName: 'Petrescu',
    amount: 121.75,
    date: '2026-03-15',
    fileName: 'supplies-radu-2026-03-15.pdf',
  },
]
