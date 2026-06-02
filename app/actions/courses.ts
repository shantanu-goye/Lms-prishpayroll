'use server'

import prisma from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { verifySession } from '@/lib/auth'
import { uploadToS3 } from '@/lib/s3'

export async function createCourse(prevState: any, formData: FormData) {
  const title = formData.get('title') as string
  const description = formData.get('description') as string
  const price = parseFloat(formData.get('price') as string) || 0
  const materialFile = formData.get('materialPdf') as File

  if (!title) {
    return { error: 'Title is required', success: '' }
  }

  const session = await verifySession()
  if (!session || session.role !== 'ADMIN') {
    return { error: 'Unauthorized', success: '' }
  }

  try {
    let materialPdfUrl = null
    if (materialFile && materialFile.size > 0) {
      const upload = await uploadToS3(materialFile, 'course-materials')
      materialPdfUrl = upload.url
    }

    await prisma.course.create({
      data: {
        title,
        description,
        price,
        materialPdfUrl,
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
  const materialFile = formData.get('materialPdf') as File

  if (!title) {
    return { error: 'Title is required', success: '' }
  }

  try {
    let materialPdfUrl = undefined
    if (materialFile && materialFile.size > 0) {
      const upload = await uploadToS3(materialFile, 'course-materials')
      materialPdfUrl = upload.url
    }

    await prisma.course.update({
      where: { id },
      data: {
        title,
        description,
        price,
        ...(materialPdfUrl && { materialPdfUrl }),
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
