export type LauncherAccount = {
  username: string
  type: string
}

export type LauncherVersion = {
  id: string
  type: string
}

export type LauncherSavedAccount = {
  key: string
  username: string
  type: string
  isCurrent: boolean
}

export type LauncherSettings = {
  gameDirectory: string
  javaPath: string
  minRamMb: number
  maxRamMb: number
  autoJava: boolean
  useLowEndPreset: boolean
  usePotatoPreset: boolean
  usePerformancePack: boolean
  graphicsEngine: string
  microsoftClientId: string
  vulkanAvailable: boolean
  vulkanStatus: string
  amcModInstalled: boolean
  amcModStatus: string
}

export type LauncherSkin = {
  id: string
  name: string
  variant: string
  previewUrl: string
}

export type LauncherMod = {
  id: string
  name: string
  version: string
  enabled: boolean
  fileName: string
  iconUrl?: string | null
}

export type LauncherShopItem = {
  id: string
  name: string
  type: string
  price: number
  description: string
  icon: string
  requiresMod: boolean
  owned: boolean
  equipped: boolean
}

export type LauncherShop = {
  points: number
  totalPlayMinutes: number
  pointsPerMinute: number
  items: LauncherShopItem[]
}

export type LauncherState = {
  latestReleaseId: string
  selectedVersionId: string
  account: LauncherAccount | null
  savedAccounts: LauncherSavedAccount[]
  localAccounts: string[]
  versions: LauncherVersion[]
  busy: boolean
  status: string
  settings: LauncherSettings
  skins: LauncherSkin[]
  selectedSkinId: string
  mods: LauncherMod[]
  shop: LauncherShop
}

export type HostMessage = {
  type: string
  [key: string]: unknown
}

export const defaultState: LauncherState = {
  latestReleaseId: "",
  selectedVersionId: "",
  account: null,
  savedAccounts: [],
  localAccounts: [],
  versions: [],
  busy: false,
  status: "",
  settings: {
    gameDirectory: "",
    javaPath: "",
    minRamMb: 512,
    maxRamMb: 2048,
    autoJava: true,
    useLowEndPreset: false,
    usePotatoPreset: false,
    usePerformancePack: false,
    graphicsEngine: "opengl",
    microsoftClientId: "",
    vulkanAvailable: false,
    vulkanStatus: "",
    amcModInstalled: false,
    amcModStatus: "",
  },
  skins: [],
  selectedSkinId: "",
  mods: [],
  shop: {
    points: 0,
    totalPlayMinutes: 0,
    pointsPerMinute: 5,
    items: [],
  },
}

export function isWebViewHost() {
  if (typeof window === "undefined") {
    return false
  }

  return !!(window as typeof window & { chrome?: { webview?: unknown } }).chrome?.webview
}

export function sendHostMessage(message: HostMessage) {
  if (!isWebViewHost()) {
    return
  }

  ;(window as typeof window & { chrome: { webview: { postMessage: (payload: HostMessage) => void } } }).chrome.webview.postMessage(message)
}

export function addHostListener(handler: (message: HostMessage) => void) {
  if (!isWebViewHost()) {
    return () => {}
  }

  const webview = (window as typeof window & { chrome: { webview: { addEventListener: (type: string, fn: (event: { data: HostMessage }) => void) => void; removeEventListener: (type: string, fn: (event: { data: HostMessage }) => void) => void } } }).chrome.webview
  const listener = (event: { data: HostMessage }) => handler(event.data)
  webview.addEventListener("message", listener)

  return () => webview.removeEventListener("message", listener)
}
