'use client'

import { useActionState } from 'react'
import { createCourse } from '@/app/actions/courses'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Loader2, BookPlus } from 'lucide-react'

const initialState = {
    error: '',
    success: '',
}

export default function CourseForm() {
    const [state, formAction, isPending] = useActionState(createCourse, initialState)

    return (
        <Card className="mb-[24px] bg-white rounded-[12px] border border-[#E5E7EB]">
            <CardHeader className="p-[24px] border-b border-[#E5E7EB]">
                <CardTitle className="text-[20px] font-semibold text-[#015A86] flex items-center gap-[8px]">
                    <BookPlus className="h-[20px] w-[20px] text-[#015A86] stroke-2" />
                    Add New Course
                </CardTitle>
            </CardHeader>
            <CardContent className="p-[24px]">
                <form action={formAction} className="space-y-[16px]">
                    <div className="space-y-[8px]">
                        <Input
                            name="title"
                            placeholder="Course Title"
                            required
                            className="border-[#E5E7EB] focus-visible:ring-[#015A86] rounded-[6px] h-[40px] text-[14px]"
                        />
                    </div>
                    <div className="space-y-[8px]">
                        <Textarea
                            name="description"
                            placeholder="Course Description"
                            rows={3}
                            className="border-[#E5E7EB] focus-visible:ring-[#015A86] rounded-[6px] text-[14px] resize-none"
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-[16px]">
                        <div className="space-y-[8px]">
                            <Label htmlFor="price" className="text-[#0B2E3F] font-medium text-[14px]">Course Fee (₹)</Label>
                            <Input
                                id="price"
                                name="price"
                                type="number"
                                placeholder="0.00"
                                step="0.01"
                                required
                                className="border-[#E5E7EB] focus-visible:ring-[#015A86] rounded-[6px] h-[40px]"
                            />
                        </div>
                    </div>

                    {(state?.error || state?.success) && (
                        <div className={`p-[12px] rounded-[8px] text-[14px] font-medium ${state?.error ? 'bg-red-50 text-red-600 border border-red-200' : 'bg-[#F5F8FA] text-[#015A86] border border-[#015A86]'}`}>
                            {state?.error || state?.success}
                        </div>
                    )}

                    <Button
                        type="submit"
                        disabled={isPending}
                        className="bg-[#FD8B0A] hover:bg-[#e57a00] text-white rounded-[8px] h-[40px] px-[24px] font-medium transition-colors border-0"
                    >
                        {isPending ? (
                            <>
                                <Loader2 className="mr-[8px] h-[16px] w-[16px] animate-spin" />
                                Creating...
                            </>
                        ) : (
                            'Create Course'
                        )}
                    </Button>
                </form>
            </CardContent>
        </Card>
    )
}
