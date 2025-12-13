"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { SvgIcon } from "@/components/icons/svg-icon"
import { cn } from "@/lib/utils"

type ToolType = "move" | "scale" | "rotate" | "multiply" | null
type MaterialType = "material1" | "material2" | null

interface CoordinateInputProps {
  label: string
  value: string
  onChange: (value: string) => void
  unit: "mm" | "%" | "°"
  labelColor?: "red" | "green" | "blue"
}

function CoordinateInput({ label, value, onChange, unit, labelColor = "blue" }: CoordinateInputProps) {
  const labelColors = {
    red: "text-red-600",
    green: "text-green-600",
    blue: "text-blue-600",
  }

  return (
    <div className="flex items-center gap-2">
      <Label className={cn("text-xs font-semibold min-w-[16px]", labelColors[labelColor])}>
        {label}
      </Label>
      <div className="flex items-center gap-1 border border-gray-200 rounded px-2 py-1.5 bg-white flex-1">
        <Input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="border-0 p-0 h-auto text-xs focus-visible:ring-0 focus-visible:ring-offset-0"
        />
        <span className="text-xs text-gray-500">{unit}</span>
      </div>
    </div>
  )
}

interface AdjustmentInputProps {
  type: "move" | "scale" | "rotate" | "multiply"
  values: {
    x?: string
    y?: string
    z?: string
    xPercent?: string
    yPercent?: string
    zPercent?: string
    copies?: string
  }
  onValuesChange: (values: AdjustmentInputProps["values"]) => void
  showUniformScaling?: boolean
  uniformScaling?: boolean
  onUniformScalingChange?: (value: boolean) => void
  showDropDownModel?: boolean
  dropDownModel?: boolean
  onDropDownModelChange?: (value: boolean) => void
  showGridPlacement?: boolean
  gridPlacement?: boolean
  onGridPlacementChange?: (value: boolean) => void
}

