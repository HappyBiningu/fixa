/**
 * Calculate credit cost for bidding on a job
 * Based on budget, urgency, and competition
 */
export interface CreditCalculationParams {
  budgetAmount: number;
  urgency: string;
  bidsCount: number;
  isProWorker: boolean;
}

export function calculateBidCost(params: CreditCalculationParams): number {
  const { budgetAmount, urgency, bidsCount, isProWorker } = params;
  
  // Base cost based on budget
  let baseCost = 1;
  if (budgetAmount <= 500) {
    baseCost = 1;
  } else if (budgetAmount <= 1000) {
    baseCost = 2;
  } else if (budgetAmount <= 2500) {
    baseCost = 3;
  } else if (budgetAmount <= 5000) {
    baseCost = 4;
  } else {
    baseCost = 5;
  }
  
  // Urgency multiplier
  const urgencyMultipliers: Record<string, number> = {
    TODAY: 1.5,
    THIS_WEEK: 1.0,
    THIS_MONTH: 0.75,
    FLEXIBLE: 0.5,
  };
  
  const multiplier = urgencyMultipliers[urgency] || 1.0;
  let cost = Math.ceil(baseCost * multiplier);
  
  // Competition adjustment
  if (bidsCount >= 8) {
    cost += 2;
  } else if (bidsCount >= 4) {
    cost += 1;
  }
  
  // Pro worker discount (20% off)
  if (isProWorker) {
    cost = Math.max(1, Math.floor(cost * 0.8));
  }
  
  return cost;
}

