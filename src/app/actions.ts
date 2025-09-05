'use server';

import { estimateParkingCost, EstimateParkingCostOutput } from '@/ai/flows/parking-cost-estimation';
import { z } from 'zod';

export type EstimateCostState = {
  status: 'idle' | 'success' | 'error';
  message: string;
  data: EstimateParkingCostOutput | null;
};

const entrySchema = z.string().datetime({ message: "Invalid datetime string." });

export async function handleEstimateCost(
  prevState: EstimateCostState,
  formData: FormData
): Promise<EstimateCostState> {
  const entryTimeValue = formData.get('entryTime');

  try {
    const validatedEntryTime = entrySchema.parse(`${entryTimeValue}:00.000Z`);

    // In a real application, you would fetch historical data for the specific user.
    // For this demo, we'll use mocked historical data.
    const historicalDepartureTimes = [
      new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    ];
    
    const result = await estimateParkingCost({
      entryTime: validatedEntryTime,
      historicalDepartureTimes,
    });
    
    return { status: 'success', message: 'Estimation complete.', data: result };

  } catch (error) {
    if (error instanceof z.ZodError) {
       return { status: 'error', message: 'Invalid entry time provided.', data: null };
    }
    console.error(error);
    return { status: 'error', message: 'An error occurred while estimating the cost.', data: null };
  }
}
