"use client"

import { useState } from "react"
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
  OverflowMenuVertical 
} from "@/lib/icons"
import { UltimakerIcon } from "@/components/icons/ultimaker-icon"

export default function RightPanelV1() {
  const [profileOpen, setProfileOpen] = useState(false)
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [infillValue, setInfillValue] = useState([20])
  const [shellSide, setShellSide] = useState("1")
  const [shellTop, setShellTop] = useState("1")
  const [supportEnabled, setSupportEnabled] = useState(false)

  return (
    <div 
      className="w-[240px] bg-white rounded-lg shadow-sm flex flex-col h-[992px]"
      style={{
        width: '240px',
        height: '992px',
        maxHeight: '992px',
        minHeight: '992px',
        boxSizing: 'border-box'
      }}
    >
      <Tabs defaultValue="prepare" className="flex flex-col h-full">
        {/* Tabs Header */}
        <div className="px-2">
          <TabsList className="w-full justify-start bg-transparent h-auto p-0 gap-0">
            <TabsTrigger
              value="prepare"
              className="px-2 py-3 rounded-none border-b-2 border-transparent data-[state=active]:border-[#0C08B2] data-[state=active]:bg-transparent data-[state=active]:text-[#282828] text-xs"
            >
              Prepare
            </TabsTrigger>
            <TabsTrigger
              value="preview"
              className="px-2 py-3 rounded-none border-b-2 border-transparent data-[state=active]:border-[#0C08B2] data-[state=active]:bg-transparent data-[state=active]:text-[#282828] text-xs text-[#707070]"
            >
              Preview
            </TabsTrigger>
          </TabsList>
        </div>

        {/* Prepare Tab Content */}
        <TabsContent value="prepare" className="flex-1 flex flex-col m-0 p-0 overflow-y-auto">
          <ScrollArea className="flex-1 w-full">
            <div className="p-2 flex flex-col h-full">
              {/* Printer Configuration Section */}
              <div className="rounded p-2 space-y-2 flex-shrink-0">
                <div className="px-2 py-1">
                  <h3 className="text-xs font-semibold text-[#282828]">Printer Configuration</h3>
                </div>
                <div className="space-y-1">
                  {/* Printer Type */}
                  <div className="flex items-center gap-2 px-2 py-2 rounded hover:bg-muted/50 h-10">
                    <Printer size={16} className="text-muted-foreground flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-[#282828]">Printer Type</p>
                    </div>
                  </div>
                  
                  {/* Material Type 1 */}
                  <div className="flex items-start gap-2 px-2 py-2 rounded hover:bg-muted/50 min-h-[52px]">
                    <Package size={16} className="text-muted-foreground mt-0.5 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-[#282828]">Material Type</p>
                      <p className="text-xs text-[#707070]">Secondary Info</p>
                      <p className="text-xs text-[#707070] text-right mt-1">Core</p>
                    </div>
                  </div>
                  
                  {/* Material Type 2 */}
                  <div className="flex items-start gap-2 px-2 py-2 rounded hover:bg-muted/50 min-h-[52px]">
                    <Package size={16} className="text-muted-foreground mt-0.5 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-[#282828]">Material Type</p>
                      <p className="text-xs text-[#707070]">Secondary Info</p>
                      <p className="text-xs text-[#707070] text-right mt-1">Core</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Profile Section */}
              <div className="rounded flex-shrink-0 mt-2 h-[72px]">
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

              {/* Settings Section - Always fills remaining space */}
              <div className="rounded flex-1 flex flex-col mt-2">
                <Collapsible open={settingsOpen} onOpenChange={setSettingsOpen} className="flex-1 flex flex-col w-full">
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
                  <div className="flex-1 flex flex-col">
                    <CollapsibleContent className="flex-1 flex flex-col">
                      <div className="p-2 space-y-2 flex-1 min-h-0">
                      {/* Resolution Dropdown */}
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <UltimakerIcon name="UltiMaker_PrintQuality" size={16} className="text-muted-foreground" />
                          <Label className="text-xs font-normal text-[#282828]">Resolution</Label>
                        </div>
                        <Select defaultValue="option">
                          <SelectTrigger className="h-8 text-xs border-[#EAEAEA]">
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
                            className="w-[125px]"
                          />
                          <InputGroup className="flex-1 h-8 border-[#EAEAEA]">
                            <InputGroupInput
                              type="text"
                              value={infillValue[0]}
                              onChange={(e) => {
                                const val = parseInt(e.target.value) || 0
                                setInfillValue([Math.min(100, Math.max(0, val))])
                              }}
                              className="text-xs text-center text-[#282828]"
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
                          <div className="flex items-center gap-2 flex-1">
                            <UltimakerIcon name="Ultimaker-shell-Side" size={16} className="text-muted-foreground" />
                            <InputGroup className="flex-1 h-8 border-[#EAEAEA]">
                              <InputGroupInput
                                type="text"
                                value={shellSide}
                                onChange={(e) => setShellSide(e.target.value)}
                                className="text-xs text-center text-[#282828]"
                              />
                              <InputGroupAddon align="inline-end">
                                <InputGroupText className="text-xs text-[#707070]">mm</InputGroupText>
                              </InputGroupAddon>
                            </InputGroup>
                          </div>
                          <div className="flex items-center gap-2 flex-1">
                            <UltimakerIcon name="Ultimaker-shell-Top" size={16} className="text-muted-foreground" />
                            <InputGroup className="flex-1 h-8 border-[#EAEAEA]">
                              <InputGroupInput
                                type="text"
                                value={shellTop}
                                onChange={(e) => setShellTop(e.target.value)}
                                className="text-xs text-center text-[#282828]"
                              />
                              <InputGroupAddon align="inline-end">
                                <InputGroupText className="text-xs text-[#707070]">mm</InputGroupText>
                              </InputGroupAddon>
                            </InputGroup>
                          </div>
                        </div>
                      </div>

                      {/* Infill Pattern */}
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <UltimakerIcon name="Ultimaker-infill-2" size={16} className="text-muted-foreground" />
                          <Label className="text-xs font-normal text-[#282828]">Infill Pattern</Label>
                        </div>
                        <Select defaultValue="option">
                          <SelectTrigger className="h-8 text-xs border-[#EAEAEA]">
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

                      {/* Support Toggle */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <UltimakerIcon name="Ultimaker-Support" size={16} className="text-muted-foreground" />
                          <Label className="text-xs font-normal text-[#282828]">Support</Label>
                        </div>
                        <Switch
                          checked={supportEnabled}
                          onCheckedChange={setSupportEnabled}
                          className="h-4 w-8"
                        />
                      </div>
                    </div>
                    </CollapsibleContent>
                    {/* Spacer that maintains the height when content is collapsed */}
                    {!settingsOpen && (
                      <div className="flex-1 flex flex-col" aria-hidden="true">
                      <div className="p-2 space-y-2 flex-1">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <UltimakerIcon name="UltiMaker_PrintQuality" size={16} className="text-muted-foreground" />
                            <Label className="text-xs font-normal text-[#282828]">Resolution</Label>
                          </div>
                          <div className="h-8" />
                        </div>
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <UltimakerIcon name="Ultimaker-infill-1" size={16} className="text-muted-foreground" />
                            <Label className="text-xs font-normal text-[#282828]">Infill</Label>
                          </div>
                          <div className="h-8" />
                        </div>
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <UltimakerIcon name="Ultimaker-shell" size={16} className="text-muted-foreground" />
                            <Label className="text-xs font-normal text-[#282828]">Shell Thickness</Label>
                          </div>
                          <div className="h-8" />
                        </div>
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <UltimakerIcon name="Ultimaker-infill-2" size={16} className="text-muted-foreground" />
                            <Label className="text-xs font-normal text-[#282828]">Infill Pattern</Label>
                          </div>
                          <div className="h-8" />
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <UltimakerIcon name="Ultimaker-Support" size={16} className="text-muted-foreground" />
                            <Label className="text-xs font-normal text-[#282828]">Support</Label>
                          </div>
                          <div className="h-4 w-8" />
                        </div>
                      </div>
                      </div>
                    )}
                  </div>
                </Collapsible>
              </div>

              {/* Print Validation Section */}
              <div className="rounded p-2 space-y-2 flex-shrink-0 mt-2">
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
          </ScrollArea>

          {/* Action Button */}
          <div className="p-4">
            <Button className="w-full bg-[#100AED] hover:bg-[#100AED]/90 text-white" size="sm">
              Slice
            </Button>
          </div>
        </TabsContent>

        {/* Preview Tab Content */}
        <TabsContent value="preview" className="flex-1 flex flex-col m-0 p-0 overflow-y-auto">
          <ScrollArea className="flex-1 w-full">
            <div className="p-2 space-y-4">
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
          <div className="p-4 space-y-4">
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
              <Button className="flex-1 bg-[#100AED] hover:bg-[#100AED]/90 text-white" size="sm">
                Queue
              </Button>
              <Button variant="outline" size="sm" className="px-3 border-[#EAEAEA]">
                <OverflowMenuVertical size={16} />
              </Button>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
