'use client'

import { updateSubmissionStatus } from '@/app/actions/submissions'
import { Button } from '@/components/ui/button'
import { CheckCircle2, XCircle } from 'lucide-react'
import { useTransition } from 'react'

export default function VerifySubmissionButton({ submissionId, courseId, currentStatus }: { submissionId: number; courseId: number; currentStatus: string }) {
    const [isPending, startTransition] = useTransition()

    const handleVerify = (status: string) => {
        startTransition(async () => {
            await updateSubmissionStatus(submissionId, status, courseId)
        })
    }

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
        <div className="flex items-center gap-[6px]">
            <Button
                size="sm"
                variant="outline"
                disabled={isPending}
                onClick={() => handleVerify('VERIFIED')}
                className="h-[28px] px-[10px] text-[12px] font-medium border-green-300 text-green-700 hover:bg-green-50 hover:text-green-800 rounded-[6px]"
            >
                <CheckCircle2 className="mr-[4px] h-[12px] w-[12px]" />
                Verify
            </Button>
            <Button
                size="sm"
                variant="outline"
                disabled={isPending}
                onClick={() => handleVerify('REJECTED')}
                className="h-[28px] px-[10px] text-[12px] font-medium border-red-300 text-red-600 hover:bg-red-50 hover:text-red-700 rounded-[6px]"
            >
                <XCircle className="mr-[4px] h-[12px] w-[12px]" />
                Reject
            </Button>
        </div>
    )
}
