import { NextResponse } from 'next/server';

// In a real application, this data would come from a database or hardware integration.
// We are simulating it here.

const TOTAL_SLOTS = 4;
let occupiedSlots = 2;

const transactions = [
    { id: 'txn_1', date: '2024-07-28', entryTime: '10:05 AM', exitTime: '11:45 AM', duration: '1h 40m', cost: 210.0 },
    { id: 'txn_2', date: '2024-07-27', entryTime: '02:15 PM', exitTime: '02:25 PM', duration: '10m', cost: 20.0 },
    { id: 'txn_3', date: '2024-07-25', entryTime: '09:00 AM', exitTime: '05:00 PM', duration: '8h 0m', cost: 950.0 },
    { id: 'txn_4', date: '2024-07-24', entryTime: '06:30 PM', exitTime: '09:10 PM', duration: '2h 40m', cost: 310.0 },
];

let balance = 4250.50;
let revenue = 2750.50;

export async function GET() {
  // Simulate a car entering or leaving to make the data dynamic
  if (Math.random() > 0.7) {
    occupiedSlots = Math.min(TOTAL_SLOTS, Math.max(0, occupiedSlots + (Math.random() > 0.5 ? 1 : -1)));
  }
  
  // Simulate small changes in revenue
  revenue += Math.random() * 10;


  return NextResponse.json({
    slotMonitor: {
      totalSlots: TOTAL_SLOTS,
      occupiedSlots: occupiedSlots,
      availableSlots: TOTAL_SLOTS - occupiedSlots,
      progressValue: (occupiedSlots / TOTAL_SLOTS) * 100,
    },
    balanceCard: {
      currentBalance: balance,
    },
    transactionHistory: {
      transactions: transactions.slice(0, 4), // Return a consistent number of recent transactions
    },
    adminDashboard: {
        currentCapacity: {
            occupied: occupiedSlots,
            total: TOTAL_SLOTS,
            percentage: ((occupiedSlots / TOTAL_SLOTS) * 100).toFixed(0),
        },
        todaysRevenue: {
            amount: revenue,
            change: '+15%', // This could also be dynamic
        },
        activeSessions: {
            count: occupiedSlots,
        }
    }
  });
}
