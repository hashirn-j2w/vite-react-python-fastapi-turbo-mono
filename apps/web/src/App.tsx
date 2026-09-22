import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import {
  deleteItemMutation,
  listItemsOptions,
  listItemsQueryKey,
} from "@workspace/api-client/query"
import { Badge } from "@workspace/ui/components/badge"
import { Button } from "@workspace/ui/components/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card"
import { Trash2Icon } from "lucide-react"

import { CreateItemForm } from "@/components/create-item-form.tsx"

export function App() {
  const queryClient = useQueryClient()
  const items = useQuery(listItemsOptions())

  const deleteItem = useMutation({
    ...deleteItemMutation(),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: listItemsQueryKey() }),
  })

  return (
    <main className="mx-auto flex min-h-svh max-w-xl flex-col gap-6 p-6">
      <Card>
        <CardHeader>
          <CardTitle>Items</CardTitle>
          <CardDescription>
            FastAPI → OpenAPI → generated client, Zod schemas and TanStack Query
            options.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-6">
          <CreateItemForm />

          {items.isPending ? (
            <p className="text-sm text-muted-foreground">Loading…</p>
          ) : items.isError ? (
            <p className="text-sm text-destructive">
              Couldn&apos;t load items. Is the API running?
            </p>
          ) : (
            <ul className="divide-y">
              {items.data.map((item) => (
                <li
                  key={item.id}
                  className="flex items-center justify-between gap-4 py-3"
                >
                  <div className="flex min-w-0 flex-col gap-1">
                    <p className="text-sm font-medium">
                      {item.name}{" "}
                      <span className="text-muted-foreground">
                        × {item.quantity}
                      </span>
                    </p>
                    {item.description && (
                      <p className="truncate text-xs text-muted-foreground">
                        {item.description}
                      </p>
                    )}
                    {item.tags.length > 0 && (
                      <div className="flex gap-1">
                        {item.tags.map((tag) => (
                          <Badge key={tag} variant="secondary">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    aria-label={`Delete ${item.name}`}
                    disabled={deleteItem.isPending}
                    onClick={() =>
                      deleteItem.mutate({ path: { item_id: item.id } })
                    }
                  >
                    <Trash2Icon />
                  </Button>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
      <p className="text-center font-mono text-xs text-muted-foreground">
        Press <kbd>d</kbd> to toggle dark mode
      </p>
    </main>
  )
}
