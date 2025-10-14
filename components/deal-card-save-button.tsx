"use client";

import { SaveButton } from "@/components/save-button";

interface DealCardSaveButtonProps {
  dealId: string;
}

export function DealCardSaveButton({ dealId }: DealCardSaveButtonProps) {
  return <SaveButton itemId={dealId} itemType="deal" />;
}
