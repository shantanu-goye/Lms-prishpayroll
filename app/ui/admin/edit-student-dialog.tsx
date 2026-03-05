'use client'

import { useState } from 'react'
import { useActionState } from 'react'
import { updateStudent } from '@/app/actions/students'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
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

// Workaround for Prisma type caching issue
type Student = {
    id: number
    name: string
    email: string
    phone: string | null
    dob: Date | null
    employmentStatus: string | null
    address: string | null
}

export default function EditStudentDialog({ student }: { student: any }) {
    const [open, setOpen] = useState(false)
    const updateStudentWithId = updateStudent.bind(null, student.id)
    const [state, formAction, isPending] = useActionState(updateStudentWithId, initialState)

    // Close dialog on success
    if (state?.success && open) {
        // Ideally we'd reset state but with useActionState it's tricky.
        // We can just close it, and the parent revalidates.
        // Use a small timeout to allow success message to show if we wanted, 
        // but for now let's just close it or show success.
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="ghost" size="icon" className="text-[#015A86] hover:text-[#015A86] hover:bg-[#F5F8FA] h-[36px] w-[36px] rounded-[6px] transition-colors border-0">
                    <Pencil className="h-[18px] w-[18px] stroke-2" />
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px] bg-white rounded-[12px] p-[32px] border border-[#E5E7EB]">
                <DialogHeader className="mb-[24px]">
                    <DialogTitle className="text-[24px] font-semibold text-[#015A86]">Edit Student</DialogTitle>
                    <DialogDescription className="text-[#0B2E3F] text-[14px]">
                        Make changes to the student's profile here. Click save when you're done.
                    </DialogDescription>
                </DialogHeader>
                <form action={formAction} className="space-y-[24px]">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-[16px]">
                        <div className="space-y-[8px]">
                            <Label htmlFor="name" className="text-[#0B2E3F] font-medium text-[14px]">Full Name</Label>
                            <Input id="name" name="name" defaultValue={student.name} required className="border-[#E5E7EB] focus-visible:ring-[#015A86] rounded-[6px] h-[40px]" />
                        </div>
                        <div className="space-y-[8px]">
                            <Label htmlFor="email" className="text-[#0B2E3F] font-medium text-[14px]">Email</Label>
                            <Input id="email" name="email" type="email" defaultValue={student.email} required className="border-[#E5E7EB] focus-visible:ring-[#015A86] rounded-[6px] h-[40px]" />
                        </div>
                        <div className="space-y-[8px]">
                            <Label htmlFor="phone" className="text-[#0B2E3F] font-medium text-[14px]">Phone</Label>
                            <Input id="phone" name="phone" defaultValue={student.phone || ''} className="border-[#E5E7EB] focus-visible:ring-[#015A86] rounded-[6px] h-[40px]" />
                        </div>
                        <div className="space-y-[8px]">
                            <Label htmlFor="dob" className="text-[#0B2E3F] font-medium text-[14px]">Date of Birth</Label>
                            <Input
                                id="dob"
                                name="dob"
                                type="date"
                                defaultValue={student.dob ? new Date(student.dob).toISOString().split('T')[0] : ''}
                                className="border-[#E5E7EB] focus-visible:ring-[#015A86] rounded-[6px] h-[40px]"
                            />
                        </div>
                        <div className="space-y-[8px]">
                            <Label htmlFor="employmentStatus" className="text-[#0B2E3F] font-medium text-[14px]">Employment Status</Label>
                            <Input id="employmentStatus" name="employmentStatus" defaultValue={student.employmentStatus || ''} className="border-[#E5E7EB] focus-visible:ring-[#015A86] rounded-[6px] h-[40px]" />
                        </div>
                        <div className="space-y-[8px] md:col-span-2">
                            <Label htmlFor="address" className="text-[#0B2E3F] font-medium text-[14px]">Address</Label>
                            <Input id="address" name="address" defaultValue={student.address || ''} className="border-[#E5E7EB] focus-visible:ring-[#015A86] rounded-[6px] h-[40px]" />
                        </div>
                        <div className="space-y-[8px] md:col-span-2">
                            <Label htmlFor="password" className="text-[#0B2E3F] font-medium text-[14px]">New Password (Optional)</Label>
                            <Input id="password" name="password" type="password" placeholder="Leave blank to keep current" className="border-[#E5E7EB] focus-visible:ring-[#015A86] rounded-[6px] h-[40px]" />
                        </div>
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
