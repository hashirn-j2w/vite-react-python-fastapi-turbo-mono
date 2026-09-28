import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { deleteItemMutation, listItemsOptions, listItemsQueryKey } from "@workspace/api-client/query"
import { Badge } from "@workspace/ui/components/badge"
import { Button } from "@workspace/ui/components/button"
import { Card, CardContent, CardHeader, CardTitle } from "@workspace/ui/components/card"
import { AnimatePresence, motion } from "motion/react"
import { Activity, ArrowUpRight, Box, ChevronDown, CircleHelp, FileText, LayoutDashboard, Menu, Package, Plus, Settings, Trash2 } from "lucide-react"
import { useState } from "react"
import { CreateItemForm } from "@/components/create-item-form.tsx"

const navItems = [
  { label: "item-1", icon: LayoutDashboard },
  { label: "item-2", icon: Package },
  { label: "item-3", icon: FileText },
  { label: "item-4", icon: Activity },
  { label: "item-5", icon: Settings },
]

export function App() {
  const queryClient = useQueryClient()
  const items = useQuery(listItemsOptions())
  const [activeItem, setActiveItem] = useState("item-1")
  const [collapsed, setCollapsed] = useState(false)

  const deleteItem = useMutation({
    ...deleteItemMutation(),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: listItemsQueryKey() }),
  })

  return (
    <div className="flex min-h-svh bg-background">
      <motion.aside initial={{ x: -24, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ duration: 0.35, ease: "easeOut" }} className={`${collapsed ? "w-[76px]" : "w-[250px]"} hidden shrink-0 flex-col border-r border-sidebar-border bg-sidebar transition-[width] duration-300 md:flex`}>
        <div className="flex h-16 items-center gap-3 border-b border-sidebar-border px-4">
          <img src="/j2w-logo.png" alt="Joules to Watts" className="h-9 w-auto object-contain dark:rounded-sm dark:bg-white dark:px-1" />
          {!collapsed && <span className="text-xs font-semibold tracking-tight text-sidebar-foreground">JOULES TO WATTS</span>}
        </div>
        <div className="flex items-center justify-between px-3 py-5">
          {!collapsed && <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-sidebar-foreground/45">Workspace</span>}
          <button className="rounded-md p-1.5 text-sidebar-foreground/60 hover:bg-sidebar-accent hover:text-sidebar-foreground" onClick={() => setCollapsed((value) => !value)} aria-label="Toggle sidebar"><Menu className="size-4" /></button>
        </div>
        <nav className="flex-1 px-3">
          {navItems.map(({ label, icon: Icon }) => <button key={label} onClick={() => setActiveItem(label)} className={`mb-1 flex h-10 w-full items-center gap-3 rounded-md px-3 text-left text-sm transition-colors ${activeItem === label ? "bg-sidebar-accent font-medium text-sidebar-accent-foreground" : "text-sidebar-foreground/65 hover:bg-sidebar-accent/70 hover:text-sidebar-foreground"}`}><Icon className="size-4 shrink-0" />{!collapsed && <span>{label}</span>}</button>)}
        </nav>
        <div className="border-t border-sidebar-border p-3"><button className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm text-sidebar-foreground/60 hover:bg-sidebar-accent hover:text-sidebar-foreground"><CircleHelp className="size-4" />{!collapsed && <span>Help & support</span>}</button></div>
      </motion.aside>

      <main className="min-w-0 flex-1">
        <header className="flex h-16 items-center justify-between border-b border-border bg-background/85 px-5 backdrop-blur md:px-8"><div className="flex items-center gap-3"><span className="text-sm text-muted-foreground">Workspace</span><ChevronDown className="size-4 text-muted-foreground" /></div><div className="flex items-center gap-2"><span className="hidden text-xs text-muted-foreground sm:inline">Template demo</span><div className="size-8 rounded-full bg-[var(--brand)] text-center text-xs font-bold leading-8 text-white">JD</div></div></header>
        <div className="mx-auto max-w-7xl px-5 py-8 md:px-8 md:py-10">
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="mb-8 flex flex-wrap items-end justify-between gap-5"><div><p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--brand)]">Dashboard / {activeItem}</p><h1 className="text-3xl font-semibold tracking-tight md:text-4xl">Good morning, welcome back.</h1><p className="mt-2 text-sm text-muted-foreground">A clean starting point for your next experience.</p></div><Button className="btn-raised gap-2"><Plus className="size-4" />New item</Button></motion.div>
          <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{[{ label: "Total items", value: items.data?.length ?? 0, note: "in your workspace" }, { label: "Active projects", value: 12, note: "+2 this month" }, { label: "Completion rate", value: "84%", note: "+8.4% from last week" }, { label: "Last updated", value: "Today", note: "09:42 AM" }].map((stat, index) => <motion.div key={stat.label} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.07, duration: 0.35 }}><Card className="h-full"><CardContent className="p-5"><p className="text-xs text-muted-foreground">{stat.label}</p><p className="mt-3 text-2xl font-semibold tabular-nums">{stat.value}</p><p className="mt-1 text-xs text-[var(--positive)]">{stat.note}</p></CardContent></Card></motion.div>)}</div>
          <div className="grid gap-6 lg:grid-cols-[1.25fr_0.75fr]">
            <Card><CardHeader className="flex-row items-center justify-between"><div><CardTitle>Items overview</CardTitle><p className="mt-1 text-sm text-muted-foreground">Manage the things in your workspace.</p></div><Box className="size-5 text-muted-foreground" /></CardHeader><CardContent><CreateItemForm /><AnimatePresence mode="popLayout">{items.isPending ? <p className="py-8 text-sm text-muted-foreground">Loading items…</p> : items.isError ? <p className="py-8 text-sm text-destructive">Couldn&apos;t load items. Is the API running?</p> : items.data.length === 0 ? <p className="py-8 text-sm text-muted-foreground">No items yet. Add one above to get started.</p> : <ul className="mt-7 divide-y divide-border">{items.data.map((item) => <motion.li layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} key={item.id} className="flex items-center justify-between gap-4 py-4"><div className="min-w-0"><p className="text-sm font-medium">{item.name} <span className="text-muted-foreground">× {item.quantity}</span></p>{item.description && <p className="truncate text-xs text-muted-foreground">{item.description}</p>}{item.tags.length > 0 && <div className="mt-1 flex gap-1">{item.tags.map((tag) => <Badge key={tag} variant="secondary">{tag}</Badge>)}</div>}</div><Button variant="ghost" size="icon-sm" aria-label={`Delete ${item.name}`} disabled={deleteItem.isPending} onClick={() => deleteItem.mutate({ path: { item_id: item.id } })}><Trash2 /></Button></motion.li>)}</ul>}</AnimatePresence></CardContent></Card>
            <Card className="bg-[var(--primary)] text-[var(--primary-foreground)]"><CardContent className="flex h-full min-h-[280px] flex-col justify-between p-6"><div><div className="mb-8 flex size-10 items-center justify-center rounded-full bg-[var(--brand)] text-white"><ArrowUpRight className="size-5" /></div><h2 className="text-2xl font-semibold tracking-tight">Build something useful.</h2><p className="mt-3 max-w-xs text-sm opacity-65">This dashboard is ready to become the home for your next product workflow.</p></div><button className="flex items-center gap-2 text-sm font-medium underline-offset-4 hover:underline">Explore the template <ArrowUpRight className="size-4" /></button></CardContent></Card>
          </div>
        </div>
      </main>
    </div>
  )
}
