import prisma from '@/lib/prisma'
import { verifySession } from '@/lib/auth'
import Link from 'next/link'
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { BookOpen, User, ArrowRight } from 'lucide-react'

export default async function StudentDashboard() {
    const session = await verifySession()
    if (!session) return null

    const enrollments = await prisma.enrollment.findMany({
        where: { userId: session.userId },
        include: {
            course: {
                include: {
                    instructor: true,
                    modules: {
                        include: {
                            _count: {
                                select: { assignments: true },
                            },
                        },
                    },
                },
            },
        },
    })

    return (
        <div className="space-y-[32px] p-[24px] max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-[16px]">
                <div>
                    <h2 className="text-[32px] font-semibold tracking-tight text-[#015A86]">My Learning Journey</h2>
                    <p className="text-[#0B2E3F] mt-[4px] text-[16px]">Pick up where you left off.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[24px]">
                {enrollments.map((enrollment) => (
                    <Card key={enrollment.id} className="group hover:bg-[#F5F8FA] transition-colors duration-300 bg-white rounded-[12px] border border-[#E5E7EB] overflow-hidden flex flex-col">
                        <CardHeader className="bg-[#F5F8FA] border-b border-[#E5E7EB] p-[24px] pb-[16px]">
                            <CardTitle className="text-[20px] font-semibold text-[#015A86] group-hover:text-[#FD8B0A] transition-colors line-clamp-1">
                                {enrollment.course.title}
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="px-[24px] py-[16px] flex-1">
                            <p className="text-[#0B2E3F] text-[14px] leading-relaxed line-clamp-3 mb-[24px] opacity-80">
                                {enrollment.course.description}
                            </p>
                            <div className="flex items-center justify-between text-[12px] font-semibold uppercase tracking-wider text-[#015A86]">
                                <div className="flex items-center gap-[8px]">
                                    <User className="h-[14px] w-[14px] text-[#FD8B0A] stroke-2" />
                                    <span>{enrollment.course.instructor.name}</span>
                                </div>
                                <div className="flex items-center gap-[8px]">
                                    <BookOpen className="h-[14px] w-[14px] text-[#FD8B0A] stroke-2" />
                                    <span>{enrollment.course.modules.reduce((sum: number, m: any) => sum + m._count.assignments, 0)} Assignments</span>
                                </div>
                            </div>
                        </CardContent>
                        <CardFooter className="bg-[#F5F8FA] p-[24px] pt-[16px] border-t border-[#E5E7EB]">
                            <Button asChild className="w-full bg-[#015A86] hover:bg-[#00476b] text-white font-medium h-[40px] rounded-[8px] group transition-colors border-0">
                                <Link href={`/dashboard/student/course/${enrollment.courseId}`} className="flex items-center justify-center">
                                    Enter Course
                                    <ArrowRight className="ml-[8px] h-[16px] w-[16px] group-hover:translate-x-1 transition-transform stroke-2" />
                                </Link>
                            </Button>
                        </CardFooter>
                    </Card>
                ))}
                {enrollments.length === 0 && (
                    <Card className="col-span-full py-[64px] text-center border border-dashed border-[#E5E7EB] bg-[#F5F8FA] rounded-[12px]">
                        <div className="max-w-xs mx-auto">
                            <div className="w-[64px] h-[64px] bg-white text-[#015A86] rounded-full flex items-center justify-center mx-auto mb-[16px] shadow-sm">
                                <BookOpen className="h-[32px] w-[32px] stroke-2" />
                            </div>
                            <h3 className="text-[20px] font-semibold text-[#015A86]">No courses yet</h3>
                            <p className="text-[#0B2E3F] text-[14px] mt-[8px]">
                                You haven't been enrolled in any courses by the administrator.
                                Please contact support if you believe this is an error.
                            </p>
                        </div>
                    </Card>
                )}
            </div>
        </div>
    )
}
