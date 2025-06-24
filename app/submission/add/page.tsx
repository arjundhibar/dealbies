import { Card, CardContent } from "@/components/ui/card"
import { ChevronRight, Tag, Scissors, MessageCircle, Lock } from "lucide-react"
import Link from "next/link"
export default function PostDealPage() {
    const postOptions = [
        {
            id: "offer",
            title: "Offer",
            description: "Put specific products on sale, such as a TV, with or without a discount code.",
            topImage: "/assetforDeal.svg",
            topAnimation: "animate-bounce-custom",
            bottomImage: "/deal-part1-dark_5940f.svg",
            bottomAnimation: "",
            icon: Tag,
            href: "/post/offer",
            available: true,
        },
        {
            id: "discount-code",
            title: "Discount code",
            description: "Post coupons and discount codes that give discounts on products, stores or events.",
            images: [
                { src: "/voucher-part3_1bb21.svg", animation: "animate-voucher-tilt", style: { zIndex: 3 } },
                { src: "/voucher-part2_6ac93.svg", animation: "animate-voucher-tilt-reverse", style: { zIndex: 2 } },
                { src: "/voucher-part1-dark_01958.svg", animation: "", style: { zIndex: 1 } },
            ],
            icon: Scissors,
            href: "/post/discount-code",
            available: true,
        },
        {
            id: "discussion",
            title: "Discussion",
            description: "Start a discussion to get tips or advice from a community of thousands of deal experts.",
            images: [
                { src: "/discussion-part3_2f938.svg", animation: "animate-discussion-bounce", style: { zIndex: 3, animationDelay: "-1.5s" } },
                { src: "/discussion-part2_df4c2.svg", animation: "animate-discussion-bounce", style: { zIndex: 2, animationDelay: "-0.75s" } },
                { src: "/discussion-part1-dark_98cad.svg", animation: "", style: { zIndex: 1 } },
            ],
            icon: MessageCircle,
            href: "/post/discussion",
            available: true,
        },
        {
            id: "referral",
            title: "Referral action",
            description: "Post your referral code or link so both you and the community can benefit from it.",
            images: [
                { src: "/lock-dark_94cc9.svg", animation: "", style: { zIndex: 1 } },
            ],
            href: "/post/referral",
            available: true,
        },
    ]
    return (
        <div className="flex justify-center items-center bg-white dark:bg-[#1d1f20] min-h-screen w-full h-full z !m-0 !p-0 fixed inset-0">
            <div className="w-full max-w-2xl space-y-6">
                <h1 className="mt-[1.75em] text-[2rem] text-[#000] font-bold line-[2.625rem] mb-4 font-inherit  text-center text-align-inherit font-['Averta_CY','Helvetica_Neue',Helvetica,Arial,'Lucida_Grande',sans-serif] outline-none vertical-align:inherit shrink-0">
                    What do you want to post?
                </h1>

                <div className="space-y-4">
                    {postOptions.map((option) => {
                        const IconComponent = option.icon
                        const content = (
                            <Card
                                key={option.id}
                                className="w-[66%] mx-auto dark:bg-[#1d1f20] border-[1px] border-[rgba(9,24,47,0.13)] transition-colors cursor-pointer mb-[0.5em] rounded-2xl items-center no-underline dark:border-[hsla(0,0%,100%,0.18)] flex flex-col hover:dark:bg-[#28292a] hover:bg-accent flex-initial align-[initial] text-inherit min-h-[150px] cursor-pointer"
                            >
                                <CardContent className="pl-[1em] pr-[1em] pt-[1.5em] pb-[1.5em] min-h-[150px] ">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-start space-x-4">
                                            <div className="flex-shrink-0">
                                                <div className="flex-shrink-0 relative w-[5.5rem] h-[5.5rem] flex items-center justify-center overflow-hidden mb-2">
                                                    {option.images
                                                        ? option.images.map((img, idx) => (
                                                            <img
                                                                key={img.src}
                                                                src={img.src}
                                                                alt={option.title}
                                                                className={`absolute top-0 left-0 right-0 bottom-0 m-auto max-w-full max-h-full bg-[50%] bg-no-repeat bg-contain will-change-transform ${img.animation}`}
                                                                style={
                                                                    img.style && 'animationDelay' in img.style
                                                                        ? { zIndex: img.style.zIndex, animationDelay: (img.style as any).animationDelay }
                                                                        : { zIndex: img.style.zIndex }
                                                                }
                                                            />
                                                        ))
                                                        : (
                                                            <>
                                                                <img
                                                                    src={option.topImage}
                                                                    alt={option.title}
                                                                    className={`absolute top-0 left-0 right-0 bottom-0 m-auto max-w-full max-h-full bg-[50%] bg-no-repeat bg-contain will-change-transform ${option.topAnimation}`}
                                                                    style={{ zIndex: 2 }}
                                                                />
                                                                <img
                                                                    src={option.bottomImage}
                                                                    alt="Bottom"
                                                                    className={`absolute top-0 left-0 right-0 bottom-0 m-auto max-w-full max-h-full bg-[50%] bg-no-repeat bg-contain will-change-transform ${option.bottomAnimation}`}
                                                                    style={{ zIndex: 1 }}
                                                                />
                                                            </>
                                                        )
                                                    }
                                                </div>
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center justify-between gap-2 mb-2">
                                                    <div className="flex items-center gap-2">
                                                        <h3 className="text-[1.25rem] font-semibold outline-none stroke-none text-[#000] dark:text-[#fff] font-['Averta_CY','Helvetica_Neue',Helvetica,Arial,'Lucida_Grande',sans-serif]">{option.title}</h3>
                                                    </div>
                                                    <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center flex-shrink-0">
                                                        <ChevronRight className="w-5 h-5 text-white" />
                                                    </div>
                                                </div>
                                                <p className="text-[rgba(4,8,13,0.59)] dark:text-[hsla(0,0%,100%,0.75)] text-base leading-normal font-['Averta_CY','Helvetica_Neue',Helvetica,Arial,'Lucida_Grande',sans-serif]">{option.description}</p>
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