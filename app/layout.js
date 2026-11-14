import "./globals.css";
import Navbar from "../components/Navbar";

export const metadata = {
  title: "FixMate — Phone repairs, made easy",
  description: "Book trusted mobile repairs and follow every step with FixMate.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        <main>{children}</main>
      </body>
    </html>
  );
}
