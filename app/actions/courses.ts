'use server'

import prisma from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { verifySession } from '@/lib/auth'

export async function createCourse(prevState: any, formData: FormData) {
  const title = formData.get('title') as string
  const description = formData.get('description') as string
  const price = parseFloat(formData.get('price') as string) || 0

  if (!title) {
    return { error: 'Title is required', success: '' }
  }

  const session = await verifySession()
  if (!session || session.role !== 'ADMIN') {
    return { error: 'Unauthorized', success: '' }
  }

  try {
    await prisma.course.create({
      data: {
        title,
        description,
        price,
        instructorId: session.userId,
      },
    })
    revalidatePath('/dashboard/admin/courses')
    return { success: 'Course created successfully', error: '' }
  } catch (error) {
    console.error('Failed to create course:', error)
    return { error: 'Failed to create course', success: '' }
  }
}

export async function updateCourse(id: number, prevState: any, formData: FormData) {
  const title = formData.get('title') as string
  const description = formData.get('description') as string
  const price = parseFloat(formData.get('price') as string) || 0

  if (!title) {
    return { error: 'Title is required', success: '' }
  }

  try {
    await prisma.course.update({
      where: { id },
      data: {
        title,
        description,
        price,
      },
    })
    revalidatePath('/dashboard/admin/courses')
    return { success: 'Course updated successfully', error: '' }
  } catch (error) {
    console.error('Failed to update course:', error)
    return { error: 'Failed to update course', success: '' }
  }
}

export async function deleteCourse(id: number) {
  try {
    await prisma.course.deleteMany({
      where: { id },
    })
    revalidatePath('/dashboard/admin/courses')
  } catch (error) {
    console.error('Failed to delete course:', error)
  }
}
