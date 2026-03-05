import prisma from '@/lib/prisma'
import AddCourseDialog from '@/app/ui/admin/add-course-dialog'
import EditCourseDialog from '@/app/ui/admin/edit-course-dialog'
import { deleteCourse } from '@/app/actions/courses'
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Users, Info, Trash2, BookOpen } from 'lucide-react'
import Link from 'next/link'

export default async function CoursesPage() {
    const courses = await prisma.course.findMany({
        include: {
            instructor: true,
            _count: {
                select: { enrollments: true, modules: true },
            },
        },
        orderBy: { id: 'desc' },
    })

    return (
        <div className="space-y-[32px] p-[24px] max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-[16px]">
                <div>
                    <h2 className="text-[32px] font-semibold tracking-tight text-[#015A86]">Manage Courses</h2>
                    <p className="text-[#0B2E3F] mt-[4px] text-[16px]">Create, edit, and manage all academic courses.</p>
                </div>
                <AddCourseDialog />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[24px]">
                {courses.map((course) => (
                    <Card key={course.id} className="flex flex-col bg-white rounded-[12px] border border-[#E5E7EB] hover:bg-[#F5F8FA] transition-colors duration-300">
                        <CardHeader className="p-[24px] pb-[16px]">
                            <CardTitle className="text-[20px] font-semibold text-[#015A86] line-clamp-1">{course.title}</CardTitle>
                        </CardHeader>
                        <CardContent className="flex-1 px-[24px] pb-[24px]">
                            <p className="text-[#0B2E3F] text-[14px] line-clamp-3 mb-[16px] opacity-80">{course.description}</p>
                            <div className="flex items-center gap-[16px] text-[14px] text-[#0B2E3F] border-t border-[#E5E7EB] pt-[16px]">
                                <div className="flex items-center gap-[8px]">
                                    <span className="font-medium">{course.instructor.name}</span>
                                </div>
                                <div className="flex items-center gap-[4px] text-[#015A86] font-medium">
                                    <Users className="h-[16px] w-[16px]" />
                                    <span>{course._count.enrollments}</span>
                                </div>
                                <div className="flex items-center gap-[4px] text-[#015A86] font-medium">
                                    <BookOpen className="h-[16px] w-[16px]" />
                                    <span>{course._count.modules} Modules</span>
                                </div>
                            </div>
                        </CardContent>
                        <CardFooter className="p-[24px] pt-0 flex justify-between items-center gap-[8px]">
                            <Button asChild variant="outline" className="flex-1 border-[#015A86] text-[#015A86] hover:bg-[#F5F8FA] h-[40px] rounded-[6px] gap-[8px] transition-colors">
                                <Link href={`/dashboard/admin/courses/${course.id}`}>
                                    <Info className="h-[16px] w-[16px]" />
                                    Details
                                </Link>
                            </Button>

                            <EditCourseDialog course={course} />

                            <form action={async () => {
                                'use server'
                                await deleteCourse(course.id)
                            }}>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="text-red-500 hover:bg-red-50 hover:text-red-600 h-[40px] w-[40px] rounded-[6px] transition-colors border-0"
                                    type="submit"
                                    title="Delete Course"
                                >
                                    <Trash2 className="h-[18px] w-[18px] stroke-2" />
                                </Button>
                            </form>
                        </CardFooter>
                    </Card>
                ))}
                {courses.length === 0 && (
                    <Card className="col-span-full py-[48px] text-center text-[#0B2E3F] bg-[#F5F8FA] border border-dashed border-[#E5E7EB] rounded-[12px]">
                        No courses created yet. Click "Add Course" to get started.
                    </Card>
                )}
            </div>
        </div>
    )
}
