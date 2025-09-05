'use server';

/**
 * @fileOverview This file defines a Genkit flow for estimating parking costs.
 *
 * - estimateParkingCost - Estimates the parking cost based on entry time and predicted departure time.
 * - EstimateParkingCostInput - The input type for the estimateParkingCost function.
 * - EstimateParkingCostOutput - The return type for the estimateParkingCost function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const EstimateParkingCostInputSchema = z.object({
  entryTime: z.string().describe('The time the user entered the parking lot as an ISO string.'),
  historicalDepartureTimes: z.array(z.string()).describe(
    'An array of historical departure times as ISO strings, used to predict departure. Should contain at least 3 examples.'
  ),
});
export type EstimateParkingCostInput = z.infer<typeof EstimateParkingCostInputSchema>;

const EstimateParkingCostOutputSchema = z.object({
  estimatedCost: z.number().describe('The estimated parking cost in Taka.'),
});
export type EstimateParkingCostOutput = z.infer<typeof EstimateParkingCostOutputSchema>;

export async function estimateParkingCost(input: EstimateParkingCostInput): Promise<EstimateParkingCostOutput> {
  return estimateParkingCostFlow(input);
}

const predictDepartureTime = ai.defineTool({
  name: 'predictDepartureTime',
  description: 'Predicts the departure time based on the entry time and historical departure times.',
  inputSchema: z.object({
    entryTime: z.string().describe('The time the user entered the parking lot as an ISO string.'),
    historicalDepartureTimes: z.array(z.string()).describe(
      'An array of historical departure times as ISO strings, used to predict departure. Should contain at least 3 examples.'
    ),
  }),
  outputSchema: z.string().describe('The predicted departure time as an ISO string.'),
},
async (input) => {
  // Simple average of historical departure times after the entry time.
  const now = new Date(input.entryTime);
  const relevantTimes = input.historicalDepartureTimes.map(t => new Date(t).getTime()).filter(t => t > now.getTime());

  if (relevantTimes.length === 0) {
    // return 30 minutes from now as the default
    return new Date(now.getTime() + (30 * 60 * 1000)).toISOString();
  }

  const averageDepartureTime = relevantTimes.reduce((a, b) => a + b, 0) / relevantTimes.length;
  return new Date(averageDepartureTime).toISOString();
});

const calculateParkingCost = ai.defineTool({
  name: 'calculateParkingCost',
  description: 'Calculates the parking cost based on entry and departure times.',
  inputSchema: z.object({
    entryTime: z.string().describe('The entry time as an ISO string.'),
    departureTime: z.string().describe('The departure time as an ISO string.'),
  }),
  outputSchema: z.object({
    cost: z.number().describe('The calculated cost in Taka.')
  }),
}, async (input) => {
  const entry = new Date(input.entryTime);
  const departure = new Date(input.departureTime);
  const durationMinutes = (departure.getTime() - entry.getTime()) / (1000 * 60);

  if (durationMinutes <= 5) {
    return { cost: 10 };
  }

  const cost = 10 + (durationMinutes - 5) * 2;
  return { cost };
});

const prompt = ai.definePrompt({
  name: 'estimateParkingCostPrompt',
  input: {schema: EstimateParkingCostInputSchema},
  output: {schema: EstimateParkingCostOutputSchema},
  tools: [predictDepartureTime, calculateParkingCost],
  prompt: `You are a parking cost estimator. You will be provided with the entry time and historical departure times. 

  Your goal is to return the estimated parking cost.
  
  1. First, predict the departure time using the predictDepartureTime tool.
  2. Then, use the calculateParkingCost tool with the original entry time and the predicted departure time to get the final estimated cost.
  
  Entry Time: {{{entryTime}}}
`,
});

const estimateParkingCostFlow = ai.defineFlow(
  {
    name: 'estimateParkingCostFlow',
    inputSchema: EstimateParkingCostInputSchema,
    outputSchema: EstimateParkingCostOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
