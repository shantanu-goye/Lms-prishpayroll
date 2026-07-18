'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter,
} from '@/components/ui/dialog'
import { Trash2, Loader2, AlertTriangle } from 'lucide-react'

interface DeleteConfirmDialogProps {
  onConfirm: () => Promise<void>
  title: string
  description: string
  entityName: string
  children?: React.ReactNode
}

export default function DeleteConfirmDialog({
  onConfirm, title, description, entityName, children,
}: DeleteConfirmDialogProps) {
  const [open, setOpen] = useState(false)
  const [deleting, setDeleting] = useState(false)

  const handleDelete = async () => {
    setDeleting(true)
    await onConfirm()
    setOpen(false)
  }

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setOpen(true)}
        className="text-red-500 hover:bg-red-50 hover:text-red-600 h-[36px] w-[36px] rounded-[6px] transition-colors border-0"
        title={`Delete ${entityName}`}
      >
        {children || <Trash2 className="h-[18px] w-[18px] stroke-2" />}
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[420px] bg-white rounded-[12px] p-[24px] border border-[#E5E7EB]">
          <DialogHeader className="mb-[16px]">
            <div className="flex items-center gap-[12px]">
              <div className="h-[40px] w-[40px] rounded-full bg-red-50 flex items-center justify-center shrink-0">
                <AlertTriangle className="h-[20px] w-[20px] text-red-500" />
              </div>
              <div>
                <DialogTitle className="text-[18px] font-semibold text-[#0B2E3F]">{title}</DialogTitle>
                <DialogDescription className="text-[14px] text-[#0B2E3F] opacity-70">
                  This action cannot be undone.
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          <p className="text-[14px] text-[#0B2E3F] leading-relaxed ml-[52px] mb-[24px]">
            {description}
          </p>

          <DialogFooter className="flex gap-[12px] justify-end">
            <Button
              variant="outline"
              onClick={() => setOpen(false)}
              className="h-[40px] px-[20px] font-medium rounded-[8px] border-[#E5E7EB] text-[#0B2E3F]"
            >
              Cancel
            </Button>
            <Button
              onClick={handleDelete}
              disabled={deleting}
              className="h-[40px] px-[20px] font-medium rounded-[8px] bg-red-600 hover:bg-red-700 text-white border-0"
            >
              {deleting ? (
                <Loader2 className="h-[16px] w-[16px] animate-spin mr-[8px]" />
              ) : (
                <Trash2 className="h-[16px] w-[16px] mr-[8px]" />
              )}
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
