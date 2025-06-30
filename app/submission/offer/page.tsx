"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Link2, Sparkles, ImageIcon, FileText, Eye, ListCheck, CircleCheck, Pencil, MapPin, Info, Scissors } from "lucide-react"
import { cn } from "@/lib/utils"
import { url } from "inspector"
import { NextResponse } from "next/server"
import { formatDistanceStrict } from "date-fns"

interface DuplicateDeal {
    title: string;
    image: string;
    price?: string;
    merchant?: string;
    createdAt?: string;
}

export default function PostOfferPage() {
    const [currentStep, setCurrentStep] = useState(0)
    const [linkValue, setLinkValue] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const [duplicateDeal, setDuplicateDeal] = useState<DuplicateDeal | null>(null)
    const [progressWidth, setProgressWidth] = useState(0)
    const [hoveredStep, setHoveredStep] = useState<number | null>(null)

    const [title, setTitle] = useState("")
    const [titleFocused, setTitleFocused] = useState(false)
    const [priceOffer, setPriceOffer] = useState("")
    const [lowestPrice, setLowestPrice] = useState("")
    const [discountCode, setDiscountCode] = useState("")
    const [availability, setAvailability] = useState("online")
    const [postageCosts, setPostageCosts] = useState("")
    const [shippingFrom, setShippingFrom] = useState("")

    const steps = [
        {
            id: "link",
            title: "Link",
            icon: Link2,
            completed: false,
        },
        {
            id: "essentials",
            title: "Essentials",
            icon: Sparkles,
            completed: false,
        },
        {
            id: "image-gallery",
            title: "Image gallery",
            icon: ImageIcon,
            completed: false,
        },
        {
            id: "description",
            title: "Description",
            icon: FileText,
            completed: false,
        },
        {
            id: "final-details",
            title: "Final details",
            icon: ListCheck,
            completed: false,
        },
        {
            id: "check",
            title: "Check",
            icon: Eye,
            completed: false,
        },
    ]

    useEffect(() => {
        if (isLoading) {
            setProgressWidth(0)
            const timer = window.setTimeout(() => {
                setProgressWidth(100)
            }, 100)
            return () => window.clearTimeout(timer)
        } else {
            setProgressWidth(0)
        }
    }, [isLoading])

    const handleNext = () => {
        if (currentStep < steps.length - 1) {
            setCurrentStep(currentStep + 1)
        }
    }

    const handleBack = () => {
        if (currentStep > 0) {
            setCurrentStep(currentStep - 1)
        }
    }

    const handleProceedAnyway = () => {
        setDuplicateDeal(null)
        handleNext()
    }

    const handleCancelSubmission = () => {
        setDuplicateDeal(null)
        setLinkValue("")
    }

    const handleContinue = async () => {
        setIsLoading(true)
        setDuplicateDeal(null)
        const encodedUrl = encodeURIComponent(linkValue.trim());
        try {
            const res = await fetch(`/api/deals/check?url=${encodedUrl}`);
            const result = await res.json();

            if (result.exists) {
                setDuplicateDeal({
                    title: result.deal.title || "Deal Title",
                    image: result.deal.image || "/placeholder.jpg",
                    price: result.deal.price,
                    merchant: result.deal.merchant,
                    createdAt: result.deal.createdAt
                })
            } else {
                handleNext();
            }
        } catch (error) {
            alert("Something went wrong while checking the deal.");
            console.error(error);
        } finally {
            setIsLoading(false)
        }
    }
    const calculateDiscount = () => {
        const offer = Number.parseFloat(priceOffer) || 0
        const lowest = Number.parseFloat(lowestPrice) || 0
        if (lowest > 0) {
            return Math.round(((lowest - offer) / lowest) * 100)
        }
        return 0
    }

    const renderStepContent = () => {
        switch (currentStep) {
            case 0:
                return (
                    <div className="flex flex-col items-center justify-center flex-1 !m-0 !p-0 animate-fade-in-up" style={{ animationDelay: '0.1s', animationFillMode: 'both' }}>
                        <div className="w-full max-w-2xl text-center space-y-8">
                            <div className="space-y-4">
                                <h1 className="text-[32px] leading-[2.625rem] font-poppins font-medium text-[#000] dark:text-[#fff]">Share an offer with millions of people</h1>
                                <p className="text-2xl font-poppins text-[rgba(4,8,13,0.59)] dark:text-[hsla(0,0%,100%,0.75)]">
                                    Paste the link where other people can buy the deal or find more information
                                </p>
                            </div>

                            <div className="space-y-6">
                                {/* Flex container for input + button */}
                                <div className="flex items-center space-x-3">
                                    {/* Input with icon */}
                                    <div className="relative flex-1">
                                        <Link2 className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                                        <Input
                                            type="url"
                                            placeholder="https://www.example.com/greatdeal..."
                                            value={linkValue}
                                            onChange={(e) => setLinkValue(e.target.value)}
                                            className="w-full h-auto text-sm leading-5 bg-[#fff] dark:bg-[#1d1f20] border border-[rgba(3,12,25,0.23)] dark:border-[hsla(0,0%,100%,0.35)] dark:text-white text-[#000] placeholder:text-gray-400 focus:border-[#f97936] focus:shadow-none rounded-lg transition-all duration-200 ease-out py-[9px] pl-10 text-ellipsis"
                                        />
                                    </div>

                                    {/* Button */}
                                    <Button
                                        onClick={handleContinue}
                                        disabled={!linkValue.trim() || isLoading}
                                        className="h-9 px-4 text-sm rounded-full bg-[#f7641b] hover:bg-[#eb611f] text-white disabled:text-[#a7a9ac] dark:disabled:text-[#8b8d90] disabled:bg-[#f3f5f7] dark:disabled:bg-[#363739]"
                                    >
                                        {isLoading ? "Checking..." : "Continue"}
                                    </Button>
                                </div>

                                {/* Progress Bar - moved below textbox */}
                                {isLoading && (
                                    <div className="w-full bg-gray-700 rounded-full h-2 overflow-hidden">
                                        <div className="bg-[#f7641b] h-2 rounded-full transition-all duration-2000 ease-out" style={{ width: `${progressWidth}%` }}></div>
                                    </div>
                                )}

                                {/* Duplicate Deal Warning */}
                                {duplicateDeal && (
                                    <div className="bg-[#28292a] rounded-lg p-4 space-y-4">
                                        <div className=" space-y-2 text-left">
                                            <h3 className="text-lg font-bold text-white">Has this been posted before?</h3>
                                            <p className="text-gray-300 text-base text-left">
                                                It looks like this offer has already been posted or is being reviewed. Duplicate deals are usually removed.
                                            </p>
                                        </div>

                                        {/* Deal Preview */}
                                        <div className="dark:bg-[#1d1f20] p-2 rounded-lg flex items-center space-x-4 relative">
                                            <div className="relative w-16 h-16">
                                                <img
                                                    src={duplicateDeal.image}
                                                    alt={duplicateDeal.title}
                                                    className="absolute top-0 left-0 right-0 bottom-0 max-w-full max-h-full m-auto align-top box-content object-fill rounded-lg h-12 w-12"
                                                />
                                            </div>
                                            <div className="flex-1">
                                                <h4 className="text-white font-medium text-base text-left">{duplicateDeal.title}</h4>
                                                <div className="flex items-center space-x-2 mt-1 gap-1">
                                                    {duplicateDeal.price && (
                                                        <span className="dark:text-[#f97936] text-base font-medium">₹{duplicateDeal.price}</span>
                                                    )}
                                                    {duplicateDeal.merchant && (
                                                        <span className="dark:text-[#f97936] text-base">{duplicateDeal.merchant}</span>
                                                    )}
                                                    {duplicateDeal.createdAt && (
                                                        <span className="dark:text-[hsla(0,0%,100%,0.75)] text-base">{formatDistanceStrict(new Date(duplicateDeal.createdAt), new Date(), { addSuffix: true })}</span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Action Buttons */}
                                        <div className="flex justify-end">
                                            <Button
                                                onClick={handleProceedAnyway}
                                                className=" h-9 text-sm dark:bg-transparent dark:hover:bg-[hsla(0,0%,100%,0.05)] dark:text-[#c5c7ca] mr-2 pl-3 pr-3 rounded-full"
                                            >
                                                No, proceed to the next step
                                            </Button>
                                            <Button
                                                onClick={handleCancelSubmission}
                                                variant="outline"
                                                className=" h-9 text-sm border dark:border-[#fd9997] dark:hover:border-[#fc8988]  dark:bg-[#1d1f20] dark:text-[#fd9997] dark:hover:text-[#fc8988] dark:hover:bg-[#4c0a11] mr-2 pl-[1em] pr-3 rounded-full"
                                            >
                                                Yes, cancel the submission
                                            </Button>
                                        </div>
                                    </div>
                                )}

                                {/* Link below input */}
                                {currentStep === 0 && !isLoading && !duplicateDeal && (
                                    <button className="text-[#6b6d70] hover:text-[#76787b] dark:text-[#c5c7ca] h-9 px-4 dark:hover:text-[#babcbf] hover:bg-[rgba(15,55,95,0.05)] dark:hover:bg-[hsla(0,0%,100%,0.05)] hover:rounded-full text-sm font-semibold">
                                        I have no link
                                    </button>
                                )}
                            </div>

                        </div>
                    </div>
                )
            case 1:
                return (
                    <div
                        className="flex flex-col justify-start flex-1 animate-fade-in-up px-8 py-8"
                        style={{ animationDelay: "0.1s", animationFillMode: "both" }}
                    >
                        <div className="w-full max-w-2xl mx-auto space-y-8">
                            <h1 className="text-3xl font-semibold text-[#000] dark:text-[#fff] text-center mb-8">
                                Let's start with the essential information
                            </h1>

                            {/* Title Section */}
                            <div className="">
                                <div className="flex justify-between items-center">
                                    <label className="text-white text-sm font-semibold pb-[1.75px]">
                                        Title of offer <span className="dark:text-[hsla(0,0%,100%,0.75)] font-normal">(required)</span>
                                    </label>
                                    <span className="dark:text-[hsla(0,0%,100%,0.75)] text-sm">{140 - title.length}</span>
                                </div>
                                <Input
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    placeholder="A short, clear title of your offer"
                                    className="w-full border text-white dark:bg-[#1d1f20] dark:text-white dark:focus:ring-0 placeholder:text-gray-400 rounded-lg pt-2 pb-2 pl-4 pr-4 dark:focus:border-[#f97936]"
                                    onFocus={() => setTitleFocused(true)}
                                    onBlur={() => setTitleFocused(false)}
                                />

                                {/* Help Section - styled to match provided HTML, with expand animation */}
                                <div
                                    className={cn(
                                        'transition-[height] duration-300 ease-in-out overflow-hidden',
                                        !titleFocused && 'expand-leave-to'
                                    )}
                                    style={{ height: titleFocused ? 110 : 0 }}
                                >
                                    <div className="mt-2 dark:bg-[#363739] rounded-lg px-4 py-3 flex flex-col gap-1">
                                        <div className="flex items-center">
                                            <div className="flex items-center mr-1">
                                                <Info className="w-[18px] h-[18px] text-[hsla(0,0%,100%,0.75)]" />
                                            </div>
                                            <span className="font-semibold text-base text-[#e3e4e8] dark:text-[#e3e4e8]">Make your title stand out</span>
                                        </div>
                                        <div className="text-sm leading-5 text-[hsla(0,0%,100%,0.75)] mt-1">
                                            Please include the brand, product type, color and model in the title (e.g. adidas UltraBoost (black))
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Price Details Section */}
                            <div className="">
                                <h2 className="text-xl font-semibold dark:text-white text-black pb-4">Price details</h2>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="dark:text-white text-black font-semibold text-sm">Price Offer</label>
                                        <div className="relative">
                                            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">€</span>
                                            <Input
                                                value={priceOffer}
                                                onChange={(e) => setPriceOffer(e.target.value)}
                                                placeholder="15,55"
                                                className="w-full border text-black dark:bg-[#1d1f20] dark:text-white dark:focus:ring-0 text-sm placeholder:text-gray-400 rounded-lg pt-2 pb-2 pl-9 pr-4 dark:focus:border-[#f97936]"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="dark:text-white text-black font-semibold text-sm">Lowest price elsewhere</label>
                                        <div className="relative flex-1">
                                            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">€</span>
                                            <Input
                                                value={lowestPrice}
                                                onChange={(e) => setLowestPrice(e.target.value)}
                                                placeholder="0.00"
                                                className="w-full border text-white dark:bg-[#1d1f20] dark:text-white dark:focus:ring-0 placeholder:text-gray-400 rounded-lg pt-2 pb-2 pl-9 pr-12 dark:focus:border-[#f97936]"
                                            />
                                            <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-xs font-semibold px-2 py-0.5 rounded bg-[#f3f5f7] dark:bg-[#23272f] text-[#f7641b] dark:text-[#f97936]">{calculateDiscount()}%</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Discount Code Section */}
                            <div className="space-y-2">
                                <label className="text-white text-sm font-semibold">Discount code</label>
                                <div className="relative">
                                    <Scissors className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                                    <Input
                                        value={discountCode}
                                        onChange={(e) => setDiscountCode(e.target.value)}
                                        placeholder="Enter the discount code"
                                        className="w-full border text-white dark:bg-[#1d1f20] dark:text-white dark:focus:ring-0 placeholder:text-gray-400 rounded-lg pt-2 pb-2 pl-4 pr-4 dark:focus:border-[#f97936]"
                                    />
                                </div>
                            </div>

                            {/* Availability Section */}
                            <div className="space-y-4">
                                <h2 className="text-xl font-semibold text-white">Availability</h2>
                                <div className="flex w-full">
                                    <Button
                                        onClick={() => setAvailability("online")}
                                        className={cn(
                                            "flex-1 py-3 border",
                                            availability === "online"
                                                ? "dark:bg-[#481802] hover:bg-orange-700 dark:text-[#f97936] dark:border-[#f97936] dark:hover:border-[#f7641b] dark:hover:text-[#f7641b] dark:hover:bg-[#612203]"
                                                : "dark:bg-[#1d1f20] dark:hover:bg-[#1d1f20] dark:text-white dark:hover:border-[#525457] dark:hover:text-[#f97936]",
                                            "rounded-l-full",
                                            "rounded-r-none",

                                        )}
                                    >
                                        Online
                                    </Button>
                                    <Button
                                        onClick={() => setAvailability("offline")}
                                        className={cn(
                                            "flex-1 py-3 border",
                                            availability === "offline"
                                                ? "dark:bg-[#481802] hover:bg-orange-700 dark:text-[#f97936] dark:border-[#f97936] dark:hover:border-[#f7641b] dark:hover:text-[#f7641b] dark:hover:bg-[#612203]"
                                                : "dark:bg-[#1d1f20] dark:hover:bg-[#1d1f20] dark:text-white dark:hover:border-[#525457] dark:hover:text-[#f97936]",
                                            "rounded-r-full",           // Right outer corner rounded
                                            "rounded-l-none"          // Inner corner flat
                                        )}
                                    >
                                        Offline
                                    </Button>
                                </div>

                            </div>

                            {/* Postage and Shipping Section */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-white font-medium">Postage costs</label>
                                    <div className="relative">
                                        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">€</span>
                                        <Input
                                            value={postageCosts}
                                            onChange={(e) => setPostageCosts(e.target.value)}
                                            placeholder="0.00"
                                            className="pl-8 bg-gray-800 border-gray-700 text-white placeholder:text-gray-400 focus:border-orange-500 rounded-lg"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-white font-medium">Shipping from</label>
                                    <div className="relative">
                                        <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                                        <Input
                                            value={shippingFrom}
                                            onChange={(e) => setShippingFrom(e.target.value)}
                                            placeholder="Search..."
                                            className="pl-10 bg-gray-800 border-gray-700 text-white placeholder:text-gray-400 focus:border-orange-500 rounded-lg"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )
            case 2:
                return (
                    <div className="flex flex-col items-center justify-center flex-1 px-8 animate-fade-in-up" style={{ animationDelay: '0.1s', animationFillMode: 'both' }}>
                        <div className="w-full max-w-2xl text-center space-y-8">
                            <h1 className="text-4xl font-bold text-white">Image Gallery</h1>
                            <p className="text-xl text-gray-300">Add images to make your offer more attractive</p>
                            <div className="h-40 flex items-center justify-center border border-dashed border-gray-600 rounded-xl text-gray-400">
                                Image gallery content goes here
                            </div>
                        </div>
                    </div>
                )
            case 3:
                return (
                    <div className="flex flex-col items-center justify-center flex-1 px-8 animate-fade-in-up" style={{ animationDelay: '0.1s', animationFillMode: 'both' }}>
                        <div className="w-full max-w-2xl text-center space-y-8">
                            <h1 className="text-4xl font-bold text-white">Description</h1>
                            <p className="text-xl text-gray-300">Describe your offer in detail</p>
                            <div className="h-40 flex items-center justify-center border border-dashed border-gray-600 rounded-xl text-gray-400">
                                Description form content goes here
                            </div>
                        </div>
                    </div>
                )
            case 4:
                return (
                    <div className="flex flex-col items-center justify-center flex-1 px-8 animate-fade-in-up" style={{ animationDelay: '0.1s', animationFillMode: 'both' }}>
                        <div className="w-full max-w-2xl text-center space-y-8">
                            <h1 className="text-4xl font-bold text-white">Final Details</h1>
                            <p className="text-xl text-gray-300">Add the final details to complete your offer</p>
                            <div className="h-40 flex items-center justify-center border border-dashed border-gray-600 rounded-xl text-gray-400">
                                Final details form content goes here
                            </div>
                        </div>
                    </div>
                )
            case 5:
                return (
                    <div className="flex flex-col items-center justify-center flex-1 px-8 animate-fade-in-up" style={{ animationDelay: '0.1s', animationFillMode: 'both' }}>
                        <div className="w-full max-w-2xl text-center space-y-8">
                            <h1 className="text-4xl font-bold text-white">Check</h1>
                            <p className="text-xl text-gray-300">Review your offer before publishing</p>
                            <div className="h-40 flex items-center justify-center border border-dashed border-gray-600 rounded-xl text-gray-400">
                                Review content goes here
                            </div>
                        </div>
                    </div>
                )
            default:
                return null
        }
    }

    return (
        <div className="fixed inset-0 w-screen h-screen min-h-screen bg-[#fff] dark:bg-[#1d1f20] flex z-30">
            {/* Left Sidebar */}
            <div className="w-[272px] mt-14 bg-[#f3f5f7] dark:bg-[#28292a] flex flex-col">
                <div className="p-6 pt-6  border-gray-700">
                    <h2 className="text-2xl font-semibold text-[#000] dark:text-[#fff]">Place an offer</h2>
                </div>

                <nav className="flex-1 p-4 space-y-2">
                    {steps.map((step, index) => {
                        let IconComponent = step.icon;
                        const isActive = index === currentStep;
                        const isCompleted = index < currentStep;
                        const isFuture = index > currentStep;

                        if (isCompleted) {
                            IconComponent = hoveredStep === index ? Pencil : CircleCheck;
                        }

                        return (
                            <button
                                key={step.id}
                                onClick={() => {
                                    if (!isFuture) setCurrentStep(index);
                                }}
                                disabled={isFuture}
                                onMouseEnter={() => setHoveredStep(index)}
                                onMouseLeave={() => setHoveredStep(null)}
                                className={cn(
                                    "w-full flex items-center gap-3 pb-4 px-4 py-4 rounded-full text-left transition-colors",
                                    step.id === "check" && "border-t rounded-none border-gray-700 pt-6 mt-4",
                                    isActive
                                        ? "dark:bg-[#1d1f20] bg-[#fff] dark:text-white text-[#000]"
                                        : isCompleted
                                            ? "text-[#000] dark:text-[#fff] dark:hover:bg-[#363739] hover:bg-[#dfe1e4] bg-transparent"
                                            : "dark:text-[hsla(0,0%,100%,0.49)] text-[rgba(4,9,18,0.35)] hover:bg-gray-700 hover:text-gray-300",
                                    isFuture && "cursor-not-allowed opacity-60 hover:bg-transparent hover:text-inherit",
                                )}
                            >
                                <IconComponent className={cn("h-5 w-5 flex-shrink-0", isCompleted && hoveredStep !== index && "text-green-500 dark:text-green-400")} />
                                <span className="font-medium text-sm">{step.title}</span>
                            </button>
                        )
                    })}
                </nav>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col">
                {/* Content */}
                <div className="flex-1 flex">{renderStepContent()}</div>

                {/* Navigation Buttons */}
                {currentStep > 0 && (
                    <div className="border-t border-gray-700 p-6 flex justify-between">
                        <Button
                            onClick={handleBack}
                            variant="outline"
                            className="border-gray-600 text-gray-300 hover:bg-gray-700 bg-transparent"
                        >
                            Back
                        </Button>
                        <Button
                            onClick={handleNext}
                            disabled={currentStep === steps.length - 1}
                            className="bg-orange-500 hover:bg-orange-600 text-white"
                        >
                            {currentStep === steps.length - 1 ? "Publish" : "Next"}
                        </Button>
                    </div>
                )}
            </div>
        </div>
    )
}
