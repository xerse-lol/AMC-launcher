"use client"

import { Play, ChevronDown, Shield, Zap, Cpu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useLauncher } from "@/components/launcher-provider"

export function LauncherMain() {
  const { state, send, openLogs } = useLauncher()
  const latestRelease = state.latestReleaseId || "Unknown"
  const selectedVersion = state.selectedVersionId || latestRelease
  const accountName = state.account?.username || "Local User"
  const versionList = state.versions.length > 0 ? state.versions : [{ id: selectedVersion, type: "release" }]

  return (
    <div className="flex-1 flex flex-col p-8 relative overflow-hidden">
      {/* Hero Section */}
      <div className="mt-auto mb-8">
        <Badge className="mb-4 bg-green-500/20 text-green-400 border-green-500/30 backdrop-blur-sm">
          Latest Release: {latestRelease}
        </Badge>
        <h1 className="text-6xl font-black text-white mb-4 drop-shadow-2xl">
          MINECRAFT
        </h1>
        <p className="text-xl text-white/80 max-w-xl mb-8 drop-shadow-md">
          Explore infinite worlds and build everything from the simplest of homes to the grandest of castles.
        </p>

        <div className="flex items-center gap-4">
          <div className="flex flex-col">
            <Button
              size="lg"
              disabled={state.busy}
              onClick={() => {
                openLogs()
                send({ type: "play" })
              }}
              className="h-16 px-12 text-xl font-bold bg-green-600 hover:bg-green-500 text-white rounded-2xl shadow-lg shadow-green-900/20 transition-all hover:scale-105 active:scale-95"
            >
              <Play className="w-6 h-6 mr-2 fill-current" />
              {state.busy ? "LAUNCHING" : "PLAY"}
            </Button>
          </div>
          
          <div className="bg-black/40 backdrop-blur-md border border-white/10 rounded-2xl p-2 flex items-center gap-4">
            <div className="px-4 py-2">
              <span className="text-xs text-white/50 block">Version</span>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button type="button" className="text-sm font-bold text-white flex items-center gap-2">
                    {selectedVersion} <ChevronDown className="w-4 h-4" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="bg-black/80 border-white/10 text-white">
                  {versionList.map((version) => (
                    <DropdownMenuItem
                      key={version.id}
                      onSelect={() => send({ type: "set_version", id: version.id })}
                      className="focus:bg-white/10 focus:text-white"
                    >
                      {version.id}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <div className="w-px h-8 bg-white/10" />
            <div className="px-4 py-2">
              <span className="text-xs text-white/50 block">Account</span>
              <span className="text-sm font-bold text-white">{accountName}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Features / Stats */}
      <div className="grid grid-cols-3 gap-6">
        <Card className="bg-black/40 backdrop-blur-md border-white/10 p-4 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center">
            <Cpu className="w-6 h-6 text-blue-400" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white">Low End Optimized</h3>
            <p className="text-xs text-white/50">Optimized for performance</p>
          </div>
        </Card>
        <Card className="bg-black/40 backdrop-blur-md border-white/10 p-4 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center">
            <Shield className="w-6 h-6 text-purple-400" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white">Secure Login</h3>
            <p className="text-xs text-white/50">Microsoft & Local Auth</p>
          </div>
        </Card>
        <Card className="bg-black/40 backdrop-blur-md border-white/10 p-4 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-orange-500/20 flex items-center justify-center">
            <Zap className="w-6 h-6 text-orange-400" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white">Fast Launch</h3>
            <p className="text-xs text-white/50">Instant game start</p>
          </div>
        </Card>
      </div>
    </div>
  )
}
