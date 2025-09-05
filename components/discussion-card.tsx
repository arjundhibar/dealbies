"use client";

import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  MessageSquare,
  Share2,
  MessagesSquare,
  MessageCircle,
} from "lucide-react";
import Link from "next/link";
import { cn, formatRelativeTime } from "@/lib/utils";
import { useData } from "@/lib/data-context";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { useIsMobile } from "@/hooks/use-mobile";
import type { Discussion } from "@/lib/types";

interface DiscussionCardProps {
  discussion: Discussion & {
    _count: {
      comments: number;
      votes: number;
    };
  };
}

export function DiscussionCard({ discussion }: DiscussionCardProps) {
  const {
    id,
    title,
    description,
    category,
    dealCategory,
    createdAt,
    postedBy,
    _count,
    score = 0,
    userVote = null,
  } = discussion;

  const { currentUser } = useData();

  const { toast } = useToast();
  const router = useRouter();
  const isMobile = useIsMobile();

  const postedAtDate = new Date(createdAt);

  // Mobile layout
  if (isMobile) {
    return (
      <Link href={`/discussion/${id}`} className="block group">
        <Card className="overflow-hidden shadow-sm border-none">
          <div className="flex flex-grow-0 w-full">
            {/* Left side - Discussion icon with overlay controls */}
            <div className="relative w-[8rem] bg-[#f3f5f7] dark:bg-[#28292a] flex items-center justify-center pl-3 pr-3">
              {/* Discussion Icon */}
              <div className="relative w-[7rem] h-[7rem] flex items-center justify-center">
                <MessageCircle className="h-16 w-16 text-[#f7641b] dark:text-[#f97936]" />
              </div>

              {/* Top overlay - Score display */}
              <div className="absolute top-2 left-1/2 -translate-x-1/2 z-10 flex items-center bg-[#fff] rounded-full p-1 gap-2 dark:bg-[#1d1f20]">
                <span className="text-lg font-bold text-vote-lightOrange">
                  {score}°
                </span>
              </div>

              {/* Bottom overlay - Actions */}
              <div
                className="absolute bottom-1 text-gray-500 left-[40%] -translate-x-1/2 z-10 flex rounded-full"
                onClick={(e) => e.stopPropagation()}
              >
                <Button
                  variant="ghost"
                  size="icon"
                  className="p-0 font-semibold"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    router.push(`/discussion/${id}#comments`);
                  }}
                >
                  <MessagesSquare className="h-5 w-5 dark:text-[hsla(0,0%,100%,0.75)] dark:hover:text-dealhunter-red" />
                </Button>
                <Button variant="ghost" size="icon" className="p-0">
                  <Share2 className="h-5 w-5 dark:text-[hsla(0,0%,100%,0.75)] dark:hover:text-dealhunter-red" />
                </Button>
              </div>
            </div>

            {/* Right side - Discussion Info */}
            <div className="w-[75%] p-2 flex flex-col dark:bg-[#1d1f20]">
              <div className="flex-grow">
                <div className="flex justify-end mb-6">
                  <div className="text-sm text-muted-foreground pl-[0.5rem] pr-[0.5rem] pb-[0.25rem] pt-[0.25rem] rounded-md dark:bg-[hsla(0,0%,100%,0.11)] dark:text-[hsla(0,0%,100%,0.75)] bg-[#0f375f0d] ">
                    Posted {formatRelativeTime(postedAtDate)}
                  </div>
                </div>

                <h3 className="text-base font-bold mb-1 leading-[1.5rem] group-hover:text-[#f7641b] line-clamp-1">
                  {title}
                </h3>

                <div className="flex items-center gap-2 mb-1 leading-none">
                  <Badge variant="outline" className="text-xs">
                    {category}
                  </Badge>
                  {dealCategory && (
                    <Badge variant="secondary" className="text-xs">
                      {dealCategory}
                    </Badge>
                  )}
                </div>

                <div className="flex items-center text-[12px] gap-1 text-muted-foreground leading-none">
                  <Avatar className="h-5 w-5">
                    <AvatarImage
                      src={
                        postedBy.avatar ||
                        "/placeholder.svg?height=40&width=40&text=U"
                      }
                      alt={postedBy.name}
                      className="h-5 w-5 object-cover"
                    />
                    <AvatarFallback>
                      {postedBy.name.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <span>Posted by</span>
                  <span className="font-medium">{postedBy.name}</span>
                </div>
              </div>

              <Button
                variant="default"
                size="sm"
                className="bg-[#f7641b] hover:bg-[#eb611f] active:bg-[#da5a1c] shadow-[#f7641b] hover:shadow-[#eb611f] rounded-[50vh] min-w-[12.375rem] h-9 px-4 mt-2"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  router.push(`/discussion/${id}`);
                }}
              >
                <span className="flex items-center justify-center">
                  <span className="text-[0.875rem] font-bold text-white">
                    Join Discussion
                  </span>
                  <MessageSquare className="ml-1 h-3 w-3 text-white" />
                </span>
              </Button>
            </div>
          </div>
        </Card>
      </Link>
    );
  }

  // Desktop layout
  return (
    <Link href={`/discussion/${id}`} className="block group">
      <Card className="overflow-hidden shadow-sm hover:shadow-md dark:bg-dark-secondary cursor-pointer min-h-[14.25rem] p-1 border-none">
        <div className="flex">
          {/* Right side - Content */}
          <div className="w-[100%] p-4 flex flex-col">
            {/* Top section with score and posted time */}
            <div className="flex justify-between items-center mb-2 ">
              {/* <Badge variant="outline" className="text-xs">
                {category}
              </Badge> */}
              {dealCategory && (
                <span className="text-xs">
                  {dealCategory}
                </span>
              )}
              {/* Posted time */}
              <div className="text-sm text-muted-foreground pl-[0.5rem] pr-[0.5rem] pb-[0.25rem] pt-[0.25rem] rounded-sm dark:bg-[hsla(0,0%,100%,0.11)] dark:text-[hsla(0,0%,100%,0.75)] bg-[#0f375f0d] ">
                Posted {formatRelativeTime(postedAtDate)}
              </div>
            </div>

            {/* Title */}
            <h3 className="text-lg font-bold group-hover:text-[#f7641b] line-clamp-1">
              {title}
            </h3>

            {/* Categories and Posted By */}
            <div className="flex items-center gap-2 my-2 flex-wrap">
              <div className="flex items-center gap-2"></div>
              <span className="text-gray-500">|</span>
              <div className="flex items-center gap-1 text-sm text-muted-foreground dark:text-[hsla(0,0%,100%,0.75)]">
                <Avatar className="h-5 w-5">
                  <AvatarImage
                    src={
                      postedBy.avatar ||
                      "/placeholder.svg?height=40&width=40&text=U"
                    }
                    alt={postedBy.name}
                    className="h-5 w-5 object-cover"
                  />
                  <AvatarFallback>
                    {postedBy.name.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <span className="font-medium">{postedBy.name}</span>
              </div>
            </div>

            {/* Description */}
            <p className="line-clamp-2 text-sm text-muted-foreground mb-auto">
              {description}
            </p>

            {/* Bottom section with actions */}
            <div className="flex items-center justify-between mt-4 pt-1">
              <div
                className="flex items-center gap-3 "
                onClick={(e) => e.stopPropagation()}
              >
                {/* Comments */}
                <Button
                  variant="ghost"
                  size="sm"
                  className="gap-1 p-0 hover:text-dealhunter-red shadow-none focus:outline-none focus:ring-0"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    router.push(`/discussion/${id}#comments`);
                  }}
                >
                  <MessagesSquare className="h-4 w-4" />
                  <span className="ml-1">{_count.comments}</span>
                </Button>

                {/* Share */}
                <Button
                  variant="ghost"
                  size="sm"
                  className="gap-1 p-0 hover:text-dealhunter-red"
                >
                  <Share2 className="h-4 w-4" />
                </Button>
              </div>

              {/* Join Discussion button */}
              <Button
                variant="default"
                size="sm"
                className="bg-[#f7641b] hover:bg-[#eb611f] active:bg-[#da5a1c] shadow-[#f7641b] hover:shadow-[#eb611f] rounded-[50vh] min-w-[12.375rem] h-9 px-4"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  router.push(`/discussion/${id}`);
                }}
              >
                <span className="flex items-center justify-center">
                  <span className="text-[0.875rem] font-bold text-white">
                    Join Discussion
                  </span>
                  <MessageSquare className="ml-1 h-3 w-3 text-white" />
                </span>
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </Link>
  );
}
