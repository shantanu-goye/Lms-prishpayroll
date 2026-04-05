'use server'

import prisma from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { verifySession } from '@/lib/auth'
import { uploadToS3 } from '@/lib/s3'
import path from 'path'
import { sendMail } from '@/lib/mailer'
import { submissionFeedbackEmailTemplate } from '@/lib/email-templates'

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
    // 1. Validate File type
    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'image/jpeg',
      'image/png'
    ]
    const allowedExtensions = ['.pdf', '.doc', '.docx', '.jpg', '.jpeg', '.png']
    const fileExtension = path.extname(file.name).toLowerCase()

    if (!allowedTypes.includes(file.type) && !allowedExtensions.includes(fileExtension)) {
      return { error: 'Invalid file type. Allowed: PDF, DOC, DOCX, JPG, PNG', success: '' }
    }

    // 2. Upload to S3
    const { url } = await uploadToS3(file, 'submissions')
    const filePath = url

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
      revalidatePath('/dashboard/student/assignments')
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

export async function updateSubmissionFeedback(submissionId: number, feedback: string, status: string, courseId: number) {
  const session = await verifySession()
  if (!session || session.role !== 'ADMIN') {
    return { error: 'Unauthorized' }
  }

  try {
    const updatedSubmission = await prisma.submission.update({
      where: { id: submissionId },
      data: { feedback, status },
      include: {
        student: true,
        assignment: true,
      },
    })

    // Send feedback email to student
    await sendMail({
      to: updatedSubmission.student.email,
      subject: `Assignment Feedback: ${updatedSubmission.assignment.title}`,
      html: submissionFeedbackEmailTemplate(
        updatedSubmission.student.name,
        updatedSubmission.assignment.title,
        status,
        feedback
      ),
    })

    revalidatePath(`/dashboard/admin/courses/${courseId}`)
    revalidatePath('/dashboard/student/assignments')
    revalidatePath('/dashboard/admin/submissions')
    return { success: 'Feedback updated successfully' }
  } catch (error) {
    console.error('Failed to update submission feedback:', error)
    return { error: 'Failed to update submission feedback' }
  }
}
