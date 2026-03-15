export type RouteStop = {
  order: number
  name: string
}

export type WorkspaceRoute = {
  id: string
  categoryId: string
  date: string
  carId: string
  userFirstName: string
  userLastName: string
  startKm: number
  endKm: number
  stops: RouteStop[]
}

export const routes: WorkspaceRoute[] = [
  {
    id: 'route-1',
    categoryId: 'education',
    date: '2026-03-02',
    carId: 'car-1',
    userFirstName: 'Ana',
    userLastName: 'Popescu',
    startKm: 10240,
    endKm: 10318,
    stops: [
      { order: 1, name: 'Warehouse' },
      { order: 2, name: 'School No. 5' },
      { order: 3, name: 'Community Center' },
    ],
  },
  {
    id: 'route-2',
    categoryId: 'community-support',
    date: '2026-03-05',
    carId: 'car-2',
    userFirstName: 'Mihai',
    userLastName: 'Ionescu',
    startKm: 23500,
    endKm: 23642,
    stops: [
      { order: 1, name: 'Main Office' },
      { order: 2, name: 'Clinic East' },
    ],
  },
  {
    id: 'route-3',
    categoryId: 'youth-development',
    date: '2026-03-08',
    carId: 'car-3',
    userFirstName: 'Elena',
    userLastName: 'Matei',
    startKm: 18760,
    endKm: 18834,
    stops: [
      { order: 1, name: 'Family Hub' },
      { order: 2, name: 'Youth Center' },
      { order: 3, name: 'Storage' },
    ],
  },
  {
    id: 'route-4',
    categoryId: 'education',
    date: '2026-03-13',
    carId: 'car-1',
    userFirstName: 'Andrei',
    userLastName: 'Dobre',
    startKm: 10318,
    endKm: 10401,
    stops: [
      { order: 1, name: 'School No. 5' },
      { order: 2, name: 'Town Hall' },
    ],
  },
]
