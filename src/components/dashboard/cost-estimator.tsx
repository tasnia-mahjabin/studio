'use client';

import { useState } from 'react';
import { handleEstimateCost, type EstimateCostState } from '@/app/actions';
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
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Loader2, Wand2, AlertCircle } from 'lucide-react';
import { useFormState, useFormStatus } from 'react-dom';

const initialState: EstimateCostState = {
  status: 'idle',
  message: '',
  data: null,
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full sm:w-auto">
      {pending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Estimating...
        </>
      ) : (
        <>
          <Wand2 className="mr-2 h-4 w-4" />
          Estimate Cost
        </>
      )}
    </Button>
  );
}

export default function CostEstimator() {
  const [entryTime, setEntryTime] = useState(new Date().toISOString().slice(0, 16));
  const [state, formAction] = useFormState(handleEstimateCost, initialState);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline">Parking Cost Estimator</CardTitle>
        <CardDescription>
          Use our AI to estimate your parking cost based on your entry time.
        </CardDescription>
      </CardHeader>
      <form action={formAction}>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="entryTime">Entry Time</Label>
            <Input
              id="entryTime"
              name="entryTime"
              type="datetime-local"
              value={entryTime}
              onChange={(e) => setEntryTime(e.target.value)}
            />
          </div>

          {state.status === 'success' && state.data && (
            <Alert variant="default" className="bg-primary/10">
              <Wand2 className="h-4 w-4 text-primary" />
              <AlertTitle className="text-primary font-bold">Estimated Cost</AlertTitle>
              <AlertDescription>
                <p className="text-lg font-semibold">
                  ${state.data.estimatedCost.toFixed(2)}
                </p>
                <p className="text-xs">This is an AI-powered prediction and may vary.</p>
              </AlertDescription>
            </Alert>
          )}

          {state.status === 'error' && (
             <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>
                    {state.message || "An unexpected error occurred."}
                </AlertDescription>
            </Alert>
          )}

        </CardContent>
        <CardFooter className="flex justify-end">
          <SubmitButton />
        </CardFooter>
      </form>
    </Card>
  );
}
