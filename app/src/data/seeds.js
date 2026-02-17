export const seeds = {
  gyms: [
    { id: 'espartano', name: 'Gym Espartano', address: 'Av. Fuerza 123', phone: '+54 9 11 1111-1111' },
    { id: 'centro', name: 'Infinit Centro', address: 'Calle Central 456', phone: '+54 9 11 2222-2222' }
  ],
  admins: [
    { id: 'u-super', email: 'user', passwordHash: 'admin', role: 'super', gymIds: ['espartano', 'centro'] },
    { id: 'u-staff', email: 'staff', passwordHash: 'admin', role: 'staff', gymIds: ['espartano'] }
  ],
  members: [
    { id: 'm1', gymId: 'espartano', fullName: 'Juan Pérez', phone: '111', status: 'active', planName: 'Pase libre', startDate: '2026-01-01', nextDueDate: '2026-02-28', isEnrolled: true },
    { id: 'm2', gymId: 'espartano', fullName: 'Ana Ruiz', phone: '112', status: 'overdue', planName: 'Pase libre', startDate: '2026-01-10', nextDueDate: '2026-01-31', isEnrolled: false },
    { id: 'm3', gymId: 'espartano', fullName: 'Marcos Diaz', phone: '113', status: 'active', planName: 'Pase libre', startDate: '2026-01-15', nextDueDate: '2026-03-05', isEnrolled: true },
    { id: 'm4', gymId: 'espartano', fullName: 'Lucía Soto', phone: '114', status: 'blocked', planName: 'Pase libre', startDate: '2026-01-20', nextDueDate: '2026-01-25', isEnrolled: false },
    { id: 'm5', gymId: 'espartano', fullName: 'Pablo Arias', phone: '115', status: 'active', planName: 'Pase libre', startDate: '2026-02-01', nextDueDate: '2026-03-01', isEnrolled: true },
    { id: 'm6', gymId: 'centro', fullName: 'Caro Núñez', phone: '211', status: 'active', planName: 'Pase libre', startDate: '2026-01-05', nextDueDate: '2026-02-25', isEnrolled: true },
    { id: 'm7', gymId: 'centro', fullName: 'Diego Paz', phone: '212', status: 'overdue', planName: 'Pase libre', startDate: '2026-01-07', nextDueDate: '2026-01-30', isEnrolled: false },
    { id: 'm8', gymId: 'centro', fullName: 'Juli Mena', phone: '213', status: 'active', planName: 'Pase libre', startDate: '2026-01-12', nextDueDate: '2026-03-02', isEnrolled: true },
    { id: 'm9', gymId: 'centro', fullName: 'Nora Giménez', phone: '214', status: 'active', planName: 'Pase libre', startDate: '2026-01-18', nextDueDate: '2026-03-10', isEnrolled: false },
    { id: 'm10', gymId: 'centro', fullName: 'Sergio Mora', phone: '215', status: 'overdue', planName: 'Pase libre', startDate: '2026-01-25', nextDueDate: '2026-02-02', isEnrolled: true }
  ],
  biometrics: [{ memberId: 'm1', weightKg: 82, bodyFatPct: 20, musclePct: 39, updatedAt: '2026-02-01' }],
  inventory: [
    { id: 'i1', gymId: 'espartano', name: 'Agua', stock: 45, price: 1200 },
    { id: 'i2', gymId: 'espartano', name: 'Bebida isotónica', stock: 26, price: 1800 },
    { id: 'i3', gymId: 'espartano', name: 'Proteína whey 1kg', stock: 9, price: 35000 },
    { id: 'i4', gymId: 'espartano', name: 'Barra proteica', stock: 30, price: 2200 },
    { id: 'i5', gymId: 'centro', name: 'Agua', stock: 40, price: 1200 },
    { id: 'i6', gymId: 'centro', name: 'Bebida isotónica', stock: 24, price: 1800 },
    { id: 'i7', gymId: 'centro', name: 'Creatina 300g', stock: 12, price: 28000 },
    { id: 'i8', gymId: 'centro', name: 'Barra proteica', stock: 28, price: 2200 }
  ],
  sales: [
    { id: 's1', gymId: 'espartano', memberId: 'm1', items: [{ itemId: 'i2', name: 'Bebida isotónica', qty: 1, price: 1800, subtotal: 1800 }], total: 1800, paidAt: '2026-02-01', method: 'cash', type: 'product', receiptNumber: 1 },
    { id: 's2', gymId: 'espartano', memberId: 'm2', items: [{ itemId: 'i4', name: 'Barra proteica', qty: 2, price: 2200, subtotal: 4400 }], total: 4400, paidAt: '2026-02-03', method: 'card', type: 'product', receiptNumber: 2 },
    { id: 's3', gymId: 'centro', memberId: 'm6', items: [{ itemId: 'i5', name: 'Agua', qty: 2, price: 1200, subtotal: 2400 }], total: 2400, paidAt: '2026-02-05', method: 'transfer', type: 'product', receiptNumber: 3 },
    { id: 's4', gymId: 'centro', memberId: 'm7', items: [{ itemId: 'i7', name: 'Creatina 300g', qty: 1, price: 28000, subtotal: 28000 }], total: 28000, paidAt: '2026-02-06', method: 'cash', type: 'product', receiptNumber: 1 },
    { id: 's5', gymId: 'espartano', memberId: null, items: [{ itemId: 'i3', name: 'Proteína whey 1kg', qty: 1, price: 35000, subtotal: 35000 }], total: 35000, paidAt: '2026-02-07', method: 'card', type: 'product', receiptNumber: 5 }
  ],
  closures: [],
  notifications: [],
  receiptCounter: 5
};
