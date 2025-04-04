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
        <div className="container mx-auto px-6 py-10">
          <DashboardHeader 
            heading="Dashboard" 
            text="Overview of your model management system."
          />
          <div className="mt-8 grid gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            <div className="bg-white dark:bg-gray-900 rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4">Model Metrics</h2>
              <p className="text-sm text-muted-foreground">
                Key performance indicators will be displayed here.
              </p>
            </div>
            <div className="bg-white dark:bg-gray-900 rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
              <p className="text-sm text-muted-foreground">
                Latest updates and actions will appear here.
              </p>
            </div>
            <div className="bg-white dark:bg-gray-900 rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4">System Health</h2>
              <p className="text-sm text-muted-foreground">
                Monitor system status and alerts.
              </p>
            </div>
          </div>
          <div className="mt-10">
            <Suspense fallback={<ModelsSkeleton />}>
              <div className="bg-white dark:bg-gray-900 rounded-lg shadow p-6">
                <DashboardContent />
              </div>
            </Suspense>
          </div>
        </div>
      </DashboardShell>
    </SupabaseProvider>
  )
}
