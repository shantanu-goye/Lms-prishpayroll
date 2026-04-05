'use client'

import { useState } from 'react'
import { getSubmissionFileUrl } from '@/app/actions/submissions'
import VerifySubmissionButton from '@/app/ui/admin/verify-submission-button'
import { Badge } from '@/components/ui/badge'
import { ExternalLink, Loader2 } from 'lucide-react'

export default function SubmissionRow({ submission }: { submission: any }) {
  const { student, assignment, status, submittedAt, feedback, id, filePath } = submission
  const { module } = assignment
  const { course } = module

  const [fileUrl, setFileUrl] = useState<string | null>(null)
  const [isLoadingUrl, setIsLoadingUrl] = useState(false)

  const handleViewFile = async () => {
    if (fileUrl) {
      window.open(fileUrl, '_blank')
      return
    }

    setIsLoadingUrl(true)
    try {
      const result = await getSubmissionFileUrl(id)
      if (result.signedUrl) {
        setFileUrl(result.signedUrl)
        window.open(result.signedUrl, '_blank')
      } else {
        alert('Failed to generate file URL')
      }
    } catch (error) {
      console.error('Error getting file URL:', error)
      alert('Failed to access file')
    } finally {
      setIsLoadingUrl(false)
    }
  }

  return (
    <TableRow>
      <TableCell className="font-medium">{student.name}</TableCell>
      <TableCell>{assignment.title}</TableCell>
      <TableCell>{course.title}</TableCell>
      <TableCell>{new Date(submittedAt).toLocaleDateString()}</TableCell>
      <TableCell>
        <Badge
          variant={
            status === 'VERIFIED' ? 'default' :
            status === 'REJECTED' ? 'destructive' :
            'secondary'
          }
        >
          {status}
        </Badge>
      </TableCell>
      <TableCell>
        <button
          onClick={handleViewFile}
          disabled={isLoadingUrl}
          className="text-blue-600 hover:text-blue-800 flex items-center gap-1 disabled:opacity-50"
        >
          {isLoadingUrl ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <ExternalLink className="h-4 w-4" />
          )}
          View File
        </button>
      </TableCell>
      <TableCell>
        <VerifySubmissionButton
          submissionId={id}
          currentStatus={status}
          courseId={course.id}
        />
      </TableCell>
    </TableRow>
  )
}