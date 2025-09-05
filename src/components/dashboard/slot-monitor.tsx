'use client';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Car } from 'lucide-react';
import { useState, useEffect } from 'react';

interface SlotData {
    availableSlots: number;
    totalSlots: number;
    occupiedSlots: number;
    progressValue: number;
}


export default function SlotMonitor() {
  const [slotData, setSlotData] = useState<SlotData | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/dashboard');
        const data = await response.json();
        setSlotData(data.slotMonitor);
      } catch (error) {
        console.error("Failed to fetch slot data:", error);
      }
    };

    fetchData(); // Initial fetch
    const interval = setInterval(fetchData, 3000); // Poll every 3 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="font-headline">Slot Availability</CardTitle>
          <Car className="h-6 w-6 text-muted-foreground" />
        </div>
        <CardDescription>
          Live parking space status.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="text-center">
            {slotData !== null ? (
               <p className="text-4xl font-bold text-primary">{slotData.availableSlots}</p>
            ) : (
               <p className="text-4xl font-bold text-primary">-</p>
            )}
            <p className="text-sm text-muted-foreground">
              of {slotData?.totalSlots ?? '-'} slots available
            </p>
          </div>
          <Progress value={slotData?.progressValue ?? 0} aria-label={`${slotData?.occupiedSlots ?? 0} of ${slotData?.totalSlots ?? 0} slots occupied`} />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Occupied</span>
            <span>{slotData?.occupiedSlots ?? 0}/{slotData?.totalSlots ?? 0}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}