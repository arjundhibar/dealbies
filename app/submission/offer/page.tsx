"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Link2, Sparkles, ImageIcon, FileText, Eye, ListCheck } from "lucide-react"
import { cn } from "@/lib/utils"
import { url } from "inspector"
import { NextResponse } from "next/server"

export default function PostOfferPage() {
    const [currentStep, setCurrentStep] = useState(0)
    const [linkValue, setLinkValue] = useState("")
    const [isLoading, setIsLoading] = useState(false)

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

    const handleContinue = async () => {
        setIsLoading(true)
        const encodedUrl = encodeURIComponent(linkValue.trim());
        try {
            const res = await fetch(`/api/deals/check?url=${encodedUrl}`);
            const result = await res.json();

            if (result.exists) {
                alert("This deal already exists")
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

    const renderStepContent = () => {
        switch (currentStep) {
            case 0:
                return (
                    <div className="flex flex-col items-center justify-center flex-1 !m-0 !p-0 animate-fade-in-up" style={{ animationDelay: '0.1s', animationFillMode: 'both' }}>
                        <div className="w-full max-w-2xl text-center space-y-8">
                            <div className="space-y-4">
                                <h1 className="text-[32px] leading-[2.625rem] font-poppins font-medium text-white dark:text-[#fff]">Share an offer with millions of people</h1>
                                <p className="text-2xl font-poppins text-gray-300 dark:text-[hsla(0,0%,100%,0.75)]">
                                    Paste the link where other people can buy the deal or find more information
                                </p>
                            </div>

                            <div className="space-y-6">
                                {/* Progress Bar */}
                                {isLoading && (
                                    <div className="w-full bg-gray-700 rounded-full h-2 overflow-hidden">
                                        <div className="bg-[#f7641b] h-2 rounded-full animate-pulse transition-all duration-1000 ease-out" style={{ width: '100%' }}></div>
                                    </div>
                                )}

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
                                            className="w-full h-auto text-sm leading-5 bg-[#1d1f20] border border-[hsla(0,0%,100%,0.35)] text-white placeholder:text-gray-400 focus:border-[#f97936] focus:shadow-none rounded-lg transition-all duration-200 ease-out py-[9px] pl-10 text-ellipsis"
                                        />
                                    </div>

                                    {/* Button */}
                                    <Button
                                        onClick={handleContinue}
                                        disabled={!linkValue.trim() || isLoading}
                                        className="h-9 px-4 text-sm rounded-full bg-[#f7641b] hover:bg-[#eb611f] text-white disabled:bg-[#363739] disabled:text-[#8b8d90]"
                                    >
                                        {isLoading ? "Checking..." : "Continue"}
                                    </Button>
                                </div>

                                {/* Link below input */}
                                <button className="text-[#c5c7ca] h-9 px-4 hover:text-[#babcbf] hover:bg-[hsla(0,0%,100%,0.05)] hover:rounded-full text-sm font-semibold">
                                    I have no link
                                </button>
                            </div>

                        </div>
                    </div>
                )
            case 1:
                return (
                    <div className="flex flex-col items-center justify-center flex-1 animate-fade-in-up" style={{ animationDelay: '0.1s', animationFillMode: 'both' }}>
                        <div className="w-full max-w-2xl text-center space-y-8">
                            <h1 className="text-4xl font-bold text-white">Essentials</h1>
                            <p className="text-xl text-gray-300">Add the essential information about your offer</p>
                            <div className="h-40 flex items-center justify-center border border-dashed border-gray-600 rounded-xl text-gray-400">
                                Essentials form content goes here
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
        <div className="fixed inset-0 w-screen h-screen min-h-screen bg-[#1d1f20] flex z-30">
            {/* Left Sidebar */}
            <div className="w-[272px] mt-14 bg-[#28292a] flex flex-col">
                <div className="p-6 pt-6  border-gray-700">
                    <h2 className="text-2xl font-semibold  text-[#fff]">Place an offer</h2>
                </div>

                <nav className="flex-1 p-4 space-y-2">
                    {steps.map((step, index) => {
                        const IconComponent = step.icon
                        const isActive = index === currentStep
                        const isCompleted = index < currentStep

                        return (
                            <button
                                key={step.id}
                                onClick={() => setCurrentStep(index)}
                                className={cn(
                                    "w-full flex items-center gap-3 pb-4 px-4 py-4 rounded-full text-left transition-colors",
                                    step.id === "check" && "border-t rounded-none border-gray-700 pt-6 mt-4",
                                    isActive
                                        ? "bg-[#1d1f20] text-white"
                                        : isCompleted
                                            ? "bg-gray-700 text-gray-300 hover:bg-gray-600"
                                            : "text-[hsla(0,0%,100%,0.49)] hover:bg-gray-700 hover:text-gray-300",
                                )}
                            >
                                <IconComponent className="h-5 w-5 flex-shrink-0" />
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
