import "./globals.css";

export const metadata = {
  title: "News Dashboard",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-[#0b0f15] text-white">
        {children}
      </body>
    </html>
  );
}

