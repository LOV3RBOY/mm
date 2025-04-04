import ModelGrid from "@/components/model-grid"
import { SearchProvider } from "@/components/search-provider"
import MainLayout from "@/components/layouts/main-layout"
import ErrorBoundary from "@/components/error-boundary"

export default function ModelsPage() {
  return (
    <MainLayout>
      <SearchProvider>
        <div className="container mx-auto px-4 py-8">
          <ErrorBoundary>
            <ModelGrid />
          </ErrorBoundary>
        </div>
      </SearchProvider>
    </MainLayout>
  )
}
