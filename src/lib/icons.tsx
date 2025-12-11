/**
 * Icon utilities - provides Carbon icons with Ultimaker fallback
 */

import { ComponentType, SVGProps } from "react"
import { SvgIcon } from "@/components/icons/svg-icon"
import { getUltimakerIcon } from "./icon-mapper"

/**
 * Create an icon component that tries Carbon first, falls back to Ultimaker
 */
export function createIcon(
  CarbonIcon: ComponentType<any>,
  iconName: string
) {
  return function Icon(props: SVGProps<SVGSVGElement> & { size?: number | string; className?: string }) {
    const ultimakerIcon = getUltimakerIcon(iconName)
    
    // If Ultimaker icon exists, use it
    if (ultimakerIcon) {
      return (
        <SvgIcon
          src={`/icons/ultimaker/${ultimakerIcon}`}
          size={props.size || 16}
          className={props.className || ""}
          style={props.style}
        />
      )
    }
    
    // Otherwise use Carbon icon
    return <CarbonIcon size={typeof props.size === "number" ? props.size : parseInt(props.size as string) || 16} className={props.className} {...props} />
  }
}

// Import Carbon icons
import {
  ArrowLeft as CarbonArrowLeft,
  Archive as CarbonArchive,
  TrashCan as CarbonTrashCan,
  Reset as CarbonReset,
  ChevronDown as CarbonChevronDown,
  ChevronUp as CarbonChevronUp,
  Printer as CarbonPrinter,
  Package as CarbonPackage,
  Settings as CarbonSettings,
  CheckmarkFilled as CarbonCheckmarkFilled,
  Time as CarbonTime,
  OverflowMenuVertical as CarbonOverflowMenuVertical,
  View as CarbonView,
  ViewOff as CarbonViewOff,
} from "@carbon/icons-react"

// Export icons with automatic fallback
export const ArrowLeft = createIcon(CarbonArrowLeft, "ArrowLeft")
export const Archive = createIcon(CarbonArchive, "Archive")
export const TrashCan = createIcon(CarbonTrashCan, "TrashCan")
export const Reset = createIcon(CarbonReset, "Reset")
export const ChevronDown = createIcon(CarbonChevronDown, "ChevronDown")
export const ChevronUp = createIcon(CarbonChevronUp, "ChevronUp")
export const Printer = createIcon(CarbonPrinter, "Printer")
export const Package = createIcon(CarbonPackage, "Package")
export const Settings = createIcon(CarbonSettings, "Settings")
export const CheckmarkFilled = createIcon(CarbonCheckmarkFilled, "CheckmarkFilled")
export const Time = createIcon(CarbonTime, "Time")
export const OverflowMenuVertical = createIcon(CarbonOverflowMenuVertical, "OverflowMenuVertical")
export const View = createIcon(CarbonView, "View")
export const ViewOff = createIcon(CarbonViewOff, "ViewOff")
