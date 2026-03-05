'use server'

import prisma from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { verifySession } from '@/lib/auth'
import { writeFile, mkdir } from 'fs/promises'
import path from 'path'

export async function submitAssignment(prevState: any, formData: FormData) {
  const assignmentId = parseInt(formData.get('assignmentId') as string)
  const file = formData.get('file') as File

  if (!assignmentId || !file) {
    return { error: 'Assignment and File are required', success: '' }
  }

  const session = await verifySession()
  if (!session || session.role !== 'STUDENT') {
    return { error: 'Unauthorized', success: '' }
  }

  try {
    const buffer = Buffer.from(await file.arrayBuffer())
    const filename = `${Date.now()}_${file.name.replace(/\s+/g, '_')}`
    const uploadDir = path.join(process.cwd(), 'public/uploads')
    
    await mkdir(uploadDir, { recursive: true })
    await writeFile(path.join(uploadDir, filename), buffer)

    const filePath = `/uploads/${filename}`

    await prisma.submission.create({
      data: {
        assignmentId,
        studentId: session.userId,
        filePath,
        status: 'PENDING',
      },
    })
    
    const assignment = await prisma.assignment.findUnique({
      where: { id: assignmentId },
      include: { module: true },
    })
    
    if (assignment) {
      revalidatePath(`/dashboard/student/course/${assignment.module.courseId}`)
    }
    
    return { success: 'Assignment submitted successfully', error: '' }
  } catch (error) {
    console.error('Failed to submit assignment:', error)
    return { error: 'Failed to submit assignment', success: '' }
  }
}

export async function updateSubmissionStatus(submissionId: number, status: string, courseId: number) {
  const session = await verifySession()
  if (!session || session.role !== 'ADMIN') {
    return { error: 'Unauthorized' }
  }

  try {
    await prisma.submission.update({
      where: { id: submissionId },
      data: { status },
    })
    revalidatePath(`/dashboard/admin/courses/${courseId}`)
    return { success: `Submission ${status.toLowerCase()} successfully` }
  } catch (error) {
    console.error('Failed to update submission status:', error)
    return { error: 'Failed to update submission status' }
  }
}
