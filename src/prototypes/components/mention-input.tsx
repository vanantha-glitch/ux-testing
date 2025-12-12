"use client"

import { useRef } from "react"
import { Textarea } from "@/components/ui/textarea"
import { MentionText } from "./mention-text"
import { cn } from "@/lib/utils"

export interface MentionInputProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
  showPreview?: boolean
  previewClassName?: string
}

/**
 * MentionInput Component
 * 
 * A textarea input that supports typing prototype mentions.
 * Shows a preview of the rendered text with clickable mentions.
 * 
 * @example
 * const [text, setText] = useState("")
 * <MentionInput 
 *   value={text} 
 *   onChange={setText}
 *   placeholder="Type @right-panel.support.v2 to mention a variant"
 *   showPreview
 * />
 */
export function MentionInput({
  value,
  onChange,
  placeholder = "Type @prototypeId.variationId to mention a variant...",
  className,
  showPreview = false,
  previewClassName,
}: MentionInputProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  return (
    <div className="space-y-2">
      <Textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={cn("font-mono text-sm", className)}
        rows={showPreview ? 4 : 6}
      />
      {showPreview && value && (
        <div
          className={cn(
            "p-3 border rounded-md bg-muted/50 min-h-[60px]",
            previewClassName
          )}
        >
          <MentionText text={value} />
        </div>
      )}
      <div className="text-xs text-muted-foreground">
        Tip: Use @prototypeId.variationId to create links (e.g., @right-panel.support.v2)
      </div>
    </div>
  )
}

