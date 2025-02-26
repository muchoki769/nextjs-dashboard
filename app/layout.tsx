import '@/app/ui/global.css';
import { StackProvider, StackTheme } from "@stackframe/stack";
import { stackServerApp } from "../stack";
import {inter} from '@/app/ui/fonts';
import { Metadata } from 'next';


export const metadata:Metadata = {

  title: {
    template: '%s | Acme Dashboard',
    default: 'Acme Dashboard',
  },
  description: 'Welcome to my website',
  metadataBase: new URL('https://next-learn-dashboard.vercel.sh'),
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      {/* <body><StackProvider app={stackServerApp}><StackTheme>{children}</StackTheme></StackProvider></body> */}
      <body className={`${inter.className} antialiased`}>{children}</body>
    </html>
  );
}
