"use client"

import { parseMentions, TextSegment } from "../utils/mention-parser"
import { PrototypeMention } from "./prototype-mention"
import { cn } from "@/lib/utils"

export interface MentionTextProps {
  text: string
  className?: string
  showMentionIcons?: boolean
}

/**
 * MentionText Component
 * 
 * Renders text with prototype mentions converted to clickable links.
 * Mentions are in the format @prototypeId.variationId or @prototypeId
 * 
 * @example
 * <MentionText text="Check out @right-panel.support.v2 for the new design" />
 * 
 * @example
 * <MentionText text="Compare @right-panel with @right-panel.behavior.v2" />
 */
export function MentionText({
  text,
  className,
  showMentionIcons = true,
}: MentionTextProps) {
  const segments = parseMentions(text)

  return (
    <span className={cn("whitespace-pre-wrap", className)}>
      {segments.map((segment, index) => {
        if (segment.type === "mention" && segment.prototypeId && segment.variationId) {
          return (
            <PrototypeMention
              key={index}
              prototypeId={segment.prototypeId}
              variationId={segment.variationId}
              showIcon={showMentionIcons}
            />
          )
        }
        return <span key={index}>{segment.content}</span>
      })}
    </span>
  )
}

