import { Outlet } from 'react-router-dom'
import Header from './Header'
import Footer from './Footer'
import ChatWidget from './ChatWidget'

export default function MainLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-100 dark:bg-slate-900 transition-colors duration-300">
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <ChatWidget />
    </div>
  )
}