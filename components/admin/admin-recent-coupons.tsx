import { Card } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import prisma from "@/lib/prisma"
import { formatDistanceToNow } from "date-fns"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"

export async function AdminRecentCoupons() {
  const coupons = await prisma.coupon.findMany({
    take: 5,
    orderBy: {
      createdAt: "desc",
    },
    include: {
      user: {
        select: {
          username: true,
        },
      },
      _count: {
        select: {
          comments: true,
          votes: true,
        },
      },
    },
  })

  return (
    <Card>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Code</TableHead>
            <TableHead>Title</TableHead>
            <TableHead>Merchant</TableHead>
            <TableHead>Posted By</TableHead>
            <TableHead>Posted</TableHead>
            <TableHead>Expires</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {coupons.map((coupon) => {
            const isExpired = new Date(coupon.expiresAt) < new Date()

            return (
              <TableRow key={coupon.id}>
                <TableCell className="font-mono uppercase">{coupon.code}</TableCell>
                <TableCell className="font-medium">
                  <Link href={`/admin/coupons/${coupon.id}`} className="hover:underline">
                    {coupon.title}
                  </Link>
                </TableCell>
                <TableCell>{coupon.merchant}</TableCell>
                <TableCell>{coupon.user.username}</TableCell>
                <TableCell>{formatDistanceToNow(new Date(coupon.createdAt), { addSuffix: true })}</TableCell>
                <TableCell>
                  {isExpired ? (
                    <Badge variant="destructive">Expired</Badge>
                  ) : (
                    <Badge variant="outline">
                      {formatDistanceToNow(new Date(coupon.expiresAt), { addSuffix: true })}
                    </Badge>
                  )}
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </Card>
  )
}
