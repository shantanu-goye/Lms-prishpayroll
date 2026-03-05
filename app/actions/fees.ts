'use server'

import prisma from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

export async function createFee(prevState: any, formData: FormData) {
  const studentId = parseInt(formData.get('studentId') as string)
  const courseId = parseInt(formData.get('courseId') as string)
  const amount = parseFloat(formData.get('amount') as string)
  const dueDate = formData.get('dueDate') as string

  if (!studentId || !amount || !courseId) {
    return { error: 'Student, Course, and Amount are required', success: '' }
  }

  try {
    await prisma.fee.create({
      data: {
        studentId,
        courseId,
        amount,
        dueDate: dueDate ? new Date(dueDate) : null,
        status: 'PAID',
      },
    })
    revalidatePath('/dashboard/admin/fees')
    return { success: 'Fee assigned successfully', error: '' }
  } catch (error) {
    console.error('Failed to assign fee:', error)
    return { error: 'Failed to assign fee', success: '' }
  }
}

export async function updateFeeStatus(id: number, status: string) {
  try {
    await prisma.fee.update({
      where: { id },
      data: { status },
    })
    revalidatePath('/dashboard/admin/fees')
  } catch (error) {
    console.error('Failed to update fee:', error)
  }
}

export async function deleteFee(id: number) {
  try {
    await prisma.fee.delete({
      where: { id },
    })
    revalidatePath('/dashboard/admin/fees')
  } catch (error) {
    console.error('Failed to delete fee:', error)
  }
}
