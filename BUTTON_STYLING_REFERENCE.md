# Button Styling Reference - Figma Design System

This document contains the button styling specifications extracted from the Figma design system (node-id: 2011-28973).

## Color Specifications

### Primary Buttons
- **Default**: `#100AED` (blue)
- **Hover**: `#0E08C9` (darker blue)
- **Active**: `#0C08B2` (even darker blue)
- **Disabled**: `#C6C6C6` (gray background), white text

### Danger Primary Buttons
- **Default**: `#FF0021` (red)
- **Hover**: `#CC001A` (darker red)
- **Active**: `#990014` (even darker red)
- **Disabled**: `#C6C6C6` (gray background), white text

### Ghost Buttons
- **Default**: Transparent background, `#100AED` text
- **Hover**: `#F2F4F8` background, `#100AED` text
- **Active**: `#C3C2FB` background, `#100AED` text
- **Disabled**: Transparent background, `#A9A9A9` text

### Ghost Neutral Buttons
- **Default**: Transparent background, `#282828` text
- **Hover**: `#EAEAEA` background, `#282828` text
- **Active**: `#C6C6C6` background, `#282828` text
- **Disabled**: Transparent background, `#A9A9A9` text

### Ghost Danger Buttons
- **Default**: Transparent background, `#FF0021` text
- **Hover**: `#FFE6E9` background, `#FF0021` text
- **Active**: `#FF99A6` background, `#FF0021` text
- **Disabled**: Transparent background, `#A9A9A9` text

### Outlined Buttons
- **Default**: White background, `#100AED` border, `#100AED` text
- **Hover**: `#F2F4F8` background, `#100AED` border, `#100AED` text
- **Active**: `#C3C2FB` background, `#100AED` border, `#100AED` text
- **Disabled**: White background, `#EAEAEA` border, `#A9A9A9` text

### Outlined Neutral Buttons
- **Default**: White background, `#EAEAEA` border, `#282828` text
- **Hover**: White background, `#100AED` border, `#100AED` text
- **Active**: White background, `#100AED` border, `#100AED` text
- **Disabled**: White background, transparent border, `#A9A9A9` text

### Outlined Danger Buttons
- **Default**: White background, `#FF0021` border, `#FF0021` text
- **Hover**: `#FFE6E9` background, `#FF0021` border, `#FF0021` text
- **Active**: `#FF99A6` background, `#FF0021` border, `#FF0021` text
- **Disabled**: White background, transparent border, `#A9A9A9` text

## Size Specifications

- **xs**: Height 24px, padding 8px horizontal, text-xs
- **sm**: Height 32px, padding 12px horizontal, text-sm
- **default/md**: Height 40px, padding 16px horizontal, text-sm
- **lg**: Height 48px, padding 24px horizontal, text-sm

## Border Radius

All buttons use `rounded` (4px border radius) as specified in Figma.

## Focus States

Focus states include a focus ring with:
- Outer ring: `rgba(16, 10, 237, 1)` (4px)
- Inner ring: `rgba(255, 255, 255, 1)` (2px)

## Shadow

- **Default**: `shadow-sm` (0px 1px 2px 0px rgba(0, 0, 0, 0.05))
- Applied to primary, destructive, and outlined variants

## Implementation Notes

- All button variants support hover, active, and disabled states
- Colors are hardcoded to match Figma exactly
- Border radius is 4px (rounded class)
- Focus states use the ring system with proper colors
- Disabled state uses `#A9A9A9` for text and `#C6C6C6` for backgrounds

## Figma Reference

- File: Design System - Foundation
- Node ID: 2011-28973
- URL: https://www.figma.com/design/4L2RHQ1Jb28Sbl1pVlm4xZ/Design-System---Foundation?node-id=2011-28973

