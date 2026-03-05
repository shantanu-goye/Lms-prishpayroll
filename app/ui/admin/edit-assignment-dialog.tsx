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

type Assignment = {
    id: number
    title: string
    description: string | null
    dueDate: Date | null
    courseId: number
}

const initialState = {
    error: '',
    success: '',
}

export default function EditAssignmentDialog({ assignment }: { assignment: any }) {
    const [open, setOpen] = useState(false)
    const updateAssignmentWithId = updateAssignment.bind(null, assignment.id, assignment.courseId)
    const [state, formAction, isPending] = useActionState(updateAssignmentWithId, initialState)

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="ghost" size="icon-xs" className="h-8 w-8 text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50">
                    <Pencil className="h-3.5 w-3.5" />
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Edit Assignment</DialogTitle>
                    <DialogDescription>
                        Update assignment details.
                    </DialogDescription>
                </DialogHeader>
                <form action={formAction} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="title">Title</Label>
                        <Input id="title" name="title" defaultValue={assignment.title} required />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                            id="description"
                            name="description"
                            defaultValue={assignment.description || ''}
                            rows={3}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="dueDate">Due Date</Label>
                        <Input
                            id="dueDate"
                            name="dueDate"
                            type="date"
                            defaultValue={assignment.dueDate ? new Date(assignment.dueDate).toISOString().split('T')[0] : ''}
                        />
                    </div>

                    {(state?.error || state?.success) && (
                        <div className={`p-3 rounded-lg text-sm font-medium ${state?.error ? 'bg-destructive/10 text-destructive' : 'bg-green-50 text-green-600'}`}>
                            {state?.error || state?.success}
                        </div>
                    )}

                    <DialogFooter>
                        <Button type="submit" disabled={isPending} className="bg-indigo-600 hover:bg-indigo-700">
                            {isPending ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
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
