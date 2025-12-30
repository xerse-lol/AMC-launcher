"use client"

import { Package, RefreshCcw, FolderOpen, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { useLauncher } from "@/components/launcher-provider"

export function LauncherMods() {
  const { state, send } = useLauncher()
  const mods = state.mods ?? []
  const darkButton = "bg-black text-white border border-white/10 hover:bg-black/80 hover:text-white"

  return (
    <div className="flex-1 flex flex-col p-8 gap-6 overflow-y-auto no-scrollbar">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-white">Mods</h2>
          <p className="text-white/60">Manage your installed mods.</p>
        </div>
        <div className="flex gap-2">
          <Button className={darkButton} onClick={() => send({ type: "mod_refresh" })}>
            <RefreshCcw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
          <Button className={darkButton} onClick={() => send({ type: "open_folder", kind: "mods" })}>
            <FolderOpen className="w-4 h-4 mr-2" />
            Mods Folder
          </Button>
        </div>
      </div>

      {mods.length === 0 ? (
        <Card className="bg-black/40 border-white/10 p-8 text-center text-white/60">
          No mods detected. Drop .jar files into the mods folder.
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {mods.map((mod) => (
            <Card key={mod.fileName} className="bg-black/40 border-white/10 p-4 flex items-center gap-4">
              <div className="w-14 h-14 rounded-xl bg-black/60 border border-white/10 flex items-center justify-center overflow-hidden">
                {mod.iconUrl ? (
                  <img src={mod.iconUrl} alt={mod.name} className="w-full h-full object-cover" />
                ) : (
                  <Package className="w-6 h-6 text-white/40" />
                )}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-white font-semibold">{mod.name}</h3>
                  <span className={`text-xs ${mod.enabled ? "text-green-400" : "text-yellow-300"}`}>
                    {mod.enabled ? "Enabled" : "Disabled"}
                  </span>
                </div>
                <p className="text-xs text-white/50">{mod.version}</p>
              </div>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  className={darkButton}
                  onClick={() => send({ type: "mod_toggle", fileName: mod.fileName, enable: !mod.enabled })}
                >
                  {mod.enabled ? "Disable" : "Enable"}
                </Button>
                <Button
                  size="sm"
                  className={darkButton}
                  onClick={() => send({ type: "mod_delete", fileName: mod.fileName })}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
