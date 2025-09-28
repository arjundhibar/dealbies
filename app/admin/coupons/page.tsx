import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import prisma from "@/lib/prisma";
import { formatDistanceToNow } from "date-fns";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Plus } from "lucide-react";
import { AdminCouponActions } from "@/components/admin/admin-coupon-actions";

export default async function AdminCoupons({
  searchParams,
}: {
  searchParams: { page?: string; merchant?: string };
}) {
  const page = Number(searchParams.page) || 1;
  const pageSize = 10;
  const skip = (page - 1) * pageSize;

  // Get coupons with pagination
  const coupons = await prisma.coupon.findMany({
    skip,
    take: pageSize,
    orderBy: {
      createdAt: "desc",
    },
    where: searchParams.merchant
      ? {
          merchant: searchParams.merchant,
        }
      : undefined,
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
  });

  // Get total count for pagination
  const totalCoupons = await prisma.coupon.count({
    where: searchParams.merchant
      ? {
          merchant: searchParams.merchant,
        }
      : undefined,
  });

  const totalPages = Math.ceil(totalCoupons / pageSize);

  // Get merchants for filter
  const merchants = await prisma.coupon.groupBy({
    by: ["merchant"],
    _count: {
      merchant: true,
    },
    orderBy: {
      _count: {
        merchant: "desc",
      },
    },
    take: 10, // Limit to top 10 merchants
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Coupons Management</h1>
          <p className="text-muted-foreground">
            Manage all coupons on the platform.
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/coupons/new">
            <Plus className="mr-2 h-4 w-4" />
            Add New Coupon
          </Link>
        </Button>
      </div>

      <div className="flex flex-wrap gap-2">
        <Link href="/admin/coupons">
          <Badge
            variant={!searchParams.merchant ? "default" : "outline"}
            className="cursor-pointer"
          >
            All
          </Badge>
        </Link>
        {merchants.map((m) => (
          <Link key={m.merchant} href={`/admin/coupons?merchant=${m.merchant}`}>
            <Badge
              variant={
                searchParams.merchant === m.merchant ? "default" : "outline"
              }
              className="cursor-pointer"
            >
              {m.merchant} ({m._count.merchant})
            </Badge>
          </Link>
        ))}
      </div>

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
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {coupons.map((coupon) => {
              const isExpired = new Date(coupon.expiresAt) < new Date();

              return (
                <TableRow key={coupon.id}>
                  <TableCell className="font-mono uppercase">
                    {coupon.code}
                  </TableCell>
                  <TableCell className="font-medium">
                    <Link
                      href={`/coupons/${coupon.slug || coupon.id}`}
                      className="hover:underline"
                      target="_blank"
                    >
                      {coupon.title}
                    </Link>
                  </TableCell>
                  <TableCell>{coupon.merchant}</TableCell>
                  <TableCell>{coupon.user.username}</TableCell>
                  <TableCell>
                    {formatDistanceToNow(new Date(coupon.createdAt), {
                      addSuffix: true,
                    })}
                  </TableCell>
                  <TableCell>
                    {isExpired ? (
                      <Badge variant="destructive">Expired</Badge>
                    ) : (
                      <Badge variant="outline">
                        {formatDistanceToNow(new Date(coupon.expiresAt), {
                          addSuffix: true,
                        })}
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    <AdminCouponActions coupon={coupon} />
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </Card>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(
            (pageNum) => (
              <Link
                key={pageNum}
                href={`/admin/coupons?page=${pageNum}${
                  searchParams.merchant
                    ? `&merchant=${searchParams.merchant}`
                    : ""
                }`}
              >
                <Button
                  variant={pageNum === page ? "default" : "outline"}
                  size="sm"
                  className="h-8 w-8 p-0"
                >
                  {pageNum}
                </Button>
              </Link>
            )
          )}
        </div>
      )}
    </div>
  );
}
