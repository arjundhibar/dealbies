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
import { AdminDealActions } from "@/components/admin/admin-deal-actions";

export default async function AdminDeals({
  searchParams,
}: {
  searchParams: { page?: string; category?: string };
}) {
  const page = Number(searchParams.page) || 1;
  const pageSize = 10;
  const skip = (page - 1) * pageSize;

  // Get deals with pagination
  const rawDeals = await prisma.deal.findMany({
    skip,
    take: pageSize,
    orderBy: {
      createdAt: "desc",
    },
    where: searchParams.category
      ? { category: searchParams.category }
      : undefined,
    include: {
      user: { select: { username: true } },
      _count: { select: { comments: true, votes: true } },
    },
  });

  // Convert Decimal fields to number
  const deals = rawDeals.map((deal) => ({
    ...deal,
    price: deal.price.toNumber(),
    originalPrice: deal.originalPrice?.toNumber?.() ?? null,
  }));

  // Get total count for pagination
  const totalDeals = await prisma.deal.count({
    where: searchParams.category
      ? {
          category: searchParams.category,
        }
      : undefined,
  });

  const totalPages = Math.ceil(totalDeals / pageSize);

  // Get categories for filter
  const categories = await prisma.deal.groupBy({
    by: ["category"],
    _count: {
      category: true,
    },
    orderBy: {
      _count: {
        category: "desc",
      },
    },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Deals Management</h1>
          <p className="text-muted-foreground">
            Manage all deals on the platform.
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/deals/new">
            <Plus className="mr-2 h-4 w-4" />
            Add New Deal
          </Link>
        </Button>
      </div>

      <div className="flex flex-wrap gap-2">
        <Link href="/admin/deals">
          <Badge
            variant={!searchParams.category ? "default" : "outline"}
            className="cursor-pointer"
          >
            All
          </Badge>
        </Link>
        {categories.map((cat) => (
          <Link
            key={cat.category}
            href={`/admin/deals?category=${cat.category}`}
          >
            <Badge
              variant={
                searchParams.category === cat.category ? "default" : "outline"
              }
              className="cursor-pointer"
            >
              {cat.category} ({cat._count.category})
            </Badge>
          </Link>
        ))}
      </div>

      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Merchant</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Posted By</TableHead>
              <TableHead>Posted</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {deals.map((deal) => (
              <TableRow key={deal.id}>
                <TableCell className="font-medium">
                  <Link
                    href={`/deals/${deal.slug || deal.id}`}
                    className="hover:underline"
                    target="_blank"
                  >
                    {deal.title}
                  </Link>
                </TableCell>
                <TableCell>₹{deal.price.toFixed(2)}</TableCell>
                <TableCell>{deal.merchant}</TableCell>
                <TableCell>{deal.category}</TableCell>
                <TableCell>{deal.user.username}</TableCell>
                <TableCell>
                  {formatDistanceToNow(new Date(deal.createdAt), {
                    addSuffix: true,
                  })}
                </TableCell>
                <TableCell>
                  {deal.expiresAt ? (
                    <Badge variant="destructive">Expired</Badge>
                  ) : (
                    <Badge variant="outline">Active</Badge>
                  )}
                </TableCell>
                <TableCell>
                  <AdminDealActions deal={deal} />
                </TableCell>
              </TableRow>
            ))}
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
                href={`/admin/deals?page=${pageNum}${
                  searchParams.category
                    ? `&category=${searchParams.category}`
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
