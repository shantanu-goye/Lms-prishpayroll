'use server'

import prisma from '@/lib/prisma'
import bcrypt from 'bcryptjs'
import { revalidatePath } from 'next/cache'
import { sendMail } from '@/lib/mailer'
import { welcomeEmailTemplate } from '@/lib/email-templates'

export async function createStudent(prevState: any, formData: FormData) {
  const name = formData.get('name') as string
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  const phone = formData.get('phone') as string
  const dob = formData.get('dob') as string ? new Date(formData.get('dob') as string) : null
  const employmentStatus = formData.get('employmentStatus') as string
  const address = formData.get('address') as string
  
  const enrollmentsStr = formData.get('enrollments') as string
  let enrollments: { courseId: string; agreedFee: string }[] = []
  if (enrollmentsStr) {
    try {
      enrollments = JSON.parse(enrollmentsStr)
    } catch (e) {
      console.error('Failed to parse enrollments')
    }
  }

  if (!name || !email || !password) {
    return { error: 'Name, email, and password are required', success: '' }
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10)
    
    await prisma.$transaction(async (tx) => {
      // 1. Create User
      const user = await tx.user.create({
        data: {
          name,
          email,
          password: hashedPassword,
          phone,
          dob,
          employmentStatus,
          address,
          role: 'STUDENT',
        },
      })

      // 2. Create Enrollments and Fees
      if (enrollments.length > 0) {
        for (const enrollment of enrollments) {
          const courseId = parseInt(enrollment.courseId)
          const agreedFee = parseFloat(enrollment.agreedFee)
          
          if (!isNaN(courseId) && !isNaN(agreedFee)) {
            // Check if course exists
            const course = await tx.course.findUnique({ where: { id: courseId } })
            if (course) {
              await tx.enrollment.create({
                data: {
                  userId: user.id,
                  courseId: course.id,
                  agreedPrice: agreedFee,
                }
              })
              
              await tx.fee.create({
                data: {
                  studentId: user.id,
                  courseId: course.id,
                  amount: agreedFee,
                  status: 'PENDING',
                }
              })
            }
          }
        }
      }
    })

    // Send welcome email with plain password
    const loginUrl = `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/login`
    await sendMail({
      to: email,
      subject: 'Welcome to Student CRM - Your Account Details',
      html: welcomeEmailTemplate(name, email, password, loginUrl),
    })

    revalidatePath('/dashboard/admin/students')
    return { success: 'Student created successfully', error: '' }
  } catch (error) {
    console.error('Failed to create student:', error)
    return { error: 'Failed to create student. Email might be taken.', success: '' }
  }
}


export async function updateStudent(id: number, prevState: any, formData: FormData) {
  const name = formData.get('name') as string
  const email = formData.get('email') as string
  const phone = formData.get('phone') as string
  const dob = formData.get('dob') as string ? new Date(formData.get('dob') as string) : null
  const employmentStatus = formData.get('employmentStatus') as string
  const address = formData.get('address') as string

  if (!name || !email) {
    return { error: 'Name and Email are required', success: '' }
  }

  try {
    const data: any = {
        name,
        email,
        phone,
        dob,
        employmentStatus,
        address,
    }

    // Only update password if provided
    const password = formData.get('password') as string
    if (password) {
        data.password = await bcrypt.hash(password, 10)
    }

    await prisma.user.update({
      where: { id },
      data,
    })
    revalidatePath('/dashboard/admin/students')
    return { success: 'Student updated successfully', error: '' }
  } catch (error) {
    console.error('Failed to update student:', error)
    return { error: 'Failed to update student', success: '' }
  }
}

export async function deleteStudent(id: number) {
  try {
    await prisma.user.deleteMany({
      where: { id },
    })
    revalidatePath('/dashboard/admin/students')
  } catch (error) {
    console.error('Failed to delete student:', error)
  }
}
