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
      },
    })
    
    // We need to revalidate the course page
    // Needs courseId to revalidate correct path. 
    // Or just revalidate the layout? 
    // We don't have courseId here easily unless passed.
    // We can fetch assignment to get courseId.
    const assignment = await prisma.assignment.findUnique({
      where: { id: assignmentId },
    })
    
    if (assignment) {
      revalidatePath(`/dashboard/student/course/${assignment.courseId}`)
    }
    
    return { success: 'Assignment submitted successfully', error: '' }
  } catch (error) {
    console.error('Failed to submit assignment:', error)
    return { error: 'Failed to submit assignment', success: '' }
  }
}
