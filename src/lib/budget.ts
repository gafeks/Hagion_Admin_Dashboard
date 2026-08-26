export function parseBudgetMidpoint(budget: string | null | undefined): number {
  if (!budget) return 0;
  const nums = budget.match(/[\d,]+/g)?.map((n) => parseInt(n.replace(/,/g, ""), 10)) ?? [];
  if (nums.length === 0) return 0;
  if (nums.length === 1) return nums[0];
  return (nums[0] + nums[1]) / 2;
}
