const PICKUP_LOCATIONS = ["Phagwara", "Lawgate", "LPU Main Gate", "LPU Mall"];

export function resolvePickupLocation(body) {
  const selected = String(body.pickupLocation || "").trim();
  if (selected === "Other") {
    const custom = String(body.customPickupLocation || "").trim();
    return custom ? custom.slice(0, 160) : null;
  }
  return PICKUP_LOCATIONS.includes(selected) ? selected : null;
}
