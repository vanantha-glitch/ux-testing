# Prototype Linking System

This system provides multiple ways to link to prototype variants:
1. **PrototypeLink** - Button component for explicit links
2. **MentionText** - Renders text with `@mentions` converted to links
3. **MentionInput** - Textarea with mention support and preview

## Import

```typescript
import { 
  PrototypeLink, 
  MentionText, 
  MentionInput 
} from "@/prototypes/components"
```

## Mention Syntax

You can reference prototypes using the `@mention` syntax:
- `@prototypeId` - Links to production variant
- `@prototypeId.variationId` - Links to specific variant

Examples:
- `@right-panel` → Links to right-panel production
- `@right-panel.support.v2` → Links to right-panel support.v2 variant
- `@right-panel.behavior.v2` → Links to right-panel behavior.v2 variant

## Basic Usage

### Link to Production Variant
```tsx
<PrototypeLink prototypeId="right-panel">
  View Production Version
</PrototypeLink>
```

### Link to Specific Variant
```tsx
<PrototypeLink prototypeId="right-panel" variationId="support.v2">
  View Support V2 Variant
</PrototypeLink>
```

### With Custom Styling
```tsx
<PrototypeLink 
  prototypeId="right-panel" 
  variationId="behavior.v2"
  variant="outline"
  size="sm"
  className="my-4"
>
  Compare Behavior V2
</PrototypeLink>
```

## Props

- `prototypeId` (required): The ID of the prototype to link to
- `variationId` (optional): The variation ID to link to (defaults to "production")
- `children` (optional): Button text (auto-generated if not provided)
- `variant` (optional): Button variant ("default" | "destructive" | "outline" | "secondary" | "ghost" | "link")
- `size` (optional): Button size ("default" | "sm" | "lg" | "icon")
- `className` (optional): Additional CSS classes
- `showIcon` (optional): Show arrow icon (defaults to true)

## URL Format

The component generates URLs in the format:
- Production: `/prototypes/{prototypeId}`
- Variant: `/prototypes/{prototypeId}#{variationId}`

The prototype viewer automatically opens the correct tab when a hash is present in the URL.

## MentionText Component

Render text with automatic mention parsing:

```tsx
<MentionText text="Check out @right-panel.support.v2 for the new design" />
```

```tsx
<MentionText text="Compare @right-panel with @right-panel.behavior.v2" />
```

```tsx
// In a description or documentation
<MentionText 
  text="This design is based on @right-panel but with changes from @right-panel.support.v2" 
  className="text-sm text-muted-foreground"
/>
```

## MentionInput Component

A textarea with mention support and live preview:

```tsx
const [description, setDescription] = useState("")

<MentionInput
  value={description}
  onChange={setDescription}
  placeholder="Type @right-panel.support.v2 to mention a variant"
  showPreview
/>
```

## Example: Comparison View

You can use multiple PrototypeLink buttons to create a comparison interface:

```tsx
<div className="flex gap-4 p-4">
  <PrototypeLink prototypeId="right-panel" variationId="production">
    Production
  </PrototypeLink>
  <PrototypeLink prototypeId="right-panel" variationId="support.v2">
    Support V2
  </PrototypeLink>
  <PrototypeLink prototypeId="right-panel" variationId="behavior.v2">
    Behavior V2
  </PrototypeLink>
</div>
```

## Example: Documentation with Mentions

```tsx
<div className="space-y-4">
  <h3>Related Prototypes</h3>
  <MentionText 
    text="This component is related to @right-panel and builds upon @right-panel.support.v2" 
  />
</div>
```

