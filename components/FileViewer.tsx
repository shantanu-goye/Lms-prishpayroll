'use client'

import { useState } from 'react'
import { ExternalLink, X, FileText, FileImage, File, Download, Eye } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'

interface FileViewerProps {
  fileUrl: string
  children?: React.ReactNode
  className?: string
  fileName?: string
}

function getFileType(url: string): 'pdf' | 'image' | 'doc' | 'other' {
  const ext = url.split('?')[0].toLowerCase()
  if (ext.endsWith('.pdf')) return 'pdf'
  if (ext.match(/\.(jpg|jpeg|png|gif|webp|svg)$/)) return 'image'
  if (ext.match(/\.(doc|docx)$/)) return 'doc'
  return 'other'
}

function FileIcon({ fileUrl }: { fileUrl: string }) {
  const type = getFileType(fileUrl)
  switch (type) {
    case 'pdf': return <FileText className="h-4 w-4" />
    case 'image': return <FileImage className="h-4 w-4" />
    case 'doc': return <FileText className="h-4 w-4" />
    default: return <File className="h-4 w-4" />
  }
}

export default function FileViewer({ fileUrl, children, className, fileName }: FileViewerProps) {
  const [open, setOpen] = useState(false)
  const fileType = getFileType(fileUrl)
  const displayName = fileName || fileUrl.split('/').pop() || 'File'

  if (fileType === 'other') {
    return (
      <a
        href={fileUrl}
        target="_blank"
        rel="noopener noreferrer"
        className={className}
      >
        <ExternalLink className="h-4 w-4" />
        {children || 'View File'}
      </a>
    )
  }

  return (
    <>
      <Button
        type="button"
        variant="ghost"
        onClick={() => setOpen(true)}
        className={className}
      >
        <Eye className="h-4 w-4" />
        {children || 'View File'}
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[90vw] md:max-w-[80vw] lg:max-w-[70vw] h-[85vh] max-h-[90vh] bg-white rounded-[12px] p-0 border border-[#E5E7EB] flex flex-col">
          <DialogHeader className="flex flex-row items-center justify-between px-[24px] py-[16px] border-b border-[#E5E7EB] shrink-0">
            <div className="flex items-center gap-[12px] min-w-0">
              <FileIcon fileUrl={fileUrl} />
              <DialogTitle className="text-[16px] font-semibold text-[#0B2E3F] truncate max-w-[400px]">
                {displayName}
              </DialogTitle>
              <span className="text-[11px] uppercase font-bold px-[8px] py-[2px] rounded-full bg-[#F5F8FA] text-[#015A86] border border-[#E5E7EB]">
                {fileType === 'pdf' ? 'PDF' : fileType === 'image' ? 'Image' : 'Document'}
              </span>
            </div>
            <div className="flex items-center gap-[8px]">
              <a
                href={fileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-[6px] px-[12px] py-[6px] text-[13px] font-medium text-[#015A86] hover:bg-[#F5F8FA] rounded-[6px] transition-colors border border-[#E5E7EB]"
              >
                <Download className="h-[14px] w-[14px]" />
                Download
              </a>
              <button
                onClick={() => setOpen(false)}
                className="p-[6px] hover:bg-[#F5F8FA] rounded-[6px] transition-colors text-[#0B2E3F]"
              >
                <X className="h-[18px] w-[18px]" />
              </button>
            </div>
          </DialogHeader>

          <div className="flex-1 overflow-auto bg-[#FAFAFA] p-[24px] flex items-start justify-center">
            {fileType === 'pdf' && (
              <iframe
                src={`${fileUrl}#view=FitH`}
                className="w-full h-full rounded-[8px] border border-[#E5E7EB] bg-white"
                title={displayName}
              />
            )}
            {fileType === 'image' && (
              <div className="max-w-full max-h-full flex items-start justify-center">
                <img
                  src={fileUrl}
                  alt={displayName}
                  className="max-w-full max-h-[75vh] object-contain rounded-[8px] shadow-sm"
                />
              </div>
            )}
            {fileType === 'doc' && (
              <div className="flex flex-col items-center justify-center py-[48px] text-center max-w-md">
                <div className="w-[64px] h-[64px] bg-[#F5F8FA] rounded-[12px] flex items-center justify-center mb-[16px] border border-[#E5E7EB]">
                  <FileText className="h-[32px] w-[32px] text-[#015A86]" />
                </div>
                <h3 className="text-[18px] font-semibold text-[#0B2E3F] mb-[8px]">Document Preview Not Available</h3>
                <p className="text-[14px] text-[#0B2E3F] opacity-70 mb-[24px]">
                  Word documents cannot be previewed in the browser. Download the file to open it in Microsoft Word, Google Docs, or compatible software.
                </p>
                <a
                  href={fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-[8px] px-[20px] py-[10px] bg-[#015A86] text-white font-medium rounded-[8px] hover:bg-[#014a6e] transition-colors"
                >
                  <Download className="h-[16px] w-[16px]" />
                  Download Document
                </a>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
