import './globals.css'

export const metadata = {
  title: 'Perpustakaan SMPN 1 Damai',
  description: 'Ekosistem pintar perpustakaan SMPN 1 Damai',
}

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <head>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css" />
      </head>
      <body>{children}</body>
    </html>
  )
}
