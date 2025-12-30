"use client"

import { Home, ShoppingBag, Package, Image as ImageIcon, Palette, Settings, User } from "lucide-react"
import { AuthModal } from "./auth-modal"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { useLauncher } from "@/components/launcher-provider"

interface SidebarProps {
  activeTab: string
  setActiveTab: (tab: string) => void
}

export function LauncherSidebar({ activeTab, setActiveTab }: SidebarProps) {
  const { state } = useLauncher()
  const accountName = state.account?.username || "Guest Account"
  const accountType = state.account?.type || "Local"

  const menuItems = [
    { id: "home", icon: Home, label: "Home" },
    { id: "shop", icon: ShoppingBag, label: "Shop" },
    { id: "mods", icon: Package, label: "Mods" },
    { id: "resource-packs", icon: ImageIcon, label: "Resource Packs" },
    { id: "skins", icon: Palette, label: "Skins" },
  ]

  return (
    <div className="w-64 bg-black/40 backdrop-blur-md border-r border-white/10 flex flex-col h-full p-4">
      <div className="flex items-center gap-3 mb-10 px-2">
        <img src="/images/logo.png" alt="Logo" className="w-10 h-10 rounded-lg" />
        <span className="font-bold text-xl tracking-tight text-white">MC Launcher</span>
      </div>

      <nav className="flex-1 space-y-2">
        {menuItems.map((item) => (
          <Button
            key={item.id}
            variant="ghost"
            className={cn(
              "w-full justify-start gap-3 text-white/70 hover:text-white hover:bg-white/10 transition-all",
              activeTab === item.id && "bg-white/10 text-white"
            )}
            onClick={() => {
              setActiveTab(item.id)
            }}
          >
            <item.icon className="w-5 h-5" />
            {item.label}
          </Button>
        ))}
      </nav>

      <div className="mt-auto space-y-2">
        <Button
          variant="ghost"
          className={cn(
            "w-full justify-start gap-3 text-white/70 hover:text-white hover:bg-white/10",
            activeTab === "settings" && "bg-white/10 text-white"
          )}
          onClick={() => setActiveTab("settings")}
        >
          <Settings className="w-5 h-5" />
          Settings
        </Button>
        <AuthModal />
        <div className="p-3 bg-white/5 rounded-xl border border-white/10 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-400 to-blue-500 flex items-center justify-center">
            <User className="w-6 h-6 text-white" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-medium text-white">{accountName}</span>
            <span className="text-xs text-white/50">{accountType}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
