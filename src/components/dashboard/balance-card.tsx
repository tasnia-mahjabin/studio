import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Wallet } from 'lucide-react';
import { RechargeDialog } from './recharge-dialog';

export default function BalanceCard() {
  // In a real app, this would come from user data
  const currentBalance = 4250.50;

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
          Tk {currentBalance.toFixed(2)}
        </p>
      </CardContent>
      <CardFooter>
        <RechargeDialog />
      </CardFooter>
    </Card>
  );
}
