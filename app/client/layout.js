import { requireRole } from "../../lib/auth";

export default async function ClientLayout({ children }) {
  await requireRole("client");
  return children;
}
