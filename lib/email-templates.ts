// Email templates for the Student CRM system

export function welcomeEmailTemplate(name: string, email: string, password: string, loginUrl: string) {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Welcome to Student CRM</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #2563eb; color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; background: #f8f9fa; }
        .credentials { background: #e3f2fd; padding: 15px; border-left: 4px solid #2563eb; margin: 20px 0; }
        .button { display: inline-block; background: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
        .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Welcome to Student CRM!</h1>
        </div>
        <div class="content">
          <h2>Hello ${name},</h2>
          <p>Your student account has been created successfully. You can now access your dashboard to view your courses, assignments, and fees.</p>

          <div class="credentials">
            <h3>Your Login Credentials:</h3>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Password:</strong> ${password}</p>
            <p style="color: #d32f2f;"><em>Please save these credentials securely and change your password after first login.</em></p>
          </div>

          <p>
            <a href="${loginUrl}" class="button">Login to Your Account</a>
          </p>

          <p>If you have any questions, please contact your administrator.</p>
        </div>
        <div class="footer">
          <p>This email was sent by Student CRM System</p>
        </div>
      </div>
    </body>
    </html>
  `
}

export function submissionFeedbackEmailTemplate(studentName: string, assignmentTitle: string, status: string, feedback: string) {
  const statusColor = status === 'VERIFIED' ? '#4caf50' : status === 'REJECTED' ? '#f44336' : '#ff9800'

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Assignment Feedback</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #2563eb; color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; background: #f8f9fa; }
        .status { background: ${statusColor}; color: white; padding: 10px; text-align: center; font-weight: bold; margin: 20px 0; }
        .feedback { background: #fff3cd; padding: 15px; border-left: 4px solid #ffc107; margin: 20px 0; }
        .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Assignment Feedback</h1>
        </div>
        <div class="content">
          <h2>Hello ${studentName},</h2>
          <p>Your submission for "<strong>${assignmentTitle}</strong>" has been reviewed.</p>

          <div class="status">
            Status: ${status}
          </div>

          ${feedback ? `
          <div class="feedback">
            <h3>Feedback from Instructor:</h3>
            <p>${feedback.replace(/\n/g, '<br>')}</p>
          </div>
          ` : ''}

          <p>Please check your dashboard for more details.</p>
        </div>
        <div class="footer">
          <p>This email was sent by Student CRM System</p>
        </div>
      </div>
    </body>
    </html>
  `
}

export function feeReminderEmailTemplate(studentName: string, courseTitle: string, amount: number, dueDate: string) {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Fee Payment Reminder</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #f44336; color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; background: #f8f9fa; }
        .amount { background: #ffebee; padding: 15px; border-left: 4px solid #f44336; margin: 20px 0; text-align: center; }
        .button { display: inline-block; background: #f44336; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
        .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Fee Payment Reminder</h1>
        </div>
        <div class="content">
          <h2>Hello ${studentName},</h2>
          <p>This is a reminder about your outstanding fee for the course "<strong>${courseTitle}</strong>".</p>

          <div class="amount">
            <h3>Amount Due: $${amount.toFixed(2)}</h3>
            <p><strong>Due Date:</strong> ${dueDate}</p>
          </div>

          <p>Please make your payment as soon as possible to avoid any delays in your course progress.</p>

          <p>Contact your administrator for payment instructions.</p>
        </div>
        <div class="footer">
          <p>This email was sent by Student CRM System</p>
        </div>
      </div>
    </body>
    </html>
  `
}

export function enrollmentConfirmationEmailTemplate(studentName: string, courseTitle: string, startDate?: string) {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Enrollment Confirmation</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #4caf50; color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; background: #f8f9fa; }
        .course-info { background: #e8f5e8; padding: 15px; border-left: 4px solid #4caf50; margin: 20px 0; }
        .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Enrollment Confirmed!</h1>
        </div>
        <div class="content">
          <h2>Hello ${studentName},</h2>
          <p>Congratulations! You have been successfully enrolled in the following course:</p>

          <div class="course-info">
            <h3>Course: ${courseTitle}</h3>
            ${startDate ? `<p><strong>Start Date:</strong> ${startDate}</p>` : ''}
          </div>

          <p>You can now access your course materials, assignments, and track your progress through your student dashboard.</p>

          <p>Welcome to the course! If you have any questions, please contact your instructor.</p>
        </div>
        <div class="footer">
          <p>This email was sent by Student CRM System</p>
        </div>
      </div>
    </body>
    </html>
  `
}