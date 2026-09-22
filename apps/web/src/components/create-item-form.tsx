import { useState, type FormEvent } from "react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import {
  createItemMutation,
  listItemsQueryKey,
} from "@workspace/api-client/query"
import { zItemCreate } from "@workspace/api-client/zod"
import { Button } from "@workspace/ui/components/button"
import { Input } from "@workspace/ui/components/input"
import { Label } from "@workspace/ui/components/label"
import { z } from "zod"

type FieldErrors = z.core.$ZodFlattenedError<
  z.input<typeof zItemCreate>
>["fieldErrors"]

export function CreateItemForm() {
  const queryClient = useQueryClient()
  const [errors, setErrors] = useState<FieldErrors>({})
  const createItem = useMutation({
    ...createItemMutation(),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: listItemsQueryKey() }),
  })

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = event.currentTarget
    const data = new FormData(form)

    // zItemCreate is generated from the Pydantic model, so client-side
    // validation uses exactly the constraints the API enforces.
    const result = zItemCreate.safeParse({
      name: data.get("name"),
      quantity: Number(data.get("quantity")),
      tags: String(data.get("tags") ?? "")
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean),
    })
    if (!result.success) {
      setErrors(z.flattenError(result.error).fieldErrors)
      return
    }

    setErrors({})
    createItem.mutate({ body: result.data }, { onSuccess: () => form.reset() })
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="grid gap-3">
      <div className="grid grid-cols-[1fr_6rem] gap-3">
        <div className="grid gap-1.5">
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            name="name"
            aria-invalid={!!errors.name}
            placeholder="Desk lamp"
          />
          <FieldError messages={errors.name} />
        </div>
        <div className="grid gap-1.5">
          <Label htmlFor="quantity">Quantity</Label>
          <Input
            id="quantity"
            name="quantity"
            type="number"
            defaultValue={1}
            aria-invalid={!!errors.quantity}
          />
          <FieldError messages={errors.quantity} />
        </div>
      </div>
      <div className="grid gap-1.5">
        <Label htmlFor="tags">Tags</Label>
        <Input
          id="tags"
          name="tags"
          aria-invalid={!!errors.tags}
          placeholder="office, lighting"
        />
        <FieldError messages={errors.tags} />
      </div>
      <Button type="submit" disabled={createItem.isPending}>
        {createItem.isPending ? "Adding…" : "Add item"}
      </Button>
      {createItem.isError && (
        <FieldError messages={["The API rejected the item."]} />
      )}
    </form>
  )
}

function FieldError({ messages }: { messages?: string[] }) {
  if (!messages?.length) return null
  return <p className="text-xs text-destructive">{messages[0]}</p>
}
