"use client"

import { Suspense, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { PrototypeModeProvider, usePrototypeMode } from "@/contexts/prototype-mode-context"
import { PrototypeModeToggle } from "@/components/prototype-mode-toggle"
import { 
  getPages, 
  getOrganisms, 
  getOrganismsForPage,
  isOrganism,
} from "@/prototypes/registry"

function PrototypesPageContent() {
  const router = useRouter()
  const { mode, isProduction } = usePrototypeMode()
  const [selectedPageFilter, setSelectedPageFilter] = useState<string>("all")

  const pages = getPages()
  const allOrganisms = getOrganisms()
  
  // Filter organisms by selected page
  const filteredOrganisms = selectedPageFilter === "all" 
    ? allOrganisms 
    : getOrganismsForPage(selectedPageFilter)

  // Filter by mode - in production mode, only show items with production variation
  const visiblePages = pages.filter(page => {
    if (!isProduction) return true
    return !page.hasVariations || page.variations?.includes("production")
  })

  const visibleOrganisms = filteredOrganisms.filter(organism => {
    if (!isProduction) return true
    return !organism.hasVariations || organism.variations?.includes("production")
  })

  // Helper to check if variations should be shown
  const showVariations = !isProduction

  return (
    <div className="container mx-auto py-8 px-4" style={{ backgroundColor: '#FAF8F6', minHeight: '100vh' }}>
      {/* Header with Mode Toggle */}
      <div className="mb-8">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold mb-2">Prototypes</h1>
            <p className="text-muted-foreground">
              {isProduction 
                ? "Production platform representation - clean view of current Digital Factory"
                : "Browse and test pages and organisms with experimental variations"}
            </p>
          </div>
          <PrototypeModeToggle />
        </div>
        
        {/* Quick Navigation - Hidden in production mode if there are experiments */}
        {showVariations && (
          <div className="mb-6">
            <label htmlFor="quick-nav" className="text-sm font-medium mb-2 block">
              Quick Navigation
            </label>
            <Select
              onValueChange={(value) => {
                router.push(`/prototypes/${value}`)
              }}
            >
              <SelectTrigger id="quick-nav" className="w-full sm:w-[300px]">
                <SelectValue placeholder="Jump to prototype..." />
              </SelectTrigger>
              <SelectContent>
                <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground">Pages</div>
                {visiblePages.map((page) => (
                  <SelectItem key={page.id} value={page.id}>
                    {page.name}
                  </SelectItem>
                ))}
                <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground mt-2">Organisms</div>
                {visibleOrganisms.map((organism) => (
                  <SelectItem key={organism.id} value={organism.id}>
                    {organism.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
      </div>

      {/* Accordioned Sections */}
      <Accordion type="multiple" defaultValue={["pages"]} className="w-full">
        {/* Pages Section */}
        <AccordionItem value="pages">
          <AccordionTrigger className="text-2xl font-semibold hover:no-underline">
            Pages
          </AccordionTrigger>
          <AccordionContent>
            {visiblePages.length > 0 ? (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {visiblePages.map((page) => (
                  <Card key={page.id} className="flex flex-col">
                    <CardHeader>
                      <CardTitle>{page.name}</CardTitle>
                      <CardDescription>{page.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="flex-1 flex flex-col">
                      {showVariations && page.hasVariations && page.variations && page.variations.length > 1 && (
                        <div className="mb-4">
                          <div className="text-sm font-medium mb-2">
                            Variations: {page.variations.length}
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {page.variations.map((variation) => (
                              <Badge key={variation} variant={variation === "production" ? "default" : "secondary"}>
                                {variation}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                      <Link href={`/prototypes/${page.id}`} className="mt-auto">
                        <Button className="w-full">View Page</Button>
                      </Link>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-card rounded-lg border">
                <p className="text-muted-foreground">No pages available in this mode.</p>
              </div>
            )}
          </AccordionContent>
        </AccordionItem>

        {/* Organisms Section */}
        <AccordionItem value="organisms">
          <AccordionTrigger className="text-2xl font-semibold hover:no-underline">
            <div className="flex items-center justify-between w-full pr-4">
              <span>Organisms</span>
              <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                <label htmlFor="page-filter" className="text-sm font-medium whitespace-nowrap">
                  Filter by page:
                </label>
                <Select value={selectedPageFilter} onValueChange={setSelectedPageFilter}>
                  <SelectTrigger id="page-filter" className="w-[200px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Pages</SelectItem>
                    {pages.map((page) => (
                      <SelectItem key={page.id} value={page.id}>
                        {page.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            {visibleOrganisms.length > 0 ? (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {visibleOrganisms.map((organism) => {
                  const page = pages.find(p => p.id === organism.pageId)
                  return (
                    <Card key={organism.id} className="flex flex-col">
                      <CardHeader>
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <CardTitle>{organism.name}</CardTitle>
                          {page && (
                            <Badge variant="outline" className="text-xs">
                              {page.name}
                            </Badge>
                          )}
                        </div>
                        <CardDescription>{organism.description}</CardDescription>
                      </CardHeader>
                      <CardContent className="flex-1 flex flex-col">
                        {showVariations && organism.hasVariations && organism.variations && organism.variations.length > 1 && (
                          <div className="mb-4">
                            <div className="text-sm font-medium mb-2">
                              Variations: {organism.variations.length}
                            </div>
                            <div className="flex flex-wrap gap-2">
                              {organism.variations.map((variation) => (
                                <Badge key={variation} variant={variation === "production" ? "default" : "secondary"}>
                                  {variation}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}
                        {organism.branches && organism.branches.length > 0 && showVariations && (
                          <div className="mb-4">
                            <div className="text-sm font-medium mb-2">Explorations:</div>
                            <div className="flex flex-wrap gap-2">
                              {organism.branches.map((branch) => (
                                <Badge key={branch.id} variant="outline" className="text-xs">
                                  {branch.name}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}
                        <Link href={`/prototypes/${organism.id}`} className="mt-auto">
                          <Button className="w-full">View Organism</Button>
                        </Link>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            ) : (
              <div className="text-center py-12 bg-card rounded-lg border">
                <p className="text-muted-foreground">
                  {selectedPageFilter === "all" 
                    ? "No organisms available in this mode."
                    : `No organisms found for the selected page in this mode.`}
                </p>
              </div>
            )}
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  )
}

export default function PrototypesPage() {
  return (
    <Suspense fallback={
      <div className="container mx-auto py-8 px-4" style={{ backgroundColor: '#FAF8F6', minHeight: '100vh' }}>
        <div className="animate-pulse">
          <div className="h-8 bg-muted rounded w-48 mb-4" />
          <div className="h-4 bg-muted rounded w-96 mb-8" />
        </div>
      </div>
    }>
      <PrototypeModeProvider>
        <PrototypesPageContent />
      </PrototypeModeProvider>
    </Suspense>
  )
}
