'use client'

import { useActionState } from 'react'
import { createModule } from '@/app/actions/modules'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Loader2, Plus } from 'lucide-react'

const initialState = {
    error: '',
    success: '',
}

export default function AddModuleForm({ courseId }: { courseId: number }) {
    const [state, formAction, isPending] = useActionState(createModule, initialState)

    return (
        <div className="bg-[#F5F8FA] rounded-[12px] border border-dashed border-[#E5E7EB] p-[24px]">
            <form action={formAction} className="flex flex-col sm:flex-row gap-[12px] items-end">
                <input type="hidden" name="courseId" value={courseId} />
                <div className="flex-1 w-full">
                    <Input
                        name="title"
                        placeholder="New module title (e.g., Module 1: Introduction)"
                        required
                        className="border-[#E5E7EB] focus-visible:ring-[#015A86] rounded-[6px] h-[40px] text-[14px] bg-white"
                    />
                </div>
                <Button
                    type="submit"
                    disabled={isPending}
                    className="bg-[#015A86] hover:bg-[#00476b] text-white h-[40px] px-[20px] font-medium rounded-[8px] transition-colors border-0 whitespace-nowrap"
                >
                    {isPending ? (
                        <Loader2 className="h-[16px] w-[16px] animate-spin" />
                    ) : (
                        <>
                            <Plus className="mr-[6px] h-[16px] w-[16px] stroke-2" />
                            Add Module
                        </>
                    )}
                </Button>
            </form>
            {(state?.error || state?.success) && (
                <p className={`text-[14px] mt-[8px] font-medium ${state?.error ? 'text-red-600' : 'text-[#015A86]'}`}>
                    {state?.error || state?.success}
                </p>
            )}
        </div>
    )
}
