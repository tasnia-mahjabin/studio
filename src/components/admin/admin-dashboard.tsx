'use client';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Settings, Users, BarChart, TrendingUp } from 'lucide-react';
import { useState, useEffect } from 'react';

interface AdminData {
  currentCapacity: {
    occupied: number;
    total: number;
    percentage: string;
  };
  todaysRevenue: {
    amount: number;
    change: string;
  };
  activeSessions: {
    count: number;
  };
}

export default function AdminDashboard() {
  const { toast } = useToast();
  const [initialRate, setInitialRate] = useState('10');
  const [perMinuteRate, setPerMinuteRate] = useState('2');
  const [adminData, setAdminData] = useState<AdminData | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/dashboard');
        const data = await response.json();
        setAdminData(data.adminDashboard);
      } catch (error) {
        console.error("Failed to fetch admin data:", error);
      }
    };

    fetchData(); // Initial fetch
    const interval = setInterval(fetchData, 3000); // Poll every 3 seconds

    return () => clearInterval(interval);
  }, []);

  const handlePriceUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would update the config in the database
    toast({
      title: 'Success!',
      description: 'Pricing configuration has been updated.',
    });
  };

  return (
    <div className="p-4 sm:p-6 md:p-8 max-w-7xl mx-auto">
      <h1 className="font-headline text-3xl md:text-4xl font-bold text-secondary mb-8">
        Admin Dashboard
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Current Capacity</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {adminData ? `${adminData.currentCapacity.occupied} / ${adminData.currentCapacity.total} cars` : 'Loading...'}
            </div>
            <p className="text-xs text-muted-foreground">
              {adminData ? `${adminData.currentCapacity.percentage}% full` : ''}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today's Revenue</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {adminData ? `Tk ${adminData.todaysRevenue.amount.toFixed(2)}` : 'Loading...'}
            </div>
            <p className="text-xs text-muted-foreground">
              {adminData ? `${adminData.todaysRevenue.change} from yesterday` : ''}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Active Sessions</CardTitle>
            <BarChart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {adminData ? adminData.activeSessions.count : '...'}
            </div>
            <p className="text-xs text-muted-foreground">Cars currently parked</p>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle className="font-headline flex items-center gap-2"><Settings className="h-6 w-6" /> Price Configuration</CardTitle>
          <CardDescription>
            Update the parking fee structure. Changes will apply to new entries.
          </CardDescription>
        </CardHeader>
        <form onSubmit={handlePriceUpdate}>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="initialRate">Initial Rate (first 5 mins)</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">Tk</span>
                  <Input 
                    id="initialRate" 
                    type="number" 
                    value={initialRate} 
                    onChange={e => setInitialRate(e.target.value)}
                    className="pl-8"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="perMinuteRate">Per Minute Rate (after 5 mins)</Label>
                 <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">Tk</span>
                  <Input 
                    id="perMinuteRate" 
                    type="number" 
                    value={perMinuteRate}
                    onChange={e => setPerMinuteRate(e.target.value)}
                    className="pl-8"
                  />
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="border-t px-6 py-4">
            <Button type="submit">Update Prices</Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}