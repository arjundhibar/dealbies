import { Card } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import prisma from "@/lib/prisma"
import { formatDistanceToNow } from "date-fns"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export default async function AdminUsers({
  searchParams,
}: {
  searchParams: { page?: string; role?: string }
}) {
  const page = Number(searchParams.page) || 1
  const pageSize = 10
  const skip = (page - 1) * pageSize

  // Get users with pagination
  const users = await prisma.user.findMany({
    skip,
    take: pageSize,
    orderBy: {
      createdAt: "desc",
    },
    where: searchParams.role
      ? {
          role: searchParams.role as any,
        }
      : undefined,
    include: {
      _count: {
        select: {
          deals: true,
          coupons: true,
          comments: true,
        },
      },
    },
  })

  // Get total count for pagination
  const totalUsers = await prisma.user.count({
    where: searchParams.role
      ? {
          role: searchParams.role as any,
        }
      : undefined,
  })

  const totalPages = Math.ceil(totalUsers / pageSize)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Users Management</h1>
        <p className="text-muted-foreground">View all users on the platform.</p>
      </div>

      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Joined</TableHead>
              <TableHead>Deals</TableHead>
              <TableHead>Coupons</TableHead>
              <TableHead>Comments</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell className="flex items-center gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user.avatarUrl || undefined} alt={user.username} />
                    <AvatarFallback>{user.username.charAt(0).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <span className="font-medium">{user.username}</span>
                </TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  <Badge variant={user.role === "ADMIN" ? "default" : "outline"}>{user.role}</Badge>
                </TableCell>
                <TableCell>{formatDistanceToNow(new Date(user.createdAt), { addSuffix: true })}</TableCell>
                <TableCell>{user._count.deals}</TableCell>
                <TableCell>{user._count.coupons}</TableCell>
                <TableCell>{user._count.comments}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
            <a
              key={pageNum}
              href={`/admin/users?page=${pageNum}${searchParams.role ? `&role=${searchParams.role}` : ""}`}
              className={`inline-flex h-8 w-8 items-center justify-center rounded-md text-sm font-medium ${
                pageNum === page
                  ? "bg-primary text-primary-foreground"
                  : "border border-input bg-background hover:bg-accent hover:text-accent-foreground"
              }`}
            >
              {pageNum}
            </a>
          ))}
        </div>
      )}
    </div>
  )
}
