"use client"

import { create } from "zustand"

export interface SavedProposal {
  id: string
  name: string
  content: string
  createdAt: Date
  updatedAt: Date
}

export interface ProposalStore {
  content: string
  currentProposalId: string | null
  proposals: SavedProposal[]
  setContent: (content: string) => void
  saveToLocalStorage: (name?: string) => string
  loadFromStorage: () => void
  loadProposal: (id: string) => void
  deleteProposal: (id: string) => void
  getAllProposals: () => SavedProposal[]
  clearContent: () => void
  setProposals: (proposals: SavedProposal[]) => void
  setCurrentProposalId: (id: string | null) => void
}

export const useProposalStore = create<ProposalStore>((set, get) => ({
  content: "",
  currentProposalId: null,
  proposals: [],

  setContent: (content: string) => set({ content }),
  setProposals: (proposals: SavedProposal[]) => set({ proposals }),
  setCurrentProposalId: (id: string | null) => set({ currentProposalId: id }),

  saveToLocalStorage: (name?: string) => {
    const state = get()
    if (!state.content.trim()) return state.currentProposalId || ""

    const now = new Date()
    let id = state.currentProposalId

    if (!id) {
      id = `proposal_${Date.now()}`
      const newProposal: SavedProposal = {
        id,
        name: name || `Proposal ${now.toLocaleDateString()}`,
        content: state.content,
        createdAt: now,
        updatedAt: now,
      }
      set((s) => ({
        proposals: [newProposal, ...s.proposals],
        currentProposalId: id,
      }))
    } else {
      set((s) => ({
        proposals: s.proposals.map((p) =>
          p.id === id ? { ...p, content: state.content, updatedAt: now, name: name || p.name } : p,
        ),
      }))
    }

    if (typeof window !== "undefined") {
      localStorage.setItem("proposals_list", JSON.stringify(get().proposals))
      localStorage.setItem("current_proposal_id", id)
    }

    return id
  },

  loadFromStorage: () => {
    if (typeof window === "undefined") return

    const stored = localStorage.getItem("proposals_list")
    const currentId = localStorage.getItem("current_proposal_id")

    if (stored) {
      const proposals = JSON.parse(stored)
      set({ proposals })

      if (currentId) {
        const current = proposals.find((p: SavedProposal) => p.id === currentId)
        if (current) {
          set({ content: current.content, currentProposalId: currentId })
        }
      }
    }
  },

  loadProposal: (id: string) => {
    const state = get()
    const proposal = state.proposals.find((p) => p.id === id)
    if (proposal) {
      set({ content: proposal.content, currentProposalId: id })
      if (typeof window !== "undefined") {
        localStorage.setItem("current_proposal_id", id)
      }
    }
  },

  deleteProposal: (id: string) => {
    const state = get()
    set((s) => ({
      proposals: s.proposals.filter((p) => p.id !== id),
      ...(s.currentProposalId === id && { currentProposalId: null, content: "" }),
    }))

    if (typeof window !== "undefined") {
      localStorage.setItem("proposals_list", JSON.stringify(get().proposals))
      if (get().currentProposalId === id) {
        localStorage.removeItem("current_proposal_id")
      }
    }
  },

  getAllProposals: () => get().proposals,

  clearContent: () => set({ content: "", currentProposalId: null }),
}))
