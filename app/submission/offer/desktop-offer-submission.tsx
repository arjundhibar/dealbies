import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import { Pencil, CircleCheck, ArrowRight, CheckCircle, Check } from "lucide-react"
import { useRouter } from "next/navigation"

export function DesktopOfferSubmission(props: any) {
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

  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  async function handleSubmitDeal() {
    try {
      setIsLoading(true);
      const imageUploadResults = [];

      for (let i = 0; i < uploadedImages.length; i++) {
        const img = uploadedImages[i];

        if (img.file) {
          const formData = new FormData();
          formData.append("file", img.file);

          const uploadRes = await fetch("/api/upload-images", {
            method: "POST",
            body: formData,
          });

          if (!uploadRes.ok) throw new Error("Failed to upload image to Cloudflare");

          const uploadResult = await uploadRes.json();
          const publicUrl = uploadResult.result.variants[0];

          imageUploadResults.push({ url: publicUrl, isCover: i === 0 });
        } else if (img.url.startsWith("http")) {
          imageUploadResults.push({ url: img.url, isCover: i === 0 });
        }
      }

      const imageUrls = imageUploadResults.map((img) => img.url);
      const coverImageIndex = imageUploadResults.findIndex((img) => img.isCover);

      const payload = {
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
        imageUrls,
        coverImageIndex,
      };
      console.log("Payload sending to /api/deals:", payload);
      const dealRes = await fetch("/api/deals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!dealRes.ok) {
        const error = await dealRes.json();
        throw new Error(error.message || "Failed to post deal");
      }

      const data = await dealRes.json();
      console.log("✅ Deal posted:", data);
      router.push("/");
    } catch (error: any) {
      console.error("🚨 Deal post failed:", error);
      alert(error.message || "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  }


  return (
    <div className="hidden md:flex w-full h-full flex-row">
      {/* Sidebar */}
      <div className="w-[272px] mt-14 bg-[#f3f5f7] dark:bg-[#28292a] flex flex-col">
        <div className="p-6 pt-6 border-gray-700">
          <h2 className="text-2xl font-semibold text-[#000] dark:text-[#fff]">Place an offer</h2>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          {steps.map((step: any, index: number) => {
            let IconComponent = step.icon
            const isActive = index === currentStep
            const isCompleted = index < currentStep
            const isFuture = index > currentStep
            if (isCompleted) {
              IconComponent = hoveredStep === index ? Pencil : CircleCheck
            }
            return (
              <button
                key={step.id}
                onClick={() => {
                  if (!isFuture) setCurrentStep(index)
                }}
                disabled={isFuture}
                onMouseEnter={() => setHoveredStep(index)}
                onMouseLeave={() => setHoveredStep(null)}
                className={
                  "w-full flex items-center gap-3 pb-4 px-4 py-4 rounded-full text-left transition-colors" +
                  (step.id === "check" ? " border-t rounded-none border-gray-700 pt-6 mt-4" : "") +
                  (isActive
                    ? " dark:bg-[#1d1f20] bg-[#fff] dark:text-white text-[#000]"
                    : isCompleted
                      ? " text-[#000] dark:text-[#fff] dark:hover:bg-[#363739] hover:bg-[#dfe1e4] bg-transparent"
                      : " dark:text-[hsla(0,0%,100%,0.49)] text-[rgba(4,9,18,0.35)] hover:bg-gray-700 hover:text-gray-300") +
                  (isFuture ? " cursor-not-allowed opacity-60 hover:bg-transparent hover:text-inherit" : "")
                }
              >
                <IconComponent
                  className={
                    "h-5 w-5 flex-shrink-0" +
                    (isCompleted && hoveredStep !== index ? " text-[#238012] dark:text-[#78c86b]" : "")
                  }
                />
                <span className="font-medium text-sm">{step.title}</span>
              </button>
            )
          })}
        </nav>
      </div>
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-auto">
        {/* Content */}
        <div className="flex-1 flex">{renderStepContent()}</div>
        {/* Navigation Buttons */}
        {currentStep > 0 && (
          <div className="border-t border-[#dfe1e4] dark:border-[#46484b] p-6 flex justify-between">
            <Button
              onClick={handleBack}
              variant="outline"
              className="h-9 px-4 border-[#dfe1e4] rounded-full hover:border-[#d7d9dd] hover:bg-[#f3f5f7] text-[#6b6d70] hover:text-[#76787b] dark:border-[#46484b] dark:hover:border-[#525457] dark:hover:bg-[#363739] dark:text-[#c5c7ca] dark:hover:text-[#d7d9dd] dark:bg-[#1d1f20] bg-transparent"
            >
              Back
            </Button>
            <Button
              onClick={() => {
                if (currentStep === steps.length - 1) {
                  handleSubmitDeal()
                } else {
                  handleNext()
                }
              }}
              disabled={isLoading}
              className="border rounded-full h-9 px-4 border-[#f7641b] hover:border-[#eb611f] text-[#f7641b] hover:bg-[#fbf3ef] hover:text-[#eb611f] bg-[#fff] dark:border-[#f97936] dark:text-[#f97936] dark:hover:border-[#f7641b] dark:hover:text-[#f7641b] dark:hover:bg-[#612203] dark:bg-[#1d1f20] flex items-center justify-center min-w-[120px]"
            >
              {isLoading && (
                <svg className="animate-spin mr-2 h-4 w-4 text-[#f7641b]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                </svg>
              )}
              {currentStep === steps.length - 1 ? (
                <>
                  <Check className="h-4 w-4" />
                  <span>Sending an offer</span>
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
    </div>
  )
} 