/**
 * Mention Parser Utilities
 * 
 * Parses text for prototype mentions in the format @prototypeId.variationId
 * and converts them to structured data for rendering.
 */

export interface MentionMatch {
  type: "mention"
  prototypeId: string
  variationId: string
  fullMatch: string
  startIndex: number
  endIndex: number
}

export interface TextSegment {
  type: "text" | "mention"
  content: string
  prototypeId?: string
  variationId?: string
}

/**
 * Parse text for mentions in format @prototypeId.variationId or @prototypeId
 * @param text The text to parse
 * @returns Array of text segments (text or mention)
 */
export function parseMentions(text: string): TextSegment[] {
  // Regex to match @prototypeId.variationId or @prototypeId
  // Matches: @word.word.word or @word (where word can contain dots, dashes, underscores)
  // The first part is the prototypeId, everything after the first dot is the variationId
  const mentionRegex = /@([a-zA-Z0-9_-]+)(?:\.([a-zA-Z0-9._-]+))?/g
  
  const segments: TextSegment[] = []
  let lastIndex = 0
  let match: RegExpExecArray | null

  while ((match = mentionRegex.exec(text)) !== null) {
    // Add text before the mention
    if (match.index > lastIndex) {
      segments.push({
        type: "text",
        content: text.substring(lastIndex, match.index),
      })
    }

    // Add the mention
    const prototypeId = match[1]
    const variationId = match[2] || "production"

    segments.push({
      type: "mention",
      content: match[0],
      prototypeId,
      variationId,
    })

    lastIndex = mentionRegex.lastIndex
  }

  // Add remaining text after last mention
  if (lastIndex < text.length) {
    segments.push({
      type: "text",
      content: text.substring(lastIndex),
    })
  }

  // If no mentions found, return single text segment
  if (segments.length === 0) {
    segments.push({
      type: "text",
      content: text,
    })
  }

  return segments
}

/**
 * Check if a string contains any mentions
 */
export function hasMentions(text: string): boolean {
  return /@[a-zA-Z0-9._-]+(?:\.[a-zA-Z0-9._-]+)?/.test(text)
}

