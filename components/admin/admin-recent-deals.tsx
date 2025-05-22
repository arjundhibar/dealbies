import { Card } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import prisma from "@/lib/prisma"
import { formatDistanceToNow } from "date-fns"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"

export async function AdminRecentDeals() {
  const deals = await prisma.deal.findMany({
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
            <TableHead>Title</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Merchant</TableHead>
            <TableHead>Posted By</TableHead>
            <TableHead>Posted</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {deals.map((deal) => (
            <TableRow key={deal.id}>
              <TableCell className="font-medium">
                <Link href={`/admin/deals/${deal.id}`} className="hover:underline">
                  {deal.title}
                </Link>
              </TableCell>
              <TableCell>₹{deal.price.toFixed(2)}</TableCell>
              <TableCell>{deal.merchant}</TableCell>
              <TableCell>{deal.user.username}</TableCell>
              <TableCell>{formatDistanceToNow(new Date(deal.createdAt), { addSuffix: true })}</TableCell>
              <TableCell>
                {deal.expired ? <Badge variant="destructive">Expired</Badge> : <Badge variant="outline">Active</Badge>}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  )
}
