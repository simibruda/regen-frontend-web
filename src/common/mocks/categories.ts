export type Category = {
  id: string
  name: string
  assignedPeople: { id: string; name: string }[]
}

export const categories: Category[] = [
  {
    id: 'education',
    name: 'Education Programs',
    assignedPeople: [
      { id: 'p1', name: 'Ana Popescu' },
      { id: 'p2', name: 'Mihai Ionescu' },
      { id: 'p3', name: 'Elena Matei' },
    ],
  },
  {
    id: 'community-support',
    name: 'Community Support',
    assignedPeople: [
      { id: 'p4', name: 'Andrei Dobre' },
      { id: 'p5', name: 'Maria Pavel' },
    ],
  },
  {
    id: 'health-access',
    name: 'Health Access',
    assignedPeople: [{ id: 'p6', name: 'Radu Chiriac' }],
  },
  {
    id: 'youth-development',
    name: 'Youth Development',
    assignedPeople: [
      { id: 'p7', name: 'Ioana Rusu' },
      { id: 'p8', name: 'Daniel Rotaru' },
    ],
  },
  {
    id: 'family-services',
    name: 'Family Services',
    assignedPeople: [
      { id: 'p9', name: 'Cristina Moldovan' },
      { id: 'p10', name: 'Sorin Balan' },
      { id: 'p11', name: 'Paula Stanciu' },
    ],
  },
]
