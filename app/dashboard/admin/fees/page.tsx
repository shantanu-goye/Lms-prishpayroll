import prisma from '@/lib/prisma'
import FeeForm from '@/app/ui/admin/fee-form'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { deleteFee, updateFeeStatus } from '@/app/actions/fees'
import { Button } from '@/components/ui/button'
import { Check, Trash2, AlertCircle, CheckCircle2, Wallet, Users, LayoutDashboard, Receipt } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default async function FeesPage() {
    // 1. Fetch Students
    const students = await prisma.user.findMany({
        where: { role: 'STUDENT' },
        orderBy: { name: 'asc' }
    })

    // 2. Fetch Courses (for selection in form)
    const courses = await prisma.course.findMany({
        orderBy: { title: 'asc' }
    })

    // 3. Fetch Enrollments (to know who owes what)
    // We need enrollments to calculate the baseline "Total Fee" (Course Price)
    const enrollments = await prisma.enrollment.findMany({
        include: {
            user: true,
            course: true,
        }
    })

    // 4. Fetch ALL Fees (to calculate payments made)
    const allFees = await prisma.fee.findMany({
        include: {
            student: true,
            course: true
        },
        orderBy: {
            dueDate: 'desc'
        }
    })

    // 5. Calculate Consolidated Status per STUDENT per COURSE
    // Logic: 
    // - Total Due = Course.price
    // - Paid = Sum of Fees where studentId, courseId match AND status='PAID'
    // - Remaining = Total Due - Paid

    const financialRecords = enrollments.map(enrollment => {
        const studentId = enrollment.userId
        const courseId = enrollment.courseId
        // Prioritize agreedPrice from enrollment, fallback to course base price
        const coursePrice = enrollment.agreedPrice ?? enrollment.course.price ?? 0

        // Find payments specific to this course allocation
        const relevantFees = allFees.filter(f =>
            f.courseId === courseId &&
            f.studentId === studentId &&
            f.status === 'PAID'
        )

        const totalPaid = relevantFees.reduce((sum, f) => sum + f.amount, 0)
        let remaining = coursePrice - totalPaid
        if (remaining < 0) remaining = 0 // Handle overpayment gracefully

        return {
            id: enrollment.id, // Use enrollment ID as key
            studentName: enrollment.user.name,
            courseTitle: enrollment.course.title,
            totalPrice: coursePrice,
            paid: totalPaid,
            remaining: remaining,
            isFullyPaid: remaining <= 0
        }
    })

    const totalExpected = financialRecords.reduce((sum, r) => sum + r.totalPrice, 0)
    const totalCollected = financialRecords.reduce((sum, r) => sum + r.paid, 0)
    const totalOutstanding = financialRecords.reduce((sum, r) => sum + r.remaining, 0)

    return (
        <div className="bg-[#F5F8FA] min-h-screen pb-12">
            <div className="space-y-[32px] p-[24px] max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-[16px]">
                    <div>
                        <h2 className="text-[32px] font-semibold tracking-tight text-[#015A86]">Financial Overview</h2>
                        <p className="text-[#0B2E3F] mt-[4px] text-[16px]">Track payments and outstanding balances per course.</p>
                    </div>
                </div>

                {/* Metrics Dashboard */}
                <div className="grid grid-cols-1 gap-[24px] sm:grid-cols-2 lg:grid-cols-3">
                    <Card className="bg-white rounded-[12px] border border-[#E5E7EB]">
                        <CardHeader className="flex flex-row items-center justify-between p-[24px] pb-[8px]">
                            <CardTitle className="text-[14px] font-medium text-[#015A86] uppercase tracking-wider">Expected Revenue</CardTitle>
                            <Wallet className="h-6 w-6 text-[#015A86] stroke-2 transition-colors hover:text-[#FD8B0A]" />
                        </CardHeader>
                        <CardContent className="px-[24px] pb-[24px]">
                            <div className="text-[32px] font-semibold text-[#0B2E3F] bg-clip-text text-transparent bg-[linear-gradient(135deg,#015A86_0%,#FD8B0A_100%)]">₹{totalExpected.toLocaleString('en-IN')}</div>
                        </CardContent>
                    </Card>
                    <Card className="bg-white rounded-[12px] border border-[#E5E7EB]">
                        <CardHeader className="flex flex-row items-center justify-between p-[24px] pb-[8px]">
                            <CardTitle className="text-[14px] font-medium text-[#015A86] uppercase tracking-wider">Total Collected</CardTitle>
                            <CheckCircle2 className="h-6 w-6 text-[#015A86] stroke-2 transition-colors hover:text-[#FD8B0A]" />
                        </CardHeader>
                        <CardContent className="px-[24px] pb-[24px]">
                            <div className="text-[32px] font-semibold text-[#0B2E3F] bg-clip-text text-transparent bg-[linear-gradient(135deg,#015A86_0%,#FD8B0A_100%)]">₹{totalCollected.toLocaleString('en-IN')}</div>
                        </CardContent>
                    </Card>
                    <Card className="bg-white rounded-[12px] border border-[#E5E7EB]">
                        <CardHeader className="flex flex-row items-center justify-between p-[24px] pb-[8px]">
                            <CardTitle className="text-[14px] font-medium text-[#015A86] uppercase tracking-wider">Outstanding Due</CardTitle>
                            <AlertCircle className="h-6 w-6 text-[#FD8B0A] stroke-2 transition-colors hover:text-[#015A86]" />
                        </CardHeader>
                        <CardContent className="px-[24px] pb-[24px]">
                            <div className="text-[32px] font-semibold text-[#FD8B0A]">₹{totalOutstanding.toLocaleString('en-IN')}</div>
                        </CardContent>
                    </Card>
                </div>

                <div className="grid lg:grid-cols-3 gap-[32px]">
                    {/* Left Column: Add Payment Form */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-[24px]">
                            <FeeForm students={students} courses={courses} />
                        </div>
                    </div>

                    {/* Right Column: Financial Data Tabs */}
                    <div className="lg:col-span-2">
                        <Tabs defaultValue="status" className="w-full">
                            <TabsList className="grid w-full grid-cols-2 mb-[24px] bg-[#E5E7EB] p-[4px] rounded-[10px]">
                                <TabsTrigger value="status" className="data-[state=active]:bg-white data-[state=active]:text-[#015A86] data-[state=active]:shadow-sm rounded-[6px] py-[8px] text-[14px] font-medium text-[#0B2E3F] transition-all">
                                    <Users className="w-[16px] h-[16px] mr-[8px] stroke-2" />
                                    Enrollment Status
                                </TabsTrigger>
                                <TabsTrigger value="transactions" className="data-[state=active]:bg-white data-[state=active]:text-[#015A86] data-[state=active]:shadow-sm rounded-[6px] py-[8px] text-[14px] font-medium text-[#0B2E3F] transition-all">
                                    <Receipt className="w-[16px] h-[16px] mr-[8px] stroke-2" />
                                    Recent Transactions
                                </TabsTrigger>
                            </TabsList>

                            <TabsContent value="status" className="m-0 focus-visible:outline-none focus-visible:ring-0">
                                <Card className="bg-white rounded-[12px] border border-[#E5E7EB] overflow-hidden">
                                    <div className="p-[24px] border-b border-[#E5E7EB] flex justify-between items-center">
                                        <h3 className="text-[24px] font-medium text-[#015A86]">Enrollment Balances</h3>
                                        <Badge variant="secondary" className="bg-[#F5F8FA] text-[#015A86] border border-[#E5E7EB] rounded-[6px] px-[12px] py-[4px] text-[14px] font-medium">
                                            {financialRecords.length} Records
                                        </Badge>
                                    </div>
                                    <div className="overflow-x-auto">
                                        <Table>
                                            <TableHeader className="bg-[#F5F8FA]">
                                                <TableRow className="border-[#E5E7EB] hover:bg-transparent">
                                                    <TableHead className="font-medium text-[#015A86] h-[48px] px-[24px]">Student / Course</TableHead>
                                                    <TableHead className="text-right font-medium text-[#015A86] h-[48px] px-[24px]">Total Fee</TableHead>
                                                    <TableHead className="text-right font-medium text-[#015A86] h-[48px] px-[24px]">Paid</TableHead>
                                                    <TableHead className="text-right font-medium text-[#015A86] h-[48px] px-[24px]">Remaining</TableHead>
                                                    <TableHead className="text-center font-medium text-[#015A86] h-[48px] px-[24px]">Status</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody className="bg-white">
                                                {financialRecords.length === 0 ? (
                                                    <TableRow>
                                                        <TableCell colSpan={5} className="h-32 text-center text-[#0B2E3F]">
                                                            No enrollments found. Assign students to courses first.
                                                        </TableCell>
                                                    </TableRow>
                                                ) : (
                                                    financialRecords.map((record) => (
                                                        <TableRow key={record.id} className="border-[#E5E7EB] hover:bg-[#F5F8FA] transition-colors">
                                                            <TableCell className="px-[24px] py-[16px]">
                                                                <div className="text-[16px] font-medium text-[#0B2E3F]">{record.studentName}</div>
                                                                <div className="text-[14px] text-[#015A86] mt-[4px]">{record.courseTitle}</div>
                                                            </TableCell>
                                                            <TableCell className="text-right font-normal text-[#0B2E3F] px-[24px] py-[16px] text-[16px]">
                                                                ₹{record.totalPrice.toLocaleString('en-IN')}
                                                            </TableCell>
                                                            <TableCell className="text-right text-[#015A86] px-[24px] py-[16px] text-[16px] font-medium">
                                                                ₹{record.paid.toLocaleString('en-IN')}
                                                            </TableCell>
                                                            <TableCell className="text-right font-semibold text-[#FD8B0A] px-[24px] py-[16px] text-[16px]">
                                                                ₹{record.remaining.toLocaleString('en-IN')}
                                                            </TableCell>
                                                            <TableCell className="text-center px-[24px] py-[16px]">
                                                                {record.isFullyPaid ? (
                                                                    <div className="inline-flex items-center gap-[6px] px-[12px] py-[4px] rounded-[6px] text-[14px] font-medium bg-[#F5F8FA] text-[#015A86] border border-[#E5E7EB]">
                                                                        <CheckCircle2 className="w-[16px] h-[16px]" /> Paid
                                                                    </div>
                                                                ) : (
                                                                    <div className="inline-flex items-center gap-[6px] px-[12px] py-[4px] rounded-[6px] text-[14px] font-medium bg-white text-[#FD8B0A] border border-[#FD8B0A]">
                                                                        <AlertCircle className="w-[16px] h-[16px]" /> Due
                                                                    </div>
                                                                )}
                                                            </TableCell>
                                                        </TableRow>
                                                    ))
                                                )}
                                            </TableBody>
                                        </Table>
                                    </div>
                                </Card>
                            </TabsContent>

                            <TabsContent value="transactions" className="m-0 focus-visible:outline-none focus-visible:ring-0">
                                <Card className="bg-white rounded-[12px] border border-[#E5E7EB] overflow-hidden">
                                    <div className="p-[24px] border-b border-[#E5E7EB] flex justify-between items-center">
                                        <h3 className="text-[24px] font-medium text-[#015A86]">Transaction History</h3>
                                        <Badge variant="outline" className="bg-[#F5F8FA] text-[#015A86] border border-[#E5E7EB] rounded-[6px] px-[12px] py-[4px] text-[14px] font-medium">
                                            {allFees.length} Transactions
                                        </Badge>
                                    </div>
                                    <div className="overflow-x-auto">
                                        <Table>
                                            <TableHeader className="bg-[#F5F8FA]">
                                                <TableRow className="border-[#E5E7EB] hover:bg-transparent">
                                                    <TableHead className="font-medium text-[#015A86] h-[48px] px-[24px]">Date</TableHead>
                                                    <TableHead className="font-medium text-[#015A86] h-[48px] px-[24px]">Student</TableHead>
                                                    <TableHead className="font-medium text-[#015A86] h-[48px] px-[24px]">Course</TableHead>
                                                    <TableHead className="text-right font-medium text-[#015A86] h-[48px] px-[24px]">Amount</TableHead>
                                                    <TableHead className="text-center font-medium text-[#015A86] h-[48px] px-[24px]">Status</TableHead>
                                                    <TableHead className="text-right font-medium text-[#015A86] h-[48px] px-[24px]">Actions</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody className="bg-white">
                                                {allFees.length === 0 ? (
                                                    <TableRow>
                                                        <TableCell colSpan={6} className="h-32 text-center text-[#0B2E3F]">
                                                            No transactions recorded yet.
                                                        </TableCell>
                                                    </TableRow>
                                                ) : (
                                                    allFees.map((fee) => (
                                                        <TableRow key={fee.id} className="border-[#E5E7EB] hover:bg-[#F5F8FA] transition-colors">
                                                            <TableCell className="text-[#0B2E3F] font-normal px-[24px] py-[16px] text-[16px]">
                                                                {fee.dueDate ? new Date(fee.dueDate).toLocaleDateString() : '-'}
                                                            </TableCell>
                                                            <TableCell className="px-[24px] py-[16px]">
                                                                <div className="text-[16px] font-medium text-[#0B2E3F]">{fee.student?.name}</div>
                                                                <div className="text-[14px] text-[#015A86] mt-[4px]">{fee.student?.email}</div>
                                                            </TableCell>
                                                            <TableCell className="px-[24px] py-[16px]">
                                                                <div className="text-[16px] font-medium text-[#0B2E3F]">{fee.course?.title || 'General'}</div>
                                                            </TableCell>
                                                            <TableCell className="text-right font-semibold text-[#015A86] px-[24px] py-[16px] text-[16px]">
                                                                ₹{fee.amount.toLocaleString('en-IN')}
                                                            </TableCell>
                                                            <TableCell className="text-center px-[24px] py-[16px]">
                                                                <div className={`inline-flex items-center px-[12px] py-[4px] rounded-[6px] text-[14px] font-medium border ${fee.status === 'PAID'
                                                                    ? 'bg-[#F5F8FA] text-[#015A86] border-[#E5E7EB]'
                                                                    : 'bg-white text-[#FD8B0A] border-[#FD8B0A]'
                                                                    }`}>
                                                                    {fee.status}
                                                                </div>
                                                            </TableCell>
                                                            <TableCell className="text-right px-[24px] py-[16px]">
                                                                <div className="flex justify-end gap-[8px]">
                                                                    {fee.status === 'PENDING' && (
                                                                        <form action={async () => {
                                                                            'use server'
                                                                            await updateFeeStatus(fee.id, 'PAID')
                                                                        }}>
                                                                            <Button
                                                                                variant="outline"
                                                                                size="icon"
                                                                                className="border-2 border-[#015A86] text-[#015A86] bg-transparent hover:bg-[#015A86] hover:text-white h-[36px] w-[36px] rounded-[6px] transition-colors"
                                                                                type="submit"
                                                                                title="Mark as Paid"
                                                                            >
                                                                                <Check className="h-[18px] w-[18px] stroke-2" />
                                                                            </Button>
                                                                        </form>
                                                                    )}
                                                                    <form action={async () => {
                                                                        'use server'
                                                                        await deleteFee(fee.id)
                                                                    }}>
                                                                        <Button
                                                                            variant="ghost"
                                                                            size="icon"
                                                                            className="text-red-500 hover:bg-red-50 hover:text-red-600 h-[36px] w-[36px] rounded-[6px] transition-colors border-0"
                                                                            type="submit"
                                                                            title="Delete"
                                                                        >
                                                                            <Trash2 className="h-[18px] w-[18px] stroke-2" />
                                                                        </Button>
                                                                    </form>
                                                                </div>
                                                            </TableCell>
                                                        </TableRow>
                                                    ))
                                                )}
                                            </TableBody>
                                        </Table>
                                    </div>
                                </Card>
                            </TabsContent>
                        </Tabs>
                    </div>
                </div>
            </div>
        </div>
    )
}
