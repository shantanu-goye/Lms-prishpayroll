'use server'

import prisma from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { sendMail } from '@/lib/mailer'
import { enrollmentConfirmationEmailTemplate } from '@/lib/email-templates'

export async function enrollStudent(prevState: any, formData: FormData) {
  const courseId = parseInt(formData.get('courseId') as string)
  const userId = parseInt(formData.get('userId') as string)

  if (!courseId || !userId) {
    return { error: 'Course and Student are required', success: '' }
  }

  try {
    const course = await prisma.course.findUnique({ where: { id: courseId } })
    if (!course) return { error: 'Course not found', success: '' }

    const student = await prisma.user.findUnique({ where: { id: userId } })
    if (!student) return { error: 'Student not found', success: '' }

    await prisma.$transaction(async (tx) => {
      await tx.enrollment.create({
        data: {
          courseId,
          userId,
          agreedPrice: course.price,
        },
      })

      await tx.fee.create({
        data: {
          studentId: userId,
          courseId,
          amount: course.price,
          status: 'PENDING',
        },
      })
    })

    // Send enrollment confirmation email
    await sendMail({
      to: student.email,
      subject: `Enrollment Confirmed: ${course.title}`,
      html: enrollmentConfirmationEmailTemplate(student.name, course.title),
    })

    revalidatePath(`/dashboard/admin/courses/${courseId}`)
    revalidatePath('/dashboard/student/fees')
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
