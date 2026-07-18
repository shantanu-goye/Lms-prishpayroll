'use client'

import { useState } from 'react'
import VerifySubmissionButton from '@/app/ui/admin/verify-submission-button'
import { deleteSubmission } from '@/app/actions/submissions'
import { Badge } from '@/components/ui/badge'
import { TableRow, TableCell } from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import FileViewer from '@/components/FileViewer'
import { Trash2, Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function SubmissionRow({ submission }: { submission: any }) {
  const [deleting, setDeleting] = useState(false)
  const router = useRouter()
  const { student, assignment, status, submittedAt, feedback, id, filePath } = submission
  const { module } = assignment
  const { course } = module

  const handleDelete = async () => {
    if (!confirm('Delete this submission? This cannot be undone.')) return
    setDeleting(true)
    await deleteSubmission(id, course.id)
    router.refresh()
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
        <FileViewer
          fileUrl={filePath}
          className="text-blue-600 hover:text-blue-800 flex items-center gap-1"
        />
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-[4px]">
          <VerifySubmissionButton
            submissionId={id}
            currentStatus={status}
            courseId={course.id}
          />
          <Button
            variant="ghost"
            size="icon"
            disabled={deleting}
            onClick={handleDelete}
            className="h-[32px] w-[32px] text-red-500 hover:bg-red-50 hover:text-red-600 rounded-[6px] border-0"
          >
            {deleting ? (
              <Loader2 className="h-[14px] w-[14px] animate-spin" />
            ) : (
              <Trash2 className="h-[14px] w-[14px]" />
            )}
          </Button>
        </div>
      </TableCell>
    </TableRow>
  )
}
