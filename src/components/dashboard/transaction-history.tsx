'use client';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { History } from 'lucide-react';
import { useEffect, useState } from 'react';

interface Transaction {
  id: string;
  date: string;
  entryTime: string;
  exitTime: string;
  duration: string;
  cost: number;
}

export default function TransactionHistory() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/dashboard');
        const data = await response.json();
        setTransactions(data.transactionHistory.transactions);
      } catch (error) {
        console.error("Failed to fetch transaction data:", error);
      }
    };

    fetchData(); // Initial fetch
    // Transactions are less likely to change frequently, so polling can be less often or on-demand
    const interval = setInterval(fetchData, 10000); // Poll every 10 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="font-headline">Transaction History</CardTitle>
          <History className="h-6 w-6 text-muted-foreground" />
        </div>
        <CardDescription>
          A record of your recent parking sessions.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="hidden sm:table-cell">Date</TableHead>
              <TableHead>Entry</TableHead>
              <TableHead>Exit</TableHead>
              <TableHead className="hidden sm:table-cell">Duration</TableHead>
              <TableHead className="text-right">Cost</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transactions.length > 0 ? (
              transactions.map((txn) => (
                <TableRow key={txn.id}>
                  <TableCell className="hidden sm:table-cell">{txn.date}</TableCell>
                  <TableCell>{txn.entryTime}</TableCell>
                  <TableCell>{txn.exitTime}</TableCell>
                  <TableCell className="hidden sm:table-cell">{txn.duration}</TableCell>
                  <TableCell className="text-right font-medium">
                    <Badge variant="outline">Tk {txn.cost.toFixed(2)}</Badge>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="text-center">
                  Loading transactions...
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}