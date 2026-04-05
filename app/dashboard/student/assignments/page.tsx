import prisma from '@/lib/prisma'
import { verifySession } from '@/lib/auth'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { FileText, Clock, CheckCircle2, AlertCircle, ExternalLink } from 'lucide-react'
import SubmissionForm from '@/app/ui/student/submission-form'
import FileViewer from '@/components/FileViewer'

export default async function StudentAssignmentsPage() {
    const session = await verifySession()
    if (!session) return null

    const enrollments = await prisma.enrollment.findMany({
        where: { userId: session.userId },
        include: {
            course: {
                include: {
                    modules: {
                        include: {
                            assignments: {
                                include: {
                                    submissions: {
                                        where: { studentId: session.userId }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    })

    const allAssignments = enrollments.flatMap(e => 
        e.course.modules.flatMap(m => 
            m.assignments.map(a => ({
                ...a,
                courseTitle: e.course.title,
                submission: a.submissions[0] || null
            }))
        )
    ).sort((a, b) => {
        if (!a.dueDate) return 1
        if (!b.dueDate) return -1
        return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
    })

    return (
        <div className="space-y-[32px] p-[24px] max-w-7xl mx-auto">
            <div>
                <h2 className="text-[32px] font-semibold tracking-tight text-[#015A86]">My Assignments</h2>
                <p className="text-[#0B2E3F] mt-[4px] text-[16px]">Track your progress and submit your work.</p>
            </div>

            <div className="grid grid-cols-1 gap-[16px]">
                {allAssignments.map((assignment) => (
                    <Card key={assignment.id} className="bg-white rounded-[12px] border border-[#E5E7EB] overflow-hidden">
                        <CardHeader className="bg-[#F5F8FA] border-b border-[#E5E7EB] p-[20px] flex flex-row items-center justify-between gap-4">
                            <div className="flex items-center gap-[12px]">
                                <div className="h-[40px] w-[40px] rounded-[10px] bg-[#015A86] text-white flex items-center justify-center">
                                    <FileText className="h-[20px] w-[20px] stroke-2" />
                                </div>
                                <div>
                                    <CardTitle className="text-[18px] font-semibold text-[#0B2E3F]">{assignment.title}</CardTitle>
                                    <p className="text-[12px] text-[#015A86] font-medium uppercase tracking-wider">{assignment.courseTitle}</p>
                                </div>
                            </div>
                            
                            <div className="flex items-center gap-3">
                                {assignment.submission ? (
                                    <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100 border-emerald-200 px-3 py-1 text-[12px] font-bold flex items-center gap-1">
                                        <CheckCircle2 className="h-3 w-3" />
                                        {assignment.submission.status}
                                    </Badge>
                                ) : (
                                    <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-100 border-amber-200 px-3 py-1 text-[12px] font-bold flex items-center gap-1">
                                        <Clock className="h-3 w-3" />
                                        PENDING
                                    </Badge>
                                )}
                                {assignment.dueDate && new Date(assignment.dueDate) < new Date() && !assignment.submission && (
                                    <Badge className="bg-red-100 text-red-700 hover:bg-red-100 border-red-200 px-3 py-1 text-[12px] font-bold flex items-center gap-1">
                                        <AlertCircle className="h-3 w-3" />
                                        OVERDUE
                                    </Badge>
                                )}
                            </div>
                        </CardHeader>
                        <CardContent className="p-[20px]">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-[24px]">
                                <div className="space-y-4">
                                    <div>
                                        <h4 className="text-[14px] font-bold text-[#015A86] mb-1">Description</h4>
                                        <p className="text-[14px] text-[#0B2E3F] opacity-80 leading-relaxed">
                                            {assignment.description || "No description provided."}
                                        </p>
                                    </div>
                                    <div className="flex flex-col gap-[12px]">
                                        <div className="flex items-center gap-2">
                                            <Clock className="h-4 w-4 text-[#FD8B0A]" />
                                            <span className="text-[13px] font-medium text-[#0B2E3F]">
                                                Due Date: {assignment.dueDate ? new Date(assignment.dueDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }) : "No deadline"}
                                            </span>
                                        </div>
                                        {assignment.fileUrl && (
                                            <a 
                                                href={assignment.fileUrl} 
                                                target="_blank" 
                                                className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-[#015A86] text-white text-[14px] font-medium hover:bg-[#014a6e] transition-colors w-fit"
                                            >
                                                <ExternalLink className="h-4 w-4" />
                                                Download Materials
                                            </a>
                                        )}
                                    </div>
                                </div>
                                <div className="bg-[#F5F8FA] rounded-[10px] p-[20px] border border-[#E5E7EB]">
                                    <h4 className="text-[14px] font-bold text-[#015A86] mb-3">Your Submission</h4>
                                    {assignment.submission ? (
                                        <div className="space-y-2">
                                            <p className="text-[13px] text-[#0B2E3F]">
                                                Submitted on: <span className="font-semibold">{new Date(assignment.submission.submittedAt).toLocaleDateString()}</span>
                                            </p>
                                            <FileViewer
                                                fileUrl={assignment.submission.filePath}
                                                className="inline-flex items-center text-[#015A86] hover:text-[#FD8B0A] font-medium text-[13px] gap-1"
                                            >
                                                View file <FileText className="h-3 w-3" />
                                            </FileViewer>

                                            {assignment.submission.feedback && (
                                                <div className="mt-4 p-3 bg-white border border-blue-100 rounded-lg shadow-sm">
                                                    <p className="text-[11px] font-bold text-[#015A86] uppercase mb-1">Teacher Feedback</p>
                                                    <p className="text-[13px] text-[#0B2E3F] italic leading-relaxed">
                                                        "{assignment.submission.feedback}"
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    ) : (
                                        <SubmissionForm assignmentId={assignment.id} />
                                    )}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}

                {allAssignments.length === 0 && (
                    <Card className="py-[64px] text-center border border-dashed border-[#E5E7EB] bg-[#F5F8FA] rounded-[12px]">
                        <div className="max-w-xs mx-auto">
                            <div className="w-[64px] h-[64px] bg-white text-[#015A86] rounded-full flex items-center justify-center mx-auto mb-[16px] shadow-sm">
                                <FileText className="h-[32px] w-[32px] stroke-2" />
                            </div>
                            <h3 className="text-[20px] font-semibold text-[#015A86]">No assignments found</h3>
                            <p className="text-[#0B2E3F] text-[14px] mt-[8px]">
                                Once your teacher adds assignments to your modules, they'll appear here.
                            </p>
                        </div>
                    </Card>
                )}
            </div>
        </div>
    )
}
