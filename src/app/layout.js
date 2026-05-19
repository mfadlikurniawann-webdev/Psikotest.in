import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800', '900'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata = {
  title: 'Psikotest.in — Platform Asesmen Psikologi Rekrutmen',
  description: 'Platform psikotest online dengan pengawasan realtime untuk rekrutmen karyawan profesional.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="id" className={inter.variable}>
      <body className="antialiased min-h-screen bg-ink-50 font-sans">
        {children}
      </body>
    </html>
  );
}
