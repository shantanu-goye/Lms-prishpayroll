'use server'

import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'
import { createSession } from '@/lib/auth'
import { redirect } from 'next/navigation'
import prisma from '@/lib/prisma'


export async function login(prevState: any, formData: FormData) {
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  if (!email || !password) {
    return { error: 'Please fill in all fields' }
  }

  const user = await prisma.user.findUnique({
    where: { email },
  })

  if (!user || !(await bcrypt.compare(password, user.password))) {
    return { error: 'Invalid credentials' }
  }

  await createSession({
    userId: user.id,
    role: user.role,
    name: user.name,
  })

  if (user.role === 'ADMIN') {
    redirect('/dashboard/admin')
  } else {
    redirect('/dashboard/student')
  }
}
