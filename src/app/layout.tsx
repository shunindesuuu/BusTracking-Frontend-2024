import type { Metadata } from 'next';
import { poppins } from '@/styles/font';
import '@/styles/globals.css';
import NavigationBar from '@/components/ui/NavBar';
import SideBar from '@/components/ui/SideBar';
import SessionWrapper from '@/components/SessionWrapper';
import SessionHandler from '@/components/SessionHandler';

export const metadata = {
  title: 'Bus Tracking System Using ESP32 and GPS Module',
  description:
    'The project is a bus tracking system that uses an ESP32 and a GPS module to track the location of a bus in real-time.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SessionWrapper>
      <html lang="en" className={`${poppins.variable}`}>
        <body className={`${poppins.className} flex flex-col`}>
          <SessionHandler />
          <div className="flex flex-row">
            <div className="flex-1">
              <main>{children}</main>
            </div>
          </div>
        </body>
      </html>
    </SessionWrapper>
  );
}
