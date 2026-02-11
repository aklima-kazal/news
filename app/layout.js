import { SearchProvider } from "@/lib/SearchContext";
import "./globals.css";
import Sidebar from "@/components/Sidebar";

export const metadata = {
  title: "News Dashboard",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-[#0b0f15] text-white">
        <SearchProvider>{children}</SearchProvider>
      </body>
    </html>
  );
}
