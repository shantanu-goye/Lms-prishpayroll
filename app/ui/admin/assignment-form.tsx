'use client'

import { useActionState } from 'react'
import { createAssignment } from '@/app/actions/assignments'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Loader2, Plus } from 'lucide-react'

const initialState = {
    error: '',
    success: '',
}

export default function AssignmentForm({ moduleId, courseId }: { moduleId: number; courseId: number }) {
    const [state, formAction, isPending] = useActionState(createAssignment, initialState)

    return (
        <div className="bg-[#F5F8FA] rounded-[8px] border border-[#E5E7EB] p-[16px] mt-[16px]">
            <p className="text-[12px] font-bold text-[#015A86] uppercase tracking-wider mb-[12px]">Add Assignment</p>
            <form action={formAction} className="space-y-[12px]">
                <input type="hidden" name="moduleId" value={moduleId} />
                <input type="hidden" name="courseId" value={courseId} />
                <Input
                    name="title"
                    placeholder="Assignment title"
                    required
                    className="border-[#E5E7EB] focus-visible:ring-[#015A86] rounded-[6px] h-[36px] text-[14px] bg-white"
                />
                <Textarea
                    name="description"
                    placeholder="Instructions (optional)"
                    rows={2}
                    className="border-[#E5E7EB] focus-visible:ring-[#015A86] rounded-[6px] text-[14px] bg-white resize-none"
                />
                <div className="flex gap-[12px] items-end">
                    <div className="flex-1 space-y-[4px]">
                        <Label className="text-[12px] text-[#0B2E3F]">Due Date</Label>
                        <Input
                            name="dueDate"
                            type="datetime-local"
                            className="border-[#E5E7EB] focus-visible:ring-[#015A86] rounded-[6px] h-[36px] text-[14px] bg-white"
                        />
                    </div>
                    <Button
                        type="submit"
                        disabled={isPending}
                        size="sm"
                        className="bg-[#FD8B0A] hover:bg-[#e57a00] text-white h-[36px] px-[16px] font-medium rounded-[6px] transition-colors border-0"
                    >
                        {isPending ? (
                            <Loader2 className="h-[14px] w-[14px] animate-spin" />
                        ) : (
                            <>
                                <Plus className="mr-[4px] h-[14px] w-[14px] stroke-2" />
                                Add
                            </>
                        )}
                    </Button>
                </div>

                {(state?.error || state?.success) && (
                    <p className={`text-[13px] font-medium ${state?.error ? 'text-red-600' : 'text-[#015A86]'}`}>
                        {state?.error || state?.success}
                    </p>
                )}
            </form>
        </div>
    )
}
