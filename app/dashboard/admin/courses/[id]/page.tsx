import prisma from '@/lib/prisma'
import AssignmentForm from '@/app/ui/admin/assignment-form'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import EnrollmentForm from '@/app/ui/admin/enrollment-form'
import { unenrollStudent } from '@/app/actions/enrollments'
import { deleteAssignment } from '@/app/actions/assignments'
import EditAssignmentDialog from '@/app/ui/admin/edit-assignment-dialog'
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from '@/components/ui/table'
import { ChevronLeft, Calendar, Users, Trash2, BookOpen } from 'lucide-react'

export default async function CourseDetailsPage({ params }: { params: { id: string } }) {
    const { id } = await params
    const courseId = parseInt(id)

    const course = await prisma.course.findUnique({
        where: { id: courseId },
        include: {
            assignments: {
                orderBy: { dueDate: 'asc' },
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

    return (
        <div className="max-w-7xl mx-auto space-y-8">
            <div className="flex flex-col gap-4">
                <Link
                    href="/dashboard/admin/courses"
                    className="flex items-center text-sm font-medium text-indigo-600 hover:text-indigo-700 transition-colors w-fit"
                >
                    <ChevronLeft className="mr-1 h-4 w-4" />
                    Back to Courses
                </Link>
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                    <div>
                        <h1 className="text-4xl font-extrabold tracking-tight text-gray-900">{course.title}</h1>
                        <p className="mt-2 text-xl text-gray-500 max-w-3xl">{course.description}</p>
                    </div>
                    <div className="flex items-center gap-4 text-sm font-medium text-gray-500 bg-white px-4 py-2 rounded-xl border shadow-sm">
                        <div className="flex items-center gap-2">
                            <span className="text-gray-900 font-bold">₹{course.price.toLocaleString('en-IN')}</span>
                        </div>
                        <div className="h-4 w-px bg-gray-200"></div>
                        <div className="flex items-center gap-2">
                            <Users className="h-4 w-4 text-emerald-600" />
                            <span>{course.enrollments.length} Enrolled</span>
                        </div>
                        <div className="h-4 w-px bg-gray-200"></div>
                        <div className="flex items-center gap-2">
                            <BookOpen className="h-4 w-4 text-indigo-600" />
                            <span>{course.assignments.length} Assignments</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                <div className="lg:col-span-2 space-y-8">
                    <AssignmentForm courseId={course.id} />

                    <Card className="shadow-sm border-gray-100 overflow-hidden">
                        <CardHeader className="bg-gray-50/50 border-b">
                            <CardTitle className="text-lg flex items-center gap-2">
                                <Calendar className="h-5 w-5 text-indigo-600" />
                                Active Assignments
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-0">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="px-6">Title</TableHead>
                                        <TableHead>Instructions</TableHead>
                                        <TableHead className="text-right px-6">Due Date</TableHead>
                                        <TableHead className="text-right px-6">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {course.assignments.map((assignment) => (
                                        <TableRow key={assignment.id} className="group">
                                            <TableCell className="px-6 font-semibold py-4">{assignment.title}</TableCell>
                                            <TableCell className="text-muted-foreground line-clamp-1 py-4">{assignment.description || '-'}</TableCell>
                                            <TableCell className="text-right px-6 py-4">
                                                {assignment.dueDate ? (
                                                    <span className={`text-sm px-2 py-1 rounded-full font-medium ${new Date(assignment.dueDate) < new Date() ? 'bg-red-50 text-red-600' : 'bg-indigo-50 text-indigo-600'}`}>
                                                        {new Date(assignment.dueDate).toLocaleDateString()}
                                                    </span>
                                                ) : '-'}
                                            </TableCell>
                                            <TableCell className="text-right px-6 py-4">
                                                <div className="flex items-center justify-end gap-2">
                                                    <EditAssignmentDialog assignment={assignment} />
                                                    <form action={async () => {
                                                        'use server'
                                                        await deleteAssignment(assignment.id, course.id)
                                                    }}>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon-xs"
                                                            className="h-8 w-8 text-destructive hover:bg-destructive/10 hover:text-destructive"
                                                            type="submit"
                                                        >
                                                            <Trash2 className="h-3.5 w-3.5" />
                                                        </Button>
                                                    </form>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                    {course.assignments.length === 0 && (
                                        <TableRow>
                                            <TableCell colSpan={4} className="h-32 text-center text-muted-foreground">
                                                No assignments created yet.
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </div>

                <div className="space-y-8">
                    <Card className="shadow-sm border-emerald-50">
                        <CardHeader>
                            <CardTitle className="text-lg flex items-center gap-2">
                                <Users className="h-5 w-5 text-emerald-600" />
                                Enrolled Students
                            </CardTitle>
                            <CardDescription>
                                {course.enrollments.length} current participants
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <ul className="space-y-4">
                                {course.enrollments.map((enrollment) => (
                                    <li key={enrollment.id} className="flex items-center justify-between group">
                                        <div className="flex items-center space-x-3">
                                            <div className="h-10 w-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold text-sm shadow-sm ring-1 ring-emerald-100">
                                                {enrollment.user.name.charAt(0)}
                                            </div>
                                            <div>
                                                <p className="font-bold text-sm text-gray-900 group-hover:text-emerald-700 transition-colors">{enrollment.user.name}</p>
                                                <p className="text-xs text-gray-500">{enrollment.user.email}</p>
                                            </div>
                                        </div>
                                        <form action={async () => {
                                            'use server'
                                            await unenrollStudent(enrollment.id, course.id)
                                        }}>
                                            <Button
                                                variant="ghost"
                                                size="icon-xs"
                                                className="opacity-0 group-hover:opacity-100 text-destructive hover:bg-destructive/10 transition-all"
                                                type="submit"
                                            >
                                                <Trash2 className="h-3.5 w-3.5" />
                                            </Button>
                                        </form>
                                    </li>
                                ))}
                                {course.enrollments.length === 0 && (
                                    <li className="py-8 text-center text-sm text-muted-foreground bg-gray-50 rounded-xl border-dashed border">
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
