'use server'

import prisma from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

export async function createModule(prevState: any, formData: FormData) {
  const title = formData.get('title') as string
  const courseId = parseInt(formData.get('courseId') as string)

  if (!title || !courseId) {
    return { error: 'Title and Course are required', success: '' }
  }

  try {
    const maxOrder = await prisma.module.aggregate({
      where: { courseId },
      _max: { order: true },
    })
    const nextOrder = (maxOrder._max.order ?? -1) + 1

    await prisma.module.create({
      data: {
        title,
        courseId,
        order: nextOrder,
      },
    })
    revalidatePath(`/dashboard/admin/courses/${courseId}`)
    return { success: 'Module created successfully', error: '' }
  } catch (error) {
    console.error('Failed to create module:', error)
    return { error: 'Failed to create module', success: '' }
  }
}

export async function deleteModule(moduleId: number, courseId: number) {
  try {
    await prisma.module.delete({
      where: { id: moduleId },
    })
    revalidatePath(`/dashboard/admin/courses/${courseId}`)
  } catch (error) {
    console.error('Failed to delete module:', error)
  }
}
