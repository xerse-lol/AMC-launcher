"use client"

import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react"
import { addHostListener, defaultState, isWebViewHost, sendHostMessage } from "@/lib/launcher-bridge"
import type { HostMessage, LauncherState } from "@/lib/launcher-bridge"

type LauncherContextValue = {
  state: LauncherState
  authMessage: string | null
  logs: string[]
  logsOpen: boolean
  send: (message: HostMessage) => void
  setAuthMessage: (message: string | null) => void
  setLogsOpen: (open: boolean) => void
  openLogs: () => void
}

const LauncherContext = createContext<LauncherContextValue | null>(null)

const browserMockState: LauncherState = {
  latestReleaseId: "1.20.4",
  selectedVersionId: "1.20.4",
  account: {
    username: "Local User",
    type: "Offline",
  },
  savedAccounts: [
    { key: "Offline:Local User", username: "Local User", type: "Offline", isCurrent: true },
    { key: "Microsoft:Steve", username: "Steve", type: "Microsoft", isCurrent: false },
  ],
  localAccounts: ["Local User", "Builder42"],
  versions: [
    { id: "1.20.4", type: "release" },
    { id: "1.20.2", type: "release" },
    { id: "1.19.4", type: "release" },
  ],
  busy: false,
  status: "Ready",
  settings: {
    gameDirectory: "C:\\Games\\AMC\\game",
    javaPath: "C:\\Program Files\\Java\\bin\\javaw.exe",
    minRamMb: 512,
    maxRamMb: 2048,
    autoJava: true,
    useLowEndPreset: false,
    usePotatoPreset: false,
    usePerformancePack: true,
    graphicsEngine: "opengl",
    microsoftClientId: "",
    vulkanAvailable: true,
    vulkanStatus: "VulkanMod available for 1.20.4.",
    amcModInstalled: false,
    amcModStatus: "Not installed.",
  },
  skins: [
    {
      id: "skin-1",
      name: "Explorer",
      variant: "classic",
      previewUrl: "/images/skin-placeholder.png",
    },
  ],
  selectedSkinId: "skin-1",
  mods: [
    {
      id: "sodium",
      name: "Sodium",
      version: "0.5.8",
      enabled: true,
      fileName: "sodium.jar",
      iconUrl: "/images/mod-placeholder.png",
    },
  ],
  shop: {
    points: 420,
    totalPlayMinutes: 84,
    pointsPerMinute: 5,
    items: [
      {
        id: "cape_aurora",
        name: "Aurora Cape",
        type: "cape",
        price: 1200,
        description: "Soft shifting lights for your back.",
        icon: "🟣",
        requiresMod: true,
        owned: false,
        equipped: false,
      },
      {
        id: "acc_badge_x",
        name: "AMC X Badge",
        type: "accessory",
        price: 700,
        description: "Show the AMC X badge in-game.",
        icon: "❌",
        requiresMod: true,
        owned: true,
        equipped: true,
      },
    ],
  },
}

export function LauncherProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<LauncherState>(defaultState)
  const [authMessage, setAuthMessage] = useState<string | null>(null)
  const [logs, setLogs] = useState<string[]>([])
  const [logsOpen, setLogsOpen] = useState(false)

  useEffect(() => {
    if (!isWebViewHost()) {
      setState(browserMockState)
      return
    }

    const unsubscribe = addHostListener((message) => {
      if (!message || typeof message.type !== "string") {
        return
      }

      if (message.type === "state" && typeof message.state === "object") {
        setState(message.state as LauncherState)
        return
      }

      if (message.type === "status" && typeof message.message === "string") {
        setState((current) => ({ ...current, status: message.message as string }))
        return
      }

      if (message.type === "auth_message" && typeof message.message === "string") {
        setAuthMessage(message.message as string)
        return
      }

      if (message.type === "auth_clear") {
        setAuthMessage(null)
      }

      if (message.type === "log" && typeof message.message === "string") {
        setLogs((current) => {
          const next = [...current, message.message as string]
          return next.length > 500 ? next.slice(next.length - 500) : next
        })
      }

      if (message.type === "log_history" && Array.isArray(message.items)) {
        const items = message.items.filter((item) => typeof item === "string") as string[]
        setLogs(items.slice(-500))
      }
    })

    sendHostMessage({ type: "ui_ready" })
    sendHostMessage({ type: "get_state" })

    return unsubscribe
  }, [])

  const send = useCallback((message: HostMessage) => {
    sendHostMessage(message)
  }, [])

  const value = useMemo(
    () => ({
      state,
      authMessage,
      logs,
      logsOpen,
      send,
      setAuthMessage,
      setLogsOpen,
      openLogs: () => setLogsOpen(true),
    }),
    [state, authMessage, logs, logsOpen, send]
  )

  return <LauncherContext.Provider value={value}>{children}</LauncherContext.Provider>
}

export function useLauncher() {
  const context = useContext(LauncherContext)
  if (!context) {
    throw new Error("useLauncher must be used within LauncherProvider")
  }
  return context
}
