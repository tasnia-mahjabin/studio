'use client';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from '@/components/ui/card';
import { Wallet } from 'lucide-react';
import { RechargeDialog } from './recharge-dialog';
import { useEffect, useState } from 'react';

export default function BalanceCard() {
  const [balance, setBalance] = useState<number | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/dashboard');
        const data = await response.json();
        setBalance(data.balanceCard.currentBalance);
      } catch (error) {
        console.error("Failed to fetch balance data:", error);
      }
    };

    fetchData(); // Initial fetch
    const interval = setInterval(fetchData, 5000); // Poll every 5 seconds

    return () => clearInterval(interval);
  }, []);


  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="font-headline">Your Balance</CardTitle>
          <Wallet className="h-6 w-6 text-muted-foreground" />
        </div>
        <CardDescription>Your current RFID card balance.</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-4xl font-bold text-secondary">
          {balance !== null ? `Tk ${balance.toFixed(2)}` : 'Loading...'}
        </p>
      </CardContent>
      <CardFooter>
        <RechargeDialog />
      </CardFooter>
    </Card>
  );
}