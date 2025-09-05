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
  estimatedCost: z.number().describe('The estimated parking cost in dollars.'),
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

const prompt = ai.definePrompt({
  name: 'estimateParkingCostPrompt',
  input: {schema: EstimateParkingCostInputSchema},
  output: {schema: EstimateParkingCostOutputSchema},
  tools: [predictDepartureTime],
  prompt: `You are a parking cost estimator. You will be provided with the entry time and historical departure times. 

  First, predict the departure time using the predictDepartureTime tool.
  Then, calculate the parking cost based on the following pricing:
  - The first 5 minutes are 10tk.
  - After 5 minutes, the cost is 2tk per minute.
  
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
