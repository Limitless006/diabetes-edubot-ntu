import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Type 2 Diabetes Educational Assistant | المساعد الذكي للسكري (Group 01)',
  description: 'Evidence-based interactive AI assistant for Type 2 Diabetes health education, grounded in WHO, CDC, MedlinePlus, and NHS sources.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ar" dir="rtl">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;500;600;700;800&family=Tajawal:wght@400;500;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen bg-slate-50 text-slate-900 antialiased font-sans">
        {children}
      </body>
    </html>
  );
}
