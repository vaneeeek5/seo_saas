import React from 'react';

export const metadata = {
  title: 'SEO Content Factory OS',
  description: 'AI-Powered Full Cycle SEO Automation Platform',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body style={{
        margin: 0,
        padding: 0,
        backgroundColor: '#0a0a0f',
        color: '#f3f4f6',
        fontFamily: 'Inter, system-ui, -apple-system, sans-serif'
      }}>
        {children}
      </body>
    </html>
  );
}
