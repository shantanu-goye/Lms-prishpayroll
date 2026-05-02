import prisma from '@/lib/prisma'
import { verifySession } from '@/lib/auth'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { AlertCircle, CheckCircle2, Wallet, Users, Receipt } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default async function StudentFeesPage() {
    const session = await verifySession()
    if (!session) return null

    const studentId = session.userId

    // 1. Fetch Enrollments for THIS student
    const enrollments = await prisma.enrollment.findMany({
        where: { userId: studentId },
        include: {
            course: true,
        }
    })

    // 2. Fetch Fees for THIS student
    const allFees = await prisma.fee.findMany({
        where: { studentId: studentId },
        include: {
            course: true
        },
        orderBy: {
            dueDate: 'desc'
        }
    })

    // 3. Calculate Consolidated Status per COURSE
    const financialRecords = enrollments.map(enrollment => {
        const courseId = enrollment.courseId
        const coursePrice = enrollment.agreedPrice ?? enrollment.course.price ?? 0

        const relevantFees = allFees.filter(f =>
            f.courseId === courseId &&
            f.status === 'PAID'
        )

        const totalPaid = relevantFees.reduce((sum, f) => sum + f.amount, 0)
        let remaining = coursePrice - totalPaid
        if (remaining < 0) remaining = 0

        return {
            id: enrollment.id,
            courseTitle: enrollment.course.title,
            totalPrice: coursePrice,
            paid: totalPaid,
            remaining: remaining,
            isFullyPaid: remaining <= 0
        }
    })

    const totalExpected = financialRecords.reduce((sum, r) => sum + r.totalPrice, 0)
    const totalPaid = financialRecords.reduce((sum, r) => sum + r.paid, 0)
    const totalOutstanding = financialRecords.reduce((sum, r) => sum + r.remaining, 0)

    return (
        <div className="bg-[#F5F8FA] min-h-screen pb-12">
            <div className="space-y-[32px] p-[24px] max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-[16px]">
                    <div>
                        <h2 className="text-[32px] font-semibold tracking-tight text-[#015A86]">My Fees & Payments</h2>
                        <p className="text-[#0B2E3F] mt-[4px] text-[16px]">Overview of your course fees and payment history.</p>
                    </div>
                </div>

                {/* Metrics Dashboard */}
                <div className="grid grid-cols-1 gap-[24px] sm:grid-cols-2 lg:grid-cols-3">
                    <Card className="bg-white rounded-[12px] border border-[#E5E7EB]">
                        <CardHeader className="flex flex-row items-center justify-between p-[24px] pb-[8px]">
                            <CardTitle className="text-[14px] font-medium text-[#015A86] uppercase tracking-wider">Total Course Fee</CardTitle>
                            <Wallet className="h-6 w-6 text-[#015A86] stroke-2" />
                        </CardHeader>
                        <CardContent className="px-[24px] pb-[24px]">
                            <div className="text-[32px] font-semibold text-[#0B2E3F]">₹{totalExpected.toLocaleString('en-IN')}</div>
                        </CardContent>
                    </Card>
                    <Card className="bg-white rounded-[12px] border border-[#E5E7EB]">
                        <CardHeader className="flex flex-row items-center justify-between p-[24px] pb-[8px]">
                            <CardTitle className="text-[14px] font-medium text-[#015A86] uppercase tracking-wider">Total Paid</CardTitle>
                            <CheckCircle2 className="h-6 w-6 text-[#015A86] stroke-2" />
                        </CardHeader>
                        <CardContent className="px-[24px] pb-[24px]">
                            <div className="text-[32px] font-semibold text-[#015A86]">₹{totalPaid.toLocaleString('en-IN')}</div>
                        </CardContent>
                    </Card>
                    <Card className="bg-white rounded-[12px] border border-[#E5E7EB]">
                        <CardHeader className="flex flex-row items-center justify-between p-[24px] pb-[8px]">
                            <CardTitle className="text-[14px] font-medium text-[#015A86] uppercase tracking-wider">Outstanding Balance</CardTitle>
                            <AlertCircle className="h-6 w-6 text-[#FD8B0A] stroke-2" />
                        </CardHeader>
                        <CardContent className="px-[24px] pb-[24px]">
                            <div className="text-[32px] font-semibold text-[#FD8B0A]">₹{totalOutstanding.toLocaleString('en-IN')}</div>
                        </CardContent>
                    </Card>
                </div>

                <div className="grid lg:grid-cols-1 gap-[32px]">
                    <div className="w-full">
                        <Tabs defaultValue="status" className="w-full">
                            <TabsList className="grid w-full grid-cols-2 mb-[24px] bg-[#E5E7EB] p-[4px] rounded-[10px] max-w-md">
                                <TabsTrigger value="status" className="data-[state=active]:bg-white data-[state=active]:text-[#015A86] data-[state=active]:shadow-sm rounded-[6px] py-[8px] text-[14px] font-medium text-[#0B2E3F] transition-all">
                                    Course Balances
                                </TabsTrigger>
                                <TabsTrigger value="transactions" className="data-[state=active]:bg-white data-[state=active]:text-[#015A86] data-[state=active]:shadow-sm rounded-[6px] py-[8px] text-[14px] font-medium text-[#0B2E3F] transition-all">
                                    Payment History
                                </TabsTrigger>
                            </TabsList>

                            <TabsContent value="status" className="m-0 focus-visible:outline-none focus-visible:ring-0">
                                <Card className="bg-white rounded-[12px] border border-[#E5E7EB] overflow-hidden">
                                    <div className="p-[24px] border-b border-[#E5E7EB]">
                                        <h3 className="text-[24px] font-medium text-[#015A86]">Fees per Course</h3>
                                    </div>
                                    <div className="overflow-x-auto">
                                        <Table>
                                            <TableHeader className="bg-[#F5F8FA]">
                                                <TableRow className="border-[#E5E7EB] hover:bg-transparent">
                                                    <TableHead className="font-medium text-[#015A86] h-[48px] px-[24px]">Course</TableHead>
                                                    <TableHead className="text-right font-medium text-[#015A86] h-[48px] px-[24px]">Agreed Fee</TableHead>
                                                    <TableHead className="text-right font-medium text-[#015A86] h-[48px] px-[24px]">Paid</TableHead>
                                                    <TableHead className="text-right font-medium text-[#015A86] h-[48px] px-[24px]">Remaining Due</TableHead>
                                                    <TableHead className="text-center font-medium text-[#015A86] h-[48px] px-[24px]">Status</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody className="bg-white">
                                                {financialRecords.length === 0 ? (
                                                    <TableRow>
                                                        <TableCell colSpan={5} className="h-32 text-center text-[#0B2E3F]">
                                                            No enrollment records found.
                                                        </TableCell>
                                                    </TableRow>
                                                ) : (
                                                    financialRecords.map((record) => (
                                                        <TableRow key={record.id} className="border-[#E5E7EB] hover:bg-[#F5F8FA] transition-colors">
                                                            <TableCell className="px-[24px] py-[16px]">
                                                                <div className="text-[16px] font-medium text-[#0B2E3F]">{record.courseTitle}</div>
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
                                                                        <CheckCircle2 className="w-[16px] h-[16px]" /> Fully Paid
                                                                    </div>
                                                                ) : (
                                                                    <div className="inline-flex items-center gap-[6px] px-[12px] py-[4px] rounded-[6px] text-[14px] font-medium bg-white text-[#FD8B0A] border border-[#FD8B0A]">
                                                                        <AlertCircle className="w-[16px] h-[16px]" /> Payment Pending
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
                                    <div className="p-[24px] border-b border-[#E5E7EB]">
                                        <h3 className="text-[24px] font-medium text-[#015A86]">Transaction History</h3>
                                    </div>
                                    <div className="overflow-x-auto">
                                        <Table>
                                            <TableHeader className="bg-[#F5F8FA]">
                                                <TableRow className="border-[#E5E7EB] hover:bg-transparent">
                                                    <TableHead className="font-medium text-[#015A86] h-[48px] px-[24px]">Date</TableHead>
                                                    <TableHead className="font-medium text-[#015A86] h-[48px] px-[24px]">Course</TableHead>
                                                    <TableHead className="text-right font-medium text-[#015A86] h-[48px] px-[24px]">Amount</TableHead>
                                                    <TableHead className="text-center font-medium text-[#015A86] h-[48px] px-[24px]">Status</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody className="bg-white">
                                                {allFees.length === 0 ? (
                                                    <TableRow>
                                                        <TableCell colSpan={4} className="h-32 text-center text-[#0B2E3F]">
                                                            No payment transactions found.
                                                        </TableCell>
                                                    </TableRow>
                                                ) : (
                                                    allFees.map((fee) => (
                                                        <TableRow key={fee.id} className="border-[#E5E7EB] hover:bg-[#F5F8FA] transition-colors">
                                                            <TableCell className="text-[#0B2E3F] font-normal px-[24px] py-[16px] text-[16px]">
                                                                {fee.dueDate ? new Date(fee.dueDate).toLocaleDateString() : '-'}
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
