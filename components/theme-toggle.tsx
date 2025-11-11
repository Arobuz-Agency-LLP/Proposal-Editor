"use client"

import { Button } from "@/components/ui/button"
import { Moon, Sun } from "lucide-react"
import { useEffect, useState } from "react"

export function ThemeToggle() {
  const [isDark, setIsDark] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    // Check if dark mode is already set
    if (typeof window !== "undefined") {
      const dark = document.documentElement.classList.contains("dark")
      setIsDark(dark)
    }
  }, [])

  const toggleTheme = () => {
    if (typeof window !== "undefined") {
      const html = document.documentElement
      if (isDark) {
        html.classList.remove("dark")
        localStorage.setItem("theme", "light")
        setIsDark(false)
      } else {
        html.classList.add("dark")
        localStorage.setItem("theme", "dark")
        setIsDark(true)
      }
    }
  }

  if (!mounted) return null

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={toggleTheme}
      title={isDark ? "Switch to light mode" : "Switch to dark mode"}
      className="gap-2 bg-transparent"
    >
      {isDark ? (
        <>
          <Sun className="w-4 h-4" />
          <span className="hidden sm:inline text-xs">Light</span>
        </>
      ) : (
        <>
          <Moon className="w-4 h-4" />
          <span className="hidden sm:inline text-xs">Dark</span>
        </>
      )}
    </Button>
  )
}
