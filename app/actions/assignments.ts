'use server'

import prisma from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { uploadToS3 } from '@/lib/s3'

export async function createAssignment(prevState: any, formData: FormData) {
  const title = formData.get('title') as string
  const description = formData.get('description') as string
  const dueDate = formData.get('dueDate') as string
  const moduleId = parseInt(formData.get('moduleId') as string)
  const courseId = parseInt(formData.get('courseId') as string)

  if (!title || !moduleId) {
    return { error: 'Title and Module are required', success: '' }
  }

  try {
    let fileUrl = null
    const file = formData.get('file') as File
    if (file && file.size > 0) {
      const uploadResult = await uploadToS3(file, 'assignments')
      fileUrl = uploadResult.url
    }

    await prisma.assignment.create({
      data: {
        title,
        description,
        fileUrl,
        dueDate: dueDate ? new Date(dueDate) : null,
        moduleId,
      },
    })
    revalidatePath(`/dashboard/admin/courses/${courseId}`)
    return { success: 'Assignment created successfully', error: '' }
  } catch (error) {
    console.error('Failed to create assignment:', error)
    return { error: 'Failed to create assignment', success: '' }
  }
}

export async function updateAssignment(id: number, courseId: number, prevState: any, formData: FormData) {
    const title = formData.get('title') as string
    const description = formData.get('description') as string
    const dueDate = formData.get('dueDate') as string

    if (!title) {
        return { error: 'Title is required', success: '' }
    }

    try {
        let fileUrl = undefined
        const file = formData.get('file') as File
        if (file && file.size > 0) {
            const uploadResult = await uploadToS3(file, 'assignments')
            fileUrl = uploadResult.url
        }

        await prisma.assignment.update({
            where: { id },
            data: {
                title,
                description,
                fileUrl,
                dueDate: dueDate ? new Date(dueDate) : null,
            },
        })
        revalidatePath(`/dashboard/admin/courses/${courseId}`)
        return { success: 'Assignment updated successfully', error: '' }
    } catch (error) {
        console.error('Failed to update assignment:', error)
        return { error: 'Failed to update assignment', success: '' }
    }
}

export async function deleteAssignment(id: number, courseId: number) {
  try {
    await prisma.assignment.delete({
      where: { id },
    })
    revalidatePath(`/dashboard/admin/courses/${courseId}`)
  } catch (error) {
    console.error('Failed to delete assignment:', error)
  }
}
