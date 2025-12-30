"use client"

import { useState, useEffect } from "react"
import { LauncherSidebar } from "@/components/launcher-sidebar"
import { LauncherMain } from "@/components/launcher-main"
import { LauncherProvider } from "@/components/launcher-provider"
import { LauncherSettings } from "@/components/launcher-settings"
import { LauncherSkins } from "@/components/launcher-skins"
import { LauncherLogs } from "@/components/launcher-logs"
import { LauncherMods } from "@/components/launcher-mods"
import { LauncherShop } from "@/components/launcher-shop"
import { cn } from "@/lib/utils"

export default function LauncherPage() {
  const [activeTab, setActiveTab] = useState("home")
  const [isNight, setIsNight] = useState(false)

  useEffect(() => {
    const checkTime = () => {
      const hour = new Date().getHours()
      // Night is from 6 PM (18) to 6 AM (6)
      setIsNight(hour >= 18 || hour < 6)
    }

    checkTime()
    const interval = setInterval(checkTime, 60000) // Check every minute
    return () => clearInterval(interval)
  }, [])

  return (
    <LauncherProvider>
      <main className="h-screen w-full flex overflow-hidden bg-zinc-950 relative">
        {/* Background Image with Transition */}
        <div 
          className={cn(
            "absolute inset-0 bg-cover bg-center transition-opacity duration-1000",
            isNight ? "opacity-0" : "opacity-100"
          )}
          style={{ backgroundImage: 'url("/images/bg-day.png")' }}
        />
        <div 
          className={cn(
            "absolute inset-0 bg-cover bg-center transition-opacity duration-1000",
            isNight ? "opacity-100" : "opacity-0"
          )}
          style={{ backgroundImage: 'url("/images/bg-night.png")' }}
        />

        {/* Overlay for better readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/20 to-transparent" />

        {/* Content */}
        <div className="relative z-10 flex w-full h-full">
          <LauncherSidebar activeTab={activeTab} setActiveTab={setActiveTab} />

          {activeTab === "home" && <LauncherMain />}
          {activeTab === "shop" && <LauncherShop />}
          {activeTab === "mods" && <LauncherMods />}
          {activeTab === "settings" && <LauncherSettings />}
          {activeTab === "skins" && <LauncherSkins />}

          {activeTab !== "home" &&
            activeTab !== "shop" &&
            activeTab !== "mods" &&
            activeTab !== "settings" &&
            activeTab !== "skins" && (
            <div className="flex-1 flex items-center justify-center">
              <div className="bg-black/40 backdrop-blur-md border border-white/10 p-12 rounded-3xl text-center max-w-md">
                <h2 className="text-3xl font-bold text-white mb-4 capitalize">{activeTab.replace("-", " ")}</h2>
                <p className="text-white/60 mb-8">
                  This section is currently under development. Stay tuned for updates!
                </p>
                <button 
                  onClick={() => setActiveTab("home")}
                  className="text-green-400 hover:text-green-300 font-medium transition-colors"
                >
                  Back to Home
                </button>
              </div>
            </div>
          )}
        </div>
        <LauncherLogs />
      </main>
    </LauncherProvider>
  )
}
