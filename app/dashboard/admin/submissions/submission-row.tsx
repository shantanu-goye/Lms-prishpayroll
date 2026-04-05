'use client'

import VerifySubmissionButton from '@/app/ui/admin/verify-submission-button'
import { Badge } from '@/components/ui/badge'
import { TableRow, TableCell } from '@/components/ui/table'
import FileViewer from '@/components/FileViewer'

export default function SubmissionRow({ submission }: { submission: any }) {
  const { student, assignment, status, submittedAt, feedback, id, filePath } = submission
  const { module } = assignment
  const { course } = module

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
        <VerifySubmissionButton
          submissionId={id}
          currentStatus={status}
          courseId={course.id}
        />
      </TableCell>
    </TableRow>
  )
}