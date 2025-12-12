"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Folder, Edit, Notification, CloudUpload, Reset, ChevronDown, Clean, Grid, Select, CaretDown } from "@/lib/icons"
import { SvgIcon } from "@/components/icons/svg-icon"

export default function TopBarProduction() {
  const [filename, setFilename] = useState("Filename.stl")
  const [isEditing, setIsEditing] = useState(false)
  const [modelsOnBuildPlate, setModelsOnBuildPlate] = useState(false)

  return (
    <div 
      data-top-bar
      className="!inline-block" 
      style={{ 
        width: '1440px', 
        maxWidth: '1440px', 
        minWidth: '1440px',
        flexShrink: 0,
        flexGrow: 0,
        boxSizing: 'border-box'
      }}
    >
      <div 
        className="w-full bg-white border-b border-[#F0ECE6] flex items-center h-16" 
        style={{ 
          width: '1440px', 
          maxWidth: '1440px', 
          minWidth: '1440px',
          height: '64px',
          maxHeight: '64px',
          minHeight: '64px',
          flexShrink: 0,
          flexGrow: 0,
          boxSizing: 'border-box'
        }}
      >
        {/* ToolBarTop - Left Section */}
        <div 
          className="flex items-center gap-2 h-full"
          style={{
            width: '316px',
            minWidth: '316px',
            maxWidth: '316px',
            paddingLeft: '24px',
          }}
        >
          {modelsOnBuildPlate ? (
            <>
              {/* Models on build plate - Outlined button with dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 w-8 p-0 border-[#100AED]"
                    aria-label="Upload object"
                  >
                    <Folder size={16} className="text-[#100AED]" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent 
                  className="w-[152px] p-1 bg-white !border-0 rounded-lg"
                  style={{ boxShadow: '0px 2px 20px 0px rgba(0, 0, 0, 0.15)' }}
                  align="start"
                >
                  <DropdownMenuItem 
                    className="gap-2 px-2 py-2 text-xs font-normal text-[#282828] rounded hover:bg-[#F2F4F8] focus:bg-[#F2F4F8] cursor-pointer flex items-center"
                    onSelect={() => {
                      // Handle Library action
                    }}
                  >
                    <SvgIcon 
                      src="/icons/ultimaker/Media--library2.svg" 
                      size={16} 
                      className="text-[#282828] flex-shrink-0"
                    />
                    <span className="text-xs leading-[1.5em] font-normal">Library</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="h-px bg-[#F0ECE6] my-0" />
                  <DropdownMenuItem 
                    className="gap-2 px-2 py-2 text-xs font-normal text-[#282828] rounded hover:bg-[#F2F4F8] focus:bg-[#F2F4F8] cursor-pointer flex items-center"
                    onSelect={() => {
                      setModelsOnBuildPlate(true)
                    }}
                  >
                    <CloudUpload size={16} className="text-[#282828] flex-shrink-0" />
                    <span className="text-xs leading-[1.5em] font-normal">Upload File</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              {/* Build Plate Tools Button Group */}
              <div className="flex-1 flex items-center justify-end gap-2 h-full">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-10 w-10 p-0 hover:bg-[#EAEAEA]"
                  aria-label="Clean"
                >
                  <Clean size={16} className="text-[#282828]" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-10 w-10 p-0 hover:bg-[#EAEAEA]"
                  aria-label="Reset"
                >
                  <Reset size={16} className="text-[#282828]" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-10 w-10 p-0 hover:bg-[#EAEAEA]"
                  aria-label="Grid"
                >
                  <Grid size={16} className="text-[#282828]" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-10 w-10 p-0 hover:bg-[#EAEAEA]"
                  aria-label="Select"
                >
                  <Select size={16} className="text-[#282828]" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-10 w-10 p-0 hover:bg-[#EAEAEA]"
                  aria-label="Dropdown"
                >
                  <CaretDown size={16} className="text-[#282828]" />
                </Button>
              </div>
            </>
          ) : (
            <>
              {/* No models - Primary button with dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="default"
                    size="sm"
                    className="h-8 w-8 p-0"
                    aria-label="Upload object"
                  >
                    <Folder size={16} />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent 
                  className="w-[152px] p-1 bg-white !border-0 rounded-lg"
                  style={{ boxShadow: '0px 2px 20px 0px rgba(0, 0, 0, 0.15)' }}
                  align="start"
                >
                  <DropdownMenuItem 
                    className="gap-2 px-2 py-2 text-xs font-normal text-[#282828] rounded hover:bg-[#F2F4F8] focus:bg-[#F2F4F8] cursor-pointer flex items-center"
                    onSelect={() => {
                      // Handle Library action
                    }}
                  >
                    <SvgIcon 
                      src="/icons/ultimaker/Media--library2.svg" 
                      size={16} 
                      className="text-[#282828] flex-shrink-0"
                    />
                    <span className="text-xs leading-[1.5em] font-normal">Library</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="h-px bg-[#F0ECE6] my-0" />
                  <DropdownMenuItem 
                    className="gap-2 px-2 py-2 text-xs font-normal text-[#282828] rounded hover:bg-[#F2F4F8] focus:bg-[#F2F4F8] cursor-pointer flex items-center"
                    onSelect={() => {
                      setModelsOnBuildPlate(true)
                    }}
                  >
                    <CloudUpload size={16} className="text-[#282828] flex-shrink-0" />
                    <span className="text-xs leading-[1.5em] font-normal">Upload File</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          )}
        </div>

        {/* TopBarCenter - Center Section */}
        <div 
          className="flex-1 flex items-center justify-center gap-2 py-1 h-full"
          style={{
            minWidth: 0,
          }}
        >
          {isEditing ? (
            <Input
              value={filename}
              onChange={(e) => setFilename(e.target.value)}
              onBlur={() => setIsEditing(false)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  setIsEditing(false)
                }
                if (e.key === 'Escape') {
                  setIsEditing(false)
                }
              }}
              className="h-12 px-3 text-xs border-[#100AED] focus-visible:ring-2 focus-visible:ring-[#E7E7FD]"
              autoFocus
              style={{
                width: '776px',
                maxWidth: '776px',
              }}
            />
          ) : (
            <div 
              className="flex items-center gap-1"
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#F8F8F8'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent'
              }}
            >
              <Label className="text-xs font-normal text-[#282828] cursor-default">
                {filename}
              </Label>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 p-0 hover:bg-[#EAEAEA]"
                onClick={() => setIsEditing(true)}
                aria-label="Edit filename"
              >
                <Edit size={14} className="text-[#282828]" />
              </Button>
            </div>
          )}
        </div>

        {/* TopBarRight - Right Section */}
        <div 
          className="flex items-center justify-end gap-2 pr-4 h-full"
          style={{
            width: '256px',
            minWidth: '256px',
            maxWidth: '256px',
          }}
        >
          <Button
            variant="ghost"
            size="sm"
            className="h-10 px-3 hover:bg-[#F8F8F8] rounded"
            aria-label="Notifications"
          >
            <Notification size={14} className="text-[#282828]" />
          </Button>
        </div>
      </div>
    </div>
  )
}

