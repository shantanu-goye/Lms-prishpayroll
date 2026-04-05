'use client'

import { useState } from 'react'
import { updateSubmissionFeedback } from '@/app/actions/submissions'
import { Button } from '@/components/ui/button'
import { 
    Dialog, 
    DialogContent, 
    DialogHeader, 
    DialogTitle, 
    DialogTrigger,
    DialogFooter,
    DialogDescription
} from '@/components/ui/dialog'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { CheckCircle2, XCircle, MessageSquare, ExternalLink, Loader2 } from 'lucide-react'
import { useTransition } from 'react'

export default function VerifySubmissionButton({ 
    submissionId, 
    courseId, 
    currentStatus,
    currentFeedback
}: { 
    submissionId: number; 
    courseId: number; 
    currentStatus: string;
    currentFeedback?: string | null;
}) {
    const [isPending, startTransition] = useTransition()
    const [open, setOpen] = useState(false)
    const [feedback, setFeedback] = useState(currentFeedback || '')

    const handleUpdate = (status: string) => {
        startTransition(async () => {
            await updateSubmissionFeedback(submissionId, feedback, status, courseId)
            setOpen(false)
        })
    }

    const getStatusBadge = () => {
        if (currentStatus === 'VERIFIED') {
            return (
                <span className="inline-flex items-center gap-[4px] px-[10px] py-[4px] rounded-full text-[12px] font-semibold bg-green-50 text-green-700 border border-green-200">
                    <CheckCircle2 className="h-[14px] w-[14px]" />
                    Verified
                </span>
            )
        }
        if (currentStatus === 'REJECTED') {
            return (
                <span className="inline-flex items-center gap-[4px] px-[10px] py-[4px] rounded-full text-[12px] font-semibold bg-red-50 text-red-600 border border-red-200">
                    <XCircle className="h-[14px] w-[14px]" />
                    Rejected
                </span>
            )
        }
        return (
            <span className="inline-flex items-center gap-[4px] px-[10px] py-[4px] rounded-full text-[12px] font-semibold bg-blue-50 text-blue-700 border border-blue-200">
                Pending
            </span>
        )
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-[32px] px-[12px] text-[12px] font-medium text-[#015A86] hover:bg-[#F5F8FA] rounded-[6px] border-0"
                >
                    <MessageSquare className="mr-[6px] h-[14px] w-[14px] stroke-2" />
                    Review
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px] bg-white rounded-[12px] p-[32px] border border-[#E5E7EB]">
                <DialogHeader className="mb-[24px]">
                    <DialogTitle className="text-[24px] font-semibold text-[#015A86]">Review Submission</DialogTitle>
                    <DialogDescription className="text-[#0B2E3F] text-[14px]">
                        Leave feedback and update the submission status.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-[20px]">
                    <div className="flex items-center justify-between">
                        <span className="text-[14px] font-medium text-[#0B2E3F]">Current Status:</span>
                        {getStatusBadge()}
                    </div>

                    <div className="space-y-[8px]">
                        <Label htmlFor="feedback" className="text-[#0B2E3F] font-medium text-[14px]">Admin Feedback</Label>
                        <Textarea
                            id="feedback"
                            placeholder="Great job! Keep it up..."
                            value={feedback}
                            onChange={(e) => setFeedback(e.target.value)}
                            rows={4}
                            className="border-[#E5E7EB] focus-visible:ring-[#015A86] rounded-[6px] resize-none"
                        />
                    </div>
                </div>

                <DialogFooter className="grid grid-cols-2 gap-[12px] pt-[24px] mt-[8px] border-t border-[#E5E7EB]">
                    <Button
                        disabled={isPending}
                        onClick={() => handleUpdate('REJECTED')}
                        variant="outline"
                        className="border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 h-[44px] font-medium rounded-[8px]"
                    >
                        {isPending ? <Loader2 className="h-[16px] w-[16px] animate-spin" /> : <XCircle className="mr-[8px] h-[16px] w-[16px]" />}
                        Reject
                    </Button>
                    <Button
                        disabled={isPending}
                        onClick={() => handleUpdate('VERIFIED')}
                        className="bg-[#015A86] hover:bg-[#014a6e] text-white h-[44px] font-medium rounded-[8px] border-0"
                    >
                        {isPending ? <Loader2 className="h-[16px] w-[16px] animate-spin" /> : <CheckCircle2 className="mr-[8px] h-[16px] w-[16px]" />}
                        Verify & Feedback
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
