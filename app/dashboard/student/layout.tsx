import { logout } from '@/lib/auth'
import { redirect } from 'next/navigation'
import Sidebar from '@/app/ui/dashboard/sidebar'

export default function StudentLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const navItems = [
        { label: 'My Courses', href: '/dashboard/student', iconName: 'BookOpen' },
        { label: 'Assignments', href: '/dashboard/student/assignments', iconName: 'FileText' },
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
                headerIconName="GraduationCap"
                headerTitle="Portal"
                headerSubtitle="Learning Hub"
            />

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto scroll-smooth bg-[#F5F8FA]">
                {children}
            </main>
        </div>
    )
}
