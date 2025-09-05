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

const transactions = [
  {
    id: 'txn_1',
    date: '2024-07-28',
    entryTime: '10:05 AM',
    exitTime: '11:45 AM',
    duration: '1h 40m',
    cost: 35.0,
  },
  {
    id: 'txn_2',
    date: '2024-07-27',
    entryTime: '02:15 PM',
    exitTime: '02:25 PM',
    duration: '10m',
    cost: 20.0,
  },
  {
    id: 'txn_3',
    date: '2024-07-25',
    entryTime: '09:00 AM',
    exitTime: '05:00 PM',
    duration: '8h 0m',
    cost: 150.0,
  },
  {
    id: 'txn_4',
    date: '2024-07-24',
    entryTime: '06:30 PM',
    exitTime: '09:10 PM',
    duration: '2h 40m',
    cost: 65.0,
  },
];

export default function TransactionHistory() {
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
            {transactions.map((txn) => (
              <TableRow key={txn.id}>
                <TableCell className="hidden sm:table-cell">{txn.date}</TableCell>
                <TableCell>{txn.entryTime}</TableCell>
                <TableCell>{txn.exitTime}</TableCell>
                <TableCell className="hidden sm:table-cell">{txn.duration}</TableCell>
                <TableCell className="text-right font-medium">
                  <Badge variant="outline">${txn.cost.toFixed(2)}</Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
