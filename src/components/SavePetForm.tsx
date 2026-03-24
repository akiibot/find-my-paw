"use client"

import { useActionState, useEffect, useRef } from "react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"

type ActionFn = (formData: FormData) => Promise<void>

interface SavePetFormProps {
  action: ActionFn
  children: React.ReactNode
}

export default function SavePetForm({ action, children }: SavePetFormProps) {
  // submitCount is used as a `key` on the form so uncontrolled inputs
  // (defaultValue) are fully remounted after each successful save,
  // preventing the Base UI "uncontrolled FieldControl" warning.
  const submitCount = useRef(0)

  const [state, formAction, isPending] = useActionState(async (_prev: unknown, formData: FormData) => {
    try {
      await action(formData)
      submitCount.current += 1
      return { success: true as const, count: submitCount.current }
    } catch (err) {
      return { success: false as const, error: err instanceof Error ? err.message : "Something went wrong." }
    }
  }, null)

  useEffect(() => {
    if (state?.success) {
      toast.success("Changes saved!", {
        description: "Your pet's profile has been updated successfully.",
        duration: 4000,
      })
    } else if (state?.success === false) {
      toast.error("Save failed", {
        description: state.error,
        duration: 5000,
      })
    }
  }, [state])

  return (
    // key changes on each successful save, remounting all uncontrolled children
    <form key={state?.success ? state.count : 0} action={formAction} className="space-y-8">
      {children}
      <div className="flex justify-end">
        <Button
          type="submit"
          size="lg"
          disabled={isPending}
          className="h-14 px-10 text-lg rounded-full font-black tracking-wide shadow-lg hover:scale-105 transition-transform disabled:opacity-60 disabled:scale-100"
        >
          {isPending ? "Saving…" : "Save All Changes"}
        </Button>
      </div>
    </form>
  )
}
