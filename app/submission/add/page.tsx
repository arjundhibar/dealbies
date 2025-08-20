'use client';
import { Card, CardContent } from "@/components/ui/card"
import { ChevronRight, Tag, Scissors, MessageCircle, Lock } from "lucide-react"
import Link from "next/link"
import { useTheme } from "next-themes"
export default function PostDealPage() {
    const { theme } = useTheme()
    const postOptions = [
        {
            id: "offer",
            title: "Offer",
            description: "Put specific products on sale, such as a TV, with or without a discount code.",
            lightMode: {
                topImage: "/assetforDeal.svg",
                bottomImage: "/deal-part1-lightmode.svg",
                topAnimation: "animate-bounce-custom",
                bottomAnimation: "",
            },
            darkMode: {
                topImage: "/assetforDeal.svg",
                bottomImage: "/deal-part1-dark_5940f.svg",
                topAnimation: "animate-bounce-custom",
                bottomAnimation: "",
            },
            icon: Tag,
            href: "/submission/offer",
            available: true,
        },
        {
            id: "discount-code",
            title: "Discount code",
            description: "Post coupons and discount codes that give discounts on products, stores or events.",
            lightMode: {
                images: [
                    { src: "/voucher-part3_1bb21.svg", animation: "animate-voucher-tilt", style: { zIndex: 3 } },
                    { src: "/voucher-part2_6ac93.svg", animation: "animate-voucher-tilt-reverse", style: { zIndex: 2 } },
                    { src: "/voucher-part1-lightmode.svg", animation: "", style: { zIndex: 1 } },
                ],
            },
            darkMode: {
                images: [
                    { src: "/voucher-part3_1bb21.svg", animation: "animate-voucher-tilt", style: { zIndex: 3 } },
                    { src: "/voucher-part2_6ac93.svg", animation: "animate-voucher-tilt-reverse", style: { zIndex: 2 } },
                    { src: "/voucher-part1-dark_01958.svg", animation: "", style: { zIndex: 1 } },
                ],
            },
            icon: Scissors,
            href: "/submission/discount-code",
            available: true,
        },
        {
            id: "discussion",
            title: "Discussion",
            description: "Start a discussion to get tips or advice from a community of thousands of deal experts.",
            lightMode: {
                images: [
                    { src: "/discussion-part3_2f938.svg", animation: "animate-discussion-bounce", style: { zIndex: 3, animationDelay: "-1.5s" } },
                    { src: "/discussion-part2_df4c2.svg", animation: "animate-discussion-bounce", style: { zIndex: 2, animationDelay: "-0.75s" } },
                    { src: "/discussion-part1-lightmode.svg", animation: "", style: { zIndex: 1 } },
                ],
            },
            darkMode: {
                images: [
                    { src: "/discussion-part3_2f938.svg", animation: "animate-discussion-bounce", style: { zIndex: 3, animationDelay: "-1.5s" } },
                    { src: "/discussion-part2_df4c2.svg", animation: "animate-discussion-bounce", style: { zIndex: 2, animationDelay: "-0.75s" } },
                    { src: "/discussion-part1-dark_98cad.svg", animation: "", style: { zIndex: 1 } },
                ],
            },
            icon: MessageCircle,
            href: "/submission/discussion",
            available: true,
        },
        {
            id: "referral",
            title: "Referral action",
            description: "Post your referral code or link so both you and the community can benefit from it.",
            lightMode: {
                images: [
                    { src: "/lock-lighmode.svg", animation: "", style: { zIndex: 1 } },
                ],
            },
            darkMode: {
                images: [
                    { src: "/lock-dark_94cc9.svg", animation: "", style: { zIndex: 1 } },
                ],
            },
            href: "/post/referral",
            available: true,
        },
    ]
    return (
        <>
            {/* Mobile Layout */}
            <div className="min-h-screen w-screen absolute top-0 left-0 bg-white dark:bg-[#1d1f20] flex-col items-center justify-start overflow-y-auto box-border md:hidden p-[1em] pb-[4.5rem]">

                <div className="w-full px-0 space-y-6 flex flex-col items-center">
                    <h1 className="mt-[2.5em] text-[1.5rem] leading-[2.625rem] font-bold text-black dark:text-white text-center antialiased font-['Averta_CY','Helvetica_Neue',Helvetica,Arial,'Lucida_Grande',sans-serif]">
                        What do you want to post?
                    </h1>
                    <div className="space-y-0">
                        {postOptions.map((option, index) => {
                            const IconComponent = option.icon
                            const content = (
                                <Card
                                    key={option.id}
                                    className="w-full mx-auto dark:bg-[#1d1f20] border-[1px] border-[rgba(9,24,47,0.13)] transition-all duration-500 ease-out mb-[0.5em] rounded-2xl items-center no-underline dark:border-[hsla(0,0%,100%,0.18)] flex flex-col hover:dark:bg-[#28292a] hover:bg-accent flex-initial align-[initial] text-inherit min-h-[130px] cursor-pointer animate-fade-in-up"
                                    style={{
                                        animationDelay: `${index * 0.1}s`,
                                        animationFillMode: 'both'
                                    }}
                                >
                                    <CardContent className="pl-[1em] pr-[1em] pt-[1.5em] pb-[1.5em]  min-h-[130px] ">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-start space-x-4">
                                                <div className="flex-shrink-0">
                                                    <div className="flex-shrink-0 relative w-[4.5rem] h-[4.5rem] mt-2 flex items-center justify-center overflow-hidden">
                                                        {((theme === 'dark' ? option.darkMode?.images : option.lightMode?.images)?.length ?? 0) > 0
                                                            ? (theme === 'dark' ? option.darkMode?.images || [] : option.lightMode?.images || []).map((img, idx) => (
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
                                                                        src={theme === 'dark' ? option.darkMode?.topImage : option.lightMode?.topImage}
                                                                        alt={option.title}
                                                                        className={`absolute top-0 left-0 right-0 bottom-0 m-auto max-w-full max-h-full bg-[50%] bg-no-repeat bg-contain will-change-transform ${theme === 'dark' ? option.darkMode?.topAnimation : option.lightMode?.topAnimation}`}
                                                                        style={{ zIndex: 2 }}
                                                                    />
                                                                    <img
                                                                        src={theme === 'dark' ? option.darkMode?.bottomImage : option.lightMode?.bottomImage}
                                                                        alt="Bottom"
                                                                        className={`absolute top-0 left-0 right-0 bottom-0 m-auto max-w-full max-h-full bg-[50%] bg-no-repeat bg-contain will-change-transform ${theme === 'dark' ? option.darkMode?.bottomAnimation : option.lightMode?.bottomAnimation}`}
                                                                        style={{ zIndex: 1 }}
                                                                    />
                                                                </>
                                                            )
                                                        }
                                                    </div>
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center justify-between gap-2 mb-1">
                                                        <div className="flex items-center gap-2">
                                                            <h3 className="text-[1.25rem] font-semibold outline-none stroke-none text-[#000] dark:text-[#fff] font-['Averta_CY','Helvetica_Neue',Helvetica,Arial,'Lucida_Grande',sans-serif]">{option.title}</h3>
                                                        </div>
                                                        {option.id === 'referral' ? (
                                                            <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-200 bg-white dark:bg-[#1d1f20] border border-[rgba(9,24,47,0.13)] dark:border-[hsla(0,0%,100%,0.18)] referral-arrow-btn hidden" />
                                                        ) : (
                                                            <div className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 custom-button hidden" />
                                                        )}
                                                    </div>
                                                    <p className="text-[rgba(4,8,13,0.59)] dark:text-[hsla(0,0%,100%,0.75)] text-[0.875rem] leading-5 font-['Averta_CY','Helvetica_Neue',Helvetica,Arial,'Lucida_Grande',sans-serif]">{option.description}</p>
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

            {/* Desktop Layout (unchanged) */}
            <div className="min-h-screen w-screen fixed inset-0 bg-white dark:bg-[#1d1f20] flex items-center justify-center overflow-hidden box-border hidden md:flex pb-[4.5rem]">
                <div className="w-[670px] px-0 space-y-6">
                    <h1 className="text-[2rem] leading-[2.625rem] font-bold text-black dark:text-white text-center !mt-[2.55em] mb-4 antialiased font-['Averta_CY','Helvetica_Neue',Helvetica,Arial,'Lucida_Grande',sans-serif]">
                        What do you want to post?
                    </h1>

                    <div className="space-y-4">
                        {postOptions.map((option, index) => {
                            const IconComponent = option.icon
                            const content = (
                                <Card
                                    key={option.id}
                                    className="w-[440px] mx-auto dark:bg-[#1d1f20] border-[1px] border-[rgba(9,24,47,0.13)] transition-all duration-500 ease-out mb-[0.5em] rounded-2xl items-center no-underline dark:border-[hsla(0,0%,100%,0.18)] flex flex-col hover:dark:bg-[#28292a] hover:bg-accent flex-initial align-[initial] text-inherit min-h-[150px] cursor-pointer animate-fade-in-up"
                                    style={{
                                        animationDelay: `${index * 0.1}s`,
                                        animationFillMode: 'both'
                                    }}
                                >
                                    <CardContent className="pl-[1em] pr-[1em] pt-[1.5em] pb-[1.5em] min-h-[150px] ">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-start space-x-4">
                                                <div className="flex-shrink-0">
                                                    <div className="flex-shrink-0 relative w-[5.5rem] h-[5.5rem] mt-2 flex items-center justify-center overflow-hidden mb-2">
                                                        {((theme === 'dark' ? option.darkMode?.images : option.lightMode?.images)?.length ?? 0) > 0
                                                            ? (theme === 'dark' ? option.darkMode?.images || [] : option.lightMode?.images || []).map((img, idx) => (
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
                                                                        src={theme === 'dark' ? option.darkMode?.topImage : option.lightMode?.topImage}
                                                                        alt={option.title}
                                                                        className={`absolute top-0 left-0 right-0 bottom-0 m-auto max-w-full max-h-full bg-[50%] bg-no-repeat bg-contain will-change-transform ${theme === 'dark' ? option.darkMode?.topAnimation : option.lightMode?.topAnimation}`}
                                                                        style={{ zIndex: 2 }}
                                                                    />
                                                                    <img
                                                                        src={theme === 'dark' ? option.darkMode?.bottomImage : option.lightMode?.bottomImage}
                                                                        alt="Bottom"
                                                                        className={`absolute top-0 left-0 right-0 bottom-0 m-auto max-w-full max-h-full bg-[50%] bg-no-repeat bg-contain will-change-transform ${theme === 'dark' ? option.darkMode?.bottomAnimation : option.lightMode?.bottomAnimation}`}
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
                                                        {option.id === 'referral' ? (
                                                            <div
                                                                className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-200 bg-white dark:bg-[#1d1f20] border border-[rgba(9,24,47,0.13)] dark:border-[hsla(0,0%,100%,0.18)] referral-arrow-btn"
                                                            >
                                                                <ChevronRight className="w-5 h-5" />
                                                            </div>
                                                        ) : (
                                                            <div className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 custom-button">
                                                                <ChevronRight className="w-5 h-5 text-white" />
                                                            </div>
                                                        )}
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
        </>
    )
}