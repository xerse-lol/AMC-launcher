"use client"

import { useEffect, useRef } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { useLauncher } from "@/components/launcher-provider"

export function LauncherLogs() {
  const { logs, logsOpen, setLogsOpen } = useLauncher()
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!logsOpen) {
      return
    }

    const container = containerRef.current
    if (container) {
      container.scrollTop = container.scrollHeight
    }
  }, [logs, logsOpen])

  return (
    <Dialog open={logsOpen} onOpenChange={setLogsOpen}>
      <DialogContent className="bg-zinc-900 border-zinc-800 text-white sm:max-w-[720px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Launch Logs</DialogTitle>
        </DialogHeader>

        <div
          ref={containerRef}
          className="max-h-[60vh] overflow-y-auto no-scrollbar rounded-xl border border-zinc-800 bg-black/60 p-4 font-mono text-xs text-white/80"
        >
          {logs.length === 0 ? (
            <p className="text-white/50">No logs yet. Launch the game to see output.</p>
          ) : (
            <div className="space-y-1">
              {logs.map((line, index) => (
                <div key={`${index}-${line}`} className="whitespace-pre-wrap">
                  {line}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex justify-end">
          <Button variant="outline" className="bg-black text-white border border-white/10 hover:bg-black/80" onClick={() => setLogsOpen(false)}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
