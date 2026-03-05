import prisma from '@/lib/prisma'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Users, BookOpen, CreditCard, Clock } from 'lucide-react'

export default async function AdminDashboard() {
    const stats = [
        {
            title: 'Total Students',
            value: await prisma.user.count({ where: { role: 'STUDENT' } }),
            icon: Users,
            color: 'text-indigo-600',
            bg: 'bg-indigo-50',
        },
        {
            title: 'Active Courses',
            value: await prisma.course.count(),
            icon: BookOpen,
            color: 'text-emerald-600',
            bg: 'bg-emerald-50',
        },
        {
            title: 'Pending Fees',
            value: await prisma.fee.count({ where: { status: 'PENDING' } }),
            icon: Clock,
            color: 'text-amber-600',
            bg: 'bg-amber-50',
        },
    ]

    return (
        <div className="space-y-[32px] p-[24px] max-w-7xl mx-auto">
            <div>
                <h2 className="text-[32px] font-semibold tracking-tight text-[#015A86]">Dashboard Overview</h2>
                <p className="text-[#0B2E3F] mt-[4px] text-[16px]">Welcome back! Here's what's happening today.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-[24px]">
                {stats.map((stat) => (
                    <Card key={stat.title} className="bg-white rounded-[12px] border border-[#E5E7EB] overflow-hidden hover:bg-[#F5F8FA] transition-colors duration-300">
                        <CardHeader className="flex flex-row items-center justify-between p-[24px] pb-[8px]">
                            <CardTitle className="text-[14px] font-medium text-[#015A86] uppercase tracking-wider">
                                {stat.title}
                            </CardTitle>
                            <div className={`p-[8px] rounded-[8px] ${stat.bg}`}>
                                <stat.icon className={`h-[20px] w-[20px] ${stat.color} stroke-2 transition-colors hover:text-[#FD8B0A]`} />
                            </div>
                        </CardHeader>
                        <CardContent className="px-[24px] pb-[24px]">
                            <div className="text-[32px] font-semibold text-[#0B2E3F] bg-clip-text text-transparent bg-[linear-gradient(135deg,#015A86_0%,#FD8B0A_100%)]">{stat.value}</div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <Card className="bg-white rounded-[12px] border border-[#E5E7EB]">
                <CardHeader className="p-[24px] border-b border-[#E5E7EB]">
                    <CardTitle className="text-[20px] font-medium text-[#015A86]">Recent Activity</CardTitle>
                </CardHeader>
                <CardContent className="p-[24px]">
                    <p className="text-[#0B2E3F] text-[14px] italic">System logs and recent updates will appear here.</p>
                </CardContent>
            </Card>
        </div>
    )
}
