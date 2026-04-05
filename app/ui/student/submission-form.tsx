'use client'

import { useActionState } from 'react'
import { submitAssignment } from '@/app/actions/submissions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Loader2, UploadCloud } from 'lucide-react'

const initialState = {
    error: '',
    success: '',
}

export default function SubmissionForm({ assignmentId }: { assignmentId: number }) {
    const [state, formAction, isPending] = useActionState(submitAssignment, initialState)

    return (
        <div className="mt-[16px]">
            <form action={formAction} encType="multipart/form-data" className="flex flex-col sm:flex-row gap-[16px] items-end">
                <input type="hidden" name="assignmentId" value={assignmentId} />
                <div className="flex-1 w-full space-y-[8px]">
                    <Input
                        name="file"
                        type="file"
                        required
                        accept=".doc,.docx,.pdf,.jpg,.jpeg,.png"
                        className="cursor-pointer file:cursor-pointer file:mr-[16px] file:py-[4px] file:px-[16px] file:rounded-[6px] file:border-0 file:text-[12px] file:font-medium file:bg-[#F5F8FA] file:text-[#015A86] hover:file:bg-[#E5E7EB] transition-all h-[40px] border-dashed border-[#E5E7EB] focus-visible:ring-[#015A86]"
                    />
                </div>
                <Button
                    type="submit"
                    disabled={isPending}
                    className="bg-[#FD8B0A] hover:bg-[#e57a00] text-white h-[40px] px-[24px] font-medium rounded-[8px] transition-colors border-0"
                >
                    {isPending ? (
                        <>
                            <Loader2 className="mr-[8px] h-[16px] w-[16px] animate-spin" />
                            Uploading...
                        </>
                    ) : (
                        <>
                            <UploadCloud className="mr-[8px] h-[16px] w-[16px] stroke-2" />
                            Submit Work
                        </>
                    )}
                </Button>
            </form>

            {(state?.error || state?.success) && (
                <p className={`text-[14px] mt-[12px] font-medium ${state?.error ? 'text-red-600' : 'text-[#015A86]'}`}>
                    {state?.error || state?.success}
                </p>
            )}
        </div>
    )
}
