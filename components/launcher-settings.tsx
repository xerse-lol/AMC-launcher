"use client"

import { useEffect, useState } from "react"
import { Cpu, FolderOpen, HardDrive, Save } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useLauncher } from "@/components/launcher-provider"
import type { LauncherSettings } from "@/lib/launcher-bridge"

export function LauncherSettings() {
  const { state, send } = useLauncher()
  const [draft, setDraft] = useState<LauncherSettings>(state.settings)
  const darkButton =
    "bg-black text-white border border-white/10 hover:bg-black/80 hover:text-white"

  useEffect(() => {
    setDraft(state.settings)
  }, [state.settings])

  const updateDraft = (patch: Partial<LauncherSettings>) => {
    setDraft((current) => ({ ...current, ...patch }))
  }

  const saveSettings = () => {
    send({ type: "save_settings", settings: draft })
  }

  return (
    <div className="flex-1 flex flex-col p-8 gap-6 overflow-y-auto no-scrollbar">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-white">Settings</h2>
          <p className="text-white/60">Tune your launcher and game preferences.</p>
        </div>
        <Button onClick={saveSettings} disabled={state.busy} className={`gap-2 ${darkButton}`}>
          <Save className="w-4 h-4" />
          Save
        </Button>
      </div>

      {state.status ? (
        <Alert className="bg-black/40 border-white/10 text-white/80">
          <AlertDescription>{state.status}</AlertDescription>
        </Alert>
      ) : null}

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <Card className="bg-black/40 backdrop-blur-md border-white/10 p-6 space-y-5">
          <div className="flex items-center gap-3">
            <HardDrive className="w-5 h-5 text-blue-400" />
            <h3 className="text-lg font-semibold text-white">Game Files</h3>
          </div>

          <div className="space-y-2">
            <Label className="text-white/70">Game directory</Label>
            <div className="flex gap-2">
              <Input
                value={draft.gameDirectory}
                onChange={(event) => updateDraft({ gameDirectory: event.target.value })}
                className="bg-zinc-900 border-zinc-800 text-white"
              />
              <Button
                variant="outline"
                onClick={() => send({ type: "browse_game_dir" })}
                className={darkButton}
              >
                Browse
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-white/70">Java path</Label>
            <div className="flex gap-2">
              <Input
                value={draft.javaPath}
                onChange={(event) => updateDraft({ javaPath: event.target.value })}
                disabled={draft.autoJava}
                className="bg-zinc-900 border-zinc-800 text-white disabled:opacity-50"
              />
              <Button
                variant="outline"
                onClick={() => send({ type: "browse_java" })}
                className={darkButton}
              >
                Browse
              </Button>
            </div>
            <div className="flex items-center justify-between gap-4 rounded-lg border border-zinc-800 p-3">
              <div>
                <p className="text-sm font-medium text-white">Auto-detect Java</p>
                <p className="text-xs text-white/50">Use the best Java version automatically.</p>
              </div>
              <Switch
                checked={draft.autoJava}
                onCheckedChange={(checked) => updateDraft({ autoJava: checked })}
              />
            </div>
          </div>

          <div className="space-y-3">
            <Label className="text-white/70">Memory (MB)</Label>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <span className="text-xs text-white/50">Min RAM</span>
                <Input
                  type="number"
                  min={256}
                  value={draft.minRamMb}
                  onChange={(event) =>
                    updateDraft({ minRamMb: Number.parseInt(event.target.value || "0", 10) || 0 })
                  }
                  className="bg-zinc-900 border-zinc-800 text-white"
                />
              </div>
              <div className="space-y-1">
                <span className="text-xs text-white/50">Max RAM</span>
                <Input
                  type="number"
                  min={512}
                  value={draft.maxRamMb}
                  onChange={(event) =>
                    updateDraft({ maxRamMb: Number.parseInt(event.target.value || "0", 10) || 0 })
                  }
                  className="bg-zinc-900 border-zinc-800 text-white"
                />
              </div>
            </div>
          </div>
        </Card>

        <div className="space-y-6">
          <Card className="bg-black/40 backdrop-blur-md border-white/10 p-6 space-y-4">
            <div className="flex items-center gap-3">
              <Cpu className="w-5 h-5 text-green-400" />
              <h3 className="text-lg font-semibold text-white">Performance</h3>
            </div>

            <div className="space-y-2">
              <Label className="text-white/70">Graphics engine</Label>
              <Select
                value={draft.graphicsEngine || "opengl"}
                onValueChange={(value) => updateDraft({ graphicsEngine: value })}
              >
                <SelectTrigger className="w-full bg-black/70 border-white/10 text-white">
                  <SelectValue placeholder="Select engine" />
                </SelectTrigger>
                <SelectContent className="bg-black/90 border-white/10 text-white">
                  <SelectItem value="opengl">OpenGL (Default)</SelectItem>
                  <SelectItem value="vulkan" disabled={!state.settings.vulkanAvailable}>
                    Vulkan (Intel/AMD, Experimental)
                  </SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-white/40">
                {state.settings.vulkanStatus || "Vulkan requires the Performance Pack (Fabric)."}
              </p>
            </div>

            <div className="flex items-center justify-between gap-4 rounded-lg border border-zinc-800 p-3">
              <div>
                <p className="text-sm font-medium text-white">Performance Pack</p>
                <p className="text-xs text-white/50">Fabric + Sodium/Lithium preset.</p>
              </div>
              <Switch
                checked={draft.usePerformancePack}
                onCheckedChange={(checked) => updateDraft({ usePerformancePack: checked })}
              />
            </div>

            <div className="flex items-center justify-between gap-4 rounded-lg border border-zinc-800 p-3">
              <div>
                <p className="text-sm font-medium text-white">Low-end preset</p>
                <p className="text-xs text-white/50">Balanced for 4-8 GB RAM.</p>
              </div>
              <Switch
                checked={draft.useLowEndPreset}
                onCheckedChange={(checked) =>
                  updateDraft({ useLowEndPreset: checked, usePotatoPreset: checked ? false : draft.usePotatoPreset })
                }
              />
            </div>

            <div className="flex items-center justify-between gap-4 rounded-lg border border-zinc-800 p-3">
              <div>
                <p className="text-sm font-medium text-white">Potato mode</p>
                <p className="text-xs text-white/50">Ultra-low settings for max FPS.</p>
              </div>
              <Switch
                checked={draft.usePotatoPreset}
                onCheckedChange={(checked) =>
                  updateDraft({ usePotatoPreset: checked, useLowEndPreset: checked ? false : draft.useLowEndPreset })
                }
              />
            </div>

            <Button
              onClick={() => send({ type: "try_machine" })}
              disabled={state.busy}
              className={`w-full ${darkButton}`}
            >
              TRYMACHINE
            </Button>
          </Card>

          <Card className="bg-black/40 backdrop-blur-md border-white/10 p-6 space-y-4">
            <h3 className="text-lg font-semibold text-white">Microsoft Client</h3>
            <div className="space-y-2">
              <Label className="text-white/70">Client ID</Label>
              <Input
                value={draft.microsoftClientId}
                onChange={(event) => updateDraft({ microsoftClientId: event.target.value })}
                className="bg-zinc-900 border-zinc-800 text-white"
              />
              <p className="text-xs text-white/40">Required for Microsoft sign-in.</p>
            </div>
          </Card>

          <Card className="bg-black/40 backdrop-blur-md border-white/10 p-6 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h3 className="text-lg font-semibold text-white">AMC Cosmetics Mod</h3>
                <p className="text-xs text-white/50">Required for AMC shop cosmetics in-game.</p>
              </div>
              <Button
                onClick={() => send({ type: "install_amc_mod" })}
                disabled={state.busy}
                className={darkButton}
              >
                Install / Update
              </Button>
            </div>
            <div className="flex items-center justify-between gap-4 rounded-lg border border-zinc-800 p-3">
              <div>
                <p className="text-sm font-medium text-white">Status</p>
                <p className="text-xs text-white/50">
                  {state.settings.amcModStatus || "Not installed."}
                </p>
              </div>
              <span
                className={`text-xs font-semibold ${state.settings.amcModInstalled ? "text-green-400" : "text-white/40"}`}
              >
                {state.settings.amcModInstalled ? "Installed" : "Missing"}
              </span>
            </div>
            <p className="text-xs text-white/40">
              Requires Performance Pack (Fabric). Enable it if cosmetics do not show up.
            </p>
            <Button
              variant="outline"
              className={darkButton}
              onClick={() => send({ type: "open_folder", kind: "mods" })}
            >
              Open Mods Folder
            </Button>
          </Card>

          <Card className="bg-black/40 backdrop-blur-md border-white/10 p-6 space-y-3">
            <h3 className="text-lg font-semibold text-white">Quick Folders</h3>
            <div className="grid grid-cols-2 gap-3">
              <Button
                variant="outline"
                className={darkButton}
                onClick={() => send({ type: "open_folder", kind: "game" })}
              >
                <FolderOpen className="w-4 h-4 mr-2" />
                Game
              </Button>
              <Button
                variant="outline"
                className={darkButton}
                onClick={() => send({ type: "open_folder", kind: "mods" })}
              >
                Mods
              </Button>
              <Button
                variant="outline"
                className={darkButton}
                onClick={() => send({ type: "open_folder", kind: "resourcepacks" })}
              >
                Resource Packs
              </Button>
              <Button
                variant="outline"
                className={darkButton}
                onClick={() => send({ type: "open_folder", kind: "config" })}
              >
                Config
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
