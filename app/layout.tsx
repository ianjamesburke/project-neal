import { KindeProvider } from "@/lib/providers/kinde-provider";
import "./globals.css";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Project Neal",
  description: "Ai video editor",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <KindeProvider>{children}</KindeProvider>
      </body>
    </html>
  );
}
