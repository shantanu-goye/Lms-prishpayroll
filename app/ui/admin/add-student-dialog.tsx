'use client'

import { useState } from 'react'
import { createStudent } from '@/app/actions/students'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog'
import { Loader2, UserPlus, Plus, Trash2 } from 'lucide-react'

// Workaround for Prisma type caching issue
type Course = {
    id: number
    title: string
    price: number
}

export default function AddStudentDialog({ courses }: { courses: Course[] }) {
    const [open, setOpen] = useState(false)
    const [isPending, setIsPending] = useState(false)
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')

    // State for course enrollments
    const [enrollments, setEnrollments] = useState<{ courseId: string, agreedFee: string }[]>([])

    const addEnrollment = () => {
        setEnrollments([...enrollments, { courseId: '', agreedFee: '' }])
    }

    const removeEnrollment = (index: number) => {
        const newEnrollments = [...enrollments]
        newEnrollments.splice(index, 1)
        setEnrollments(newEnrollments)
    }

    const updateEnrollment = (index: number, field: 'courseId' | 'agreedFee', value: string) => {
        const newEnrollments = [...enrollments]
        newEnrollments[index][field] = value

        // Auto-fill price when course is selected and no fee is set
        if (field === 'courseId') {
            const selectedCourse = courses.find(c => c.id.toString() === value)
            if (selectedCourse && !newEnrollments[index].agreedFee) {
                newEnrollments[index].agreedFee = selectedCourse.price.toString()
            }
        }

        setEnrollments(newEnrollments)
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setIsPending(true)
        setError('')
        setSuccess('')

        const formData = new FormData(e.currentTarget)

        // Append enrollment data as a JSON string
        formData.append('enrollments', JSON.stringify(enrollments.filter(e => e.courseId)))

        // Call the server action directly (not via useActionState to handle JSON data easily)
        const result = await createStudent(null, formData)

        if (result.error) {
            setError(result.error)
        } else if (result.success) {
            setSuccess(result.success)
            // Reset form by closing and clearing state
            setTimeout(() => {
                setOpen(false)
                setEnrollments([])
                setSuccess('')
            }, 1000)
        }
        setIsPending(false)
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="bg-[#FD8B0A] hover:bg-[#e57a00] text-white rounded-[8px] h-[40px] font-medium transition-colors border-0">
                    <UserPlus className="mr-[8px] h-[16px] w-[16px]" />
                    Add Student
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto bg-white rounded-[12px] p-[32px] border border-[#E5E7EB]">
                <DialogHeader className="mb-[24px]">
                    <DialogTitle className="text-[24px] font-semibold text-[#015A86]">Add New Student</DialogTitle>
                    <DialogDescription className="text-[#0B2E3F] text-[14px]">
                        Enter student details and optionally enroll them in courses.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-[24px]">
                    <div className="space-y-[16px]">
                        <h3 className="text-[16px] font-semibold text-[#015A86] border-b border-[#E5E7EB] pb-[8px]">Personal Details</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-[16px]">
                            <div className="space-y-[8px]">
                                <Label htmlFor="name" className="text-[#0B2E3F] font-medium text-[14px]">Full Name *</Label>
                                <Input id="name" name="name" required className="border-[#E5E7EB] focus-visible:ring-[#015A86] rounded-[6px] h-[40px]" />
                            </div>
                            <div className="space-y-[8px]">
                                <Label htmlFor="email" className="text-[#0B2E3F] font-medium text-[14px]">Email Address *</Label>
                                <Input id="email" name="email" type="email" required className="border-[#E5E7EB] focus-visible:ring-[#015A86] rounded-[6px] h-[40px]" />
                            </div>
                            <div className="space-y-[8px]">
                                <Label htmlFor="password" className="text-[#0B2E3F] font-medium text-[14px]">Password *</Label>
                                <Input id="password" name="password" type="password" required className="border-[#E5E7EB] focus-visible:ring-[#015A86] rounded-[6px] h-[40px]" />
                            </div>
                            <div className="space-y-[8px]">
                                <Label htmlFor="phone" className="text-[#0B2E3F] font-medium text-[14px]">Phone Number</Label>
                                <Input id="phone" name="phone" className="border-[#E5E7EB] focus-visible:ring-[#015A86] rounded-[6px] h-[40px]" />
                            </div>
                            <div className="space-y-[8px]">
                                <Label htmlFor="dob" className="text-[#0B2E3F] font-medium text-[14px]">Date of Birth</Label>
                                <Input id="dob" name="dob" type="date" className="border-[#E5E7EB] focus-visible:ring-[#015A86] rounded-[6px] h-[40px]" />
                            </div>
                            <div className="space-y-[8px]">
                                <Label htmlFor="employmentStatus" className="text-[#0B2E3F] font-medium text-[14px]">Employment Status</Label>
                                <Input id="employmentStatus" name="employmentStatus" placeholder="e.g. Student, Employed" className="border-[#E5E7EB] focus-visible:ring-[#015A86] rounded-[6px] h-[40px]" />
                            </div>
                            <div className="col-span-1 md:col-span-2 space-y-[8px]">
                                <Label htmlFor="address" className="text-[#0B2E3F] font-medium text-[14px]">Full Address</Label>
                                <Input id="address" name="address" className="border-[#E5E7EB] focus-visible:ring-[#015A86] rounded-[6px] h-[40px]" />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-[16px]">
                        <div className="flex justify-between items-center border-b border-[#E5E7EB] pb-[8px]">
                            <h3 className="text-[16px] font-semibold text-[#015A86]">Course Enrollment & Fees</h3>
                            <Button type="button" variant="outline" size="sm" onClick={addEnrollment} className="border-[#015A86] text-[#015A86] hover:bg-[#F5F8FA] rounded-[6px] h-[32px] px-[12px]">
                                <Plus className="h-[14px] w-[14px] mr-[4px]" /> Add Course
                            </Button>
                        </div>

                        {enrollments.length === 0 ? (
                            <p className="text-[14px] text-[#0B2E3F] italic opacity-70">No courses added. Student will be created without enrollments.</p>
                        ) : (
                            <div className="space-y-[12px]">
                                {enrollments.map((enrollment, index) => (
                                    <div key={index} className="flex gap-[12px] items-end bg-[#F5F8FA] p-[12px] rounded-[8px] border border-[#E5E7EB]">
                                        <div className="flex-1 space-y-[8px]">
                                            <Label className="text-[#0B2E3F] font-medium text-[14px]">Select Course</Label>
                                            <select
                                                className="flex h-[40px] w-full rounded-[6px] border border-[#E5E7EB] bg-white px-[12px] py-[8px] text-[14px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#015A86] focus-visible:ring-offset-2"
                                                value={enrollment.courseId}
                                                onChange={(e) => updateEnrollment(index, 'courseId', e.target.value)}
                                                required
                                            >
                                                <option value="" disabled>Select a course</option>
                                                {courses.map(course => (
                                                    <option key={course.id} value={course.id}>
                                                        {course.title} (Base: ₹{course.price})
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="w-1/3 space-y-[8px]">
                                            <Label className="text-[#0B2E3F] font-medium text-[14px]">Agreed Fee (₹)</Label>
                                            <Input
                                                type="number"
                                                min="0"
                                                step="0.01"
                                                value={enrollment.agreedFee}
                                                onChange={(e) => updateEnrollment(index, 'agreedFee', e.target.value)}
                                                placeholder="Amount"
                                                required
                                                className="border-[#E5E7EB] focus-visible:ring-[#015A86] rounded-[6px] h-[40px]"
                                            />
                                        </div>
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="icon"
                                            className="text-red-500 hover:bg-red-50 hover:text-red-600 h-[40px] w-[40px] rounded-[6px] mb-0.5"
                                            onClick={() => removeEnrollment(index)}
                                        >
                                            <Trash2 className="h-[18px] w-[18px] stroke-2" />
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {(error || success) && (
                        <div className={`p-[12px] rounded-[8px] text-[14px] font-medium ${error ? 'bg-red-50 text-red-600 border border-red-200' : 'bg-[#F5F8FA] text-[#015A86] border border-[#015A86]'}`}>
                            {error || success}
                        </div>
                    )}

                    <div className="flex justify-end pt-[16px]">
                        <Button
                            type="submit"
                            disabled={isPending}
                            className="bg-[#FD8B0A] hover:bg-[#e57a00] text-white rounded-[8px] h-[40px] px-[24px] font-medium transition-colors border-0"
                        >
                            {isPending ? (
                                <>
                                    <Loader2 className="mr-[8px] h-[16px] w-[16px] animate-spin" />
                                    Saving...
                                </>
                            ) : (
                                'Save Student'
                            )}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}
