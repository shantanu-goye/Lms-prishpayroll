'use client'

import { useState } from 'react'
import VerifySubmissionButton from '@/app/ui/admin/verify-submission-button'
import { deleteSubmission } from '@/app/actions/submissions'
import { Badge } from '@/components/ui/badge'
import { TableRow, TableCell } from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog'
import FileViewer from '@/components/FileViewer'
import { Trash2, Loader2, AlertTriangle } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function SubmissionRow({ submission }: { submission: any }) {
  const [deleting, setDeleting] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const router = useRouter()
  const { student, assignment, status, submittedAt, feedback, id, filePath } = submission
  const { module } = assignment
  const { course } = module

  const handleDelete = async () => {
    setDeleting(true)
    setShowConfirm(false)
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
            currentFeedback={feedback}
            courseId={course.id}
            fileUrl={filePath}
            studentName={student.name}
            assignmentTitle={assignment.title}
          />
          <Button
            variant="ghost"
            size="icon"
            disabled={deleting}
            onClick={() => setShowConfirm(true)}
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

      <Dialog open={showConfirm} onOpenChange={setShowConfirm}>
        <DialogContent className="sm:max-w-[400px] bg-white rounded-[12px] p-[24px] border border-[#E5E7EB]">
          <DialogHeader className="mb-[16px]">
            <div className="flex items-center gap-[12px]">
              <div className="h-[40px] w-[40px] rounded-full bg-red-50 flex items-center justify-center">
                <AlertTriangle className="h-[20px] w-[20px] text-red-500" />
              </div>
              <div>
                <DialogTitle className="text-[18px] font-semibold text-[#0B2E3F]">Delete Submission</DialogTitle>
                <DialogDescription className="text-[14px] text-[#0B2E3F] opacity-70">
                  This action cannot be undone.
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          <p className="text-[14px] text-[#0B2E3F] mb-[24px] ml-[52px]">
            Are you sure you want to delete <strong>{student.name}</strong>&apos;s submission for <strong>{assignment.title}</strong>?
          </p>

          <DialogFooter className="flex gap-[12px] justify-end">
            <Button
              variant="outline"
              onClick={() => setShowConfirm(false)}
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
    </TableRow>
  )
}
