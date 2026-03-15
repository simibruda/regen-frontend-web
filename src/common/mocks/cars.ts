export type Car = {
  id: string
  name: string
  plateNumber: string
  averageConsumptionPer100Km: number
  label: string
}

export const cars: Car[] = [
  {
    id: 'car-1',
    name: 'Dacia Logan',
    plateNumber: 'B 101 REG',
    averageConsumptionPer100Km: 6.2,
    label: 'Dacia Logan - B 101 REG',
  },
  {
    id: 'car-2',
    name: 'Ford Transit',
    plateNumber: 'B 202 REG',
    averageConsumptionPer100Km: 8.7,
    label: 'Ford Transit - B 202 REG',
  },
  {
    id: 'car-3',
    name: 'Volkswagen Caddy',
    plateNumber: 'B 303 REG',
    averageConsumptionPer100Km: 7.1,
    label: 'Volkswagen Caddy - B 303 REG',
  },
]
