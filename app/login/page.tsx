'use client'

import { useState } from 'react'
import Image from 'next/image'
import { useActionState } from 'react'
import { Card, CardHeader, CardContent, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { login } from '@/app/actions/auth'
import { Loader2, ArrowRight } from 'lucide-react'

const initialState = {
    error: '',
}

export default function LoginPage() {
    const [activeTab, setActiveTab] = useState('student')
    const [isAdminPending, setAdminPending] = useState(false)
    const [isStudentPending, setStudentPending] = useState(false)

    // Separate actions for handling pending state correctly if needed, 
    // though useActionState handles it per form mostly. 
    // But since we have one 'login' action that redirects based on role...
    // Actually the login action checks DB. We don't send role from form necessarily?
    // Wait, the previous login action didn't take role. It just checked email/pass.
    // So the tabs are mostly aesthetic/UX to start with, BUT we should probably 
    // hint to the user or pre-validate if we can.
    // For now, let's keep it simple: Both forms call the same login action.
    // The backend handles routing based on the user's actual role.

    const [state, formAction, isPending] = useActionState(login, initialState)

    return (
        <div className="min-h-screen grid lg:grid-cols-2">
            {/* Visual Side (Hidden on Mobile) */}
            <div className={`hidden lg:flex flex-col justify-center items-center p-12 text-white transition-colors duration-500 ${activeTab === 'admin' ? 'bg-[#015A86]' : 'bg-[#0B2E3F]'}`}>
                <div className="max-w-md space-y-8 text-center">
                    {/* Logo on white pill */}
                    <div className="mx-auto bg-white rounded-2xl px-8 py-5 inline-flex shadow-2xl">
                        <Image
                            src="/logo.png"
                            alt="PRISH Payroll Services"
                            width={180}
                            height={70}
                            className="object-contain"
                            priority
                        />
                    </div>
                    <h1 className="text-4xl font-bold font-heading">
                        {activeTab === 'admin' ? 'Admin Portal' : 'Student Learning Hub'}
                    </h1>
                    <p className="text-lg text-white/90">
                        {activeTab === 'admin'
                            ? 'Manage courses, students, and payroll data efficiently.'
                            : 'Access your courses, track progress, and submit assignments with ease.'}
                    </p>
                </div>
            </div>

            {/* Login Form Side */}
            <div className="flex items-center justify-center p-6 bg-background">
                <Card className="w-full max-w-md border-none shadow-none">
                    <CardHeader className="text-center pb-2">
                        {/* Logo visible on mobile / also shown on form side */}
                        <div className="flex justify-center mb-4">
                            <Image
                                src="/logo.png"
                                alt="PRISH Payroll Services"
                                width={140}
                                height={55}
                                className="object-contain"
                                priority
                            />
                        </div>
                        <h2 className="text-2xl font-bold font-heading text-foreground">Welcome Back</h2>
                        <CardDescription>Please sign in to access your account</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Tabs defaultValue="student" className="w-full" onValueChange={setActiveTab}>
                            <TabsList className="grid w-full grid-cols-2 mb-8 h-12">
                                <TabsTrigger
                                    value="student"
                                    className="data-[state=active]:bg-secondary data-[state=active]:text-secondary-foreground text-md font-medium transition-all"
                                >
                                    Student
                                </TabsTrigger>
                                <TabsTrigger
                                    value="admin"
                                    className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground text-md font-medium transition-all"
                                >
                                    Admin
                                </TabsTrigger>
                            </TabsList>

                            {/* Student Form */}
                            <TabsContent value="student">
                                <form action={formAction} className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="s-email">Email Address</Label>
                                        <Input
                                            id="s-email"
                                            name="email"
                                            type="email"
                                            placeholder="student@school.com"
                                            required
                                            className="h-11 focus-visible:ring-secondary"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="s-password">Password</Label>
                                        <Input
                                            id="s-password"
                                            name="password"
                                            type="password"
                                            required
                                            className="h-11 focus-visible:ring-secondary"
                                        />
                                    </div>
                                    {state?.error && (
                                        <div className="p-3 text-sm text-destructive bg-destructive/10 rounded-md font-medium">
                                            {state.error}
                                        </div>
                                    )}
                                    <Button
                                        type="submit"
                                        disabled={isPending}
                                        className="w-full h-11 bg-secondary hover:bg-secondary/90 text-md font-bold"
                                    >
                                        {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Sign In as Student'}
                                    </Button>
                                </form>
                            </TabsContent>

                            {/* Admin Form */}
                            <TabsContent value="admin">
                                <form action={formAction} className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="a-email">Email Address</Label>
                                        <Input
                                            id="a-email"
                                            name="email"
                                            type="email"
                                            placeholder="admin@school.com"
                                            required
                                            className="h-11 focus-visible:ring-primary"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="a-password">Password</Label>
                                        <Input
                                            id="a-password"
                                            name="password"
                                            type="password"
                                            required
                                            className="h-11 focus-visible:ring-primary"
                                        />
                                    </div>
                                    {state?.error && (
                                        <div className="p-3 text-sm text-destructive bg-destructive/10 rounded-md font-medium">
                                            {state.error}
                                        </div>
                                    )}
                                    <Button
                                        type="submit"
                                        disabled={isPending}
                                        className="w-full h-11 bg-primary hover:bg-primary/90 text-md font-bold"
                                    >
                                        {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Sign In as Admin'}
                                    </Button>
                                </form>
                            </TabsContent>
                        </Tabs>
                    </CardContent>
                    <CardFooter className="justify-center">
                        <p className="text-xs text-muted-foreground">
                            Protected by Enterprise Security
                        </p>
                    </CardFooter>
                </Card>
            </div>
        </div>
    )
}