function AdjustmentInput({
  type,
  values,
  onValuesChange,
  showUniformScaling = false,
  uniformScaling = false,
  onUniformScalingChange,
  showDropDownModel = false,
  dropDownModel = false,
  onDropDownModelChange,
  showGridPlacement = false,
  gridPlacement = false,
  onGridPlacementChange,
}: AdjustmentInputProps) {
  if (type === "move") {
    return (
      <div className="flex flex-col gap-2">
        <CoordinateInput
          label="X"
          value={values.x || "0"}
          onChange={(val) => onValuesChange({ ...values, x: val })}
          unit="mm"
          labelColor="red"
        />
        <CoordinateInput
          label="Y"
          value={values.y || "0"}
          onChange={(val) => onValuesChange({ ...values, y: val })}
          unit="mm"
          labelColor="green"
        />
        <CoordinateInput
          label="Z"
          value={values.z || "0"}
          onChange={(val) => onValuesChange({ ...values, z: val })}
          unit="mm"
          labelColor="blue"
        />
        {showDropDownModel && (
          <div className="flex items-center justify-between pt-2">
            <div className="flex items-center gap-2">
              <SvgIcon
                src="/icons/ultimaker/Ultimaker-chevron-double-down.svg"
                size={16}
                className="text-gray-600"
              />
              <Label className="text-xs">Drop Down Model</Label>
            </div>
            <Switch
              checked={dropDownModel}
              onCheckedChange={onDropDownModelChange}
            />
          </div>
        )}
      </div>
    )
  }

  if (type === "scale") {
    return (
      <div className="flex flex-col gap-2">
        <div className="flex gap-2">
          <CoordinateInput
            label="X"
            value={values.x || "0"}
            onChange={(val) => onValuesChange({ ...values, x: val })}
            unit="mm"
            labelColor="red"
          />
          <CoordinateInput
            label=""
            value={values.xPercent || "0"}
            onChange={(val) => onValuesChange({ ...values, xPercent: val })}
            unit="%"
          />
        </div>
        <div className="flex gap-2">
          <CoordinateInput
            label="Y"
            value={values.y || "0"}
            onChange={(val) => onValuesChange({ ...values, y: val })}
            unit="mm"
            labelColor="green"
          />
          <CoordinateInput
            label=""
            value={values.yPercent || "0"}
            onChange={(val) => onValuesChange({ ...values, yPercent: val })}
            unit="%"
          />
        </div>
        <div className="flex gap-2">
          <CoordinateInput
            label="Z"
            value={values.z || "0"}
            onChange={(val) => onValuesChange({ ...values, z: val })}
            unit="mm"
            labelColor="blue"
          />
          <CoordinateInput
            label=""
            value={values.zPercent || "0"}
            onChange={(val) => onValuesChange({ ...values, zPercent: val })}
            unit="%"
          />
        </div>
        {showUniformScaling && (
          <div className="flex items-center justify-between pt-2">
            <div className="flex items-center gap-2">
              <SvgIcon
                src="/icons/ultimaker/ultimaker-layflat-onface.svg"
                size={16}
                className="text-gray-600"
              />
              <Label className="text-xs">Uniform Scaling</Label>
            </div>
            <Switch
              checked={uniformScaling}
              onCheckedChange={onUniformScalingChange}
            />
          </div>
        )}
      </div>
    )
  }

  if (type === "rotate") {
    return (
      <div className="flex flex-col gap-2">
        <CoordinateInput
          label="X"
          value={values.x || "0"}
          onChange={(val) => onValuesChange({ ...values, x: val })}
          unit="°"
          labelColor="red"
        />
        <CoordinateInput
          label="Y"
          value={values.y || "0"}
          onChange={(val) => onValuesChange({ ...values, y: val })}
          unit="°"
          labelColor="green"
        />
        <CoordinateInput
          label="Z"
          value={values.z || "0"}
          onChange={(val) => onValuesChange({ ...values, z: val })}
          unit="°"
          labelColor="blue"
        />
      </div>
    )
  }

  if (type === "multiply") {
    return (
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <Label className="text-xs">Copies</Label>
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="sm" className="h-6 w-6 p-0 hover:bg-gray-100">
              <span className="text-xs">−</span>
            </Button>
            <div className="flex items-center gap-1 border border-gray-200 rounded px-2 py-1.5 bg-white min-w-[32px]">
              <Input
                type="text"
                value={values.copies || "1"}
                onChange={(e) => onValuesChange({ ...values, copies: e.target.value })}
                className="border-0 p-0 h-auto text-xs w-8 text-center focus-visible:ring-0 focus-visible:ring-offset-0"
              />
            </div>
            <Button variant="ghost" size="sm" className="h-6 w-6 p-0 hover:bg-gray-100">
              <span className="text-xs">+</span>
            </Button>
          </div>
        </div>
        {showGridPlacement && (
          <div className="flex items-center justify-between pt-2">
            <div className="flex items-center gap-2">
              <SvgIcon
                src="/icons/ultimaker/Ultimaker-cube-filled.svg"
                size={16}
                className="text-gray-600"
              />
              <Label className="text-xs">Grid Placement</Label>
            </div>
            <Switch
              checked={gridPlacement}
              onCheckedChange={onGridPlacementChange}
            />
          </div>
        )}
      </div>
    )
  }

  return null
}

interface ToolbarButtonProps {
  icon: string
  label?: string
  active?: boolean
  disabled?: boolean
  onClick?: () => void
}

function ToolbarButton({ icon, label, active = false, disabled = false, onClick }: ToolbarButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "flex flex-col items-center justify-center gap-1 p-3 rounded transition-colors",
        "w-14 h-14",
        active
          ? "bg-blue-100 text-blue-600"
          : disabled
          ? "opacity-50 cursor-not-allowed"
          : "hover:bg-gray-100 text-gray-600"
      )}
    >
      <SvgIcon src={icon} size={20} />
      {label && <span className="text-[10px]">{label}</span>}
    </button>
  )
}

