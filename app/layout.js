// /app/layout.js
import './globals.css'
import { AuthProvider } from './contexts/AuthContext'
import Navbar from './components/Navbar'
import Footer from './components/Footer'

export const metadata = {
  title: 'Racare - Jual Beli Skincare & Kosmetik',
  description: 'Aplikasi jual beli skincare dan kosmetik modern untuk bisnis Anda',
}

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <body className="bg-gray-50 min-h-screen">
        <AuthProvider>
          <Navbar />
          <main className="min-h-screen">
            {children}
          </main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  )
}