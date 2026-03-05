import prisma from '@/lib/prisma'
import AddStudentDialog from '@/app/ui/admin/add-student-dialog'
import EditStudentDialog from '@/app/ui/admin/edit-student-dialog'
import { deleteStudent } from '@/app/actions/students'
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Trash2 } from 'lucide-react'

export default async function StudentsPage() {
    const students = await prisma.user.findMany({
        where: { role: 'STUDENT' },
        orderBy: { createdAt: 'desc' },
    })

    const courses = await prisma.course.findMany({
        select: {
            id: true,
            title: true,
            price: true,
        },
        orderBy: { title: 'asc' },
    })

    return (
        <div className="space-y-[32px] p-[24px] max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-[16px]">
                <div>
                    <h2 className="text-[32px] font-semibold tracking-tight text-[#015A86]">Manage Students</h2>
                    <p className="text-[#0B2E3F] mt-[4px] text-[16px]">View and manage all registered students.</p>
                </div>
                <AddStudentDialog courses={courses} />
            </div>

            <div className="rounded-[12px] bg-white border border-[#E5E7EB] overflow-hidden">
                <Table>
                    <TableHeader className="bg-[#F5F8FA]">
                        <TableRow className="border-[#E5E7EB] hover:bg-transparent">
                            <TableHead className="w-[200px] font-medium text-[#015A86] h-[48px] px-[24px]">Name</TableHead>
                            <TableHead className="font-medium text-[#015A86] h-[48px] px-[24px]">Email</TableHead>
                            <TableHead className="text-right font-medium text-[#015A86] h-[48px] px-[24px]">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody className="bg-white">
                        {students.map((student) => (
                            <TableRow key={student.id} className="border-[#E5E7EB] hover:bg-[#F5F8FA] transition-colors">
                                <TableCell className="font-medium text-[#0B2E3F] px-[24px] py-[16px] text-[16px]">{student.name}</TableCell>
                                <TableCell className="text-[#015A86] px-[24px] py-[16px] text-[14px]">{student.email}</TableCell>
                                <TableCell className="text-right px-[24px] py-[16px]">
                                    <div className="flex items-center justify-end gap-[8px]">
                                        <EditStudentDialog student={student} />
                                        <form action={async () => {
                                            'use server'
                                            await deleteStudent(student.id)
                                        }}>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="text-red-500 hover:bg-red-50 hover:text-red-600 h-[36px] w-[36px] rounded-[6px] transition-colors border-0"
                                                type="submit"
                                                title="Delete Student"
                                            >
                                                <Trash2 className="h-[18px] w-[18px] stroke-2" />
                                            </Button>
                                        </form>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                        {students.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={3} className="h-32 text-center text-[#0B2E3F]">
                                    No students found.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}
