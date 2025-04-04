import { Suspense } from "react"
import { SupabaseProvider } from "@/components/supabase-provider"
import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardShell } from "@/components/dashboard-shell"
import { DashboardContent } from "@/components/dashboard-content"
import { ModelsSkeleton } from "@/components/models-skeleton"

export default function DashboardPage() {
  return (
    <SupabaseProvider>
      <DashboardShell>
        <DashboardHeader heading="Dashboard" text="Overview of your model management system." />
        <Suspense fallback={<ModelsSkeleton />}>
          <DashboardContent />
        </Suspense>
      </DashboardShell>
    </SupabaseProvider>
  )
}

