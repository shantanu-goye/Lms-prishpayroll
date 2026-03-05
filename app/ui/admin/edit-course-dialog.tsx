'use client'

import { useState } from 'react'
import { useActionState } from 'react'
import { updateCourse } from '@/app/actions/courses'
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
import { Loader2, Pencil } from 'lucide-react'

// Workaround for types
type Course = {
    id: number
    title: string
    description: string | null
    price: number
}

const initialState = {
    error: '',
    success: '',
}

export default function EditCourseDialog({ course }: { course: any }) {
    const [open, setOpen] = useState(false)
    const updateCourseWithId = updateCourse.bind(null, course.id)
    const [state, formAction, isPending] = useActionState(updateCourseWithId, initialState)

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="ghost" size="icon" className="text-[#015A86] hover:text-[#015A86] hover:bg-[#F5F8FA] h-[36px] w-[36px] rounded-[6px] transition-colors border-0">
                    <Pencil className="h-[18px] w-[18px] stroke-2" />
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px] bg-white rounded-[12px] p-[32px] border border-[#E5E7EB]">
                <DialogHeader className="mb-[24px]">
                    <DialogTitle className="text-[24px] font-semibold text-[#015A86]">Edit Course</DialogTitle>
                    <DialogDescription className="text-[#0B2E3F] text-[14px]">
                        Update course details.
                    </DialogDescription>
                </DialogHeader>
                <form action={formAction} className="space-y-[24px]">
                    <div className="space-y-[8px]">
                        <Label htmlFor="title" className="text-[#0B2E3F] font-medium text-[14px]">Course Title</Label>
                        <Input id="title" name="title" defaultValue={course.title} required className="border-[#E5E7EB] focus-visible:ring-[#015A86] rounded-[6px] h-[40px]" />
                    </div>

                    <div className="space-y-[8px]">
                        <Label htmlFor="description" className="text-[#0B2E3F] font-medium text-[14px]">Description</Label>
                        <Textarea
                            id="description"
                            name="description"
                            defaultValue={course.description || ''}
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
                            defaultValue={course.price}
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
                                    Saving...
                                </>
                            ) : (
                                'Save Changes'
                            )}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
