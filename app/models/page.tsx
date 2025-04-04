import ModelGrid from "@/components/model-grid"
import { SearchProvider } from "@/components/search-provider"
import MainLayout from "@/components/layouts/main-layout"
import ErrorBoundary from "@/components/error-boundary"
import { DebugEnvDisplay } from "@/components/debug-env-display"
import { DirectEnvCheck } from "@/components/direct-env-check"

export default function ModelsPage() {
  return (
    <MainLayout>
      <SearchProvider>
        <div className="container mx-auto px-4 py-8">
          <div className="flex gap-2">
            <DebugEnvDisplay />
            <DirectEnvCheck />
          </div>
          <ErrorBoundary>
            <ModelGrid />
          </ErrorBoundary>
        </div>
      </SearchProvider>
    </MainLayout>
  )
}

