"use client"

import { useEffect, useState, Suspense } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { ArrowLeft, TrashCan, View, ViewOff } from "@/lib/icons"
import {
  getPrototype,
  getActiveVariations,
  getBranches,
  getVariationsForBranch,
  getVariationDescription,
  isPage,
  isOrganism,
} from "@/prototypes/registry"
import {
  loadVariation,
} from "@/prototypes/component-loader"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { ComponentType } from "react"
import { Skeleton } from "@/components/ui/skeleton"
import { ViewportProvider } from "@/prototypes/components/viewport/viewport-context"
import { PrototypeModeProvider, usePrototypeMode } from "@/contexts/prototype-mode-context"
import { PrototypeModeToggle } from "@/components/prototype-mode-toggle"

function ComponentPageContent() {
  const params = useParams()
  const router = useRouter()
  const id = params.id as string
  const prototype = getPrototype(id)
  const { mode, isProduction } = usePrototypeMode()

  const [activeVariations, setActiveVariations] = useState<string[]>([])
  const [loadedComponents, setLoadedComponents] = useState<Record<string, ComponentType>>({})
  const [activeTab, setActiveTab] = useState<string>("")
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [variationToDelete, setVariationToDelete] = useState<string | null>(null)
  const [selectedBranch, setSelectedBranch] = useState<string | null>(null)
  const [showDescription, setShowDescription] = useState<Record<string, boolean>>({})
  const [loadingErrors, setLoadingErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    if (!prototype) return

    if (prototype.hasVariations) {
      // In production mode, only show production variation
      if (isProduction) {
        setActiveVariations(["production"])
        setActiveTab("production")
      } else {
        // Get variations for selected branch (or all if no branch selected)
        const active = getVariationsForBranch(id, selectedBranch)
        setActiveVariations(active)
        
        if (active.length > 0) {
          // Check for hash in URL to set initial tab
          const hash = typeof window !== "undefined" ? window.location.hash.slice(1) : ""
          const hashVariation = hash && active.includes(hash) ? hash : null
          setActiveTab(hashVariation || active[0])
        }
      }
    } else {
      // Legacy component without variations
      setActiveTab("default")
    }
  }, [id, prototype, selectedBranch, isProduction])

  // Handle hash changes for direct navigation to variations
  useEffect(() => {
    if (!prototype?.hasVariations || isProduction) return

    const handleHashChange = () => {
      const hash = window.location.hash.slice(1)
      if (hash && activeVariations.includes(hash)) {
        setActiveTab(hash)
      }
    }

    // Check initial hash
    handleHashChange()

    // Listen for hash changes
    window.addEventListener("hashchange", handleHashChange)
    return () => window.removeEventListener("hashchange", handleHashChange)
  }, [prototype, activeVariations, isProduction])

  useEffect(() => {
    if (!prototype?.hasVariations || activeVariations.length === 0) return

    // Load all active variation components
    const loadComponents = async () => {
      const components: Record<string, ComponentType> = {}
      const errors: Record<string, string> = {}
      for (const variationId of activeVariations) {
        try {
          const Component = await loadVariation(id, variationId)
          if (Component) {
            components[variationId] = Component
            // Clear any previous error for this variation
            setLoadingErrors((prev) => {
              const updated = { ...prev }
              delete updated[variationId]
              return updated
            })
          } else {
            const errorMsg = `Failed to load variation ${variationId} for component ${id}`
            console.warn(errorMsg)
            errors[variationId] = errorMsg
          }
        } catch (error) {
          const errorMsg = error instanceof Error ? error.message : `Error loading variation ${variationId}`
          console.error(`Error loading variation ${variationId} for component ${id}:`, error)
          errors[variationId] = errorMsg
        }
      }
      if (Object.keys(errors).length > 0) {
        setLoadingErrors((prev) => ({ ...prev, ...errors }))
      }
      if (Object.keys(components).length > 0) {
        setLoadedComponents((prev) => ({ ...prev, ...components }))
      }
    }

    loadComponents()
  }, [id, activeVariations, prototype?.hasVariations])

  if (!prototype) {
    return (
      <div className="container mx-auto py-8 px-4" style={{ backgroundColor: '#FAF8F6', minHeight: '100vh' }}>
        <div className="mb-6 flex items-center justify-between">
          <Link href="/prototypes">
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Prototypes
            </Button>
          </Link>
          <PrototypeModeToggle />
        </div>
        <div className="bg-card border rounded-lg p-8 text-center">
          <h1 className="text-2xl font-bold mb-2">Prototype Not Found</h1>
          <p className="text-muted-foreground mb-4">
            The prototype with ID &quot;{id}&quot; could not be found.
          </p>
          <Link href="/prototypes">
            <Button>View All Prototypes</Button>
          </Link>
        </div>
      </div>
    )
  }

  const handleDelete = (variationId: string) => {
    setVariationToDelete(variationId)
    setDeleteDialogOpen(true)
  }

  const confirmDelete = async () => {
    if (!variationToDelete) return
    // TODO: Implement delete functionality via API route or server action
    console.log(`Delete ${variationToDelete}`)
    setDeleteDialogOpen(false)
    setVariationToDelete(null)
    alert(`Delete functionality will be implemented. Would delete: ${variationToDelete}`)
  }

  const prototypeType = isPage(prototype) ? "page" : isOrganism(prototype) ? "organism" : "component"
  const backText = prototypeType === "page" ? "Back to Pages" : "Back to Organisms"
  
  // Check if this component needs ViewportProvider
  // Pages that already have ViewportProvider internally (like cura-cloud) should be excluded
  const needsViewportProvider = (
    id === "viewport" || 
    id === "adjustment-tools" || 
    id === "top-bar" || 
    id === "right-panel" ||
    (isOrganism(prototype) && prototype.pageId === "cura-cloud")
  ) && id !== "cura-cloud"

  // Legacy component (no variations)
  if (!prototype.hasVariations && prototype.component) {
    const Component = prototype.component
    const isCuraCloud = id === "cura-cloud"
    
    return (
      <div className="container mx-auto py-8 px-4" style={{ backgroundColor: '#FAF8F6', minHeight: '100vh' }}>
        <div className="mb-6 flex items-center justify-between">
          <Link href="/prototypes">
            <Button variant="ghost" className="mb-4">
              <ArrowLeft size={16} className="mr-2" />
              {backText}
            </Button>
          </Link>
          <PrototypeModeToggle />
        </div>
        <div className="mb-4">
          <h1 className="text-3xl font-bold mb-2">{prototype.name}</h1>
          <p className="text-muted-foreground">{prototype.description}</p>
        </div>

        <div className="bg-card border rounded-lg flex flex-col" style={{ minHeight: '992px', backgroundColor: isCuraCloud ? '#FAF8F6' : undefined }}>
          <div className="flex items-center justify-between p-6 pb-4 border-b flex-shrink-0">
            <h2 className="text-lg font-semibold">Preview</h2>
          </div>
          <div className="flex-1 overflow-hidden" style={{ backgroundColor: isCuraCloud ? '#FAF8F6' : undefined }}>
            <div className="flex-1 overflow-y-auto" style={{ backgroundColor: isCuraCloud ? '#FAF8F6' : undefined }}>
              {needsViewportProvider ? (
                <ViewportProvider>
                  <Component />
                </ViewportProvider>
              ) : (
                <Component />
              )}
            </div>
          </div>
        </div>

        {prototype.fields && prototype.fields.length > 0 && (
          <div className="mt-8 bg-muted/50 rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Form Fields</h2>
            <div className="space-y-4">
              {prototype.fields.map((field) => (
                <div key={field.name} className="border-b pb-4 last:border-0">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <span className="font-medium">{field.label}</span>
                      {field.required && (
                        <span className="text-destructive ml-2">*</span>
                      )}
                    </div>
                    <span className="text-sm text-muted-foreground">{field.type}</span>
                  </div>
                  {field.description && (
                    <p className="text-sm text-muted-foreground mb-1">{field.description}</p>
                  )}
                  {field.validation && (
                    <p className="text-xs text-muted-foreground">Validation: {field.validation}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    )
  }

  // Component with variations
  const branches = getBranches(id)
  const hasBranches = branches.length > 0

  return (
    <div className="container mx-auto py-8 px-4" style={{ backgroundColor: '#FAF8F6', minHeight: '100vh' }}>
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <Link href="/prototypes">
            <Button variant="ghost">
              <ArrowLeft className="mr-2 h-4 w-4" />
              {backText}
            </Button>
          </Link>
          <PrototypeModeToggle />
        </div>
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <h1 className="text-3xl font-bold mb-2">{prototype.name}</h1>
            <p className="text-muted-foreground">{prototype.description}</p>
          </div>
          {hasBranches && !isProduction && (
            <div className="flex items-center gap-2 flex-shrink-0">
              <Label htmlFor="branch-select" className="text-sm font-medium whitespace-nowrap">
                Exploration Type
              </Label>
              <Select value={selectedBranch || "all"} onValueChange={(value) => setSelectedBranch(value === "all" ? null : value)}>
                <SelectTrigger id="branch-select" className="w-[200px]">
                  <SelectValue placeholder="Select exploration type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Variations</SelectItem>
                  {branches.map((branch) => (
                    <SelectItem key={branch.id} value={branch.id}>
                      {branch.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
        </div>
      </div>

      {/* In production mode, hide tabs and show only production */}
      {isProduction ? (
        <div className="w-full">
          {(() => {
            const Component = loadedComponents["production"]
            const description = getVariationDescription(id, "production")
            
            return (
              <div className="bg-card border rounded-lg flex flex-col" style={{ minHeight: '992px', backgroundColor: '#FAF8F6' }}>
                <div className="flex flex-col p-6 pb-4 border-b flex-shrink-0 gap-3">
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold">Production</h2>
                  </div>
                </div>
                <div className="flex-1 overflow-hidden" style={{ backgroundColor: '#FAF8F6' }}>
                  <div className="flex-1 overflow-y-auto" style={{ backgroundColor: '#FAF8F6' }}>
                    {Component ? (
                      needsViewportProvider ? (
                        <ViewportProvider>
                          <Component />
                        </ViewportProvider>
                      ) : (
                        <Component />
                      )
                    ) : loadingErrors["production"] ? (
                      <div className="p-6 space-y-4">
                        <div className="text-sm text-destructive font-medium">
                          Failed to load component
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {loadingErrors["production"]}
                        </div>
                      </div>
                    ) : (
                      <div className="p-6 space-y-4">
                        <div className="text-sm text-muted-foreground">
                          Loading component...
                        </div>
                        <Skeleton className="h-8 w-48" />
                        <Skeleton className="h-64 w-full" />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )
          })()}
        </div>
      ) : (
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="flex items-center justify-between mb-4">
            <TabsList>
              {activeVariations.map((variationId) => (
                <TabsTrigger key={variationId} value={variationId}>
                  {variationId === "production" ? "Production" : variationId}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>

          {activeVariations.map((variationId) => {
            const Component = loadedComponents[variationId]
            const description = getVariationDescription(id, variationId)
            const isProductionVar = variationId === "production"
            const showDesc = showDescription[variationId] || false
            
            return (
              <TabsContent key={variationId} value={variationId} className="mt-0">
                <div className="bg-card border rounded-lg flex flex-col" style={{ minHeight: '992px', backgroundColor: '#FAF8F6' }}>
                  <div className="flex flex-col p-6 pb-4 border-b flex-shrink-0 gap-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3 flex-1">
                        <h2 className="text-lg font-semibold">
                          {isProductionVar ? "Production" : `Variation ${variationId}`}
                        </h2>
                        {description && (
                          <>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setShowDescription({ ...showDescription, [variationId]: !showDesc })}
                              className="h-auto p-1 text-muted-foreground hover:text-foreground"
                              aria-label={showDesc ? "Hide description" : "Show description"}
                            >
                              {showDesc ? <ViewOff size={16} /> : <View size={16} />}
                            </Button>
                            {showDesc && (
                              <p className="text-sm text-muted-foreground">
                                {description}
                              </p>
                            )}
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex-1 overflow-hidden" style={{ backgroundColor: '#FAF8F6' }}>
                    <div className="flex-1 overflow-y-auto" style={{ backgroundColor: '#FAF8F6' }}>
                      {Component ? (
                        needsViewportProvider ? (
                          <ViewportProvider>
                            <Component />
                          </ViewportProvider>
                        ) : (
                          <Component />
                        )
                      ) : loadingErrors[variationId] ? (
                        <div className="p-6 space-y-4">
                          <div className="text-sm text-destructive font-medium">
                            Failed to load component
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {loadingErrors[variationId]}
                          </div>
                          <Button
                            variant="outline"
                            onClick={() => {
                              // Retry loading
                              const loadComponent = async () => {
                                try {
                                  const Component = await loadVariation(id, variationId)
                                  if (Component) {
                                    setLoadedComponents((prev) => ({ ...prev, [variationId]: Component }))
                                    setLoadingErrors((prev) => {
                                      const updated = { ...prev }
                                      delete updated[variationId]
                                      return updated
                                    })
                                  }
                                } catch (error) {
                                  console.error(`Retry failed for ${variationId}:`, error)
                                }
                              }
                              loadComponent()
                            }}
                          >
                            Retry
                          </Button>
                        </div>
                      ) : (
                        <div className="p-6 space-y-4">
                          <div className="text-sm text-muted-foreground">
                            Loading component...
                          </div>
                          <Skeleton className="h-8 w-48" />
                          <Skeleton className="h-64 w-full" />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </TabsContent>
            )
          })}
        </Tabs>
      )}

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete variation {variationToDelete}. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-destructive-foreground">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

export default function PrototypePage() {
  return (
    <Suspense fallback={
      <div className="container mx-auto py-8 px-4">
        <Skeleton className="h-12 w-48 mb-4" />
        <Skeleton className="h-64 w-full" />
      </div>
    }>
      <PrototypeModeProvider>
        <ComponentPageContent />
      </PrototypeModeProvider>
    </Suspense>
  )
}
