"use client"

import { Button } from "@/components/ui/button"
import { Bookmark } from "lucide-react"
import { useData } from "@/lib/data-context"
import { useToast } from "@/hooks/use-toast"
import { cn } from "@/lib/utils"
import { useRouter } from "next/navigation"

interface DealCardSaveButtonProps {
  dealId: string
}

export function DealCardSaveButton({ dealId }: DealCardSaveButtonProps) {
  const { currentUser, isSaved, saveDeal, unsaveDeal } = useData()
  const { toast } = useToast()
  const router = useRouter()
  const saved = isSaved(dealId)

  const handleToggleSave = async () => {
    try {
      if (!currentUser) {
        router.push("/login")
        throw new Error("You must be logged in to save deals")
      }

      if (saved) {
        await unsaveDeal(dealId)
        toast({
          title: "Deal removed",
          description: "Deal removed from your saved items",
        })
      } else {
        await saveDeal(dealId)
        toast({
          title: "Deal saved",
          description: "Deal added to your saved items",
        })
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "An error occurred",
        variant: "destructive",
      })
    }
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      className={cn("gap-1 px-2", saved && "text-primary")}
      onClick={handleToggleSave}
      title={saved ? "Remove from saved" : "Save deal"}
    >
      <Bookmark className={cn("h-4 w-4", saved && "fill-current")} />
      <span className="sr-only">{saved ? "Unsave" : "Save"}</span>
    </Button>
  )
}
