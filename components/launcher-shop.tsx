"use client"

import { ShoppingBag } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { useLauncher } from "@/components/launcher-provider"
import { cn } from "@/lib/utils"

export function LauncherShop() {
  const { state, send } = useLauncher()
  const shop = state.shop
  const darkButton = "bg-black text-white border border-white/10 hover:bg-black/80 hover:text-white"

  const grouped = shop.items.reduce<Record<string, typeof shop.items>>((acc, item) => {
    acc[item.type] = acc[item.type] ? [...acc[item.type], item] : [item]
    return acc
  }, {})

  return (
    <div className="flex-1 flex flex-col p-8 gap-6 overflow-y-auto no-scrollbar">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-white">AMC Shop</h2>
          <p className="text-white/60">Client-side cosmetics and accessories.</p>
        </div>
        <Card className="bg-black/40 border-white/10 px-4 py-3 flex items-center gap-3">
          <ShoppingBag className="w-5 h-5 text-green-400" />
          <div>
            <p className="text-xs text-white/50">Points</p>
            <p className="text-lg font-bold text-white">{shop.points}</p>
          </div>
          <div className="text-xs text-white/40">
            +{shop.pointsPerMinute} / min • {shop.totalPlayMinutes} min played
          </div>
        </Card>
      </div>

      {Object.keys(grouped).length === 0 ? (
        <Card className="bg-black/40 border-white/10 p-8 text-center text-white/60">
          Shop items are loading. Launch the game to earn points.
        </Card>
      ) : (
        Object.entries(grouped).map(([type, items]) => (
          <div key={type} className="space-y-3">
            <h3 className="text-xl font-semibold text-white capitalize">{type}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {items.map((item) => {
                const canBuy = shop.points >= item.price
                const actionLabel = item.owned ? (item.equipped ? "Equipped" : "Equip") : "Buy"
                return (
                  <Card key={item.id} className="bg-black/40 border-white/10 p-4 space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-black/60 border border-white/10 flex items-center justify-center text-xl">
                        {item.icon}
                      </div>
                      <div className="flex-1">
                        <p className="text-white font-semibold">{item.name}</p>
                        <p className="text-xs text-white/50">{item.price} pts</p>
                      </div>
                    </div>
                    <p className="text-xs text-white/50">{item.description}</p>
                    {item.requiresMod && (
                      <p className="text-[11px] text-yellow-300/80">Requires AMC cosmetics mod in-game.</p>
                    )}
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        className={cn(darkButton, item.owned && item.equipped && "opacity-60")}
                        disabled={item.owned ? item.equipped : !canBuy}
                        onClick={() => {
                          if (!item.owned) {
                            send({ type: "shop_buy", id: item.id })
                          } else if (!item.equipped) {
                            send({ type: "shop_equip", id: item.id })
                          }
                        }}
                      >
                        {actionLabel}
                      </Button>
                      {item.owned && item.equipped && (
                        <Button
                          size="sm"
                          className={darkButton}
                          onClick={() => send({ type: "shop_unequip", slot: item.type })}
                        >
                          Unequip
                        </Button>
                      )}
                    </div>
                  </Card>
                )
              })}
            </div>
          </div>
        ))
      )}
    </div>
  )
}
