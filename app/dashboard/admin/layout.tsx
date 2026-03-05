import Link from 'next/link'
import { logout } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import {
    LayoutDashboard,
    Users,
    BookOpen,
    CreditCard,
    LogOut,
    ShieldCheck
} from 'lucide-react'

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const navItems = [
        { label: 'Overview', href: '/dashboard/admin', icon: LayoutDashboard },
        { label: 'Students', href: '/dashboard/admin/students', icon: Users },
        { label: 'Courses', href: '/dashboard/admin/courses', icon: BookOpen },
        { label: 'Fees', href: '/dashboard/admin/fees', icon: CreditCard },
    ]

    return (
        <div className="flex h-screen bg-[#F5F8FA] overflow-hidden">
            {/* Sidebar */}
            <aside className="w-[280px] bg-white flex flex-col z-10 border-r border-[#E5E7EB]">
                <div className="p-[32px] pb-[16px]">
                    <div className="flex items-center gap-[12px] px-[8px]">
                        <div className="h-[40px] w-[40px] bg-[#015A86] rounded-[12px] flex items-center justify-center shadow-md">
                            <ShieldCheck className="h-[24px] w-[24px] text-white stroke-2" />
                        </div>
                        <div>
                            <h1 className="text-[20px] font-bold text-[#0B2E3F] tracking-tight leading-none">Admin</h1>
                            <p className="text-[12px] uppercase font-bold text-[#FD8B0A] tracking-widest mt-[4px]">Management</p>
                        </div>
                    </div>
                </div>

                <nav className="mt-[16px] flex-1 px-[16px] space-y-[8px]">
                    {navItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className="flex items-center gap-[12px] px-[16px] py-[12px] text-[14px] font-medium text-[#0B2E3F] hover:text-[#015A86] hover:bg-[#F5F8FA] rounded-[12px] transition-all duration-200 group"
                        >
                            <item.icon className="h-[20px] w-[20px] text-[#015A86] group-hover:text-[#FD8B0A] transition-colors stroke-2" />
                            {item.label}
                        </Link>
                    ))}
                </nav>

                <div className="p-[24px] mt-auto">
                    <Separator className="mb-[24px] bg-[#E5E7EB]" />
                    <form action={async () => {
                        'use server'
                        await logout()
                        redirect('/')
                    }}>
                        <Button
                            variant="ghost"
                            className="w-full justify-start gap-[12px] rounded-[12px] text-red-500 hover:text-red-600 hover:bg-red-50 h-[48px] font-medium transition-all"
                        >
                            <LogOut className="h-[20px] w-[20px] stroke-2" />
                            Logout
                        </Button>
                    </form>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto scroll-smooth bg-[#F5F8FA]">
                {children}
            </main>
        </div>
    )
}
