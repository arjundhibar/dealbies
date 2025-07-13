import React from "react"
import { Button } from "@/components/ui/button"
import { Pencil, CircleCheck } from "lucide-react"

export function MobileOfferSubmission(props: any) {
  const {
    steps,
    currentStep,
    setCurrentStep,
    hoveredStep,
    setHoveredStep,
    renderStepContent,
    handleBack,
    handleNext,
  } = props

  console.log("MobileOfferSubmission renderStepContent:", renderStepContent)
  console.log("MobileOfferSubmission currentStep:", currentStep)

  return (
    <>
      {/* Mobile: Horizontal Step Bar */}
      <div className="block md:hidden w-full bg-[#f3f5f7] mt-12 h-fit dark:bg-[#28292a] border-b border-gray-200 dark:border-[#23272f]">
        <nav className="flex flex-row items-center justify-between px-2 py-4 overflow-x-auto">
          {steps.map((step: any, index: number) => {
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
                {index < steps.length - 1 && <div className="w-6 h-px bg-[rgba(3,12,25,0.23)] dark:bg-[#46484b] mx-2" />}
              </div>
            )
          })}
        </nav>
      </div>

      {/* Mobile: Main Content Area */}
      <div className="flex flex-col overflow-auto md:hidden">
        <div>{renderStepContent && renderStepContent()}</div>
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
              onClick={handleNext}
              disabled={currentStep === steps.length - 1}
              className="border rounded-full h-9 px-4 border-[#f7641b] hover:border-[#eb611f] text-[#f7641b] hover:bg-[#fbf3ef] hover:text-[#eb611f] bg-[#fff] dark:border-[#f97936] dark:text-[#f97936] dark:hover:border-[#f7641b] dark:hover:text-[#f7641b] dark:hover:bg-[#612203] dark:bg-[#1d1f20]"
            >
              {currentStep === steps.length - 1 ? "Publish" : "Next"}
            </Button>
          </div>
        )}
      </div>
    </>
  )
} 