import { logout } from '@/lib/auth'
import { redirect } from 'next/navigation'
import Sidebar from '@/app/ui/dashboard/sidebar'

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const navItems = [
        { label: 'Overview', href: '/dashboard/admin', iconName: 'LayoutDashboard' },
        { label: 'Students', href: '/dashboard/admin/students', iconName: 'Users' },
        { label: 'Courses', href: '/dashboard/admin/courses', iconName: 'BookOpen' },
        { label: 'Fees', href: '/dashboard/admin/fees', iconName: 'CreditCard' },
    ]

    const handleLogout = async () => {
        'use server'
        await logout()
        redirect('/')
    }

    return (
        <div className="flex h-screen bg-[#F5F8FA] overflow-hidden">
            <Sidebar
                navItems={navItems}
                logoutAction={handleLogout}
                headerIconName="ShieldCheck"
                headerTitle="Admin"
                headerSubtitle="Management"
            />

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto scroll-smooth bg-[#F5F8FA]">
                {children}
            </main>
        </div>
    )
}
