"use client"

import React from "react"
import { Button } from "@/components/ui/button"
import { Pencil, CircleCheck, ArrowRight, Check, Link2, Sparkles, ImageIcon, FileText, ListChecksIcon as ListCheck, Eye } from "lucide-react"
import { useCouponSubmission } from "@/hooks/use-coupon-submission";

// Define the prop types based on sharedProps (same as desktop)
interface MobileDiscountSubmissionProps {
  steps: any[];
  currentStep: number;
  setCurrentStep: (step: number) => void;
  hoveredStep: number | null;
  setHoveredStep: (step: number | null) => void;
  renderStepContent: () => React.ReactNode;
  handleBack: () => void;
  handleNext: () => void;
  discount: string;
  setDiscount: (val: string) => void;
  discountFocused: boolean;
  setDiscountFocused: (val: boolean) => void;
  discountCode: string;
  setDiscountCode: (val: string) => void;
  discountType: string;
  setDiscountType: (val: string) => void;
  discountValue: string;
  setDiscountValue: (val: string) => void;
  availability: string;
  setAvailability: (val: string) => void;
  discountCodeFocused: boolean;
  setDiscountCodeFocused: (val: boolean) => void;
  uploadedImages: any[];
  setUploadedImages: (imgs: any[]) => void;
  description: string;
  setDescription: (val: string) => void;
  startDate: string;
  setStartDate: (val: string) => void;
  startTime: string;
  setStartTime: (val: string) => void;
  endDate: string;
  setEndDate: (val: string) => void;
  endTime: string;
  setEndTime: (val: string) => void;
  selectedCategories: string[];
  setSelectedCategories: (cats: string[]) => void;
  discountlinkValue: string;
  setDiscountLinkValue: (val: string) => void;
  isLoading: boolean;
  // ...other sharedProps if needed
}

export function MobileDiscountSubmission(props: MobileDiscountSubmissionProps) {
  const {
    steps,
    currentStep,
    setCurrentStep,
    hoveredStep,
    setHoveredStep,
    renderStepContent,
    handleBack,
    handleNext,
    discount,
    setDiscount,
    discountFocused,
    setDiscountFocused,
    discountCode,
    setDiscountCode,
    discountType,
    setDiscountType,
    discountValue,
    setDiscountValue,
    availability,
    setAvailability,
    discountCodeFocused,
    setDiscountCodeFocused,
    uploadedImages,
    setUploadedImages,
    description,
    setDescription,
    startDate,
    setStartDate,
    startTime,
    setStartTime,
    endDate,
    setEndDate,
    endTime,
    setEndTime,
    selectedCategories,
    setSelectedCategories,
    discountlinkValue,
    setDiscountLinkValue,
    isLoading,
  } = props

  const { handleSubmitCoupon } = useCouponSubmission(uploadedImages, discount);

  const payloadBase = {
    title: discount,
    description,
    discountCode,
    discountType: discountType || "none",
    discountValue: discountValue || null,
    availability,
    couponUrl: discountlinkValue || "",
    startAt: startDate && startTime ? new Date(`${startDate}T${startTime}`).toISOString() : null,
    expiresAt: endDate && endTime ? new Date(`${endDate}T${endTime}`).toISOString() : null,
    category: selectedCategories[0] || "Other",
    uploadedImages,
  };

  // Define discount code specific steps
  const discountSteps = [
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
  ];

  return (
    <>
      {/* Mobile: Horizontal Step Bar */}
      <div className="block md:hidden w-full bg-[#f3f5f7] mt-12 h-fit dark:bg-[#28292a] border-b border-gray-200 dark:border-[#23272f]">
        <nav className="flex flex-row items-center justify-between px-2 py-4 overflow-x-auto">
          {discountSteps.map((step: any, index: number) => {
            let IconComponent = step.icon
            const isActive = index === currentStep
            const isCompleted = index < currentStep
            const isFuture = index > currentStep
            if (isCompleted) {
              IconComponent = hoveredStep === index ? Pencil : CircleCheck
            }
            return (
              <div key={step.id} className="flex items-center">
                <button
                  onClick={() => {
                    if (index <= currentStep) setCurrentStep(index)
                  }}
                  disabled={index > currentStep}
                  onMouseEnter={() => setHoveredStep(index)}
                  onMouseLeave={() => setHoveredStep(null)}
                  className={
                    "flex flex-col items-center p-2  focus:outline-none  rounded-full align-middle text-sm font-semibold whitespace-nowrap" +
                    (isActive
                      ? " text-black bg-white dark:text-[#f97936]"
                      : isCompleted
                        ? " text-[#238012] dark:text-green-400"
                        : " text-black dark:text-[#525457]") +
                    (isFuture ? " cursor-not-allowed opacity-35 text-[rgba(4,9,18,0.35)]" : "")
                  }
                >
                  <div className="flex flex-row gap-3 whitespace-normal">
                    <IconComponent className="h-5 w-5" />
                    <span className=" whitespace-nowrap">{step.title}</span>
                  </div>
                </button>
                {index < discountSteps.length - 1 && <div className="w-6 h-px bg-[rgba(3,12,25,0.23)] dark:bg-[#46484b] mx-2" />}
              </div>
            )
          })}
        </nav>
      </div>

      {/* Mobile: Main Content Area */}
      <div className="flex flex-col overflow-auto md:hidden pb-12">
        <div>{renderStepContent && renderStepContent()}</div>
        {currentStep > 0 && (
          <div className="border-t  border-[#e4dfdf] dark:border-[#46484b] p-4 flex justify-between sticky bottom-0 bg-white dark:bg-[#1d1f20]">
            <Button
              onClick={handleBack}
              variant="outline"
              className="h-9 px-4 border-[#dfe1e4] rounded-full hover:border-[#d7d9dd] hover:bg-[#f3f5f7] text-[#6b6d70] hover:text-[#76787b] dark:border-[#46484b] dark:hover:border-[#525457] dark:hover:bg-[#363739] dark:text-[#c5c7ca] dark:hover:text-[#d7d9dd] dark:bg-[#1d1f20] bg-transparent"
            >
              Back
            </Button>
            <Button
              onClick={() => {
                console.log("Mobile: Submitting coupon with payload:", payloadBase)
                if (currentStep === discountSteps.length - 1) {
                  handleSubmitCoupon(payloadBase)
                } else {
                  handleNext()
                }
              }}
              disabled={isLoading}
              className="border rounded-full h-9 px-4 border-[#f7641b] hover:border-[#eb611f] text-[#f7641b] hover:bg-[#fbf3ef] hover:text-[#eb611f] bg-[#fff] dark:border-[#f97936] dark:text-[#f97936] dark:hover:border-[#f7641b] dark:hover:text-[#f7641b] dark:hover:bg-[#612203] dark:bg-[#1d1f20]"
            >
              {isLoading && (
                <svg className="animate-spin mr-2 h-4 w-4 text-[#f7641b]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                </svg>
              )}
              {currentStep === discountSteps.length - 1 ? (
                <>
                  <Check className="h-4 w-4" />
                  <span>Posting discount code</span>
                </>
              ) : (
                <>
                  <span>Next</span>
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </Button>
          </div>
        )}
      </div>
    </>
  )
} 