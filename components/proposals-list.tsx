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
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl border-border/50 animate-scaleIn">
        <div className="flex justify-between items-center sticky top-0 bg-card/95 backdrop-blur-xl p-4 border-b border-border/50 z-10">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <Folder className="w-5 h-5 text-primary" />
            </div>
            <h2 className="text-xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">My Proposals</h2>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>

        <div className="p-6 bg-gradient-to-b from-background to-muted/10">
          {proposals.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted/50 flex items-center justify-center">
                <Folder className="w-8 h-8 text-muted-foreground" />
              </div>
              <p className="text-muted-foreground font-medium">No proposals yet</p>
              <p className="text-sm text-muted-foreground mt-1">Create your first one!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {proposals.map((proposal, index) => (
                <Card
                  key={proposal.id}
                  className={`p-5 cursor-pointer transition-all duration-200 hover:scale-[1.02] hover:shadow-lg ${
                    currentProposalId === proposal.id 
                      ? "bg-gradient-to-r from-primary/10 to-primary/5 border-primary shadow-md" 
                      : "hover:bg-muted/50 border-border/50"
                  }`}
                  style={{ animationDelay: `${index * 50}ms` }}
                  onClick={() => {
                    loadProposal(proposal.id)
                    onClose()
                  }}
                >
                  <div className="flex justify-between items-start gap-4">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-foreground truncate mb-2">{proposal.name}</h3>
                      <div className="space-y-1">
                        <p className="text-xs text-muted-foreground">
                          <span className="font-medium">Created:</span> {new Date(proposal.createdAt).toLocaleDateString()}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          <span className="font-medium">Updated:</span> {new Date(proposal.updatedAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="hover:bg-destructive/10 hover:text-destructive transition-all duration-200"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleDelete(proposal.id)
                      }}
                    >
                      <Trash2 className="w-4 h-4" />
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
