"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { prototypes } from "@/prototypes/registry"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export default function PrototypesPage() {
  const router = useRouter()

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Component Prototypes</h1>
        <p className="text-muted-foreground mb-4">
          Browse and test component variations built with shadcn/ui components
        </p>
        
        {/* Component Dropdown Navigation */}
        <div className="mb-6">
          <label htmlFor="component-select" className="text-sm font-medium mb-2 block">
            Quick Navigation
          </label>
          <Select
            onValueChange={(value) => {
              router.push(`/prototypes/${value}`)
            }}
          >
            <SelectTrigger id="component-select" className="w-full sm:w-[300px]">
              <SelectValue placeholder="Select a component..." />
            </SelectTrigger>
            <SelectContent>
              {prototypes.map((prototype) => (
                <SelectItem key={prototype.id} value={prototype.id}>
                  {prototype.name}
                  {prototype.hasVariations && prototype.variations && (
                    <span className="text-muted-foreground ml-2">
                      ({prototype.variations.length} {prototype.variations.length === 1 ? "variation" : "variations"})
                    </span>
                  )}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {prototypes.map((prototype) => (
          <Card key={prototype.id} className="flex flex-col">
            <CardHeader>
              <CardTitle>{prototype.name}</CardTitle>
              <CardDescription>{prototype.description}</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col">
              {prototype.hasVariations && prototype.variations && (
                <div className="mb-4">
                  <div className="text-sm font-medium mb-2">
                    Active Variations: {prototype.variations.length}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {prototype.variations.map((variation) => (
                      <Badge key={variation} variant="secondary">
                        {variation}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
              {prototype.fields && prototype.fields.length > 0 && (
                <div className="mb-4 flex-1">
                  <div className="text-sm font-medium mb-2">Fields:</div>
                  <div className="flex flex-wrap gap-2">
                    {prototype.fields.map((field) => (
                      <Badge key={field.name} variant="outline">
                        {field.label}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
              <Link href={`/prototypes/${prototype.id}`}>
                <Button className="w-full">View Component</Button>
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>

      {prototypes.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No prototypes yet. Create your first one!</p>
        </div>
      )}
    </div>
  )
}

