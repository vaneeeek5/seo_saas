import React from 'react';

export const metadata = {
  title: 'SEO Content Factory OS — Платформа Авто-Продвижения',
  description: 'AI-Платформа полного цикла для автоматизированного создания, публикации и развития SEO-контента',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru">
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
