export default function StatusBadge({ status }) {
  const label = status || "Pending";
  return <span className={`status-badge status-${label.toLowerCase().replaceAll(" ", "-")}`}><i />{label}</span>;
}
