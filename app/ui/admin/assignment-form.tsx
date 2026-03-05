'use client'

import { useActionState } from 'react'
import { createAssignment } from '@/app/actions/assignments'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Loader2, CalendarPlus } from 'lucide-react'

const initialState = {
    error: '',
    success: '',
}

export default function AssignmentForm({ courseId }: { courseId: number }) {
    const [state, formAction, isPending] = useActionState(createAssignment, initialState)

    return (
        <Card className="mb-6 shadow-sm border-indigo-100">
            <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                    <CalendarPlus className="h-5 w-5 text-indigo-600" />
                    Add Assignment
                </CardTitle>
            </CardHeader>
            <CardContent>
                <form action={formAction} className="space-y-4">
                    <input type="hidden" name="courseId" value={courseId} />
                    <div className="space-y-2">
                        <Label htmlFor="title">Assignment Title</Label>
                        <Input
                            id="title"
                            name="title"
                            placeholder="e.g., Final Project, Quiz 1"
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="description">Description / Instructions</Label>
                        <Textarea
                            id="description"
                            name="description"
                            placeholder="Provide details about the assignment..."
                            rows={3}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="dueDate">Due Date</Label>
                        <Input
                            id="dueDate"
                            name="dueDate"
                            type="datetime-local"
                        />
                    </div>

                    {(state?.error || state?.success) && (
                        <div className={`p-3 rounded-lg text-sm font-medium ${state?.error ? 'bg-destructive/10 text-destructive' : 'bg-green-50 text-green-600'}`}>
                            {state?.error || state?.success}
                        </div>
                    )}

                    <Button
                        type="submit"
                        disabled={isPending}
                        className="w-full bg-indigo-600 hover:bg-indigo-700"
                    >
                        {isPending ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Creating...
                            </>
                        ) : (
                            'Create Assignment'
                        )}
                    </Button>
                </form>
            </CardContent>
        </Card>
    )
}
