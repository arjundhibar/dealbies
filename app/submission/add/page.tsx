import { Card, CardContent } from "@/components/ui/card"
import { ChevronRight, Tag, Scissors, MessageCircle, Lock } from "lucide-react"
import Link from "next/link"
export default function PostDealPage() {
    const postOptions = [
        {
            id: "offer",
            title: "Offer",
            description: "Put specific products on sale, such as a TV, with or without a discount code.",
            icon: Tag,
            href: "/post/offer",
            available: true,
        },
        {
            id: "discount-code",
            title: "Discount code",
            description: "Post coupons and discount codes that give discounts on products, stores or events.",
            icon: Scissors,
            href: "/post/discount-code",
            available: true,
        },
        {
            id: "discussion",
            title: "Discussion",
            description: "Start a discussion to get tips or advice from a community of thousands of deal experts.",
            icon: MessageCircle,
            href: "/post/discussion",
            available: true,
        },
        {
            id: "referral",
            title: "Referral action",
            description: "Post your referral code or link so both you and the community can benefit from it.",
            icon: Lock,
            href: "/post/referral",
            available: false,
            badge: "Closed",
        },
    ]
    return (
        <div className="flex justify-center items-center bg-white dark:bg-[#1d1f20] min-h-screen w-full h-full z !m-0 !p-0 fixed inset-0">
            <div className="w-full max-w-2xl space-y-6">
                <h1 className="mt-[1.5em] text-[2rem] font-bold text-white text-center mb-8 font-['Averta_CY','Helvetica_Neue',Helvetica,Arial,'Lucida_Grande',sans-serif]">
                    What do you want to post?
                </h1>

                <div className="space-y-4">
                    {postOptions.map((option) => {
                        const IconComponent = option.icon
                        const content = (
                            <Card
                                key={option.id}
                                className="bg-gray-800 border-gray-700 hover:bg-gray-750 transition-colors cursor-pointer"
                            >
                                <CardContent className="p-6">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-start space-x-4">
                                            <div className="flex-shrink-0">
                                                <div className="w-12 h-12 bg-orange-500/20 rounded-lg flex items-center justify-center">
                                                    <IconComponent className="w-6 h-6 text-orange-500" />
                                                </div>
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <h3 className="text-lg font-semibold text-white">{option.title}</h3>
                                                    {option.badge && (
                                                        <span className="px-2 py-1 text-xs font-medium bg-gray-600 text-gray-300 rounded">
                                                            {option.badge}
                                                        </span>
                                                    )}
                                                </div>
                                                <p className="text-gray-300 text-sm leading-relaxed">{option.description}</p>
                                            </div>
                                        </div>
                                        <div className="flex-shrink-0 ml-4">
                                            <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center">
                                                <ChevronRight className="w-5 h-5 text-white" />
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        )

                        if (option.available) {
                            return (
                                <Link key={option.id} href={option.href}>
                                    {content}
                                </Link>
                            )
                        } else {
                            return (
                                <div key={option.id} className="opacity-60 cursor-not-allowed">
                                    {content}
                                </div>
                            )
                        }
                    })}
                </div>
            </div>
        </div>
    )
}