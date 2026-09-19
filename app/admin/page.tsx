import type { Metadata } from 'next'
import { AdminPanel } from '@/components/site/admin-panel'

export const metadata: Metadata = {
  title: 'Admin',
  robots: { index: false, follow: false },
}

export default function AdminPage() {
  return (
    <main className="min-h-[100svh] bg-background">
      <AdminPanel />
    </main>
  )
}
