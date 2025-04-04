import { Suspense } from "react"
import { SupabaseProvider } from "@/components/supabase-provider"
import { DashboardHeader } from "@/components/dashboard-header"
import MainLayout from "@/components/layouts/main-layout" // Use MainLayout
import { DashboardContent } from "@/components/dashboard-content"
import { ModelsSkeleton } from "@/components/models-skeleton"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card" // Import Card components

export default function DashboardPage() {
  return (
    <MainLayout> {/* Use MainLayout */}
      <SupabaseProvider> {/* Keep SupabaseProvider if needed by DashboardContent */}
        <div className="container mx-auto px-4 py-8"> {/* Standard container */}
          <DashboardHeader 
            heading="Dashboard" 
            text="Monitor and manage your models with insights at your fingertips." 
          />
          {/* Use Card components for content blocks */}
          <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <Card className="transition transform hover:scale-105">
              <CardHeader>
                <CardTitle>Model Metrics</CardTitle>
                <CardDescription>View key metrics and performance indicators.</CardDescription>
              </CardHeader>
              {/* <CardContent> Optional content </CardContent> */}
            </Card>
            <Card className="transition transform hover:scale-105">
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>See the latest updates and actions in your system.</CardDescription>
              </CardHeader>
              {/* <CardContent> Optional content </CardContent> */}
            </Card>
            <Card className="transition transform hover:scale-105">
              <CardHeader>
                <CardTitle>System Health</CardTitle>
                <CardDescription>Check the ongoing performance and status of operations.</CardDescription>
              </CardHeader>
              {/* <CardContent> Optional content </CardContent> */}
            </Card>
          </div>
          
          {/* Wrap DashboardContent in a Card */}
          <Card className="mt-10"> 
            <CardContent className="p-6"> {/* Add padding back if needed */}
              <Suspense fallback={<ModelsSkeleton />}>
                <DashboardContent />
              </Suspense>
            </CardContent>
          </Card>
        </div>
      </SupabaseProvider>
    </MainLayout>
  )
}
