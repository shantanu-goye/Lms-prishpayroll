'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import {
    ChevronLeft,
    ChevronRight,
    LogOut,
    LucideIcon
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface NavItem {
    label: string
    href: string
    icon: LucideIcon
}

interface SidebarProps {
    navItems: NavItem[]
    logoutAction: () => Promise<void>
    headerIcon: LucideIcon
    headerTitle: string
    headerSubtitle: string
}

export default function Sidebar({
    navItems,
    logoutAction,
    headerIcon: HeaderIcon,
    headerTitle,
    headerSubtitle
}: SidebarProps) {
    const [isCollapsed, setIsCollapsed] = useState(false)
    const pathname = usePathname()

    return (
        <aside
            className={cn(
                "bg-white flex flex-col z-10 border-r border-[#E5E7EB] transition-all duration-300 relative",
                isCollapsed ? "w-[80px]" : "w-[280px]"
            )}
        >
            {/* Toggle Button */}
            <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsCollapsed(!isCollapsed)}
                className="absolute -right-3 top-8 h-6 w-6 rounded-full border border-[#E5E7EB] bg-white shadow-sm hover:bg-[#F5F8FA] z-20"
            >
                {isCollapsed ? (
                    <ChevronRight className="h-4 w-4 text-[#015A86]" />
                ) : (
                    <ChevronLeft className="h-4 w-4 text-[#015A86]" />
                )}
            </Button>

            <div className={cn("p-[32px] pb-[16px]", isCollapsed && "p-[20px]")}>
                <div className="flex items-center gap-[12px] px-[8px]">
                    <div className="h-[40px] w-[40px] min-w-[40px] bg-[#015A86] rounded-[12px] flex items-center justify-center shadow-md">
                        <HeaderIcon className="h-[24px] w-[24px] text-white stroke-2" />
                    </div>
                    {!isCollapsed && (
                        <div className="overflow-hidden whitespace-nowrap">
                            <h1 className="text-[20px] font-bold text-[#0B2E3F] tracking-tight leading-none">{headerTitle}</h1>
                            <p className="text-[12px] uppercase font-bold text-[#FD8B0A] tracking-widest mt-[4px]">{headerSubtitle}</p>
                        </div>
                    )}
                </div>
            </div>

            <nav className="mt-[16px] flex-1 px-[16px] space-y-[8px]">
                {navItems.map((item) => {
                    const isActive = pathname === item.href
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "flex items-center gap-[12px] px-[16px] py-[12px] text-[14px] font-medium rounded-[12px] transition-all duration-200 group relative",
                                isActive
                                    ? "text-[#015A86] bg-[#F5F8FA]"
                                    : "text-[#0B2E3F] hover:text-[#015A86] hover:bg-[#F5F8FA]",
                                isCollapsed && "justify-center px-0"
                            )}
                        >
                            <item.icon
                                className={cn(
                                    "h-[20px] w-[20px] transition-colors stroke-2",
                                    isActive ? "text-[#FD8B0A]" : "text-[#015A86] group-hover:text-[#FD8B0A]"
                                )}
                            />
                            {!isCollapsed && <span>{item.label}</span>}

                            {/* Tooltip for collapsed mode */}
                            {isCollapsed && (
                                <div className="absolute left-full ml-4 px-2 py-1 bg-black text-white text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50">
                                    {item.label}
                                </div>
                            )}
                        </Link>
                    )
                })}
            </nav>

            <div className={cn("p-[24px] mt-auto", isCollapsed && "p-[16px]")}>
                <Separator className="mb-[24px] bg-[#E5E7EB]" />
                <form action={logoutAction}>
                    <Button
                        variant="ghost"
                        className={cn(
                            "w-full justify-start gap-[12px] rounded-[12px] text-red-500 hover:text-red-600 hover:bg-red-50 h-[48px] font-medium transition-all",
                            isCollapsed && "justify-center px-0"
                        )}
                    >
                        <LogOut className="h-[20px] w-[20px] stroke-2" />
                        {!isCollapsed && <span>Logout</span>}
                    </Button>
                </form>
            </div>
        </aside>
    )
}
