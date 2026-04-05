import { Suspense } from 'react'
import prisma from '@/lib/prisma'
import { verifySession } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import VerifySubmissionButton from '@/app/ui/admin/verify-submission-button'
import { ExternalLink } from 'lucide-react'
import SubmissionRow from './submission-row'

async function getAllSubmissions() {
  const session = await verifySession()
  if (!session || session.role !== 'ADMIN') {
    redirect('/')
  }

  const submissions = await prisma.submission.findMany({
    include: {
      student: true,
      assignment: {
        include: {
          module: {
            include: {
              course: true
            }
          }
        }
      }
    },
    orderBy: {
      submittedAt: 'desc'
    }
  })

  return submissions
}

function SubmissionsTable({ submissions, statusFilter }: { submissions: any[], statusFilter: string }) {
  const filteredSubmissions = statusFilter === 'ALL'
    ? submissions
    : submissions.filter(s => s.status === statusFilter)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Submissions ({filteredSubmissions.length})</CardTitle>
        <CardDescription>
          {statusFilter === 'ALL' ? 'All submissions' : `${statusFilter} submissions`}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Student</TableHead>
              <TableHead>Assignment</TableHead>
              <TableHead>Course</TableHead>
              <TableHead>Submitted</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>File</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredSubmissions.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center text-gray-500">
                  No submissions found
                </TableCell>
              </TableRow>
            ) : (
              filteredSubmissions.map((submission) => (
                <SubmissionRow key={submission.id} submission={submission} />
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}

export default async function SubmissionsPage() {
  const submissions = await getAllSubmissions()

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">All Submissions</h1>
        <p className="text-gray-600">View and manage all student assignment submissions across all courses</p>
      </div>

      <Tabs defaultValue="ALL" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="ALL">All ({submissions.length})</TabsTrigger>
          <TabsTrigger value="PENDING">
            Pending ({submissions.filter(s => s.status === 'PENDING').length})
          </TabsTrigger>
          <TabsTrigger value="VERIFIED">
            Verified ({submissions.filter(s => s.status === 'VERIFIED').length})
          </TabsTrigger>
          <TabsTrigger value="REJECTED">
            Rejected ({submissions.filter(s => s.status === 'REJECTED').length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="ALL">
          <SubmissionsTable submissions={submissions} statusFilter="ALL" />
        </TabsContent>
        <TabsContent value="PENDING">
          <SubmissionsTable submissions={submissions} statusFilter="PENDING" />
        </TabsContent>
        <TabsContent value="VERIFIED">
          <SubmissionsTable submissions={submissions} statusFilter="VERIFIED" />
        </TabsContent>
        <TabsContent value="REJECTED">
          <SubmissionsTable submissions={submissions} statusFilter="REJECTED" />
        </TabsContent>
      </Tabs>
    </div>
  )
}