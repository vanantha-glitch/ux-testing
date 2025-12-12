"use client"

import { useState, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import {
  RadioGroup,
  RadioGroupItem,
} from "@/components/ui/radio-group"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText,
} from "@/components/ui/input-group"
import { 
  ChevronDown, 
  ChevronUp, 
  Printer, 
  Package, 
  Settings, 
  CheckmarkFilled, 
  Time, 
  OverflowMenuVertical, 
  Reset 
} from "@/lib/icons"
import { UltimakerIcon } from "@/components/icons/ultimaker-icon"
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item"

export default function RightPanelV2() {
  const [activeTab, setActiveTab] = useState("prepare")
  const [profileOpen, setProfileOpen] = useState(false)
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [infillValue, setInfillValue] = useState([20])
  const [shellSide, setShellSide] = useState("1")
  const [shellTop, setShellTop] = useState("1")
  const [supportEnabled, setSupportEnabled] = useState(false)
  const [resolutionValue, setResolutionValue] = useState("0.15")
  const [adhesionValue, setAdhesionValue] = useState("Off")
  const [settingsContentRef, setSettingsContentRef] = useState<HTMLDivElement | null>(null)
  const [showScrollIndicator, setShowScrollIndicator] = useState(false)
  const [hoveredItem, setHoveredItem] = useState<string | null>(null)
  const [selectedExtruder, setSelectedExtruder] = useState<"1" | "2">("1")

  // Reset collapsible states when switching tabs
  useEffect(() => {
    setProfileOpen(false)
    setSettingsOpen(false)
  }, [activeTab])

  // Check if content overflows and show scroll indicator
  useEffect(() => {
    if (!settingsContentRef || !settingsOpen) {
      setShowScrollIndicator(false)
      return
    }

    const checkOverflow = () => {
      const hasOverflow = settingsContentRef.scrollHeight > settingsContentRef.clientHeight
      setShowScrollIndicator(hasOverflow)
    }

    checkOverflow()
    const resizeObserver = new ResizeObserver(checkOverflow)
    resizeObserver.observe(settingsContentRef)

    return () => resizeObserver.disconnect()
  }, [settingsContentRef, settingsOpen])

  return (
    <div 
      data-right-panel
      className="!inline-block" 
      style={{ 
        width: '240px', 
        maxWidth: '240px', 
        minWidth: '240px',
        flexShrink: 0,
        flexGrow: 0,
        boxSizing: 'border-box'
      }}
    >
      <div 
        className="w-[240px] max-w-[240px] min-w-[240px] flex-shrink-0 flex-grow-0 bg-white rounded-lg shadow-sm flex flex-col h-[896px]" 
        style={{ 
          width: '240px', 
          maxWidth: '240px', 
          minWidth: '240px',
          height: '896px',
          maxHeight: '896px',
          minHeight: '896px',
          flexShrink: 0,
          flexGrow: 0,
          boxSizing: 'border-box'
        }}
      >
      <Tabs value={activeTab} onValueChange={setActiveTab} defaultValue="prepare" className="flex flex-col h-full w-full">
        {/* Tabs Header */}
        <div className="w-full h-[42px] bg-background rounded-none p-0 relative" style={{ borderBottom: '1px solid #EAEAEA' }}>
          <TabsList className="inline-flex items-center text-muted-foreground w-full h-full bg-transparent rounded-none border-0 p-0 justify-start">
            <TabsTrigger
              value="prepare"
              className="rounded-none border-0 bg-transparent px-2 py-3 text-xs font-normal text-[#707070] shadow-none h-full relative border-b-[3px] border-transparent data-[state=active]:border-[#0C08B2] data-[state=active]:bg-transparent data-[state=active]:text-[#282828] data-[state=active]:font-medium data-[state=active]:shadow-none"
              style={{
                marginBottom: '-1px'
              }}
            >
              Prepare
            </TabsTrigger>
            <TabsTrigger
              value="preview"
              className="rounded-none border-0 bg-transparent px-2 py-3 text-xs font-normal text-[#707070] shadow-none h-full relative border-b-[3px] border-transparent data-[state=active]:border-[#0C08B2] data-[state=active]:bg-transparent data-[state=active]:text-[#282828] data-[state=active]:font-medium data-[state=active]:shadow-none"
              style={{
                marginBottom: '-1px'
              }}
            >
              Preview
            </TabsTrigger>
          </TabsList>
        </div>

        {/* Prepare Tab Content */}
        <TabsContent value="prepare" className="flex-1 flex flex-col m-0 p-0 overflow-hidden">
          {/* Settings Container - fills space */}
          <div className="flex-1 flex flex-col w-full min-w-0 min-h-0">
            {/* Printer Configuration Section - PanelSectionShell */}
            <div className="flex flex-col p-2 border-b border-[#EAEAEA] flex-shrink-0">
                <div className="space-y-2">
                <div className="px-2 py-1">
                  <h3 className="text-xs font-semibold text-[#282828]">Printer Configuration</h3>
                </div>
                <div className="space-y-1">
                  {/* Printer Type */}
                  <Item 
                    size="sm" 
                    className="h-10 cursor-pointer transition-colors"
                    style={{ backgroundColor: hoveredItem === 'printer' ? '#F8F8F8' : 'transparent' }}
                    onMouseEnter={() => setHoveredItem('printer')}
                    onMouseLeave={() => setHoveredItem(null)}
                  >
                    <ItemMedia>
                      <Printer size={16} className="text-muted-foreground" />
                    </ItemMedia>
                    <ItemContent>
                      <ItemTitle className="text-xs text-[#282828]">Printer Type</ItemTitle>
                    </ItemContent>
                  </Item>
                  
                  {/* Material Type 1 */}
                  <Item 
                    size="sm" 
                    className="min-h-[52px] cursor-pointer transition-colors"
                    style={{ backgroundColor: hoveredItem === 'material1' ? '#F8F8F8' : 'transparent' }}
                    onMouseEnter={() => setHoveredItem('material1')}
                    onMouseLeave={() => setHoveredItem(null)}
                  >
                    <ItemMedia>
                      <Package size={16} className="text-muted-foreground" />
                    </ItemMedia>
                    <ItemContent>
                      <ItemTitle className="text-xs text-[#282828]">Material Type</ItemTitle>
                      <ItemDescription className="text-xs text-[#707070]">Secondary Info</ItemDescription>
                    </ItemContent>
                    <ItemActions>
                      <p className="text-xs text-[#707070]">Core</p>
                    </ItemActions>
                  </Item>
                  
                  {/* Material Type 2 */}
                  <Item 
                    size="sm" 
                    className="min-h-[52px] cursor-pointer transition-colors"
                    style={{ backgroundColor: hoveredItem === 'material2' ? '#F8F8F8' : 'transparent' }}
                    onMouseEnter={() => setHoveredItem('material2')}
                    onMouseLeave={() => setHoveredItem(null)}
                  >
                    <ItemMedia>
                      <Package size={16} className="text-muted-foreground" />
                    </ItemMedia>
                    <ItemContent>
                      <ItemTitle className="text-xs text-[#282828]">Material Type</ItemTitle>
                      <ItemDescription className="text-xs text-[#707070]">Secondary Info</ItemDescription>
                    </ItemContent>
                    <ItemActions>
                      <p className="text-xs text-[#707070]">Core</p>
                    </ItemActions>
                  </Item>
                </div>
                </div>
              </div>

              {/* Profile Section - PanelSectionShell */}
              <div className="flex flex-col p-2 border-b border-[#EAEAEA] flex-shrink-0 h-[72px]">
                <Collapsible open={profileOpen} onOpenChange={setProfileOpen} className="h-full flex flex-col">
                  <CollapsibleTrigger className="w-full px-2 py-2 flex items-center justify-between hover:bg-muted/50 rounded-t flex-shrink-0">
                    <div className="flex items-center gap-2">
                      <h3 className="text-xs font-semibold text-[#282828]">Profile</h3>
                    </div>
                    {profileOpen ? (
                      <ChevronDown size={16} className="text-muted-foreground" />
                    ) : (
                      <ChevronUp size={16} className="text-muted-foreground" />
                    )}
                  </CollapsibleTrigger>
                  <CollapsibleContent className="flex-1">
                    <div className="px-2 pb-2">
                      <div className="flex items-center gap-2 px-2 py-2 rounded hover:bg-muted/50">
                        <Settings size={16} className="text-muted-foreground" />
                        <p className="text-xs text-[#282828]">Draft</p>
                      </div>
                    </div>
                  </CollapsibleContent>
                </Collapsible>
              </div>

              {/* Settings Section - PanelSectionShell - fills remaining space */}
              <div className="flex-1 flex flex-col w-full min-w-0 min-h-0 p-2 border-b border-[#EAEAEA]">
                <Collapsible open={settingsOpen} onOpenChange={setSettingsOpen} className="flex-1 flex flex-col w-full min-w-0 min-h-0">
                  <CollapsibleTrigger className="w-full px-2 py-2 flex items-center justify-between hover:bg-muted/50 rounded-t flex-shrink-0">
                    <div className="flex items-center gap-2">
                      <h3 className="text-xs font-semibold text-[#282828]">Settings</h3>
                    </div>
                    {settingsOpen ? (
                      <ChevronDown size={16} className="text-muted-foreground" />
                    ) : (
                      <ChevronUp size={16} className="text-muted-foreground" />
                    )}
                  </CollapsibleTrigger>
                  <div className="flex-1 flex flex-col w-full min-w-0 min-h-0 relative overflow-hidden">
                    {/* Collapsed State - Summary View - fills space, content at top */}
                    {!settingsOpen && (
                      <div className="flex-1 flex flex-col min-h-0 px-2 py-2">
                        <div className="flex flex-col gap-2 flex-shrink-0">
                          {/* Row 1: Support and Resolution */}
                          <div className="flex items-center gap-2">
                            <div className="flex items-center gap-2 flex-1">
                              <UltimakerIcon name="Ultimaker-Support" size={16} className="text-muted-foreground flex-shrink-0" />
                              <span className="text-xs text-[#282828] min-w-[24px]">{supportEnabled ? "On" : "Off"}</span>
                            </div>
                            <div className="flex items-center gap-2 flex-1">
                              <UltimakerIcon name="UltiMaker_PrintQuality" size={16} className="text-muted-foreground flex-shrink-0" />
                              <span className="text-xs text-[#282828]">{resolutionValue === "0.15" ? "0.15 mm" : resolutionValue === "0.20" ? "0.20 mm" : resolutionValue === "0.25" ? "0.25 mm" : resolutionValue}</span>
                            </div>
                          </div>
                          {/* Row 2: Infill and Adhesion */}
                          <div className="flex items-center gap-2">
                            <div className="flex items-center gap-2 flex-1">
                              <UltimakerIcon name="Ultimaker-infill-1" size={16} className="text-muted-foreground flex-shrink-0" />
                              <span className="text-xs text-[#282828]">{infillValue[0]} %</span>
                            </div>
                            <div className="flex items-center gap-2 flex-1">
                              <UltimakerIcon name="Ultimaker-Adhesion" size={16} className="text-muted-foreground flex-shrink-0" />
                              <span className="text-xs text-[#282828]">{adhesionValue}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                    {/* Expanded State - Full Form */}
                    <CollapsibleContent className="flex-1 flex flex-col w-full min-w-0 overflow-hidden min-h-0" style={{ width: '100%', maxWidth: '100%' }}>
                      <ScrollArea className="flex-1 w-full min-w-0 max-w-[224px] h-full min-h-0" style={{ width: '100%', maxWidth: '224px', height: '100%' }}>
                        <div 
                          ref={setSettingsContentRef}
                          className="w-full min-w-0 max-w-[224px] px-2 py-2 space-y-2"
                          style={{ scrollbarWidth: 'thin', boxSizing: 'border-box', width: '100%', maxWidth: '224px' }}
                        >
                          {/* Support Toggle - Now at the top */}
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2 flex-1 min-w-0">
                              <UltimakerIcon name="Ultimaker-Support" size={16} className="text-muted-foreground flex-shrink-0" />
                              <Label className="text-xs font-normal text-[#282828] flex-shrink-0">Support</Label>
                            </div>
                            <div className="flex items-center gap-2 flex-shrink-0">
                              <div className="w-5 h-5 flex items-center justify-center flex-shrink-0">
                                {supportEnabled && (
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      setSupportEnabled(false)
                                    }}
                                    className="p-0.5 hover:bg-muted/50 rounded"
                                    aria-label="Reset support"
                                  >
                                    <Reset size={12} className="text-muted-foreground" />
                                  </button>
                                )}
                              </div>
                              <Switch
                                checked={supportEnabled}
                                onCheckedChange={setSupportEnabled}
                                className="h-4 w-8 flex-shrink-0"
                              />
                            </div>
                          </div>

                          {/* Additional fields when support is enabled */}
                          {supportEnabled && (
                            <>
                              {/* Extruder Selection */}
                              <div className="space-y-1">
                                <RadioGroup 
                                  value={selectedExtruder} 
                                  onValueChange={(value) => setSelectedExtruder(value as "1" | "2")}
                                  className="flex flex-col gap-1"
                                >
                                  <div className="flex items-center gap-2 px-2 py-2 rounded transition-colors">
                                    <RadioGroupItem value="1" id="extruder-1" />
                                    <Label htmlFor="extruder-1" className="text-xs text-[#282828] cursor-pointer">
                                      Extruder 1
                                    </Label>
                                  </div>
                                  <div className="flex items-center gap-2 px-2 py-2 rounded transition-colors">
                                    <RadioGroupItem value="2" id="extruder-2" />
                                    <Label htmlFor="extruder-2" className="text-xs text-[#282828] cursor-pointer">
                                      Extruder 2
                                    </Label>
                                  </div>
                                </RadioGroup>
                              </div>

                              {/* Type Dropdown */}
                              <div className="flex flex-col gap-2">
                                <Label id="support-type-label-v2" htmlFor="support-type-select-v2" className="text-xs font-normal text-[#282828]">Type</Label>
                                <Select defaultValue="option">
                                  <SelectTrigger id="support-type-select-v2" className="h-8 text-xs border-[#EAEAEA]" aria-labelledby="support-type-label-v2">
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="option">Option</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>

                              {/* Placement Dropdown */}
                              <div className="flex flex-col gap-2">
                                <Label id="support-placement-label-v2" htmlFor="support-placement-select-v2" className="text-xs font-normal text-[#282828]">Placement</Label>
                                <Select defaultValue="option">
                                  <SelectTrigger id="support-placement-select-v2" className="h-8 text-xs border-[#EAEAEA]" aria-labelledby="support-placement-label-v2">
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="option">Option</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                            </>
                          )}

                          {/* Resolution Dropdown */}
                          <div className="flex flex-col gap-2">
                            <div className="flex items-center gap-2">
                              <UltimakerIcon name="UltiMaker_PrintQuality" size={16} className="text-muted-foreground" />
                              <Label id="resolution-label-v2" htmlFor="resolution-select-v2" className="text-xs font-normal text-[#282828]">Resolution</Label>
                            </div>
                            <Select value={resolutionValue} onValueChange={setResolutionValue}>
                              <SelectTrigger id="resolution-select-v2" className="h-8 text-xs border-[#EAEAEA]" aria-labelledby="resolution-label-v2">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="option">Option</SelectItem>
                                <SelectItem value="0.15">0.15 mm</SelectItem>
                                <SelectItem value="0.20">0.20 mm</SelectItem>
                                <SelectItem value="0.25">0.25 mm</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          {/* Infill Slider */}
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <UltimakerIcon name="Ultimaker-infill-1" size={16} className="text-muted-foreground" />
                              <Label className="text-xs font-normal text-[#282828]">Infill</Label>
                            </div>
                            <div className="flex items-center gap-2">
                              <Slider
                                value={infillValue}
                                onValueChange={setInfillValue}
                                max={100}
                                step={1}
                                className="flex-1"
                              />
                              <InputGroup className="!w-[72px] !min-w-[72px] !max-w-[72px] flex-shrink-0 h-8 border-[#EAEAEA]" style={{ width: '72px', minWidth: '72px', maxWidth: '72px' }}>
                                <InputGroupInput
                                  type="text"
                                  value={infillValue[0]}
                                  onChange={(e) => {
                                    const val = parseInt(e.target.value) || 0
                                    setInfillValue([Math.min(100, Math.max(0, val))])
                                  }}
                                  className="text-xs text-left text-[#282828]"
                                />
                                <InputGroupAddon align="inline-end">
                                  <InputGroupText className="text-xs text-[#707070]">%</InputGroupText>
                                </InputGroupAddon>
                              </InputGroup>
                            </div>
                          </div>

                          {/* Shell Thickness */}
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <UltimakerIcon name="Ultimaker-shell" size={16} className="text-muted-foreground" />
                              <Label className="text-xs font-normal text-[#282828]">Shell Thickness</Label>
                            </div>
                            <div className="flex items-center gap-2">
                              {/* Side Input */}
                              <div className="flex items-center gap-2 flex-1 min-w-0">
                                <UltimakerIcon name="Ultimaker-shell-Side" size={16} className="text-muted-foreground flex-shrink-0" />
                                <InputGroup className="flex-1 h-8 border-[#EAEAEA] min-w-0">
                                  <InputGroupInput
                                    type="text"
                                    value={shellSide}
                                    onChange={(e) => setShellSide(e.target.value)}
                                    className="text-xs text-left text-[#282828]"
                                  />
                                  <InputGroupAddon align="inline-end">
                                    <InputGroupText className="text-xs text-[#707070]">mm</InputGroupText>
                                  </InputGroupAddon>
                                </InputGroup>
                              </div>
                              {/* Top Input */}
                              <div className="flex items-center gap-2 flex-1 min-w-0">
                                <UltimakerIcon name="Ultimaker-shell-Top" size={16} className="text-muted-foreground flex-shrink-0" />
                                <InputGroup className="flex-1 h-8 border-[#EAEAEA] min-w-0">
                                  <InputGroupInput
                                    type="text"
                                    value={shellTop}
                                    onChange={(e) => setShellTop(e.target.value)}
                                    className="text-xs text-left text-[#282828]"
                                  />
                                  <InputGroupAddon align="inline-end">
                                    <InputGroupText className="text-xs text-[#707070]">mm</InputGroupText>
                                  </InputGroupAddon>
                                </InputGroup>
                              </div>
                            </div>
                          </div>

                          {/* Infill Pattern */}
                          <div className="flex flex-col gap-2">
                            <div className="flex items-center gap-2">
                              <UltimakerIcon name="Ultimaker-infill-2" size={16} className="text-muted-foreground" />
                              <Label id="infill-pattern-label-v2" htmlFor="infill-pattern-select-v2" className="text-xs font-normal text-[#282828]">Infill Pattern</Label>
                            </div>
                            <Select defaultValue="option">
                              <SelectTrigger id="infill-pattern-select-v2" className="h-8 text-xs border-[#EAEAEA]" aria-labelledby="infill-pattern-label-v2">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="option">Option</SelectItem>
                                <SelectItem value="grid">Grid</SelectItem>
                                <SelectItem value="triangles">Triangles</SelectItem>
                                <SelectItem value="honeycomb">Honeycomb</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          {/* Adhesion Dropdown */}
                          <div className="flex flex-col gap-2">
                            <div className="flex items-center gap-2">
                              <UltimakerIcon name="Ultimaker-Adhesion" size={16} className="text-muted-foreground" />
                              <Label id="adhesion-label-v2" htmlFor="adhesion-select-v2" className="text-xs font-normal text-[#282828]">Adhesion</Label>
                            </div>
                            <Select value={adhesionValue} onValueChange={setAdhesionValue}>
                              <SelectTrigger id="adhesion-select-v2" className="h-8 text-xs border-[#EAEAEA]" aria-labelledby="adhesion-label-v2">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Off">Off</SelectItem>
                                <SelectItem value="Brim">Brim</SelectItem>
                                <SelectItem value="Raft">Raft</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      </ScrollArea>
                      {/* Scroll Indicator */}
                      {showScrollIndicator && (
                        <div className="absolute right-0 top-0 bottom-0 w-2 flex items-center justify-center pointer-events-none">
                          <div className="w-1 h-8 bg-[#A9A9A9] rounded-full opacity-50" />
                        </div>
                      )}
                    </CollapsibleContent>
                  </div>
                </Collapsible>
              </div>

              {/* Print Validation Section - PanelSectionShell */}
              <div className="flex flex-col p-2 flex-shrink-0 border-t border-[#EAEAEA]">
                <div className="space-y-2">
                  <div className="px-2 py-1">
                    <h3 className="text-xs font-semibold text-[#282828]">Print Validation</h3>
                  </div>
                  <div className="flex items-center gap-2 px-2 py-2 rounded">
                    <CheckmarkFilled size={16} className="text-[#A9A9A9]" />
                    <div className="flex-1">
                      <p className="text-xs text-[#A9A9A9]">0</p>
                      <p className="text-xs text-[#A9A9A9]">No issues detected</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Button - Primary CTA */}
              <div className="p-4 flex-shrink-0 border-t border-[#EAEAEA]">
                <Button
                  variant="default"
                  className="w-full !bg-[#100AED] hover:!bg-[#100AED]/90 !text-white font-normal !border-0 shadow-sm"
                  size="sm"
                >
                  Slice
                </Button>
              </div>
            </div>
        </TabsContent>

        {/* Preview Tab Content */}
        {activeTab === "preview" && (
          <TabsContent value="preview" className="flex-1 flex flex-col m-0 p-0 overflow-y-auto">
            <ScrollArea className="flex-1 w-full">
              <div className="w-full min-w-0 p-2 space-y-4">
                {/* Toolpath Legend */}
                <div className="pb-2">
                  <div className="space-y-1 px-4">
                    <div className="flex items-center gap-2 py-1 px-2 rounded">
                      <div className="w-4 h-4 bg-blue-500 rounded" />
                      <p className="text-xs text-[#282828]">Wall inner</p>
                    </div>
                    <div className="flex items-center gap-2 py-1 px-2 rounded">
                      <div className="w-4 h-4 bg-blue-600 rounded" />
                      <p className="text-xs text-[#282828]">Wall outer</p>
                    </div>
                    <div className="flex items-center gap-2 py-1 px-2 rounded">
                      <div className="w-4 h-4 bg-green-500 rounded" />
                      <p className="text-xs text-[#282828]">Skirt</p>
                    </div>
                    <div className="flex items-center gap-2 py-1 px-2 rounded">
                      <div className="w-4 h-4 bg-yellow-500 rounded" />
                      <p className="text-xs text-[#282828]">Fill</p>
                    </div>
                    <div className="flex items-center gap-2 py-1 px-2 rounded">
                      <div className="w-4 h-4 bg-orange-500 rounded" />
                      <p className="text-xs text-[#282828]">Skin</p>
                    </div>
                    <div className="flex items-center gap-2 py-1 px-2 rounded">
                      <div className="w-4 h-4 bg-red-500 rounded" />
                      <p className="text-xs text-[#282828]">Support</p>
                    </div>
                    <div className="flex items-center gap-2 py-1 px-2 rounded">
                      <div className="w-4 h-4 bg-purple-500 rounded" />
                      <p className="text-xs text-[#282828]">Label</p>
                    </div>
                  </div>
                </div>

                {/* Material Info */}
                <div className="space-y-4 px-4">
                  {/* Time Estimation */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xs font-semibold text-[#707070]">Time Estimation</h3>
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-[#707070] w-[120px]">Overall Time</span>
                        <span className="text-xs text-[#707070]">20:30</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-[#707070] w-[120px]">Infill:</span>
                        <span className="text-xs text-[#707070]">02:24</span>
                        <span className="text-xs text-[#707070]">7%</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-[#707070] w-[120px]">Infill:</span>
                        <span className="text-xs text-[#707070]">02:03</span>
                        <span className="text-xs text-[#707070]">9%</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-[#707070] w-[120px]">Infill:</span>
                        <span className="text-xs text-[#707070]">02:45</span>
                        <span className="text-xs text-[#707070]">15%</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-[#707070] w-[120px]">Infill:</span>
                        <span className="text-xs text-[#707070]">03:44</span>
                        <span className="text-xs text-[#707070]">3%</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-[#707070] w-[120px]">Infill:</span>
                        <span className="text-xs text-[#707070]">00:05</span>
                        <span className="text-xs text-[#707070]">5%</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-[#707070] w-[120px]">Infill:</span>
                        <span className="text-xs text-[#707070]">00:12</span>
                        <span className="text-xs text-[#707070]">21%</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-[#707070] w-[120px]">Infill:</span>
                        <span className="text-xs text-[#707070]">08:00</span>
                        <span className="text-xs text-[#707070]">17%</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-[#707070] w-[120px]">Infill:</span>
                        <span className="text-xs text-[#707070]">07:12</span>
                        <span className="text-xs text-[#707070]">12%</span>
                      </div>
                    </div>
                  </div>

                  {/* Material 1 */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xs font-semibold text-[#707070]">Material 1</h3>
                      <span className="text-xs text-[#707070]">PLA</span>
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-[#707070]">Weight:</span>
                        <span className="text-xs text-[#707070]">2.26 g</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-[#707070]">Length:</span>
                        <span className="text-xs text-[#707070]">2.85 m</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-[#707070]">Material Cost</span>
                        <span className="text-xs text-[#707070]">$6.49</span>
                      </div>
                    </div>
                  </div>

                  {/* Material 2 */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xs font-semibold text-[#707070]">Material 2</h3>
                      <span className="text-xs text-[#707070]">PVA</span>
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-[#707070]">Weight:</span>
                        <span className="text-xs text-[#707070]">2.26 g</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-[#707070]">Length:</span>
                        <span className="text-xs text-[#707070]">2.85 m</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-[#707070]">Material Cost</span>
                        <span className="text-xs text-[#707070]">$16.49</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
          </ScrollArea>

          {/* Action Section */}
          <div className="p-4 space-y-4 flex-shrink-0 border-t border-[#EAEAEA]">
            <div className="flex items-center gap-2">
              <Time size={16} className="text-muted-foreground" />
              <div className="flex-1">
                <p className="text-sm font-medium text-[#282828]">6 hours 33 minutes</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Package size={16} className="text-muted-foreground" />
              <div className="flex-1">
                <p className="text-sm font-medium text-[#282828]">121 g</p>
                <p className="text-xs text-[#707070]">15.29m</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button 
                variant="default"
                className="flex-1 !bg-[#100AED] hover:!bg-[#100AED]/90 !text-white !border-0 shadow-sm" 
                size="sm"
              >
                Queue
              </Button>
              <Button variant="outline" size="sm" className="px-3 border-[#EAEAEA]">
                <OverflowMenuVertical size={16} />
              </Button>
            </div>
          </div>
          </TabsContent>
        )}
      </Tabs>
      </div>
    </div>
  )
}
