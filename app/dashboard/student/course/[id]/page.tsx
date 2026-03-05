import prisma from '@/lib/prisma'
import { verifySession } from '@/lib/auth'
import SubmissionForm from '@/app/ui/student/submission-form'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Card, CardHeader, CardTitle, CardContent, CardFooter, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ChevronLeft, GraduationCap, CheckCircle2, Clock, FileText, ExternalLink } from 'lucide-react'

export default async function StudentCoursePage({ params }: { params: { id: string } }) {
    const { id } = await params
    const courseId = parseInt(id)
    const session = await verifySession()
    if (!session) return null

    const course = await prisma.course.findUnique({
        where: { id: courseId },
        include: {
            instructor: true,
            assignments: {
                include: {
                    submissions: {
                        where: { studentId: session.userId },
                    },
                },
                orderBy: { dueDate: 'asc' },
            },
            enrollments: {
                where: { userId: session.userId },
            },
        },
    })

    if (!course || course.enrollments.length === 0) {
        notFound()
    }

    return (
        <div className="max-w-[1024px] mx-auto space-y-[32px] p-[24px]">
            <div className="flex flex-col gap-[16px]">
                <Link
                    href="/dashboard/student"
                    className="flex items-center text-[14px] font-medium text-[#015A86] hover:text-[#FD8B0A] transition-colors w-fit"
                >
                    <ChevronLeft className="mr-[4px] h-[16px] w-[16px] stroke-2" />
                    Back to My Courses
                </Link>
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-[24px] border-b border-[#E5E7EB] pb-[32px]">
                    <div>
                        <div className="inline-flex items-center gap-[8px] text-[#015A86] bg-[#F5F8FA] px-[12px] py-[4px] border border-[#015A86] rounded-full text-[12px] font-bold uppercase tracking-wider mb-[16px]">
                            <GraduationCap className="h-[16px] w-[16px] stroke-2" />
                            <span>Enrolled Student</span>
                        </div>
                        <h1 className="text-[36px] font-bold tracking-tight text-[#0B2E3F] leading-tight">{course.title}</h1>
                        <p className="mt-[16px] text-[16px] text-[#0B2E3F] opacity-80 max-w-2xl leading-relaxed">{course.description}</p>
                    </div>
                    <div className="flex flex-col items-start md:items-end gap-[4px] min-w-max">
                        <span className="text-[12px] font-bold text-[#FD8B0A] uppercase tracking-wider">Instructor</span>
                        <span className="font-medium text-[16px] text-[#0B2E3F]">{course.instructor.name}</span>
                    </div>
                </div>
            </div>

            <div className="space-y-[24px]">
                <div className="flex items-center justify-between">
                    <h3 className="text-[24px] font-semibold text-[#015A86] flex items-center gap-[8px]">
                        <FileText className="h-[24px] w-[24px] text-[#015A86] stroke-2" />
                        Course Assignments
                    </h3>
                </div>

                {course.assignments.map((assignment) => {
                    const submission = assignment.submissions[0]
                    const isOverdue = assignment.dueDate && new Date(assignment.dueDate) < new Date() && !submission

                    return (
                        <Card key={assignment.id} className={`overflow-hidden bg-white rounded-[12px] transition-all duration-300 border-0 border-l-4 ${submission ? 'border-l-green-500' : isOverdue ? 'border-l-red-500' : 'border-l-[#FD8B0A]'}`}>
                            <CardHeader className="p-[24px] pb-[16px] border-b border-[#E5E7EB]">
                                <div className="flex flex-col sm:flex-row justify-between gap-[16px]">
                                    <div className="space-y-[4px]">
                                        <CardTitle className="text-[20px] font-semibold text-[#015A86]">{assignment.title}</CardTitle>
                                        <CardDescription className="text-[#0B2E3F] opacity-80 text-[14px]">
                                            {assignment.description}
                                        </CardDescription>
                                    </div>
                                    {assignment.dueDate && (
                                        <div className={`flex items-center gap-[6px] px-[12px] py-[6px] rounded-[6px] text-[12px] font-medium h-fit whitespace-nowrap ${isOverdue ? 'bg-red-50 text-red-600 border border-red-200' : 'bg-[#F5F8FA] text-[#015A86] border border-[#015A86]'}`}>
                                            <Clock className="h-[14px] w-[14px] stroke-2" />
                                            Due: {new Date(assignment.dueDate).toLocaleDateString()}
                                        </div>
                                    )}
                                </div>
                            </CardHeader>
                            <CardContent className="p-[24px]">
                                <div className="bg-[#F5F8FA] rounded-[8px] p-[24px] border border-[#E5E7EB]">
                                    {submission ? (
                                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-[16px]">
                                            <div className="flex items-center gap-[12px]">
                                                <div className="h-[40px] w-[40px] bg-green-50 text-green-600 border border-green-200 rounded-[8px] flex items-center justify-center">
                                                    <CheckCircle2 className="h-[20px] w-[20px] stroke-2" />
                                                </div>
                                                <div>
                                                    <p className="text-[14px] font-semibold text-[#0B2E3F]">Task Completed</p>
                                                    <p className="text-[12px] text-[#0B2E3F] opacity-80 mt-[2px]">Submitted on {new Date(submission.submittedAt).toLocaleDateString()} at {new Date(submission.submittedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                                                </div>
                                            </div>
                                            <Button asChild variant="outline" size="sm" className="font-medium border-[#015A86] text-[#015A86] hover:bg-[#F5F8FA] h-[40px] px-[24px] rounded-[6px] transition-colors">
                                                <a href={submission.filePath} target="_blank" className="flex items-center gap-[8px]">
                                                    <ExternalLink className="h-[16px] w-[16px] stroke-2" />
                                                    Review Work
                                                </a>
                                            </Button>
                                        </div>
                                    ) : (
                                        <div className="space-y-[16px]">
                                            <div className="flex items-center gap-[8px] mb-[8px]">
                                                <div className="w-[6px] h-[6px] rounded-full bg-[#FD8B0A] animate-pulse"></div>
                                                <p className="text-[12px] font-bold text-[#FD8B0A] uppercase tracking-widest">Pending Submission</p>
                                            </div>
                                            <SubmissionForm assignmentId={assignment.id} />
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    )
                })}
                {course.assignments.length === 0 && (
                    <div className="text-center py-[64px] bg-[#F5F8FA] rounded-[12px] border border-dashed border-[#E5E7EB]">
                        <FileText className="h-[48px] w-[48px] text-[#015A86] opacity-50 mx-auto mb-[16px] stroke-1" />
                        <p className="text-[#0B2E3F] font-medium text-[16px]">No assignments have been posted for this course yet.</p>
                    </div>
                )}
            </div>
        </div>
    )
}
