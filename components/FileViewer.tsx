'use client'

import { ExternalLink } from 'lucide-react'

interface FileViewerProps {
  fileUrl: string
  children?: React.ReactNode
  className?: string
}

export default function FileViewer({ fileUrl, children, className }: FileViewerProps) {
  const handleViewFile = () => {
    window.open(fileUrl, '_blank')
  }

  return (
    <button
      onClick={handleViewFile}
      className={className}
    >
      <ExternalLink className="h-4 w-4" />
      {children || 'View File'}
    </button>
  )
}