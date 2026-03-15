import { useState, useEffect, useCallback, useRef } from "react";
import { CheckoutDraft } from "@/types/checkout";

const STORAGE_KEY = "EA_CHECKOUT_DRAFT_V1";

export function useCheckoutDraft() {
  const [draft, setDraft] = useState<CheckoutDraft | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const draftRef = useRef(draft);
  draftRef.current = draft;

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setDraft(JSON.parse(stored));
      }
    } catch (error) {
      console.error("Error loading checkout draft:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Save to localStorage
  const saveDraft = useCallback((newDraft: CheckoutDraft) => {
    try {
      const draftToSave = {
        ...newDraft,
        updatedAt: new Date().toISOString(),
        createdAt: newDraft.createdAt || new Date().toISOString(),
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(draftToSave));
      setDraft(draftToSave);
    } catch (error) {
      console.error("Error saving checkout draft:", error);
    }
  }, []);

  // Update draft — use ref to avoid draft in deps (prevents infinite loop when saveDraft calls setDraft)
  const updateDraft = useCallback(
    (updates: Partial<CheckoutDraft>) => {
      const updatedDraft = {
        ...draftRef.current,
        ...updates,
      } as CheckoutDraft;
      saveDraft(updatedDraft);
    },
    [saveDraft]
  );

  // Clear draft
  const clearDraft = useCallback(() => {
    try {
      localStorage.removeItem(STORAGE_KEY);
      setDraft(null);
    } catch (error) {
      console.error("Error clearing checkout draft:", error);
    }
  }, []);

  return {
    draft,
    isLoading,
    updateDraft,
    clearDraft,
    saveDraft,
  };
}
