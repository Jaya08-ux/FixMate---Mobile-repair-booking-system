export const REPAIR_ESTIMATES = {
  screen: 4999,
  battery: 2499,
  charging: 1799,
  camera: 2999,
  water: 3999,
  other: 1499,
};

export function estimateRepair(repairType) {
  return REPAIR_ESTIMATES[repairType] || REPAIR_ESTIMATES.other;
}
