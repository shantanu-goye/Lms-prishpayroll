'use client'

import { useActionState } from 'react'
import { enrollStudent } from '@/app/actions/enrollments'
import { Button } from '@/components/ui/button'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { Loader2, UserPlus } from 'lucide-react'

const initialState = {
    error: '',
    success: '',
}

export default function EnrollmentForm({ courseId, students }: { courseId: number; students: { id: number; name: string; email: string }[] }) {
    const [state, formAction, isPending] = useActionState(enrollStudent, initialState)

    return (
        <div className="mt-6 border-t pt-6">
            <h4 className="text-sm font-bold flex items-center gap-2 mb-4">
                <UserPlus className="h-4 w-4 text-emerald-600" />
                Enroll Student
            </h4>
            <form action={formAction} className="flex flex-col sm:flex-row gap-3">
                <input type="hidden" name="courseId" value={courseId} />

                {/* We'll use a hidden input for the actual value since select handles UI */}
                <Select name="userId" required>
                    <SelectTrigger className="flex-1 h-10 border-emerald-100">
                        <SelectValue placeholder="Select a student" />
                    </SelectTrigger>
                    <SelectContent>
                        {students.map((student) => (
                            <SelectItem key={student.id} value={student.id.toString()}>
                                {student.name} ({student.email.split('@')[0]})
                            </SelectItem>
                        ))}
                        {students.length === 0 && (
                            <SelectItem value="none" disabled>No students available</SelectItem>
                        )}
                    </SelectContent>
                </Select>

                <Button
                    type="submit"
                    disabled={isPending || students.length === 0}
                    className="bg-emerald-600 hover:bg-emerald-700 h-10 px-6 font-bold"
                >
                    {isPending ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Enrolling...
                        </>
                    ) : (
                        'Enroll'
                    )}
                </Button>
            </form>

            {(state?.error || state?.success) && (
                <p className={`text-xs mt-3 font-medium ${state?.error ? 'text-destructive' : 'text-emerald-600'}`}>
                    {state?.error || state?.success}
                </p>
            )}
        </div>
    )
}
