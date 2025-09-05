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

const TOTAL_SLOTS = 4;

export default function SlotMonitor() {
  const [availableSlots, setAvailableSlots] = useState<number | null>(null);

  useEffect(() => {
    // Mock real-time data fetching, ensuring it only runs on the client
    setAvailableSlots(Math.floor(Math.random() * (TOTAL_SLOTS + 1)));
  }, []);

  const occupiedSlots = availableSlots !== null ? TOTAL_SLOTS - availableSlots : 0;
  const progressValue = availableSlots !== null ? (occupiedSlots / TOTAL_SLOTS) * 100 : 0;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="font-headline">Slot Availability</CardTitle>
          <Car className="h-6 w-6 text-muted-foreground" />
        </div>
        <CardDescription>
          Check for open parking spaces.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="text-center">
            {availableSlots !== null ? (
               <p className="text-4xl font-bold text-primary">{availableSlots}</p>
            ) : (
               <p className="text-4xl font-bold text-primary">-</p>
            )}
            <p className="text-sm text-muted-foreground">
              of {TOTAL_SLOTS} slots available
            </p>
          </div>
          <Progress value={progressValue} aria-label={`${occupiedSlots} of ${TOTAL_SLOTS} slots occupied`} />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Occupied</span>
            <span>{occupiedSlots}/{TOTAL_SLOTS}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
