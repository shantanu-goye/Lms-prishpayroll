import nodemailer from 'nodemailer'
import prisma from '@/lib/prisma'
import { decrypt } from '@/lib/crypto'

interface EmailOptions {
  to: string
  subject: string
  html: string
}

export async function sendMail({ to, subject, html }: EmailOptions) {
  try {
    // Get SMTP settings from database
    const smtpEmailSetting = await prisma.setting.findUnique({
      where: { key: 'SMTP_EMAIL' },
    })

    const smtpPasswordSetting = await prisma.setting.findUnique({
      where: { key: 'SMTP_PASSWORD' },
    })

    if (!smtpEmailSetting || !smtpPasswordSetting) {
      console.error('SMTP settings not configured')
      return false
    }

    const smtpEmail = smtpEmailSetting.value
    const smtpPassword = decrypt(smtpPasswordSetting.value)

    // Create transporter
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: smtpEmail,
        pass: smtpPassword,
      },
    })

    // Send email
    const info = await transporter.sendMail({
      from: `"Student CRM" <${smtpEmail}>`,
      to,
      subject,
      html,
    })

    console.log('Email sent:', info.messageId)
    return true
  } catch (error) {
    console.error('Failed to send email:', error)
    return false
  }
}