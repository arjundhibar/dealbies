"use client"

import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import { Pencil, CircleCheck, ArrowRight, CheckCircle, Check, Link2, Sparkles, ImageIcon, FileText, ListChecksIcon as ListCheck, Eye, Tag, Percent } from "lucide-react"
import { useRouter } from "next/navigation"
import { getSupabase } from "@/lib/supabase"
import { useAuth } from "@/lib/auth-context"
import { useOfferSubmission } from "@/hooks/use-offer-submission";

export function MobileDiscountSubmission(props: any) {
  const {
    steps,
    currentStep,
    setCurrentStep,
    hoveredStep,
    setHoveredStep,
    renderStepContent,
    handleBack,
    handleNext,
    title,
    description,
    priceOffer,
    lowestPrice,
    discountCode,
    availability,
    postageCosts,
    shippingFrom,
    startDate,
    startTime,
    endDate,
    endTime,
    selectedCategories,
    linkValue,
    uploadedImages,
  } = props

  const { handleSubmitDeal, isLoading } = useOfferSubmission(uploadedImages, title);

  const payloadBase = {
    title,
    description,
    price: parseFloat(priceOffer) || 0,
    originalPrice: parseFloat(lowestPrice) || null,
    discountCode: discountCode || null,
    availability,
    postageCosts: postageCosts ? parseFloat(postageCosts) : null,
    shippingFrom: shippingFrom || null,
    startAt: startDate && startTime ? new Date(`${startDate}T${startTime}`).toISOString() : null,
    expiresAt: endDate && endTime ? new Date(`${endDate}T${endTime}`).toISOString() : null,
    category: selectedCategories[0] || null,
    dealUrl: linkValue,
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
    <div className="block md:hidden w-full overflow-y-auto h-screen">
      {/* Mobile Header with Steps */}
      <div className="sticky top-0 z-50 bg-background border-b">
        <div className="flex items-center justify-between p-4">
          <Button variant="ghost" size="sm" onClick={handleBack} disabled={currentStep === 0}>
            <ArrowRight className="h-4 w-4 rotate-180" />
          </Button>
          
          <div className="flex-1 mx-4">
            <div className="flex items-center justify-between">
              {discountSteps.map((step, index) => (
                <div key={index} className="flex items-center">
                  <div className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium ${
                    index <= currentStep 
                      ? 'bg-[#f7641b] text-white' 
                      : 'bg-gray-200 text-gray-600'
                  }`}>
                    {index + 1}
                  </div>
                  {index < discountSteps.length - 1 && (
                    <div className={`w-8 h-0.5 mx-2 ${
                      index < currentStep ? 'bg-[#f7641b]' : 'bg-gray-200'
                    }`} />
                  )}
                </div>
              ))}
            </div>
          </div>

          <Button 
            variant="ghost" 
            size="sm" 
            onClick={handleNext}
            disabled={currentStep === discountSteps.length - 1}
          >
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1">
        {renderStepContent()}
      </div>

      {/* Bottom Navigation */}
      <div className="sticky bottom-0 bg-background border-t p-4">
        <div className="flex gap-4">
          <Button
            variant="outline"
            onClick={handleBack}
            disabled={currentStep === 0}
            className="flex-1"
          >
            Back
          </Button>
          <Button
            onClick={() => {
              if (currentStep === discountSteps.length - 1) {
                handleSubmitDeal(payloadBase)
              } else {
                handleNext()
              }
            }}
            disabled={isLoading}
            className="flex-1 bg-[#f7641b] hover:bg-[#eb611f] text-white"
          >
            {isLoading && (
              <svg className="animate-spin mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
              </svg>
            )}
            {currentStep === discountSteps.length - 1 ? "Post Discount Code" : "Next"}
          </Button>
        </div>
      </div>
    </div>
  )
} 