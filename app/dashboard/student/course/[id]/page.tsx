import prisma from '@/lib/prisma'
import { verifySession } from '@/lib/auth'
import SubmissionForm from '@/app/ui/student/submission-form'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ChevronLeft, GraduationCap, CheckCircle2, Clock, FileText, ExternalLink, XCircle, Layers } from 'lucide-react'
import FileViewer from '@/components/FileViewer'

export default async function StudentCoursePage({ params }: { params: { id: string } }) {
    const { id } = await params
    const courseId = parseInt(id)
    const session = await verifySession()
    if (!session) return null

    const course = await prisma.course.findUnique({
        where: { id: courseId },
        include: {
            instructor: true,
            modules: {
                orderBy: { order: 'asc' },
                include: {
                    assignments: {
                        include: {
                            submissions: {
                                where: { studentId: session.userId },
                            },
                        },
                        orderBy: { id: 'asc' },
                    },
                },
            },
            enrollments: {
                where: { userId: session.userId },
            },
        },
    })

    if (!course || course.enrollments.length === 0) {
        notFound()
    }

    const totalAssignments = course.modules.reduce((sum, m) => sum + m.assignments.length, 0)
    const completedAssignments = course.modules.reduce(
        (sum, m) => sum + m.assignments.filter(a => a.submissions.length > 0).length, 0
    )

    return (
        <div className="max-w-[1024px] mx-auto space-y-[32px] p-[24px]">
            {/* Header */}
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
                    <div className="flex flex-col items-start md:items-end gap-[8px] min-w-max">
                        <div className="flex items-center gap-[4px]">
                            <span className="text-[12px] font-bold text-[#FD8B0A] uppercase tracking-wider">Instructor</span>
                        </div>
                        <span className="font-medium text-[16px] text-[#0B2E3F]">{course.instructor.name}</span>
                        <div className="text-[14px] text-[#015A86] font-medium mt-[4px]">
                            {completedAssignments}/{totalAssignments} Assignments completed
                        </div>
                    </div>
                </div>
            </div>

            {/* Modules */}
            <div className="space-y-[24px]">
                {course.modules.map((module, moduleIndex) => (
                    <Card key={module.id} className="bg-white rounded-[12px] border border-[#E5E7EB] overflow-hidden">
                        <CardHeader className="bg-[#F5F8FA] border-b border-[#E5E7EB] p-[20px]">
                            <div className="flex items-center gap-[12px]">
                                <div className="h-[32px] w-[32px] rounded-[8px] bg-[#015A86] text-white flex items-center justify-center text-[14px] font-bold">
                                    {moduleIndex + 1}
                                </div>
                                <CardTitle className="text-[18px] font-semibold text-[#0B2E3F]">{module.title}</CardTitle>
                                <span className="text-[12px] text-[#0B2E3F] opacity-60 font-medium ml-auto">
                                    {module.assignments.filter(a => a.submissions.length > 0).length}/{module.assignments.length} done
                                </span>
                            </div>
                        </CardHeader>
                        <CardContent className="p-[20px] space-y-[16px]">
                            {module.assignments.map((assignment) => {
                                const submission = assignment.submissions[0]
                                const isOverdue = assignment.dueDate && new Date(assignment.dueDate) < new Date() && !submission

                                return (
                                    <div
                                        key={assignment.id}
                                        className={`rounded-[8px] border p-[16px] transition-all ${submission
                                                ? submission.status === 'VERIFIED'
                                                    ? 'border-green-200 bg-green-50/30'
                                                    : submission.status === 'REJECTED'
                                                        ? 'border-red-200 bg-red-50/30'
                                                        : 'border-[#E5E7EB] bg-[#F5F8FA]'
                                                : isOverdue
                                                    ? 'border-red-200 bg-red-50/30'
                                                    : 'border-[#E5E7EB] bg-white'
                                            }`}
                                    >
                                        <div className="flex flex-col sm:flex-row justify-between gap-[12px]">
                                            <div className="space-y-[4px]">
                                                <div className="flex items-center gap-[8px]">
                                                    <FileText className="h-[16px] w-[16px] text-[#FD8B0A] stroke-2" />
                                                    <h4 className="text-[16px] font-semibold text-[#015A86]">{assignment.title}</h4>
                                                </div>
                                                {assignment.description && (
                                                    <p className="text-[#0B2E3F] opacity-70 text-[14px] ml-[24px]">{assignment.description}</p>
                                                )}
                                            </div>
                                            {assignment.dueDate && (
                                                <div className="flex flex-col items-end gap-[8px]">
                                                    <div className={`flex items-center gap-[6px] px-[12px] py-[6px] rounded-[6px] text-[12px] font-medium h-fit whitespace-nowrap ${isOverdue ? 'bg-red-50 text-red-600 border border-red-200' : 'bg-[#F5F8FA] text-[#015A86] border border-[#015A86]'}`}>
                                                        <Clock className="h-[14px] w-[14px] stroke-2" />
                                                        Due: {new Date(assignment.dueDate).toLocaleDateString()}
                                                    </div>
                                                    {assignment.fileUrl && (
                                                        <a 
                                                            href={assignment.fileUrl} 
                                                            target="_blank" 
                                                            className="flex items-center gap-[6px] text-[13px] font-bold text-[#FD8B0A] hover:underline transition-all"
                                                        >
                                                            <ExternalLink className="h-[14px] w-[14px]" />
                                                            Materials
                                                        </a>
                                                    )}
                                                </div>
                                            )}
                                        </div>

                                        <div className="mt-[12px] ml-[24px]">
                                            {submission ? (
                                                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-[12px] bg-white rounded-[8px] p-[12px] border border-[#E5E7EB]">
                                                    <div className="flex items-center gap-[12px]">
                                                        {submission.status === 'VERIFIED' ? (
                                                            <div className="h-[36px] w-[36px] bg-green-50 text-green-600 border border-green-200 rounded-[8px] flex items-center justify-center">
                                                                <CheckCircle2 className="h-[18px] w-[18px] stroke-2" />
                                                            </div>
                                                        ) : submission.status === 'REJECTED' ? (
                                                            <div className="h-[36px] w-[36px] bg-red-50 text-red-600 border border-red-200 rounded-[8px] flex items-center justify-center">
                                                                <XCircle className="h-[18px] w-[18px] stroke-2" />
                                                            </div>
                                                        ) : (
                                                            <div className="h-[36px] w-[36px] bg-[#F5F8FA] text-[#FD8B0A] border border-[#E5E7EB] rounded-[8px] flex items-center justify-center">
                                                                <Clock className="h-[18px] w-[18px] stroke-2" />
                                                            </div>
                                                        )}
                                                        <div>
                                                            <p className="text-[14px] font-semibold text-[#0B2E3F]">
                                                                {submission.status === 'VERIFIED' ? 'Verified' : submission.status === 'REJECTED' ? 'Rejected — Please Resubmit' : 'Submitted — Under Review'}
                                                            </p>
                                                            <p className="text-[12px] text-[#0B2E3F] opacity-60 mt-[2px]">
                                                                Submitted on {new Date(submission.submittedAt).toLocaleDateString()} at {new Date(submission.submittedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                            </p>
                                                            {submission.feedback && (
                                                                <div className="mt-3 p-3 bg-[#F5F8FA] rounded-lg border border-blue-100 italic text-[13px] text-[#0B2E3F]">
                                                                    "{submission.feedback}"
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                    <FileViewer
                                                        fileUrl={submission.filePath}
                                                        className="font-medium border-[#015A86] text-[#015A86] hover:bg-[#F5F8FA] h-[36px] px-[16px] rounded-[6px] transition-colors inline-flex items-center gap-[6px] border"
                                                    />
                                                </div>
                                            ) : (
                                                <div className="space-y-[12px]">
                                                    <div className="flex items-center gap-[8px]">
                                                        <div className="w-[6px] h-[6px] rounded-full bg-[#FD8B0A] animate-pulse"></div>
                                                        <p className="text-[12px] font-bold text-[#FD8B0A] uppercase tracking-widest">Pending Submission</p>
                                                    </div>
                                                    <SubmissionForm assignmentId={assignment.id} />
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )
                            })}

                            {module.assignments.length === 0 && (
                                <div className="text-center py-[24px] text-[14px] text-[#0B2E3F] opacity-60">
                                    No assignments in this module yet.
                                </div>
                            )}
                        </CardContent>
                    </Card>
                ))}

                {course.modules.length === 0 && (
                    <div className="text-center py-[64px] bg-[#F5F8FA] rounded-[12px] border border-dashed border-[#E5E7EB]">
                        <Layers className="h-[48px] w-[48px] text-[#015A86] opacity-50 mx-auto mb-[16px] stroke-1" />
                        <p className="text-[#0B2E3F] font-medium text-[16px]">No course content has been added yet.</p>
                        <p className="text-[14px] text-[#0B2E3F] opacity-60 mt-[4px]">The instructor is still setting up this course.</p>
                    </div>
                )}
            </div>
        </div>
    )
}
