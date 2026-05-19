import './globals.css';

export const metadata = {
  title: 'Psikotest.in — Platform Asesmen Psikologi Rekrutmen',
  description: 'Platform psikotest online dengan pengawasan realtime untuk rekrutmen karyawan profesional.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <body className="antialiased min-h-screen bg-ink-50 font-sans">
        {children}
      </body>
    </html>
  );
}
