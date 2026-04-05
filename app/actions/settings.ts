'use server'

import prisma from '@/lib/prisma'
import { encrypt, decrypt } from '@/lib/crypto'
import { revalidatePath } from 'next/cache'
import { verifySession } from '@/lib/auth'

export async function getSettings() {
  const session = await verifySession()
  if (!session || session.role !== 'ADMIN') {
    throw new Error('Unauthorized')
  }

  try {
    const settings = await prisma.setting.findMany()
    const result: Record<string, string> = {}

    for (const setting of settings) {
      if (setting.key === 'SMTP_PASSWORD') {
        result[setting.key] = decrypt(setting.value)
      } else {
        result[setting.key] = setting.value
      }
    }

    return result
  } catch (error) {
    console.error('Failed to get settings:', error)
    return {}
  }
}

export async function saveSettings(prevState: any, formData: FormData) {
  const session = await verifySession()
  if (!session || session.role !== 'ADMIN') {
    return { error: 'Unauthorized', success: '' }
  }

  const smtpEmail = formData.get('smtpEmail') as string
  const smtpPassword = formData.get('smtpPassword') as string

  if (!smtpEmail || !smtpPassword) {
    return { error: 'Both email and password are required', success: '' }
  }

  try {
    await prisma.setting.upsert({
      where: { key: 'SMTP_EMAIL' },
      update: { value: smtpEmail },
      create: { key: 'SMTP_EMAIL', value: smtpEmail },
    })

    const encryptedPassword = encrypt(smtpPassword)
    await prisma.setting.upsert({
      where: { key: 'SMTP_PASSWORD' },
      update: { value: encryptedPassword },
      create: { key: 'SMTP_PASSWORD', value: encryptedPassword },
    })

    revalidatePath('/dashboard/admin/settings')
    return { success: 'Settings saved successfully', error: '' }
  } catch (error) {
    console.error('Failed to save settings:', error)
    return { error: 'Failed to save settings', success: '' }
  }
}