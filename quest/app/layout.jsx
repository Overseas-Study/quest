import { Playfair_Display } from "next/font/google";
import SideNav from "../components/SideNav";
import "./globals.css";

const playfair = Playfair_Display({ subsets: ["latin"] });

export const metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={playfair.className}>
        <div className="flex h-screen flex-col md:flex-row md:overflow-hidden">
          <div className="w-full flex-none md:w-20">
            <SideNav />
          </div>
          <div className="w-full bg-custom-secondary">
            <div className="flex-grow p-2 h-screen bg-custom-white md:overflow-y-auto md:p-4">
              {children}
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
