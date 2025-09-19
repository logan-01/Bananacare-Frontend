import type { Metadata } from "next";
import { Raleway } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";

import "leaflet/dist/leaflet.css";
import "react-leaflet-cluster/dist/assets/MarkerCluster.css";
import "react-leaflet-cluster/dist/assets/MarkerCluster.Default.css";

const raleway = Raleway({
  variable: "--font-raleway",
  subsets: ["latin"],
});

const clashGrotesk = localFont({
  src: "../public/fonts/ClashGrotesk/ClashGrotesk-Variable.woff2",
  variable: "--font-clash-grotesk",
});

export const metadata: Metadata = {
  title: "BananaCare",
  description: "Detect Banana Disease with Ease",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth antialiased">
      <head>
        <meta
          name="viewport"
          content="viewport-fit=cover, width=device-width, initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, user-scalable=no"
        />
      </head>
      <body
        className={`${raleway.variable} ${clashGrotesk.variable} text-dark bg-light flex min-h-screen flex-col`}
      >
        {children}
      </body>
    </html>
  );
}
