"use client"

import { useEffect, useState, Suspense } from "react"
import { notFound, useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Archive, TrashCan, Reset } from "@/lib/icons"
import {
  getPrototype,
  getActiveVariations,
  getArchivedVariations,
} from "@/prototypes/registry"
import {
  loadVariation,
  loadArchivedVariation,
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
import { ComponentType } from "react"
import { Skeleton } from "@/components/ui/skeleton"

function ComponentPageContent() {
  const params = useParams()
  const router = useRouter()
  const id = params.id as string
  const prototype = getPrototype(id)

  const [activeVariations, setActiveVariations] = useState<string[]>([])
  const [archivedVariations, setArchivedVariations] = useState<string[]>([])
  const [loadedComponents, setLoadedComponents] = useState<Record<string, ComponentType>>({})
  const [loadedArchivedComponents, setLoadedArchivedComponents] = useState<Record<string, ComponentType>>({})
  const [activeTab, setActiveTab] = useState<string>("")
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [variationToDelete, setVariationToDelete] = useState<{ id: string; isArchived: boolean } | null>(null)

  useEffect(() => {
    if (!prototype) return

    if (prototype.hasVariations) {
      const active = getActiveVariations(id)
      const archived = getArchivedVariations(id)
      setActiveVariations(active)
      setArchivedVariations(archived)
      if (active.length > 0) {
        setActiveTab(active[0])
      }
    } else {
      // Legacy component without variations
      setActiveTab("default")
    }
  }, [id, prototype])

  useEffect(() => {
    if (!prototype?.hasVariations || activeVariations.length === 0) return

    // Load all active variation components
    const loadComponents = async () => {
      const components: Record<string, ComponentType> = {}
      for (const variationId of activeVariations) {
        try {
          const Component = await loadVariation(id, variationId)
          if (Component) {
            components[variationId] = Component
          } else {
            console.warn(`Failed to load variation ${variationId} for component ${id}`)
          }
        } catch (error) {
          console.error(`Error loading variation ${variationId} for component ${id}:`, error)
        }
      }
      if (Object.keys(components).length > 0) {
        setLoadedComponents((prev) => ({ ...prev, ...components }))
      }
    }

    loadComponents()
  }, [id, activeVariations, prototype?.hasVariations])

  useEffect(() => {
    if (!prototype?.hasVariations || archivedVariations.length === 0) return

    // Load all archived variation components
    const loadArchivedComponents = async () => {
      const components: Record<string, ComponentType> = {}
      for (const variationId of archivedVariations) {
        try {
          const Component = await loadArchivedVariation(id, variationId)
          if (Component) {
            components[variationId] = Component
          } else {
            console.warn(`Failed to load archived variation ${variationId} for component ${id}`)
          }
        } catch (error) {
          console.error(`Error loading archived variation ${variationId} for component ${id}:`, error)
        }
      }
      if (Object.keys(components).length > 0) {
        setLoadedArchivedComponents((prev) => ({ ...prev, ...components }))
      }
    }

    loadArchivedComponents()
  }, [id, archivedVariations, prototype?.hasVariations])

  if (!prototype) {
    notFound()
  }

  const handleArchive = async (variationId: string) => {
    // TODO: Implement archive functionality via API route or server action
    console.log(`Archive ${variationId}`)
    // For now, just show a message
    alert(`Archive functionality will be implemented. Would archive: ${variationId}`)
  }

  const handleDelete = (variationId: string, isArchived: boolean) => {
    setVariationToDelete({ id: variationId, isArchived })
    setDeleteDialogOpen(true)
  }

  const confirmDelete = async () => {
    if (!variationToDelete) return
    // TODO: Implement delete functionality via API route or server action
    console.log(`Delete ${variationToDelete.id} (archived: ${variationToDelete.isArchived})`)
    setDeleteDialogOpen(false)
    setVariationToDelete(null)
    alert(`Delete functionality will be implemented. Would delete: ${variationToDelete.id}`)
  }

  const handleRestore = async (variationId: string) => {
    // TODO: Implement restore functionality via API route or server action
    console.log(`Restore ${variationId}`)
    alert(`Restore functionality will be implemented. Would restore: ${variationId}`)
  }

  // Legacy component (no variations)
  if (!prototype.hasVariations && prototype.component) {
    const Component = prototype.component
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="mb-6">
          <Link href="/prototypes">
            <Button variant="ghost" className="mb-4">
              <ArrowLeft size={16} className="mr-2" />
              Back to Prototypes
            </Button>
          </Link>
          <div className="mb-4">
            <h1 className="text-3xl font-bold mb-2">{prototype.name}</h1>
            <p className="text-muted-foreground">{prototype.description}</p>
          </div>
        </div>

        <div className="bg-card border rounded-lg flex flex-col" style={{ minHeight: '992px' }}>
          <div className="flex-1 overflow-y-auto">
            <Component />
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
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-6">
        <Link href="/prototypes">
          <Button variant="ghost" className="mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Prototypes
          </Button>
        </Link>
        <div className="mb-4">
          <h1 className="text-3xl font-bold mb-2">{prototype.name}</h1>
          <p className="text-muted-foreground">{prototype.description}</p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="flex items-center justify-between mb-4">
          <TabsList className="flex-1">
            {activeVariations.map((variationId) => (
              <TabsTrigger key={variationId} value={variationId}>
                {variationId}
              </TabsTrigger>
            ))}
            {archivedVariations.length > 0 && (
              <TabsTrigger value="archive" className="ml-auto">
                Archive ({archivedVariations.length})
              </TabsTrigger>
            )}
          </TabsList>
        </div>

        {activeVariations.map((variationId) => {
          const Component = loadedComponents[variationId]
          return (
            <TabsContent key={variationId} value={variationId} className="mt-0">
              <div className="bg-card border rounded-lg flex flex-col" style={{ minHeight: '992px' }}>
                <div className="flex items-center justify-between p-6 pb-4 border-b flex-shrink-0">
                  <h2 className="text-lg font-semibold">Variation {variationId}</h2>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleArchive(variationId)}
                  >
                    <Archive size={16} className="mr-2" />
                    Archive
                  </Button>
                </div>
                <div className="flex-1 overflow-y-auto">
                  {Component ? (
                    <Component />
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
            </TabsContent>
          )
        })}

        {archivedVariations.length > 0 && (
          <TabsContent value="archive" className="mt-0">
            <div className="bg-muted/50 rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4">Archived Variations</h2>
              <div className="space-y-4">
                {archivedVariations.map((variationId) => {
                  const Component = loadedArchivedComponents[variationId]
                  return (
                    <div
                      key={variationId}
                      className="border rounded-lg p-4 bg-background"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-medium">{variationId}</h3>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleRestore(variationId)}
                          >
                            <Reset size={16} className="mr-2" />
                            Restore
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDelete(variationId, true)}
                          >
                            <TrashCan size={16} className="mr-2" />
                            Delete
                          </Button>
                        </div>
                      </div>
                      <div className="border-t pt-4">
                        {Component ? (
                          <Component />
                        ) : (
                          <div className="space-y-2">
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-3/4" />
                          </div>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </TabsContent>
        )}
      </Tabs>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete variation {variationToDelete?.id}. This action cannot be undone.
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
      <ComponentPageContent />
    </Suspense>
  )
}
