"use client"

import * as React from "react"
import { Check, ChevronsUpDown, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

export interface ComboboxOption {
  value: string
  label: string
}

interface ComboboxProps {
  options: ComboboxOption[]
  value: string
  onChange: (value: string) => void
  onInputChange?: (value: string) => void
  placeholder?: string
  emptyMessage?: string
  className?: string
  inputClassName?: string
  loading?: boolean
  disabled?: boolean
}

export function Combobox({
  options,
  value,
  onChange,
  onInputChange,
  placeholder = "Selecione uma opção...",
  emptyMessage = "Nenhum resultado encontrado.",
  className,
  inputClassName,
  loading = false,
  disabled = false,
}: ComboboxProps) {
  const [open, setOpen] = React.useState(false)
  const [inputValue, setInputValue] = React.useState("")
  
  React.useEffect(() => {
    // If a value is selected, find its label and set it as input value
    const selectedOption = options.find(option => option.value === value)
    if (selectedOption && selectedOption.label !== inputValue) {
      setInputValue(selectedOption.label)
    } else if (!value && inputValue !== "") {
      setInputValue("")
    }
  }, [value, options, inputValue])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value
    setInputValue(newValue)
    if (onInputChange) {
      onInputChange(newValue)
    }
  }

  const handleSelect = (currentValue: string) => {
    if (currentValue === value) {
      onChange("")
      setInputValue("")
    } else {
      onChange(currentValue)
      const selectedOption = options.find(option => option.value === currentValue)
      if (selectedOption) {
        setInputValue(selectedOption.label)
      }
    }
    setOpen(false)
  }

  const clearValue = () => {
    onChange("")
    setInputValue("")
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <div className={cn("relative", className)}>
          <input
            value={inputValue}
            onChange={handleInputChange}
            className={cn(
              "w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
              inputClassName
            )}
            placeholder={placeholder}
            onClick={() => setOpen(true)}
            disabled={disabled}
          />
          <div className="absolute inset-y-0 right-0 flex items-center pr-2">
            {inputValue && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-5 w-5 p-0 text-gray-400 hover:text-gray-500"
                onClick={(e) => {
                  e.stopPropagation()
                  clearValue()
                }}
                disabled={disabled}
              >
                <X className="h-3 w-3" />
              </Button>
            )}
            <ChevronsUpDown className="h-4 w-4 text-gray-400 hover:text-gray-500" />
          </div>
        </div>
      </PopoverTrigger>
      <PopoverContent className="p-0 w-[--radix-popover-trigger-width]">
        <Command>
          <CommandInput placeholder={placeholder} />
          <CommandEmpty>{loading ? "Carregando..." : emptyMessage}</CommandEmpty>
          <CommandGroup className="max-h-60 overflow-y-auto">
            {options.map((option) => (
              <CommandItem
                key={option.value}
                value={option.label}
                onSelect={() => handleSelect(option.value)}
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    value === option.value ? "opacity-100" : "opacity-0"
                  )}
                />
                {option.label}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  )
} 