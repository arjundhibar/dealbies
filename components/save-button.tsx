"use client";

import { Button } from "@/components/ui/button";
import { Bookmark } from "lucide-react";
import { cn } from "@/lib/utils";
import { useData } from "@/lib/data-context";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

interface SaveButtonProps {
  itemId: string;
  itemType: "deal" | "coupon";
}

export function SaveButton({ itemId, itemType }: SaveButtonProps) {
  const {
    currentUser,
    isSaved,
    isCouponSaved,
    saveDeal,
    unsaveDeal,
    saveCoupon,
    unsaveCoupon,
  } = useData();
  const { toast } = useToast();
  const router = useRouter();

  const saved = itemType === "deal" ? isSaved(itemId) : isCouponSaved(itemId);

  const handleToggleSave = async () => {
    try {
      console.log("Save button clicked for", itemType, ":", itemId);
      console.log("Current user:", currentUser);
      console.log("Currently saved:", saved);

      if (!currentUser) {
        console.log("No currentUser, redirecting to login");
        router.push("/login");
        throw new Error("You must be logged in to save items");
      }

      if (saved) {
        console.log("Unsaving", itemType, ":", itemId);
        if (itemType === "deal") {
          await unsaveDeal(itemId);
        } else {
          await unsaveCoupon(itemId);
        }
        toast({
          title: `${itemType === "deal" ? "Deal" : "Coupon"} removed`,
          description: `${
            itemType === "deal" ? "Deal" : "Coupon"
          } removed from your saved items`,
        });
      } else {
        console.log("Saving", itemType, ":", itemId);
        if (itemType === "deal") {
          await saveDeal(itemId);
        } else {
          await saveCoupon(itemId);
        }
        toast({
          title: `${itemType === "deal" ? "Deal" : "Coupon"} saved`,
          description: `${
            itemType === "deal" ? "Deal" : "Coupon"
          } added to your saved items`,
        });
      }
    } catch (error: any) {
      console.error("Error in handleToggleSave:", error);
      toast({
        title: "Error",
        description: error.message || "An error occurred",
        variant: "destructive",
      });
    }
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      className={cn("gap-1 px-2", saved && "text-primary")}
      onClick={handleToggleSave}
      title={saved ? `Remove from saved` : `Save ${itemType}`}
    >
      <Bookmark className={cn("h-4 w-4", saved && "fill-current")} />
      <span className="sr-only">{saved ? "Unsave" : "Save"}</span>
    </Button>
  );
}
