'use client'

import { useState } from 'react'
import { useActionState } from 'react'
import { updateAssignment } from '@/app/actions/assignments'
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

const initialState = {
    error: '',
    success: '',
}

export default function EditAssignmentDialog({ assignment }: { assignment: any }) {
    const [open, setOpen] = useState(false)
    // Get courseId from the module relation
    const courseId = assignment.module?.courseId || 0
    const updateAssignmentWithId = updateAssignment.bind(null, assignment.id, courseId)
    const [state, formAction, isPending] = useActionState(updateAssignmentWithId, initialState)

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="ghost" size="icon" className="h-[32px] w-[32px] text-[#015A86] hover:text-[#015A86] hover:bg-[#F5F8FA] rounded-[6px] transition-colors border-0">
                    <Pencil className="h-[14px] w-[14px] stroke-2" />
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px] bg-white rounded-[12px] p-[32px] border border-[#E5E7EB]">
                <DialogHeader className="mb-[24px]">
                    <DialogTitle className="text-[24px] font-semibold text-[#015A86]">Edit Assignment</DialogTitle>
                    <DialogDescription className="text-[#0B2E3F] text-[14px]">
                        Update assignment details.
                    </DialogDescription>
                </DialogHeader>
                <form action={formAction} encType="multipart/form-data" className="space-y-[24px]">
                    <div className="space-y-[8px]">
                        <Label htmlFor="title" className="text-[#0B2E3F] font-medium text-[14px]">Title</Label>
                        <Input id="title" name="title" defaultValue={assignment.title} required className="border-[#E5E7EB] focus-visible:ring-[#015A86] rounded-[6px] h-[40px]" />
                    </div>

                    <div className="space-y-[8px]">
                        <Label htmlFor="description" className="text-[#0B2E3F] font-medium text-[14px]">Description</Label>
                        <Textarea
                            id="description"
                            name="description"
                            defaultValue={assignment.description || ''}
                            rows={3}
                            className="border-[#E5E7EB] focus-visible:ring-[#015A86] rounded-[6px] resize-none"
                        />
                    </div>

                    <div className="space-y-[8px]">
                        <Label htmlFor="dueDate" className="text-[#0B2E3F] font-medium text-[14px]">Due Date</Label>
                        <Input
                            id="dueDate"
                            name="dueDate"
                            type="datetime-local"
                            defaultValue={assignment.dueDate ? new Date(assignment.dueDate).toISOString().slice(0, 16) : ''}
                            className="border-[#E5E7EB] focus-visible:ring-[#015A86] rounded-[6px] h-[40px]"
                        />
                    </div>

                    <div className="space-y-[8px]">
                        <Label htmlFor="file" className="text-[#0B2E3F] font-medium text-[14px]">
                            Update Materials {assignment.fileUrl && <span className="text-[12px] text-[#015A86] font-normal ml-2">(Current file exists)</span>}
                        </Label>
                        <Input
                            id="file"
                            name="file"
                            type="file"
                            accept=".pdf,.doc,.docx"
                            className="border-[#E5E7EB] focus-visible:ring-[#015A86] rounded-[6px] h-[40px] text-[13px]"
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
