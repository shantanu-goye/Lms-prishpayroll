'use client'

import { useActionState } from 'react'
import { createFee } from '@/app/actions/fees'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Loader2, ReceiptIndianRupee } from 'lucide-react'

const initialState = {
    error: '',
    success: '',
}

export default function FeeForm({ students, courses }: { students: { id: number; name: string; email: string }[], courses: { id: number; title: string }[] }) {
    const [state, formAction, isPending] = useActionState(createFee, initialState)

    return (
        <Card className="bg-white rounded-[12px] border border-[#E5E7EB]">
            <CardHeader className="border-b border-[#E5E7EB] pb-4 px-[24px] pt-[24px]">
                <CardTitle className="text-[24px] font-medium text-[#015A86] flex items-center gap-2">
                    <ReceiptIndianRupee className="h-6 w-6 text-[#015A86] stroke-2" />
                    Record Payment
                </CardTitle>
                <p className="text-[14px] text-[#0B2E3F] mt-2 font-normal">
                    Log a new payment from a student towards a specific course.
                </p>
            </CardHeader>
            <CardContent className="p-[24px]">
                <form action={formAction} className="space-y-[16px]">
                    <div className="space-y-[16px]">
                        <div className="space-y-[8px]">
                            <Label htmlFor="studentId" className="text-[#0B2E3F] font-medium text-[14px]">Student</Label>
                            <Select name="studentId" required>
                                <SelectTrigger id="studentId" className="w-full bg-white border-[#E5E7EB] rounded-[6px] text-[#0B2E3F]">
                                    <SelectValue placeholder="Select a student" />
                                </SelectTrigger>
                                <SelectContent>
                                    {students.map((student) => (
                                        <SelectItem key={student.id} value={student.id.toString()}>
                                            {student.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-[8px]">
                            <Label htmlFor="courseId" className="text-[#0B2E3F] font-medium text-[14px]">Course</Label>
                            <Select name="courseId" required>
                                <SelectTrigger id="courseId" className="w-full bg-white border-[#E5E7EB] rounded-[6px] text-[#0B2E3F]">
                                    <SelectValue placeholder="Select a course" />
                                </SelectTrigger>
                                <SelectContent>
                                    {courses.map((course) => (
                                        <SelectItem key={course.id} value={course.id.toString()}>
                                            {course.title}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-[8px]">
                            <Label htmlFor="amount" className="text-[#0B2E3F] font-medium text-[14px]">Amount (₹)</Label>
                            <div className="relative">
                                <span className="absolute left-3 top-2.5 text-[#015A86] font-medium">₹</span>
                                <Input
                                    id="amount"
                                    name="amount"
                                    type="number"
                                    placeholder="0.00"
                                    step="0.01"
                                    required
                                    className="pl-7 bg-white border-[#E5E7EB] rounded-[6px] text-[#0B2E3F]"
                                />
                            </div>
                        </div>
                        <div className="space-y-[8px]">
                            <Label htmlFor="dueDate" className="text-[#0B2E3F] font-medium text-[14px]">Payment Date <span className="text-[#015A86] opacity-70 font-normal">(Optional)</span></Label>
                            <Input
                                id="dueDate"
                                name="dueDate"
                                type="date"
                                className="bg-white border-[#E5E7EB] rounded-[6px] text-[#0B2E3F]"
                            />
                        </div>
                    </div>

                    {(state?.error || state?.success) && (
                        <div className={`p-3 rounded-[8px] text-[14px] font-medium mt-4 ${state?.error ? 'bg-red-50 text-red-600 border border-red-200' : 'bg-green-50 text-green-600 border border-green-200'}`}>
                            {state?.error || state?.success}
                        </div>
                    )}

                    <div className="pt-[8px]">
                        <Button
                            type="submit"
                            disabled={isPending}
                            className="w-full bg-[#FD8B0A] hover:bg-[#e57a00] text-white rounded-[8px] h-[40px] font-medium transition-colors border-0"
                        >
                            {isPending ? (
                                <>
                                    <Loader2 className="mr-2 h-[20px] w-[20px] animate-spin" />
                                    Recording...
                                </>
                            ) : (
                                'Record Payment'
                            )}
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    )
}