export default function AdjustmentTools() {
  const [activeTool, setActiveTool] = useState<ToolType>(null)
  const [selectedMaterial, setSelectedMaterial] = useState<MaterialType>(null)
  const [values, setValues] = useState<AdjustmentInputProps["values"]>({
    x: "0",
    y: "0",
    z: "0",
    copies: "1",
  })
  const [uniformScaling, setUniformScaling] = useState(false)
  const [dropDownModel, setDropDownModel] = useState(false)
  const [gridPlacement, setGridPlacement] = useState(false)

  const handleToolClick = (tool: ToolType) => {
    setActiveTool(activeTool === tool ? null : tool)
  }

  const handleMaterialClick = (material: MaterialType) => {
    setSelectedMaterial(selectedMaterial === material ? null : material)
  }

  const handleCancel = () => {
    setActiveTool(null)
    setValues({ x: "0", y: "0", z: "0", copies: "1" })
    setUniformScaling(false)
    setDropDownModel(false)
    setGridPlacement(false)
  }

  const handleConfirm = () => {
    // Handle confirm action
    console.log("Confirm", { activeTool, values, uniformScaling, dropDownModel, gridPlacement })
    setActiveTool(null)
  }

  return (
    <div className="flex flex-col gap-4 p-5 bg-[#FAF8F6] h-full">
      <div className="flex items-start gap-2">
        {/* Toolbar Groups - Vertically Stacked */}
        <div className="flex flex-col gap-4">
          {/* Navigation Toolbar */}
          <div className="flex flex-col gap-2 p-2 bg-white/50 backdrop-blur-sm border border-[#F0ECE6] rounded-lg">
            <ToolbarButton
              icon="/icons/ultimaker/Home--Position.svg"
              active={activeTool === "move"}
              onClick={() => handleToolClick("move")}
            />
            <ToolbarButton
              icon="/icons/ultimaker/UltiMaker_Scale-edit.svg"
              active={activeTool === "scale"}
              onClick={() => handleToolClick("scale")}
            />
            <ToolbarButton
              icon="/icons/ultimaker/Rotate.svg"
              active={activeTool === "rotate"}
              onClick={() => handleToolClick("rotate")}
            />
            <ToolbarButton
              icon="/icons/ultimaker/Replicate.svg"
              active={activeTool === "multiply"}
              onClick={() => handleToolClick("multiply")}
            />
          </div>

          {/* Material Selection */}
          <div className="flex flex-col gap-2 p-2 bg-white/50 backdrop-blur-sm border border-[#F0ECE6] rounded-lg">
            <ToolbarButton
              icon="/icons/ultimaker/Ultimaker-material-1.svg"
              active={selectedMaterial === "material1"}
              onClick={() => handleMaterialClick("material1")}
            />
            <ToolbarButton
              icon="/icons/ultimaker/Ultimaker-material-2.svg"
              active={selectedMaterial === "material2"}
              onClick={() => handleMaterialClick("material2")}
            />
          </div>
        </div>

        {/* Popup Panel */}
        {activeTool && (
          <div className="w-[286px] shadow-lg border border-gray-200 rounded-lg bg-white">
            <div className="flex flex-col">
              {/* Input Fields Section */}
              <div className="p-4 border-b border-gray-200">
                <AdjustmentInput
                  type={activeTool}
                  values={values}
                  onValuesChange={setValues}
                  showUniformScaling={activeTool === "scale"}
                  uniformScaling={uniformScaling}
                  onUniformScalingChange={setUniformScaling}
                  showDropDownModel={activeTool === "move"}
                  dropDownModel={dropDownModel}
                  onDropDownModelChange={setDropDownModel}
                  showGridPlacement={activeTool === "multiply"}
                  gridPlacement={gridPlacement}
                  onGridPlacementChange={setGridPlacement}
                />
              </div>

              {/* Action Buttons (only for multiply) */}
              {activeTool === "multiply" && (
                <div className="flex justify-end gap-2 p-2 border-t border-gray-200">
                  <Button variant="ghost" size="sm" onClick={handleCancel}>
                    Cancel
                  </Button>
                  <Button size="sm" onClick={handleConfirm}>
                    Confirm
                  </Button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

