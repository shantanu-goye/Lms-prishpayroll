'use client'

import { useState } from 'react'
import { useActionState } from 'react'
import { createCourse } from '@/app/actions/courses'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog'
import { Loader2, BookPlus } from 'lucide-react'

const initialState = {
    error: '',
    success: '',
}

export default function AddCourseDialog() {
    const [open, setOpen] = useState(false)
    const [state, formAction, isPending] = useActionState(createCourse, initialState)

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="bg-[#FD8B0A] hover:bg-[#e57a00] text-white rounded-[8px] h-[40px] font-medium transition-colors border-0">
                    <BookPlus className="mr-[8px] h-[16px] w-[16px]" />
                    Add Course
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px] bg-white rounded-[12px] p-[32px] border border-[#E5E7EB]">
                <DialogHeader className="mb-[24px]">
                    <DialogTitle className="text-[24px] font-semibold text-[#015A86]">Add New Course</DialogTitle>
                    <DialogDescription className="text-[#0B2E3F] text-[14px]">
                        Create a new course for students to enroll in.
                    </DialogDescription>
                </DialogHeader>
                <form action={formAction} className="space-y-[24px]">
                    <div className="space-y-[8px]">
                        <Label htmlFor="title" className="text-[#0B2E3F] font-medium text-[14px]">Course Title *</Label>
                        <Input id="title" name="title" placeholder="e.g., Web Development" required className="border-[#E5E7EB] focus-visible:ring-[#015A86] rounded-[6px] h-[40px]" />
                    </div>

                    <div className="space-y-[8px]">
                        <Label htmlFor="description" className="text-[#0B2E3F] font-medium text-[14px]">Description</Label>
                        <Textarea
                            id="description"
                            name="description"
                            placeholder="Course description..."
                            rows={3}
                            className="border-[#E5E7EB] focus-visible:ring-[#015A86] rounded-[6px] resize-none"
                        />
                    </div>

                    <div className="space-y-[8px]">
                        <Label htmlFor="price" className="text-[#0B2E3F] font-medium text-[14px]">Course Fee (₹)</Label>
                        <Input
                            id="price"
                            name="price"
                            type="number"
                            min="0"
                            step="0.01"
                            placeholder="0.00"
                            required
                            className="border-[#E5E7EB] focus-visible:ring-[#015A86] rounded-[6px] h-[40px]"
                        />
                    </div>

                    {(state?.error || state?.success) && (
                        <div className={`p-[12px] rounded-[8px] text-[14px] font-medium ${state?.error ? 'bg-red-50 text-red-600 border border-red-200' : 'bg-[#F5F8FA] text-[#015A86] border border-[#015A86]'}`}>
                            {state?.error || state?.success}
                        </div>
                    )}

                    <DialogFooter className="pt-[16px] border-t border-[#E5E7EB] mt-[8px]">
                        <Button type="submit" disabled={isPending} className="bg-[#FD8B0A] hover:bg-[#e57a00] text-white rounded-[8px] h-[40px] px-[24px] font-medium transition-colors border-0 w-full sm:w-auto">
                            {isPending ? (
                                <>
                                    <Loader2 className="mr-[8px] h-[16px] w-[16px] animate-spin" />
                                    Creating...
                                </>
                            ) : (
                                'Create Course'
                            )}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
