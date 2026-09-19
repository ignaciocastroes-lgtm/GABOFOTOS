import type { Metadata } from "next"
import { AdminPanel } from "@/components/admin/admin-panel"

export const metadata: Metadata = {
  title: "Administrar fotos",
  robots: { index: false, follow: false },
}

export default function AdminPage() {
  return (
    <main className="min-h-dvh bg-slate-50 text-slate-900 dark:bg-zinc-950 dark:text-zinc-100">
      <AdminPanel />
    </main>
  )
}
