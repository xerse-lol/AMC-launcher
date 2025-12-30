"use client"

import { useRef, useState } from "react"
import type { ChangeEvent } from "react"
import { AlertCircle, Check, Upload, Trash2, Image as ImageIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { useLauncher } from "@/components/launcher-provider"
import { cn } from "@/lib/utils"

type SkinVariant = "classic" | "slim"

export function LauncherSkins() {
  const { state, send } = useLauncher()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [skinName, setSkinName] = useState("")
  const [variant, setVariant] = useState<SkinVariant>("classic")
  const [file, setFile] = useState<File | null>(null)
  const isBusy = state.busy
  const darkButton =
    "bg-black text-white border border-white/10 hover:bg-black/80 hover:text-white"

  const handlePickFile = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const selected = event.target.files?.[0]
    if (!selected) {
      return
    }

    setFile(selected)
    const baseName = selected.name.replace(/\.[^/.]+$/, "")
    setSkinName(baseName)
  }

  const handleAddSkin = () => {
    if (!file) {
      return
    }

    const reader = new FileReader()
    reader.onload = () => {
      const dataUrl = typeof reader.result === "string" ? reader.result : ""
      if (!dataUrl) {
        return
      }

      send({
        type: "add_skin",
        name: skinName || "New Skin",
        dataUrl,
        variant,
      })

      setFile(null)
      setSkinName("")
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
    }

    reader.readAsDataURL(file)
  }

  const showOfflineWarning =
    state.account?.type !== "Microsoft" && !state.settings.usePerformancePack

  return (
    <div className="flex-1 flex flex-col p-8 gap-6 overflow-y-auto no-scrollbar">
      <div>
        <h2 className="text-3xl font-bold text-white">Skins</h2>
        <p className="text-white/60">Manage and apply skins to your accounts.</p>
      </div>

      {showOfflineWarning && (
        <Alert className="bg-black/40 border-yellow-500/40 text-yellow-200">
          <AlertCircle />
          <AlertTitle>Offline skins need Fabric</AlertTitle>
          <AlertDescription>
            Enable the Performance Pack in Settings to use skins with local accounts.
          </AlertDescription>
        </Alert>
      )}

      <Card className="bg-black/40 backdrop-blur-md border-white/10 p-6 space-y-4">
        <div className="flex flex-col xl:flex-row xl:items-end gap-4">
          <div className="flex-1 space-y-2">
            <Label className="text-white/70">Skin name</Label>
            <Input
              value={skinName}
              onChange={(event) => setSkinName(event.target.value)}
              placeholder="My new skin"
              className="bg-zinc-900 border-zinc-800 text-white"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-white/70">Variant</Label>
            <ToggleGroup
              type="single"
              value={variant}
              onValueChange={(value) => {
                if (value === "classic" || value === "slim") {
                  setVariant(value)
                }
              }}
              spacing={0}
              className="bg-black/30 border border-zinc-800 rounded-lg"
            >
              <ToggleGroupItem value="classic" className="text-white/80">
                Classic
              </ToggleGroupItem>
              <ToggleGroupItem value="slim" className="text-white/80">
                Slim
              </ToggleGroupItem>
            </ToggleGroup>
          </div>

          <div className="flex gap-3">
            <Button variant="outline" className={darkButton} onClick={handlePickFile}>
              <Upload className="w-4 h-4 mr-2" />
              Choose File
            </Button>
            <Button className={darkButton} onClick={handleAddSkin} disabled={!file || isBusy}>
              Add Skin
            </Button>
          </div>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/png"
          onChange={handleFileChange}
          className="hidden"
        />

        <p className="text-xs text-white/40">PNG only, 64x64 or 64x32 recommended.</p>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {state.skins.map((skin) => {
          const isSelected = skin.id === state.selectedSkinId

          return (
            <Card
              key={skin.id}
              className={cn(
                "bg-black/40 backdrop-blur-md border-white/10 p-4 space-y-3",
                isSelected && "border-green-500/60 shadow-[0_0_0_1px_rgba(34,197,94,0.6)]"
              )}
            >
              <div className="flex items-center gap-3">
                <div className="w-16 h-16 rounded-2xl bg-black/50 border border-white/10 flex items-center justify-center overflow-hidden">
                  {skin.previewUrl ? (
                    <img
                      src={skin.previewUrl}
                      alt={skin.name}
                      className="w-16 h-16 object-cover"
                    />
                  ) : (
                    <ImageIcon className="w-6 h-6 text-white/40" />
                  )}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-white">{skin.name}</p>
                  <p className="text-xs text-white/50 capitalize">{skin.variant}</p>
                </div>
                {isSelected && <Check className="w-4 h-4 text-green-400" />}
              </div>

              <div className="flex gap-2">
                <Button
                  size="sm"
                  className={`flex-1 ${darkButton}`}
                  onClick={() => send({ type: "select_skin", id: skin.id })}
                  disabled={isBusy}
                >
                  {isSelected ? "Selected" : "Apply"}
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className={darkButton}
                  onClick={() => send({ type: "remove_skin", id: skin.id })}
                  disabled={isBusy}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </Card>
          )
        })}
      </div>

      {state.skins.length === 0 && (
        <Card className="bg-black/40 border-white/10 p-8 text-center text-white/60">
          No skins uploaded yet. Add one to get started.
        </Card>
      )}

      {state.skins.length > 0 && (
        <div className="flex justify-end">
          <Button variant="outline" className={darkButton} onClick={() => send({ type: "clear_skin" })} disabled={isBusy}>
            Clear selection
          </Button>
        </div>
      )}
    </div>
  )
}
