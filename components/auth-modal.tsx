"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Shield, User } from "lucide-react"
import { useLauncher } from "@/components/launcher-provider"

export function AuthModal() {
  const [mode, setMode] = useState<"select" | "microsoft" | "local">("select")
  const [username, setUsername] = useState("")
  const { state, send, authMessage, setAuthMessage } = useLauncher()

  const savedAccountsBlock =
    state.savedAccounts.length > 0 ? (
      <div className="space-y-2">
        <p className="text-xs uppercase tracking-wide text-zinc-500">Saved accounts</p>
        <div className="grid gap-2">
          {state.savedAccounts.map((account) => (
            <Button
              key={account.key}
              variant="outline"
              disabled={account.isCurrent}
              onClick={() => send({ type: "select_account", key: account.key })}
              className="justify-between border-zinc-800 bg-zinc-800/40 text-white text-sm"
            >
              <span className="flex items-center gap-2">
                {account.type.toLowerCase() === "microsoft" ? (
                  <Shield className="w-4 h-4 text-blue-300" />
                ) : (
                  <User className="w-4 h-4 text-zinc-300" />
                )}
                {account.username}
              </span>
              <span className="text-[11px] uppercase text-zinc-400">
                {account.isCurrent ? "Current" : account.type}
              </span>
            </Button>
          ))}
        </div>
      </div>
    ) : null

  return (
    <Dialog
      onOpenChange={() => {
        setMode("select")
        setAuthMessage(null)
      }}
    >
      <DialogTrigger asChild>
        <Button variant="ghost" className="w-full justify-start gap-3 text-white/70 hover:text-white hover:bg-white/10">
          <User className="w-5 h-5" />
          Switch Account
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-zinc-900 border-zinc-800 text-white sm:max-w-[520px] max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center">
            {mode === "select" && "Choose Account Type"}
            {mode === "microsoft" && "Microsoft Login"}
            {mode === "local" && "Local Account"}
          </DialogTitle>
        </DialogHeader>

        {mode === "select" && (
          <div className="grid gap-4 py-4">
            {savedAccountsBlock}
            <Button 
              onClick={() => setMode("microsoft")}
              className="h-16 bg-[#00a4ef] hover:bg-[#00a4ef]/90 text-white font-bold gap-3"
            >
              <Shield className="w-6 h-6" />
              Login with Microsoft
            </Button>
            <div className="relative">
              <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-zinc-800" /></div>
              <div className="relative flex justify-center text-xs uppercase"><span className="bg-zinc-900 px-2 text-zinc-500">Or</span></div>
            </div>
            <Button 
              variant="outline"
              onClick={() => setMode("local")}
              className="h-16 border-zinc-800 bg-zinc-800/50 hover:bg-zinc-800 text-white font-bold gap-3"
            >
              <User className="w-6 h-6" />
              Play with Local Account
            </Button>
          </div>
        )}

        {mode === "microsoft" && (
          <div className="grid gap-4 py-4">
            {savedAccountsBlock}
            <p className="text-sm text-zinc-400 text-center mb-4">
              You will be redirected to Microsoft to securely sign in to your account.
            </p>
            <Button
              disabled={state.busy}
              onClick={() => {
                setAuthMessage("Starting Microsoft login...")
                send({ type: "login_microsoft" })
              }}
              className="bg-[#00a4ef] hover:bg-[#00a4ef]/90 font-bold"
            >
              Continue to Microsoft
            </Button>
            {authMessage && (
              <div className="w-full text-xs text-zinc-300 bg-zinc-800/60 border border-zinc-700 rounded-lg p-3 whitespace-pre-wrap break-words leading-relaxed max-h-48 overflow-y-auto">
                {authMessage}
              </div>
            )}
            <Button variant="link" onClick={() => setMode("select")} className="text-zinc-500">
              Go back
            </Button>
          </div>
        )}

        {mode === "local" && (
          <div className="grid gap-4 py-4">
            {savedAccountsBlock}
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                placeholder="Enter your username"
                value={username}
                onChange={(event) => setUsername(event.target.value)}
                className="bg-zinc-800 border-zinc-700"
              />
            </div>
            {state.localAccounts.length > 0 && (
              <div className="space-y-2">
                <p className="text-xs uppercase tracking-wide text-zinc-500">Recent local accounts</p>
                <div className="flex flex-wrap gap-2">
                  {state.localAccounts.map((name) => (
                    <Button
                      key={name}
                      variant="outline"
                      className="border-zinc-800 bg-zinc-800/40 text-white text-xs"
                      onClick={() => send({ type: "login_local", username: name })}
                    >
                      {name}
                    </Button>
                  ))}
                </div>
              </div>
            )}
            <Button
              disabled={state.busy}
              onClick={() => {
                const trimmed = username.trim()
                if (!trimmed) {
                  return
                }
                setAuthMessage(null)
                send({ type: "login_local", username: trimmed })
              }}
              className="bg-green-600 hover:bg-green-500 font-bold"
            >
              Start Playing
            </Button>
            <Button variant="link" onClick={() => setMode("select")} className="text-zinc-500">
              Go back
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
