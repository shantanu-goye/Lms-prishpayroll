'use server'

import prisma from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

export async function enrollStudent(prevState: any, formData: FormData) {
  const courseId = parseInt(formData.get('courseId') as string)
  const userId = parseInt(formData.get('userId') as string)

  if (!courseId || !userId) {
    return { error: 'Course and Student are required', success: '' }
  }

  try {
    await prisma.enrollment.create({
      data: {
        courseId,
        userId,
      },
    })
    revalidatePath(`/dashboard/admin/courses/${courseId}`)
    return { success: 'Student enrolled successfully', error: '' }
  } catch (error) {
    console.error('Failed to enroll student:', error)
    return { error: 'Failed to enroll student', success: '' }
  }
}

export async function unenrollStudent(enrollmentId: number, courseId: number) {
  try {
    await prisma.enrollment.delete({
      where: { id: enrollmentId },
    })
    revalidatePath(`/dashboard/admin/courses/${courseId}`)
  } catch (error) {
    console.error('Failed to unenroll student:', error)
  }
}
