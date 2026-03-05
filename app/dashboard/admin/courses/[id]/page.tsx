import prisma from '@/lib/prisma'
import AssignmentForm from '@/app/ui/admin/assignment-form'
import AddModuleForm from '@/app/ui/admin/add-module-form'
import VerifySubmissionButton from '@/app/ui/admin/verify-submission-button'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import EnrollmentForm from '@/app/ui/admin/enrollment-form'
import { unenrollStudent } from '@/app/actions/enrollments'
import { deleteAssignment } from '@/app/actions/assignments'
import { deleteModule } from '@/app/actions/modules'
import EditAssignmentDialog from '@/app/ui/admin/edit-assignment-dialog'
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ChevronLeft, Users, Trash2, BookOpen, FileText, Layers, ExternalLink } from 'lucide-react'

export default async function CourseDetailsPage({ params }: { params: { id: string } }) {
    const { id } = await params
    const courseId = parseInt(id)

    const course = await prisma.course.findUnique({
        where: { id: courseId },
        include: {
            modules: {
                orderBy: { order: 'asc' },
                include: {
                    assignments: {
                        orderBy: { id: 'asc' },
                        include: {
                            submissions: {
                                include: { student: true },
                            },
                        },
                    },
                },
            },
            enrollments: {
                include: { user: true },
            },
        },
    })

    if (!course) {
        notFound()
    }

    const allStudents = await prisma.user.findMany({
        where: { role: 'STUDENT' },
    })

    const enrolledIds = new Set(course.enrollments.map(e => e.userId))
    const availableStudents = allStudents.filter(s => !enrolledIds.has(s.id))

    const totalAssignments = course.modules.reduce((sum, m) => sum + m.assignments.length, 0)

    return (
        <div className="max-w-7xl mx-auto space-y-[32px] p-[24px]">
            {/* Header */}
            <div className="flex flex-col gap-[16px]">
                <Link
                    href="/dashboard/admin/courses"
                    className="flex items-center text-[14px] font-medium text-[#015A86] hover:text-[#FD8B0A] transition-colors w-fit"
                >
                    <ChevronLeft className="mr-[4px] h-[16px] w-[16px] stroke-2" />
                    Back to Courses
                </Link>
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-[16px] border-b border-[#E5E7EB] pb-[24px]">
                    <div>
                        <h1 className="text-[32px] font-semibold tracking-tight text-[#015A86]">{course.title}</h1>
                        <p className="mt-[8px] text-[16px] text-[#0B2E3F] opacity-80 max-w-3xl">{course.description}</p>
                    </div>
                    <div className="flex items-center gap-[16px] text-[14px] font-medium text-[#0B2E3F] bg-white px-[16px] py-[10px] rounded-[8px] border border-[#E5E7EB]">
                        <div className="flex items-center gap-[6px]">
                            <span className="text-[#015A86] font-bold">₹{course.price.toLocaleString('en-IN')}</span>
                        </div>
                        <div className="h-[16px] w-px bg-[#E5E7EB]"></div>
                        <div className="flex items-center gap-[6px]">
                            <Users className="h-[16px] w-[16px] text-[#FD8B0A]" />
                            <span>{course.enrollments.length} Enrolled</span>
                        </div>
                        <div className="h-[16px] w-px bg-[#E5E7EB]"></div>
                        <div className="flex items-center gap-[6px]">
                            <Layers className="h-[16px] w-[16px] text-[#015A86]" />
                            <span>{course.modules.length} Modules</span>
                        </div>
                        <div className="h-[16px] w-px bg-[#E5E7EB]"></div>
                        <div className="flex items-center gap-[6px]">
                            <BookOpen className="h-[16px] w-[16px] text-[#015A86]" />
                            <span>{totalAssignments} Assignments</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-[32px] items-start">
                {/* Main Content — Modules & Assignments */}
                <div className="lg:col-span-2 space-y-[24px]">
                    <div className="flex items-center justify-between mb-[8px]">
                        <h3 className="text-[20px] font-semibold text-[#015A86] flex items-center gap-[8px]">
                            <Layers className="h-[20px] w-[20px] text-[#015A86] stroke-2" />
                            Course Modules
                        </h3>
                    </div>

                    {course.modules.map((module, moduleIndex) => (
                        <Card key={module.id} className="bg-white rounded-[12px] border border-[#E5E7EB] overflow-hidden">
                            <CardHeader className="bg-[#F5F8FA] border-b border-[#E5E7EB] p-[20px] flex flex-row items-center justify-between">
                                <div className="flex items-center gap-[12px]">
                                    <div className="h-[32px] w-[32px] rounded-[8px] bg-[#015A86] text-white flex items-center justify-center text-[14px] font-bold">
                                        {moduleIndex + 1}
                                    </div>
                                    <CardTitle className="text-[18px] font-semibold text-[#0B2E3F]">{module.title}</CardTitle>
                                </div>
                                <form action={async () => {
                                    'use server'
                                    await deleteModule(module.id, courseId)
                                }}>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="text-red-500 hover:bg-red-50 hover:text-red-600 h-[32px] w-[32px] rounded-[6px] transition-colors border-0"
                                        type="submit"
                                        title="Delete Module"
                                    >
                                        <Trash2 className="h-[16px] w-[16px] stroke-2" />
                                    </Button>
                                </form>
                            </CardHeader>
                            <CardContent className="p-[20px] space-y-[16px]">
                                {/* Assignments list */}
                                {module.assignments.length > 0 ? (
                                    <div className="space-y-[12px]">
                                        {module.assignments.map((assignment) => (
                                            <div key={assignment.id} className="bg-white rounded-[8px] border border-[#E5E7EB] p-[16px]">
                                                <div className="flex items-start justify-between gap-[12px]">
                                                    <div className="flex-1">
                                                        <div className="flex items-center gap-[8px]">
                                                            <FileText className="h-[16px] w-[16px] text-[#FD8B0A] stroke-2" />
                                                            <h4 className="text-[16px] font-semibold text-[#0B2E3F]">{assignment.title}</h4>
                                                        </div>
                                                        {assignment.description && (
                                                            <p className="text-[13px] text-[#0B2E3F] opacity-70 mt-[4px] ml-[24px]">{assignment.description}</p>
                                                        )}
                                                        {assignment.dueDate && (
                                                            <p className={`text-[12px] mt-[6px] ml-[24px] font-medium ${new Date(assignment.dueDate) < new Date() ? 'text-red-500' : 'text-[#015A86]'}`}>
                                                                Due: {new Date(assignment.dueDate).toLocaleDateString()}
                                                            </p>
                                                        )}
                                                    </div>
                                                    <div className="flex items-center gap-[4px]">
                                                        <EditAssignmentDialog assignment={assignment} />
                                                        <form action={async () => {
                                                            'use server'
                                                            await deleteAssignment(assignment.id, courseId)
                                                        }}>
                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                                className="h-[32px] w-[32px] text-red-500 hover:bg-red-50 hover:text-red-600 rounded-[6px] border-0"
                                                                type="submit"
                                                            >
                                                                <Trash2 className="h-[14px] w-[14px]" />
                                                            </Button>
                                                        </form>
                                                    </div>
                                                </div>

                                                {/* Submissions for this assignment */}
                                                {assignment.submissions.length > 0 && (
                                                    <div className="mt-[12px] ml-[24px] space-y-[8px]">
                                                        <p className="text-[12px] font-bold text-[#015A86] uppercase tracking-wider">
                                                            Submissions ({assignment.submissions.length})
                                                        </p>
                                                        {assignment.submissions.map((sub) => (
                                                            <div key={sub.id} className="flex items-center justify-between bg-[#F5F8FA] rounded-[6px] px-[12px] py-[8px] border border-[#E5E7EB]">
                                                                <div className="flex items-center gap-[8px]">
                                                                    <div className="h-[28px] w-[28px] rounded-full bg-[#015A86] text-white flex items-center justify-center text-[11px] font-bold">
                                                                        {sub.student.name.charAt(0)}
                                                                    </div>
                                                                    <div>
                                                                        <p className="text-[13px] font-medium text-[#0B2E3F]">{sub.student.name}</p>
                                                                        <p className="text-[11px] text-[#0B2E3F] opacity-60">{new Date(sub.submittedAt).toLocaleDateString()}</p>
                                                                    </div>
                                                                </div>
                                                                <div className="flex items-center gap-[8px]">
                                                                    <a href={sub.filePath} target="_blank" className="text-[#015A86] hover:text-[#FD8B0A] transition-colors">
                                                                        <ExternalLink className="h-[14px] w-[14px]" />
                                                                    </a>
                                                                    <VerifySubmissionButton
                                                                        submissionId={sub.id}
                                                                        courseId={courseId}
                                                                        currentStatus={sub.status}
                                                                    />
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-[24px] text-[14px] text-[#0B2E3F] opacity-60">
                                        No assignments in this module yet.
                                    </div>
                                )}

                                {/* Add Assignment Form */}
                                <AssignmentForm moduleId={module.id} courseId={courseId} />
                            </CardContent>
                        </Card>
                    ))}

                    {course.modules.length === 0 && (
                        <div className="text-center py-[48px] bg-[#F5F8FA] rounded-[12px] border border-dashed border-[#E5E7EB]">
                            <Layers className="h-[40px] w-[40px] text-[#015A86] opacity-40 mx-auto mb-[12px]" />
                            <p className="text-[#0B2E3F] font-medium">No modules created yet.</p>
                            <p className="text-[14px] text-[#0B2E3F] opacity-60 mt-[4px]">Add your first module below to get started.</p>
                        </div>
                    )}

                    {/* Add Module Form */}
                    <AddModuleForm courseId={courseId} />
                </div>

                {/* Sidebar — Enrolled Students */}
                <div className="space-y-[24px]">
                    <Card className="bg-white rounded-[12px] border border-[#E5E7EB]">
                        <CardHeader className="bg-[#F5F8FA] border-b border-[#E5E7EB] p-[20px]">
                            <CardTitle className="text-[18px] font-semibold text-[#015A86] flex items-center gap-[8px]">
                                <Users className="h-[18px] w-[18px] text-[#FD8B0A]" />
                                Enrolled Students
                            </CardTitle>
                            <CardDescription className="text-[#0B2E3F] text-[14px]">
                                {course.enrollments.length} current participants
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="p-[20px]">
                            <ul className="space-y-[12px]">
                                {course.enrollments.map((enrollment) => (
                                    <li key={enrollment.id} className="flex items-center justify-between group">
                                        <div className="flex items-center space-x-[12px]">
                                            <div className="h-[36px] w-[36px] rounded-[8px] bg-[#F5F8FA] text-[#015A86] border border-[#E5E7EB] flex items-center justify-center font-bold text-[14px]">
                                                {enrollment.user.name.charAt(0)}
                                            </div>
                                            <div>
                                                <p className="font-medium text-[14px] text-[#0B2E3F]">{enrollment.user.name}</p>
                                                <p className="text-[12px] text-[#0B2E3F] opacity-60">{enrollment.user.email}</p>
                                            </div>
                                        </div>
                                        <form action={async () => {
                                            'use server'
                                            await unenrollStudent(enrollment.id, course.id)
                                        }}>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="opacity-0 group-hover:opacity-100 text-red-500 hover:bg-red-50 hover:text-red-600 h-[32px] w-[32px] rounded-[6px] transition-all border-0"
                                                type="submit"
                                            >
                                                <Trash2 className="h-[14px] w-[14px]" />
                                            </Button>
                                        </form>
                                    </li>
                                ))}
                                {course.enrollments.length === 0 && (
                                    <li className="py-[24px] text-center text-[14px] text-[#0B2E3F] opacity-60 bg-[#F5F8FA] rounded-[8px] border-dashed border border-[#E5E7EB]">
                                        No students enrolled yet.
                                    </li>
                                )}
                            </ul>

                            <EnrollmentForm courseId={course.id} students={availableStudents} />
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
