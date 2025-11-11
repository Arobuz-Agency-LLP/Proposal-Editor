"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { X, Trash2, Folder } from "lucide-react"
import { useProposalStore } from "@/lib/store"

export function ProposalsList({ onClose }) {
  const { proposals, loadProposal, deleteProposal, currentProposalId } = useProposalStore()

  const handleDelete = (id: string) => {
    if (window.confirm("Are you sure you want to delete this proposal?")) {
      deleteProposal(id)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center sticky top-0 bg-card p-4 border-b border-border">
          <div className="flex items-center gap-2">
            <Folder className="w-5 h-5" />
            <h2 className="text-lg font-semibold text-foreground">My Proposals</h2>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>

        <div className="p-6">
          {proposals.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No proposals yet. Create your first one!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {proposals.map((proposal) => (
                <Card
                  key={proposal.id}
                  className={`p-4 cursor-pointer transition-colors ${
                    currentProposalId === proposal.id ? "bg-primary/10 border-primary" : "hover:bg-muted/50"
                  }`}
                  onClick={() => {
                    loadProposal(proposal.id)
                    onClose()
                  }}
                >
                  <div className="flex justify-between items-start gap-4">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-foreground truncate">{proposal.name}</h3>
                      <p className="text-xs text-muted-foreground mt-1">
                        Created: {new Date(proposal.createdAt).toLocaleDateString()}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Updated: {new Date(proposal.updatedAt).toLocaleDateString()}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleDelete(proposal.id)
                      }}
                    >
                      <Trash2 className="w-4 h-4 text-destructive" />
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </Card>
    </div>
  )
}
