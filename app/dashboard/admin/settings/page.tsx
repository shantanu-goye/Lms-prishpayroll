'use client'

import { useState, useEffect } from 'react'
import { saveSettings, getSettings } from '@/app/actions/settings'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Eye, EyeOff } from 'lucide-react'

export default function SettingsPage() {
  const [smtpEmail, setSmtpEmail] = useState('')
  const [smtpPassword, setSmtpPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    async function loadSettings() {
      try {
        const settings = await getSettings()
        setSmtpEmail(settings.SMTP_EMAIL || '')
        if (settings.SMTP_PASSWORD) {
          setSmtpPassword('••••••••') // Mask the password
        }
      } catch (err) {
        console.error('Failed to load settings:', err)
      }
    }
    loadSettings()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setMessage('')
    setError('')

    const formData = new FormData()
    formData.append('smtpEmail', smtpEmail)
    formData.append('smtpPassword', smtpPassword === '••••••••' ? '' : smtpPassword)

    const result = await saveSettings({}, formData)

    if (result.success) {
      setMessage(result.success)
      if (smtpPassword !== '••••••••') {
        setSmtpPassword('••••••••')
      }
    } else {
      setError(result.error)
    }

    setIsLoading(false)
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600">Configure email settings for automated notifications</p>
      </div>

      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle>Gmail SMTP Configuration</CardTitle>
          <CardDescription>
            Configure your Gmail account to send automated emails. You need to generate an App Password from your Google Account settings.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4 p-4 border border-blue-200 bg-blue-50 rounded-md">
            <p className="text-blue-800">
              <strong>Important:</strong> Use a Gmail App Password, not your regular password.
              Enable 2FA on your Google Account first, then generate an App Password at{' '}
              <a href="https://myaccount.google.com/apppasswords" target="_blank" rel="noopener noreferrer" className="underline text-blue-600">
                myaccount.google.com/apppasswords
              </a>
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="smtpEmail">Gmail Address</Label>
              <Input
                id="smtpEmail"
                type="email"
                value={smtpEmail}
                onChange={(e) => setSmtpEmail(e.target.value)}
                placeholder="your-email@gmail.com"
                required
              />
            </div>

            <div>
              <Label htmlFor="smtpPassword">App Password</Label>
              <div className="relative">
                <Input
                  id="smtpPassword"
                  type={showPassword ? 'text' : 'password'}
                  value={smtpPassword}
                  onChange={(e) => setSmtpPassword(e.target.value)}
                  placeholder="Enter 16-character app password"
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>

            {message && (
              <div className="p-4 border border-green-200 bg-green-50 rounded-md mb-4">
                <p className="text-green-800">{message}</p>
              </div>
            )}

            {error && (
              <div className="p-4 border border-red-200 bg-red-50 rounded-md mb-4">
                <p className="text-red-800">{error}</p>
              </div>
            )}

            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Saving...' : 'Save Settings'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}