import Header from '@/components/layout/header';
import SlotMonitor from '@/components/dashboard/slot-monitor';
import BalanceCard from '@/components/dashboard/balance-card';
import CostEstimator from '@/components/dashboard/cost-estimator';
import TransactionHistory from '@/components/dashboard/transaction-history';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 p-4 sm:p-6 md:p-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="font-headline text-3xl md:text-4xl font-bold text-secondary mb-8">
            Your Dashboard
          </h1>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1 flex flex-col gap-6">
              <SlotMonitor />
              <BalanceCard />
            </div>
            <div className="lg:col-span-2 flex flex-col gap-6">
              <CostEstimator />
              <TransactionHistory />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
