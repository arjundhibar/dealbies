"use client"

import type React from "react"
import { useEffect, useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
    Link2,
    Sparkles,
    ImageIcon,
    FileText,
    Eye,
    ListChecksIcon as ListCheck,
    Info,
    Scissors,
    ArrowRight,
    Plus,
    X,
    Link as LinkIcon,
    Smile,
    Minus,
    List,
    Italic,
    Strikethrough,
    Bold,
    AlignLeft,
    AlignCenter,
    Check,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { formatDistanceStrict } from "date-fns"
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import Placeholder from '@tiptap/extension-placeholder';

// Import the separated components
import { MobileDiscountSubmission } from "./mobile-discount-submission"
import { DesktopDiscountSubmission } from "./desktop-discount-submission"




interface DuplicateDeal {
    title: string
    image: string
    price?: string
    merchant?: string
    createdAt?: string
}

interface UploadedImage {
    id: string
    url: string
    file?: File
    isCover: boolean
}



export default function PostDiscountCodePage() {
    // Shared state for both mobile and desktop
    const [currentStep, setCurrentStep] = useState(0)
    const [discountlinkValue, setDiscountLinkValue] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const [duplicateDeal, setDuplicateDeal] = useState<DuplicateDeal | null>(null)
    const [progressWidth, setProgressWidth] = useState(0)
    const [hoveredStep, setHoveredStep] = useState<number | null>(null)

    const [discount, setDiscount] = useState("")
    const [discountFocused, setDiscountFocused] = useState(false)
    const [priceOffer, setPriceOffer] = useState("")
    const [lowestPrice, setLowestPrice] = useState("")
    const [discountCode, setDiscountCode] = useState("")
    const [availability, setAvailability] = useState("online")
    const [postageCosts, setPostageCosts] = useState("")
    const [shippingFrom, setShippingFrom] = useState("")

    const [discountType, setDiscountType] = useState("none")
    const [discountValue, setDiscountValue] = useState("")


    const [priceOfferFocused, setPriceOfferFocused] = useState(false)
    const [lowestPriceFocused, setLowestPriceFocused] = useState(false)
    const [discountCodeFocused, setDiscountCodeFocused] = useState(false)

    const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([])
    const [imageUrlInput, setImageUrlInput] = useState("")
    const [isDragOver, setIsDragOver] = useState(false)

    const [description, setDescription] = useState("")
    const [descriptionFocused, setDescriptionFocused] = useState(false)

    const [showLinkInput, setShowLinkInput] = useState(false)
    const [linkURL, setLinkURL] = useState("")
    const [linkText, setLinkText] = useState("")

    const [showImageInput, setShowImageInput] = useState(false)

    const [selected, setSelected] = useState<"left" | "middle">("left")

    const [startDate, setStartDate] = useState("")
    const [startTime, setStartTime] = useState("")
    const [showStartTimeInput, setShowStartTimeInput] = useState(false)

    const [endDate, setEndDate] = useState("")
    const [endTime, setEndTime] = useState("")
    const [showEndTimeInput, setShowEndTimeInput] = useState(false)

    const [selectedCategories, setSelectedCategories] = useState<string[]>([])

    const [showMoreDescription, setShowMoreDescription] = useState(false)



    const editorRef = useRef<HTMLDivElement>(null)

    const [showCityDropdown, setShowCityDropdown] = useState(false)
    const cityList = [
        "Mumbai, Maharashtra",
        "Delhi, Delhi",
        "Bengaluru, Karnataka",
        "Hyderabad, Telangana",
        "Ahmedabad, Gujarat",
        "Chennai, Tamil Nadu",
        "Kolkata, West Bengal",
        "Pune, Maharashtra",
        "Jaipur, Rajasthan",
        "Lucknow, Uttar Pradesh",
        "Chandigarh, Chandigarh",
        "Bhopal, Madhya Pradesh",
        "Patna, Bihar",
        "Indore, Madhya Pradesh",
        "Guwahati, Assam",
    ]

    const categories = [
        "Electronics",
        "Gaming",
        "Groceries",
        "Fashion & Accessories",
        "Beauty & Health",
        "To travel",
        "Family & Children",
        "Home & Living",
        "Garden & DIY",
        "Car & Motorcycle",
        "Culture & Leisure",
        "Sports & Outdoors",
        "Telecom & Internet",
        "Money Matters & Insurance",
        "Services & Contracts",
    ]

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

    const fileInputRef = useRef<HTMLInputElement>(null)
    const textareaRef = useRef<HTMLTextAreaElement>(null)

    const [savedSelection, setSavedSelection] = useState<Range | null>(null)

    const startDateRef = useRef<HTMLInputElement>(null)
    const startTimeRef = useRef<HTMLInputElement>(null)
    const endDateRef = useRef<HTMLInputElement>(null)
    const endTimeRef = useRef<HTMLInputElement>(null)

    const [discountError, setDiscountError] = useState("");
    const [descriptionError, setDescriptionError] = useState("");
    const [categoryError, setCategoryError] = useState("");

    useEffect(() => {
        console.log("this is the discount type", discountType)
    },[discountType])

    useEffect(() => {
        if (isLoading) {
            setProgressWidth(0)
            const timer = window.setTimeout(() => {
                setProgressWidth(100)
            }, 1000)
            return () => window.clearTimeout(timer)
        } else {
            setProgressWidth(0)
        }
    }, [isLoading])

    useEffect(() => {
        if (currentStep === 3 && editorRef.current) {
            editorRef.current.innerHTML = description || ""
        }
    }, [currentStep, description])

    const handleFileUpload = (files: FileList | null) => {
        if (!files) return

        Array.from(files).forEach((file) => {
            if (file.type.startsWith("image/") && uploadedImages.length < 8) {
                const reader = new FileReader()
                reader.onload = (e) => {
                    const newImage: UploadedImage = {
                        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
                        url: e.target?.result as string,
                        file,
                        isCover: uploadedImages.length === 0, // First image becomes cover
                    }
                    setUploadedImages((prev) => [...prev, newImage])
                }
                reader.readAsDataURL(file)
            }
        })
    }

    const handleUrlUpload = async () => {
        if (!imageUrlInput.trim() || uploadedImages.length >= 8) return;

        try {
            setIsLoading(true);

            // Step 1: Fetch image blob from the URL
            const response = await fetch(imageUrlInput.trim());
            const blob = await response.blob();

            // Step 2: Create a File from blob
            const ext = blob.type.split("/")[1] || "jpg";
            const file = new File([blob], `url-upload-${Date.now()}.${ext}`, {
                type: blob.type,
            });

            // Step 3: Store it in uploadedImages[] like other images
            const newImage: UploadedImage = {
                id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
                file,
                url: URL.createObjectURL(blob), // shows preview in UI
                isCover: uploadedImages.length === 0,
            };

            setUploadedImages((prev) => [...prev, newImage]);
            setImageUrlInput("");
        } catch (error) {
            console.error("🚨 Failed to convert URL to file:", error);
            alert("Failed to load image from the URL. Try a different one.");
        } finally {
            setIsLoading(false);
        }
    };


    const removeImage = (id: string) => {
        setUploadedImages((prev) => {
            const filtered = prev.filter((img) => img.id !== id)
            // If we removed the cover image, make the first remaining image the cover
            if (filtered.length > 0 && !filtered.some((img) => img.isCover)) {
                filtered[0].isCover = true
            }
            return filtered
        })
    }

    const setCoverImage = (id: string) => {
        setUploadedImages((prev) => prev.map((img) => ({ ...img, isCover: img.id === id })))
    }

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault()
        setIsDragOver(true)
    }

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault()
        setIsDragOver(false)
    }

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault()
        setIsDragOver(false)
        handleFileUpload(e.dataTransfer.files)
    }

    const handleNext = () => {
        if (currentStep === 1 && !discount.trim()) {
            setDiscountError("This field is required");
            return;
        }
        setDiscountError("");
        if (currentStep === 3) {
            if (editorRef.current) {
                setDescription(editorRef.current.innerHTML);
            }
            const plainText = editor?.getText().trim() || "";
            if (!plainText) {
                setDescriptionError("This field is required");
                return;
            }
            setDescriptionError("");
        }
        if (currentStep === 4 && selectedCategories.length === 0) {
            setCategoryError("Select the most relevant category");
            return;
        }
        setCategoryError("");
        if (currentStep < steps.length - 1) {
            setCurrentStep(currentStep + 1);
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
        setDiscountLinkValue("")
    }

    const toggleCategory = (category: string) => {
        setSelectedCategories((prev) => (prev.includes(category) ? [] : [category]))
    }

    const handleContinue = async () => {
        setIsLoading(true)
        setDuplicateDeal(null)
        const encodedUrl = encodeURIComponent(discountlinkValue.trim())
        try {
            const res = await fetch(`/api/deals/check?url=${encodedUrl}`)
            const result = await res.json()

            if (result.exists) {
                setDuplicateDeal({
                    title: result.deal.title || "Deal Title",
                    image: result.deal.image || "/placeholder.jpg",
                    price: result.deal.price,
                    merchant: result.deal.merchant,
                    createdAt: result.deal.createdAt,
                })
            } else {
                handleNext()
            }
        } catch (error) {
            alert("Something went wrong while checking the deal.")
            console.error(error)
        } finally {
            setIsLoading(false)
        }
    }
    const calculateDiscount = () => {
        const offer = Number.parseFloat(priceOffer) || 0
        const lowest = Number.parseFloat(lowestPrice) || 0
        if (lowest > 0) {
            const discount = Math.round(((lowest - offer) / lowest) * 100)
            return discount > 0 ? discount : 0
        }
        return 0
    }

    // Formatting handlers
    const handleBold = () => {
        document.execCommand("bold")
    }

    const handleItalic = () => {
        document.execCommand("italic")
    }

    const handleStrikethrough = () => {
        document.execCommand("strikeThrough")
    }
    const handleList = () => {
        document.execCommand("insertUnorderedList")
    }
    const handleHorizontalLine = () => {
        document.execCommand("insertHorizontalRule")
    }
    // FIXED: Emoji insertion for contentEditable
    const handleEmoji = (emoji: string) => {
        if (!editorRef.current) return;
        editorRef.current.focus();
        const selection = window.getSelection();
        if (!selection || !selection.rangeCount) return;
        const range = selection.getRangeAt(0);
        range.deleteContents();
        const textNode = document.createTextNode(emoji);
        range.insertNode(textNode);
        // Move caret after the inserted emoji
        range.setStartAfter(textNode);
        range.collapse(true);
        selection.removeAllRanges();
        selection.addRange(range);
        // Update description state
        setDescription(editorRef.current.innerHTML);
    };

    const handleSubmit = () => {
        const html = editorRef.current?.innerHTML
        console.log("Final formatted HTML:", html)
    }
    const handleInput = () => {
        if (editorRef.current) {
            // Save caret position as character offset
            const selection = window.getSelection();
            let caretOffset = 0;
            if (selection && selection.rangeCount > 0) {
                const range = selection.getRangeAt(0);
                const preCaretRange = range.cloneRange();
                preCaretRange.selectNodeContents(editorRef.current);
                preCaretRange.setEnd(range.endContainer, range.endOffset);
                caretOffset = preCaretRange.toString().length;
            }

            setDescription(editorRef.current.innerHTML);

            // Restore caret position after state update
            setTimeout(() => {
                if (editorRef.current && caretOffset >= 0) {
                    const node = editorRef.current;
                    let charIndex = 0, range = document.createRange();
                    range.setStart(node, 0);
                    range.collapse(true);

                    const treeWalker = document.createTreeWalker(
                        node,
                        NodeFilter.SHOW_TEXT,
                        null
                    );

                    let found = false;
                    while (treeWalker.nextNode()) {
                        const textNode = treeWalker.currentNode as Text;
                        const nextCharIndex = charIndex + textNode.length;
                        if (!found && caretOffset <= nextCharIndex) {
                            range.setStart(textNode, caretOffset - charIndex);
                            range.collapse(true);
                            found = true;
                        }
                        charIndex = nextCharIndex;
                    }

                    const sel = window.getSelection();
                    sel?.removeAllRanges();
                    sel?.addRange(range);
                }
            }, 0);
        }
    }
    // Emoji picker state
    const [showEmojiPicker, setShowEmojiPicker] = useState(false)
    const emojiList = ["😀", "😂", "😍", "😎", "👍", "🎉", "🔥", "🙏", "😊", "🥳"]

    // Add state for image URL input and file input
    const [imageInsertUrl, setImageInsertUrl] = useState("")
    const [imageInsertFile, setImageInsertFile] = useState<File | null>(null)

    // Handler for file input change
    const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] || null
        setImageInsertFile(file)
        setImageInsertUrl("") // Clear URL if file is chosen
    }

    // Handler for image URL input change
    const handleImageUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setImageInsertUrl(e.target.value)
        setImageInsertFile(null) // Clear file if URL is entered
    }

    // Handler for placing the image
    const handlePlaceImage = async () => {
        console.log("Placing image", { imageInsertFile, imageInsertUrl, selected })
        if (!editorRef.current) return
        editorRef.current.focus()
        // Restore the saved selection
        if (savedSelection) {
            const selection = window.getSelection()
            selection?.removeAllRanges()
            selection?.addRange(savedSelection)
        }
        let imageUrl = imageInsertUrl
        if (imageInsertFile) {
            imageUrl = await new Promise<string>((resolve) => {
                const reader = new FileReader()
                reader.onload = (e) => resolve(e.target?.result as string)
                reader.readAsDataURL(imageInsertFile)
            })
        }
        if (!imageUrl) {
            console.log("No imageUrl")
            return
        }
        const selection = window.getSelection()
        if (!selection || !selection.rangeCount) return
        const range = selection.getRangeAt(0)
        range.deleteContents()
        const img = document.createElement("img")
        img.src = imageUrl
        img.alt = "Inserted image"
        img.style.width = "200px"
        img.style.height = "200px"
        img.style.objectFit = "cover"
        img.style.display = "block"
        img.style.margin = selected === "middle" ? "16px auto" : "16px 0"
        img.style.float = selected === "left" ? "left" : "none"
        img.style.borderRadius = "12px"
        range.insertNode(img)
        range.setStartAfter(img)
        range.collapse(true)
        selection.removeAllRanges()
        selection.addRange(range)
        setShowImageInput(false)
        setImageInsertFile(null)
        setImageInsertUrl("")
        setDescription(editorRef.current.innerHTML)
        console.log("Editor HTML after image insert:", editorRef.current.innerHTML)
    }



    function renderCase0Mobile() {
        return (
            <div className="flex flex-col items-center justify-center flex-1 !m-0 !p-0 animate-fade-in-up px-4" style={{ animationDelay: "0.1s", animationFillMode: "both" }}>
                <div className="w-full max-w-2xl text-center space-y-8">
                    <div className="space-y-4 pt-3">
                        <h1 className="text-[32px] leading-tight  font-semibold text-[#000] dark:text-[#fff]">
                            Share a discount code with millions of people
                        </h1>
                        <p className="text-lg font-poppins text-[rgba(4,8,13,0.59)] dark:text-[hsla(0,0%,100%,0.75)]">
                            Paste the link where other people can buy the deal or find more information.
                        </p>
                    </div>
                    <div className="space-y-6">
                        <div className="flex flex-col items-center space-y-3 w-full">
                            <div className="relative flex-1 w-full">
                                <Scissors className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                                <Input
                                    type="url"
                                    placeholder="Discount code"
                                    value={discountCode}
                                    onChange={(e) => setDiscountCode(e.target.value)}
                                    className="w-full h-auto text-sm leading-5 bg-[#fff] dark:bg-[#1d1f20] border border-[rgba(3,12,25,0.23)] dark:border-[hsla(0,0%,100%,0.35)] dark:text-white text-[#000] placeholder:text-gray-400 focus:border-[#f97936] focus:shadow-none rounded-lg transition-all duration-200 ease-out py-[9px] pl-10 text-ellipsis"
                                />
                            </div>
                            <div className="relative flex-1 w-full">
                                <Link2 className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                                <Input
                                    type="url"
                                    placeholder="https://www.example.com/greatdeal..."
                                    value={discountlinkValue}
                                    onChange={(e) => setDiscountLinkValue(e.target.value)}
                                    className="w-full h-auto text-sm leading-5 bg-[#fff] dark:bg-[#1d1f20] border border-[rgba(3,12,25,0.23)] dark:border-[hsla(0,0%,100%,0.35)] dark:text-white text-[#000] placeholder:text-gray-400 focus:border-[#f97936] focus:shadow-none rounded-lg transition-all duration-200 ease-out py-[9px] pl-10 text-ellipsis"
                                />
                            </div>
                            <Button
                                onClick={handleContinue}
                                disabled={!discountlinkValue.trim() && !discountCode.trim() || isLoading}
                                className="h-9 px-4 text-sm rounded-full bg-[#f7641b] hover:bg-[#eb611f] text-white disabled:text-[#a7a9ac] dark:disabled:text-[#8b8d90] disabled:bg-[#f3f5f7] dark:disabled:bg-[#363739] w-full"
                            >
                                {isLoading ? "Checking..." : "Continue"}
                            </Button>
                        </div>
                        {isLoading && (
                            <div className="w-full bg-gray-700 rounded-full h-2 overflow-hidden">
                                <div
                                    className="bg-[#f7641b] h-2 rounded-full transition-all duration-2000 ease-out"
                                    style={{ width: `${progressWidth}%` }}
                                ></div>
                            </div>
                        )}
                        {duplicateDeal && (
                            <div className="bg-[#28292a] rounded-lg p-4 space-y-4">
                                <div className="space-y-2 text-left">
                                    <h3 className="text-lg font-bold text-white">Has this been posted before?</h3>
                                    <p className="text-gray-300 text-base text-left">
                                        It looks like this offer has already been posted or is being reviewed. Duplicate deals are usually removed.
                                    </p>
                                </div>
                                <div className="dark:bg-[#1d1f20] p-2 rounded-lg flex items-center space-x-4 relative">
                                    <div className="relative w-16 h-16">
                                        <img
                                            src={duplicateDeal.image || "/placeholder.svg"}
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
                                                <span className="dark:text-[hsla(0,0%,100%,0.75)] text-base">
                                                    {formatDistanceStrict(new Date(duplicateDeal.createdAt), new Date(), { addSuffix: true })}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <div className="flex flex-col justify-end space-y-2">
                                    <Button
                                        onClick={handleProceedAnyway}
                                        className="h-9 text-sm dark:bg-transparent dark:hover:bg-[hsla(0,0%,100%,0.05)] dark:text-[#c5c7ca] px-3 rounded-full w-full"
                                    >
                                        No, proceed to the next step
                                    </Button>
                                    <Button
                                        onClick={handleCancelSubmission}
                                        variant="outline"
                                        className="h-9 text-sm border dark:border-[#fd9997] dark:hover:border-[#fc8988] dark:bg-[#1d1f20] dark:text-[#fd9997] dark:hover:text-[#fc8988] dark:hover:bg-[#4c0a11] px-3 rounded-full bg-transparent w-full"
                                    >
                                        Yes, cancel the submission
                                    </Button>
                                </div>
                            </div>
                        )}
                        {currentStep === 0 && !isLoading && !duplicateDeal && (
                            <button onClick={handleNext} className="text-[#6b6d70] hover:text-[#76787b] dark:text-[#c5c7ca] h-9 px-4 dark:hover:text-[#babcbf] hover:bg-[rgba(15,55,95,0.05)] dark:hover:bg-[hsla(0,0%,100%,0.05)] hover:rounded-full text-sm font-semibold w-full">
                                I don't have a code or link
                            </button>
                        )}
                    </div>
                </div>
            </div>
        )
    }

    function renderCase0Desktop() {
        return (
            <div className="flex flex-col items-center justify-center flex-1 !m-0 !p-0 animate-fade-in-up min-h-screen w-full" style={{ animationDelay: '0.1s', animationFillMode: 'both' }}>
                <div className="w-full max-w-2xl text-center space-y-8">
                    <div className="space-y-4">
                        <h1 className="text-[32px] leading-[2.625rem] font-poppins font-medium text-[#000] dark:text-[#fff]">Share a discount code with millions of people</h1>
                        <p className="text-2xl leading-8 text-nowrap font-poppins text-[rgba(4,8,13,0.59)] dark:text-[hsla(0,0%,100%,0.75)]">
                            Enter the code and link where other people can redeem it
                        </p>
                    </div>

                    <div className="space-y-6">
                        {/* Flex container for input + button */}
                        <div className="flex items-center space-x-3">
  {/* Discount Code Input */}
                            <div className="relative w-[180px]">
                                <Scissors className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
    <Input
      type="text"
      placeholder="Discount code"
      value={discountCode}
      onChange={(e) => setDiscountCode(e.target.value)}
      className="w-full h-auto text-sm leading-5 bg-[#fff] dark:bg-[#1d1f20] border border-[rgba(3,12,25,0.23)] dark:border-[hsla(0,0%,100%,0.35)] dark:text-white text-[#000] placeholder:text-gray-400 focus:border-[#f97936] focus:shadow-none rounded-lg transition-all duration-200 ease-out py-[9px] px-4 pl-10 text-ellipsis focus:ring-0 dark:focus:ring-0"
    />
  </div>

  {/* Link Input with Icon */}
  <div className="relative flex-1">
    <Link2 className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
    <Input
      type="url"
      placeholder="https://www.example.com/greatdeal..."
      value={discountlinkValue}
      onChange={(e) => setDiscountLinkValue(e.target.value)}
      className="w-full h-auto text-sm leading-5 bg-[#fff] dark:bg-[#1d1f20] border border-[rgba(3,12,25,0.23)] dark:border-[hsla(0,0%,100%,0.35)] dark:text-white text-[#000] placeholder:text-gray-400 focus:border-[#f97936] focus:shadow-none rounded-lg transition-all duration-200 ease-out py-[9px] pl-10 text-ellipsis"
    />
  </div>

  {/* Continue Button */}
  <Button
    onClick={handleContinue}
    disabled={!discountlinkValue.trim() && !discountCode.trim() || isLoading}
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
                            <button onClick={handleNext} className="text-[#6b6d70] hover:text-[#76787b] dark:text-[#c5c7ca] h-9 px-4 dark:hover:text-[#babcbf] hover:bg-[rgba(15,55,95,0.05)] dark:hover:bg-[hsla(0,0%,100%,0.05)] hover:rounded-full text-sm font-semibold">
                                I don't have a code or link
                            </button>
                        )}
                    </div>

                </div>
            </div>
        )
    }

    function renderCase1Mobile() {
        return (
            <div className="w-full max-w-2xl !mx-auto space-y-8 px-2" style={{ animationDelay: "0.1s", animationFillMode: "both" }}>
                <div className="w-full max-w-2xl mx-auto space-y-8">
                    <h1 className="text-2xl md:text-3xl font-semibold text-[#000] dark:text-[#fff] text-left mb-8">
                        Let's start with the essential information
                    </h1>
                    {/* Title Section */}
                    <div className="">
                        <div className="flex justify-between items-center">
                            <label className="dark:text-white text-black text-sm font-semibold pb-[1.75px]">
                                discount code title <span className="text-[rgba(4,8,13,0.59)] dark:text-[hsla(0,0%,100%,0.75)] font-normal">(required)</span>
                            </label>
                            <span className="dark:text-[hsla(0,0%,100%,0.75)] text-sm">{140 - discount.length}</span>
                        </div>
                        <Input
                            value={discount}
                            onChange={e => {
                                setDiscount(e.target.value);
                                if (discountError) setDiscountError("");
                            }}
                            placeholder="A short description of the discount code..."
                            className={cn(
                                "w-full border text-black dark:border-[hsla(0,0%,100%,0.35)] dark:bg-[#1d1f20] dark:text-white dark:focus:ring-0 placeholder:text-gray-400 rounded-lg pt-2 pb-2 pl-4 pr-4 dark:focus:border-[#f97936]",
                                discountError ? "border-red-500 focus:border-red-500" : "border-[rgba(3,12,25,0.23)]"
                            )}
                            onFocus={() => setDiscountFocused(true)}
                            onBlur={() => setDiscountFocused(false)}
                        />
                        {discountError && (
                            <div className="text-red-500 text-xs mt-1">{discountError}</div>
                        )}
                    </div>
                    {/* Discount Details Section */}
                    <div className="">
                        <h2 className="text-xl font-semibold dark:text-white text-black pb-4">Discount type <span className="text-sm text-[rgba(4,8,13,0.59)] dark:text-[hsla(0,0%,100%,0.75)] font-normal">(required)</span></h2>
                        <div className="space-y-3">
                        <div className="flex items-center space-x-3">
                           <label
  htmlFor="percentage"
  className="flex items-center space-x-3 cursor-pointer"
>
  <input
    type="radio"
    id="percentage"
    name="discountType"
    value="percentage"
    checked={discountType === "percentage"}
    onChange={(e) => {
      setDiscountType(e.target.value);
      setDiscountValue("");
    }}
    className="hidden peer"
  />
  <div
    className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-colors duration-200
      ${discountType === "percentage" 
        ? "border-[#f7641b]" 
        : "border-[rgba(3,12,25,0.23)] dark:border-[hsla(0,0%,100%,0.35)]"
      }`}
  >
    {discountType === "percentage" && (
      <div className="w-2 h-2 rounded-full bg-[#f7641b]"></div>
    )}
  </div>
  <span className="dark:text-white text-black text-sm">Discount (%)</span>
</label>

                        </div>

                        {discountType === "percentage" && (
                            <div className="relative w-[200px] mt-1">
                            <span className="absolute left-14 top-1/2 transform -translate-y-1/2 text-gray-400">%</span>
                            <Input
                                type="number"
                                step="0.01"
                                min="0"
                                placeholder="0.00"
                                value={discountValue}
                                onChange={(e) => setDiscountValue(e.target.value)}
                                className="pl-8 ml-11 w-full text-sm bg-[#fff] dark:bg-[#1d1f20] border border-[rgba(3,12,25,0.23)] dark:border-[hsla(0,0%,100%,0.35)] text-black dark:text-white rounded-lg [&::-webkit-inner-spin-button]:appearance-none
             [&::-webkit-outer-spin-button]:appearance-none
             [&::-webkit-inner-spin-button]:m-0 focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:shadow-none focus-visible:outline-none focus:border-[#f7641b] focus:border-2"
                            />
                            </div>
                        )}

                        <div className="flex items-center space-x-3">
                           <input
  type="radio"
  id="euro"
  name="discountType"
  value="euro"
  checked={discountType === "euro"}
  onChange={(e) => {
    setDiscountType(e.target.value);
    setDiscountValue("");
  }}
  className="hidden peer"
/>
<div
  className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-colors duration-200
    ${discountType === "euro" 
      ? "border-[#f7641b]" 
      : "border-[rgba(3,12,25,0.23)] dark:border-[hsla(0,0%,100%,0.35)]"
    }`}
>
  {discountType === "euro" && (
    <div className="w-2 h-2 rounded-full bg-[#f7641b]"></div>
  )}
</div>
<label
  htmlFor="euro"
  className="dark:text-white text-black text-sm cursor-pointer"
>
  Discount (₹)
</label>

                        </div>

                            {discountType === "euro" && (
                                <div className="relative w-[200px] mt-1">
                                <span className="absolute left-14 top-1/2 transform -translate-y-1/2 text-gray-400">€</span>
                                <Input
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    placeholder="0.00"
                                    value={discountValue}
                                    onChange={(e) => setDiscountValue(e.target.value)}
                                    className="pl-8 ml-11 w-full text-sm bg-[#fff] dark:bg-[#1d1f20] border border-[rgba(3,12,25,0.23)] dark:border-[hsla(0,0%,100%,0.35)] text-black dark:text-white rounded-lg [&::-webkit-inner-spin-button]:appearance-none
             [&::-webkit-outer-spin-button]:appearance-none
             [&::-webkit-inner-spin-button]:m-0 focus:outline-none focus:ring-0 focus:shadow-none focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:shadow-none focus-visible:outline-none focus:border-[#f7641b] focus:border-2"
                                />
                                </div>
                            )}
                    {/* Free shipping */}
                    <div className="flex items-center space-x-3">
                        <input
  type="radio"
  id="freeShipping"
  name="discountType"
  value="freeShipping"
  checked={discountType === "freeShipping"}
  onChange={(e) => {
    setDiscountType(e.target.value);
    setDiscountValue("");
  }}
  className="hidden peer"
/>
<div
  className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-colors duration-200
    ${discountType === "freeShipping" 
      ? "border-[#f7641b]" 
      : "border-[rgba(3,12,25,0.23)] dark:border-[hsla(0,0%,100%,0.35)]"
    }`}
>
  {discountType === "freeShipping" && (
    <div className="w-2 h-2 rounded-full bg-[#f7641b]"></div>
  )}
</div>
<label
  htmlFor="freeShipping"
  className="dark:text-white text-black text-sm cursor-pointer"
>
  Free shipping
</label>

                    </div>
                    {/* None of the above */}
                    <div className="flex items-center space-x-3">
                    <input
  type="radio"
  id="none"
  name="discountType"
  value="none"
  checked={discountType === "none"}
  onChange={(e) => {
    setDiscountType(e.target.value);
    setDiscountValue("");
  }}
  className="hidden peer"
/>
<div
  className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-colors duration-200
    ${discountType === "none" 
      ? "border-[#f7641b]" 
      : "border-[rgba(3,12,25,0.23)] dark:border-[hsla(0,0%,100%,0.35)]"
    }`}
>
  {discountType === "none" && (
    <div className="w-2 h-2 rounded-full bg-[#f7641b]"></div>
  )}
</div>
<label
  htmlFor="none"
  className="dark:text-white text-black text-sm cursor-pointer"
>
  None of the above
</label>

                    </div>
                    </div>

                    </div>
                    {/* Availability Section */}
                    <div className="space-y-4">
                        <h2 className="text-xl font-semibold dark:text-white text-black">Availability</h2>
                        <div className="flex w-full">
                            <Button
                                onClick={() => setAvailability("online")}
                                className={cn(
                                    "flex-1 py-3 border",
                                    availability === "online"
                                        ? "bg-[#fbf3ef] hover:bg-[#fbece3] border-[#f7641b] hover:border-[#eb611f] hover:text-[#eb611f] dark:bg-[#481802] text-[#f7641b]  dark:text-[#f97936] dark:border-[#f97936] dark:hover:border-[#f7641b] dark:hover:text-[#f7641b] dark:hover:bg-[#612203]"
                                        : "text-black bg-[#fff] hover:border-[#d7d9dd] hover:text-[#f7641b] hover:bg-[#fff] dark:bg-[#1d1f20] dark:hover:bg-[#1d1f20] dark:text-white dark:hover:border-[#525457] dark:hover:text-[#f97936]",
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
                                        ? "bg-[#fbf3ef] hover:bg-[#fbece3] border-[#f7641b] hover:border-[#eb611f] hover:text-[#eb611f] dark:bg-[#481802] text-[#f7641b]  dark:text-[#f97936] dark:border-[#f7641b] dark:hover:border-[#f7641b] dark:hover:text-[#f7641b] dark:hover:bg-[#612203]"
                                        : "text-black bg-[#fff] hover:border-[#d7d9dd] hover:text-[#f7641b] hover:bg-[#fff] dark:bg-[#1d1f20] dark:hover:bg-[#1d1f20] dark:text-white dark:hover:border-[#525457] dark:hover:text-[#f97936]",
                                    "rounded-r-full",
                                    "rounded-l-none",
                                )}
                            >
                                Offline
                            </Button>
                            
                        </div>
                        {availability === "offline" ? (
                                        <div className=" rounded-lg relative">
                                            <label className="dark:text-white text-sm font-semibold pb-[1.75px]">Select location(s)</label>
                                            <Input
                                                value={shippingFrom}
                                                onChange={(e) => setShippingFrom(e.target.value)}
                                                placeholder="Type to search or add city..."
                                                className="w-full border border-[rgba(3,12,25,0.23)] dark:border-[hsla(0,0%,100%,0.35)] text-black dark:bg-[#1d1f20] dark:text-white dark:focus:ring-0 focus:ring-0 placeholder:text-gray-400 rounded-lg pt-2 pb-2 pl-4 pr-4 dark:focus:border-[#f97936]"
                                                onFocus={() => setShowCityDropdown(true)}
                                                onBlur={() => setTimeout(() => setShowCityDropdown(false), 150)}
                                            />
                                            {showCityDropdown && (
                                                <ul className="absolute left-0 right-0 z-10 mt-2 max-h-56 overflow-y-auto bg-[#f3f5f7] dark:bg-[#23272f] rounded-lg shadow-lg border border-gray-200 dark:border-[#23272f] text-sm font-medium text-black dark:text-white">
                                                    {cityList.map((city) => (
                                                        <li
                                                            key={city}
                                                            className="px-4 py-2 cursor-pointer hover:bg-[#e3e4e8] dark:hover:bg-[#363739]"
                                                            onMouseDown={() => {
                                                                setShippingFrom(city)
                                                                setShowCityDropdown(false)
                                                            }}
                                                        >
                                                            {city}
                                                        </li>
                                                    ))}
                                                </ul>
                                            )}
                                        </div>
                                    ) : (<div> </div>
                                    )}
                    </div>
                </div>
            </div>
        )
    }

    function renderCase3Mobile() {
        return (
            <div className="flex items-center justify-center flex-1 p-2 animate-fade-in-up" style={{ animationDelay: "0.1s", animationFillMode: "both" }}>
                <div className="max-w-[682px] w-full space-y-8">
                    {/* Header */}
                    <div className="text-left">
                        <h1 className="text-2xl font-semibold text-[#000] dark:text-[#fff]">
                            Why is this offer worth sharing?
                        </h1>
                    </div>
                    {/* Description Text Area */}
                    <div className="">
                        <div className="">
                            {editor && <EditorContent editor={editor} />}
                            {descriptionError && (
                                <div className="text-red-500 text-xs mt-1">{descriptionError}</div>
                            )}
                            {/* Help Section for Description - animated */}
                            <div
                                className={cn(
                                    "transition-[height] duration-300 ease-in-out overflow-hidden absolute top-[353px] left-2 right-2 z-10",
                                    !descriptionFocused && "expand-leave-to",
                                )}
                                style={{ height: descriptionFocused ? 110 : 0 }}
                            >
                                <div className="bg-[#f3f5f7] dark:bg-[#363739] rounded-lg px-4 py-3 flex flex-col gap-1">
                                    <div className="flex items-center">
                                        <div className="flex items-center mr-1">
                                            <Info className="w-[18px] h-[18px] dark:text-[hsla(0,0%,100%,0.75)] text-black" />
                                        </div>
                                        <span className="font-semibold text-base text-black dark:text-[#e3e4e8]">
                                            Tell us about your deal.
                                        </span>
                                    </div>
                                    <div className="text-sm leading-5 dark:text-[hsla(0,0%,100%,0.75)] text-[rgba(4,8,13,0.59)] mt-1">
                                        Add the details about the product,links to relevant info/reviews and why you think it's a good deal
                                    </div>
                                </div>
                            </div>
                            {/* Formatting Toolbar */}
                            <div className="relative -top-14 w-fit left-2 inline-flex items-center gap-1 bg-[#fff] dark:bg-[#1d1f20] rounded-xl p-[7px] border border-[rgba(3,12,25,0.1)] dark:border-[#1d1f20] shadow-lg overflow-x-auto">
                                <Button variant="ghost" size="sm" className="icon-button flex-shrink-0" onMouseDown={e => e.preventDefault()} onClick={() => editor?.chain().focus().toggleBold().run()}><Bold className="h-4 w-4 stroke-[3.2]" /></Button>
                                <Button variant="ghost" size="sm" className="icon-button flex-shrink-0" onMouseDown={e => e.preventDefault()} onClick={() => editor?.chain().focus().toggleStrike().run()}><Strikethrough className="h-4 w-4 stroke-[3.2]" /></Button>
                                <Button variant="ghost" size="sm" className="icon-button flex-shrink-0" onMouseDown={e => e.preventDefault()} onClick={() => editor?.chain().focus().toggleItalic().run()}><Italic className="h-4 w-4 stroke-[3.2]" /></Button>
                                <Button variant="ghost" size="sm" className="icon-button flex-shrink-0" onMouseDown={e => e.preventDefault()} onClick={() => editor?.chain().focus().toggleBulletList().run()}><List className="h-4 w-4 stroke-[3.2]" /></Button>
                                <Button variant="ghost" size="sm" className="icon-button flex-shrink-0" onMouseDown={e => e.preventDefault()} onClick={() => editor?.chain().focus().setHorizontalRule().run()}><Minus className="h-4 w-4 stroke-[3.2]" /></Button>
                                <Button variant="ghost" size="sm" className="icon-button" onMouseDown={e => e.preventDefault()} onClick={() => setShowEmojiPicker((v) => !v)}><Smile className="h-4 w-4 stroke-[3.2]" /></Button>
                                {showEmojiPicker && (
                                    <div className="absolute bottom-12 left-0 bg-white dark:bg-[#23272f] border border-gray-200 dark:border-[#23272f] rounded-lg shadow-lg p-2 flex flex-wrap gap-1 z-50">
                                        {emojiList.map((emoji) => (
                                            <button key={emoji} className="text-xl p-1 hover:bg-gray-100 dark:hover:bg-[#363739] rounded" onMouseDown={e => e.preventDefault()} onClick={() => { editor?.chain().focus().insertContent(emoji).run(); setShowEmojiPicker(false); }}>{emoji}</button>
                                        ))}
                                    </div>
                                )}
                                <Button variant="ghost" size="sm" className="icon-button flex-shrink-0" onMouseDown={e => e.preventDefault()} onClick={() => setShowLinkInput(true)}><LinkIcon className="h-4 w-4 stroke-[3.2]" /></Button>
                                {showLinkInput && (
                                    <div className="absolute bottom-12 m-4 left-24 bg-white dark:bg-[#23272f] border border-gray-200 dark:border-[#23272f] rounded-lg shadow-lg p-6 flex flex-col gap-2 w-[350px]">
                                        {/* Arrow pointer at the bottom */}
                                        <div
                                            className="absolute -bottom-2 left-36 w-0 h-0"
                                            style={{
                                                borderLeft: "8px solid transparent",
                                                borderRight: "8px solid transparent",
                                                borderTop: "8px solid #fff",
                                            }}
                                        />
                                        {/* Heading with icon, text, and close button */}
                                        <div className="flex items-center justify-between mb-4">
                                            <div className="flex items-center gap-1">
                                                <Link2 className="h-6 w-6 text-black dark:text-white" />
                                                <span className="font-semibold text-lg text-black dark:text-white">Link</span>
                                            </div>
                                            <button
                                                onClick={() => setShowLinkInput(false)}
                                                className="p-1 rounded-full hover:bg-[rgba(15,55,95,0.05)] dark:hover:bg-[#363739] text-[#6b6d70] hover:text-[#76787b] dark:hover:text-white"
                                                aria-label="Close"
                                            >
                                                <X className="h-6 w-6" />
                                            </button>
                                        </div>
                                        <div className="flex flex-col space-y-8">
                                            <div className="flex flex-col space-y-2">
                                                <label className="text-[12.25px] text-black dark:text-white font-semibold">URL</label>
                                                <input
                                                    type="text"
                                                    value={linkURL}
                                                    onChange={(e) => setLinkURL(e.target.value)}
                                                    className="pt-[9px] pb-[9px] pl-[16px] pr-[16px] rounded-lg border border-[rgba(3,12,25,0.23)] dark:bg-[#2d2f31] focus:border-[#f7641b] outline-none dark:text-white text-black text-sm"
                                                />
                                            </div>
                                            <div className="flex flex-col space-y-2">
                                                <label className="text-[12.25px] text-black dark:text-white font-semibold">Text</label>
                                                <input
                                                    type="text"
                                                    value={linkText}
                                                    onChange={(e) => setLinkText(e.target.value)}
                                                    className="pt-[9px] pb-[9px] pl-[16px] pr-[16px] rounded-lg border border-[rgba(3,12,25,0.23)] dark:bg-[#2d2f31] focus:border-[#f7641b] outline-none dark:text-white text-black text-sm"
                                                />
                                                <div className="pt-4">
                                                    <button
                                                        onClick={() => {
                                                            if (!editorRef.current) return
                                                            editorRef.current.focus()
                                                            if (savedSelection) {
                                                                const selection = window.getSelection()
                                                                selection?.removeAllRanges()
                                                                selection?.addRange(savedSelection)
                                                            }
                                                            const selection = window.getSelection()
                                                            if (!selection || !selection.rangeCount) return
                                                            const range = selection.getRangeAt(0)
                                                            range.deleteContents()
                                                            // Create a real <a> element
                                                            const a = document.createElement("a")
                                                            a.href = linkURL
                                                            a.textContent = linkText || linkURL
                                                            a.target = "_blank"
                                                            a.rel = "noopener noreferrer"
                                                            range.insertNode(a)
                                                            // Move caret after link
                                                            range.setStartAfter(a)
                                                            range.collapse(true)
                                                            selection.removeAllRanges()
                                                            selection.addRange(range)
                                                            setShowLinkInput(false)
                                                            setLinkURL("")
                                                            setLinkText("")
                                                            setDescription(editorRef.current.innerHTML)
                                                        }}
                                                        disabled={!linkURL.trim()}
                                                        className={
                                                            `text-sm h-9 font-medium  text-white px-3 py-1 w-full rounded-full  ` +
                                                            (!linkURL.trim()
                                                                ? "bg-[#f3f5f7] text-[#a7a9ac] cursor-not-allowed"
                                                                : "text-white bg-[#f7641b] hover:bg-[#eb611f] shadow-[#f7641b] hover:shadow-[#eb611f]")
                                                        }
                                                    >
                                                        Insert
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="icon-button flex-shrink-0"
                                    onMouseDown={(e) => e.preventDefault()}
                                    onClick={() => {
                                        setShowImageInput(true)
                                        // Save the current selection
                                        const selection = window.getSelection()
                                        if (selection && selection.rangeCount > 0) {
                                            setSavedSelection(selection.getRangeAt(0))
                                        }
                                    }}
                                >
                                    <ImageIcon className="h-4 w-4 stroke-[3.2]" />
                                </Button>
                                {showImageInput && (
                                    <div className="absolute bottom-12 m-4 left-48 bg-white dark:bg-[#23272f] border border-gray-200 dark:border-[#23272f] rounded-lg shadow-lg p-6 flex flex-col gap-2 z-50 w-[350px]">
                                        {/* Arrow pointer at the bottom */}
                                        <div
                                            className="absolute -bottom-2 left-36 w-0 h-0"
                                            style={{
                                                borderLeft: "8px solid transparent",
                                                borderRight: "8px solid transparent",
                                                borderTop: "8px solid #fff",
                                            }}
                                        />
                                        {/* Heading with icon, text, and close button */}
                                        <div className="flex items-center justify-between mb-4">
                                            <div className="flex items-center gap-1">
                                                <ImageIcon className="h-6 w-6 text-black dark:text-white" />
                                                <span className="font-semibold text-lg text-black dark:text-white">Add Image</span>
                                            </div>
                                            <button
                                                onClick={() => setShowImageInput(false)}
                                                className="p-1 rounded-full hover:bg-[rgba(15,55,95,0.05)] dark:hover:bg-[#363739] text-[#6b6d70] hover:text-[#76787b] dark:hover:text-white"
                                                aria-label="Close"
                                            >
                                                <X className="h-6 w-6" />
                                            </button>
                                        </div>
                                        <div className="flex flex-col space-y-8">
                                            {/* Upload image section */}
                                            <div className="flex flex-col space-y-2">
                                                <label className="text-[12.25px] text-black dark:text-white font-semibold">
                                                    Upload image
                                                </label>
                                                <div className="flex items-center gap-3">
                                                    <input
                                                        type="file"
                                                        accept="image/*"
                                                        className="hidden"
                                                        id="image-upload-input"
                                                        onChange={handleImageFileChange}
                                                    />
                                                    <label
                                                        htmlFor="image-upload-input"
                                                        className="px-3 py-2 h-9 rounded-full w-fit border border-[#f7641b] text-[#f7641b] bg-white hover:bg-[#fbece3] dark:bg-[#481802] dark:text-[#f97936] dark:border-[#f97936] dark:hover:border-[#f7641b] dark:hover:text-[#f7641b] dark:hover:bg-[#612203] text-sm font-medium cursor-pointer"
                                                    >
                                                        Choose
                                                    </label>
                                                    <span className="text-sm text-[#a7a9ac] dark:text-[#8b8d90]">
                                                        {imageInsertFile ? imageInsertFile.name : "Nothing selected"}
                                                    </span>
                                                </div>
                                            </div>
                                            {/* Image from URL section */}
                                            <div className="flex flex-col space-y-2">
                                                <label className="text-[12.25px] text-black dark:text-white font-semibold">
                                                    Image from URL
                                                </label>
                                                <input
                                                    type="text"
                                                    placeholder="Image URL"
                                                    value={imageInsertUrl}
                                                    onChange={handleImageUrlChange}
                                                    className="pt-[9px] pb-[9px] pl-[16px] pr-[16px] rounded-lg border border-[rgba(3,12,25,0.23)] dark:bg-[#2d2f31] focus:border-[#f7641b] outline-none dark:text-white text-black text-sm"
                                                />
                                                {/* Placement options */}
                                                <span className="text-[12.25px] text-black dark:text-white font-semibold mr-2 pt-4">
                                                    Placement:
                                                </span>
                                                <div className="flex flex-row mt-1 w-full">
                                                    <button
                                                        onClick={() => setSelected("left")}
                                                        className={cn(
                                                            "w-1/2 py-2 h-9 rounded-l-full border text-sm font-medium focus:outline-none flex flex-row justify-center items-center gap-1",
                                                            selected === "left"
                                                                ? "bg-[#f7641b] border-[#f7641b] text-white hover:bg-[#eb611f] hover:border-[#eb611f] "
                                                                : "text-[#6b6d70] border-[#dfe1e4] hover:bg-white hover:text-[#f7641b] hover:border-[#dfe1e4] ",
                                                        )}
                                                    >
                                                        <AlignLeft className="h-6 w-6" />
                                                        <span>Left</span>
                                                    </button>
                                                    <button
                                                        onClick={() => setSelected("middle")}
                                                        className={cn(
                                                            "w-1/2 py-2 h-9 -ml-[1px] rounded-r-full border text-sm font-medium focus:outline-none flex flex-row justify-center items-center gap-1",
                                                            selected === "middle"
                                                                ? "bg-[#f7641b] border-[#f7641b] text-white hover:bg-[#eb611f] hover:border-[#eb611f] "
                                                                : "text-[#6b6d70] border-[#dfe1e4] hover:bg-white hover:text-[#f7641b] hover:border-[#dfe1e4] ",
                                                        )}
                                                    >
                                                        <AlignCenter className="h-6 w-6" />
                                                        <span>Middle</span>
                                                    </button>
                                                </div>

                                                <div className="pt-4">
                                                    <button
                                                        onClick={handlePlaceImage}
                                                        className="text-sm h-9 font-medium text-white px-3 py-1 w-full rounded-full bg-[#f7641b] hover:bg-[#eb611f] shadow-[#f7641b] hover:shadow-[#eb611f]"
                                                        disabled={!imageInsertFile && !imageInsertUrl}
                                                    >
                                                        Place image
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    function renderCase3Desktop() {
        // Use your existing desktop JSX for case 3 here (copy from your current case 3)
        return (
            <div className="flex items-center justify-center flex-1 p-2 md:p-0 animate-fade-in-up min-h-screen w-full" style={{ animationDelay: "0.1s", animationFillMode: "both" }}>
                <div className="max-w-[682px] w-full space-y-8">
                    {/* Header */}
                    <div className="text-left">
                        <h1 className="text-2xl md:text-[32px] leading-8 md:leading-10 font-semibold text-[#000] dark:text-[#fff]">
                            Why is your discount code worth sharing?
                        </h1>
                    </div>
                    {/* Description Text Area */}
                    <div className="space-y-4">
                        <div className="relative h-[400px] ">
                            {editor && <EditorContent editor={editor} />}
                            {descriptionError && (
                                <div className="text-red-500 text-xs mt-1">{descriptionError}</div>
                            )}
                            
                            {/* Formatting Toolbar */}
                            <div className="relative -top-14 w-fit left-2 inline-flex items-center gap-1 bg-[#fff] dark:bg-[#1d1f20] rounded-xl p-[7px] border border-[rgba(3,12,25,0.1)] dark:border-[#1d1f20] shadow-lg overflow-x-auto">
                                <Button variant="ghost" size="sm" className="icon-button flex-shrink-0" onMouseDown={e => e.preventDefault()} onClick={() => editor?.chain().focus().toggleBold().run()}><Bold className="h-4 w-4 stroke-[3.2]" /></Button>
                                <Button variant="ghost" size="sm" className="icon-button flex-shrink-0" onMouseDown={e => e.preventDefault()} onClick={() => editor?.chain().focus().toggleStrike().run()}><Strikethrough className="h-4 w-4 stroke-[3.2]" /></Button>
                                <Button variant="ghost" size="sm" className="icon-button flex-shrink-0" onMouseDown={e => e.preventDefault()} onClick={() => editor?.chain().focus().toggleItalic().run()}><Italic className="h-4 w-4 stroke-[3.2]" /></Button>
                                <Button variant="ghost" size="sm" className="icon-button flex-shrink-0" onMouseDown={e => e.preventDefault()} onClick={() => editor?.chain().focus().toggleBulletList().run()}><List className="h-4 w-4 stroke-[3.2]" /></Button>
                                <Button variant="ghost" size="sm" className="icon-button flex-shrink-0" onMouseDown={e => e.preventDefault()} onClick={() => editor?.chain().focus().setHorizontalRule().run()}><Minus className="h-4 w-4 stroke-[3.2]" /></Button>
                                <Button variant="ghost" size="sm" className="icon-button" onMouseDown={e => e.preventDefault()} onClick={() => setShowEmojiPicker((v) => !v)}><Smile className="h-4 w-4 stroke-[3.2]" /></Button>
                                {showEmojiPicker && (
                                    <div className="absolute bottom-12 left-0 bg-white dark:bg-[#23272f] border border-gray-200 dark:border-[#23272f] rounded-lg shadow-lg p-2 flex flex-wrap gap-1 z-50">
                                        {emojiList.map((emoji) => (
                                            <button key={emoji} className="text-xl p-1 hover:bg-gray-100 dark:hover:bg-[#363739] rounded" onMouseDown={e => e.preventDefault()} onClick={() => { editor?.chain().focus().insertContent(emoji).run(); setShowEmojiPicker(false); }}>{emoji}</button>
                                        ))}
                                    </div>
                                )}
                                <Button variant="ghost" size="sm" className="icon-button flex-shrink-0" onMouseDown={e => e.preventDefault()} onClick={() => setShowLinkInput(true)}><LinkIcon className="h-4 w-4 stroke-[3.2]" /></Button>
                                {showLinkInput && (
                                    <div className="absolute bottom-12 m-4 left-24 bg-white dark:bg-[#23272f] border border-gray-200 dark:border-[#23272f] rounded-lg shadow-lg p-6 flex flex-col gap-2 w-[350px]">
                                        {/* Arrow pointer at the bottom */}
                                        <div
                                            className="absolute -bottom-2 left-36 w-0 h-0"
                                            style={{
                                                borderLeft: "8px solid transparent",
                                                borderRight: "8px solid transparent",
                                                borderTop: "8px solid #fff",
                                            }}
                                        />
                                        {/* Heading with icon, text, and close button */}
                                        <div className="flex items-center justify-between mb-4">
                                            <div className="flex items-center gap-1">
                                                <Link2 className="h-6 w-6 text-black dark:text-white" />
                                                <span className="font-semibold text-lg text-black dark:text-white">Link</span>
                                            </div>
                                            <button
                                                onClick={() => setShowLinkInput(false)}
                                                className="p-1 rounded-full hover:bg-[rgba(15,55,95,0.05)] dark:hover:bg-[#363739] text-[#6b6d70] hover:text-[#76787b] dark:hover:text-white"
                                                aria-label="Close"
                                            >
                                                <X className="h-6 w-6" />
                                            </button>
                                        </div>
                                        <div className="flex flex-col space-y-8">
                                            <div className="flex flex-col space-y-2">
                                                <label className="text-[12.25px] text-black dark:text-white font-semibold">URL</label>
                                                <input
                                                    type="text"
                                                    value={linkURL}
                                                    onChange={(e) => setLinkURL(e.target.value)}
                                                    className="pt-[9px] pb-[9px] pl-[16px] pr-[16px] rounded-lg border border-[rgba(3,12,25,0.23)] dark:bg-[#2d2f31] focus:border-[#f7641b] outline-none dark:text-white text-black text-sm"
                                                />
                                            </div>
                                            <div className="flex flex-col space-y-2">
                                                <label className="text-[12.25px] text-black dark:text-white font-semibold">Text</label>
                                                <input
                                                    type="text"
                                                    value={linkText}
                                                    onChange={(e) => setLinkText(e.target.value)}
                                                    className="pt-[9px] pb-[9px] pl-[16px] pr-[16px] rounded-lg border border-[rgba(3,12,25,0.23)] dark:bg-[#2d2f31] focus:border-[#f7641b] outline-none dark:text-white text-black text-sm"
                                                />
                                                <div className="pt-4">
                                                    <button
                                                        onClick={() => {
                                                            if (!editorRef.current) return
                                                            editorRef.current.focus()
                                                            if (savedSelection) {
                                                                const selection = window.getSelection()
                                                                selection?.removeAllRanges()
                                                                selection?.addRange(savedSelection)
                                                            }
                                                            const selection = window.getSelection()
                                                            if (!selection || !selection.rangeCount) return
                                                            const range = selection.getRangeAt(0)
                                                            range.deleteContents()
                                                            // Create a real <a> element
                                                            const a = document.createElement("a")
                                                            a.href = linkURL
                                                            a.textContent = linkText || linkURL
                                                            a.target = "_blank"
                                                            a.rel = "noopener noreferrer"
                                                            range.insertNode(a)
                                                            // Move caret after link
                                                            range.setStartAfter(a)
                                                            range.collapse(true)
                                                            selection.removeAllRanges()
                                                            selection.addRange(range)
                                                            setShowLinkInput(false)
                                                            setLinkURL("")
                                                            setLinkText("")
                                                            setDescription(editorRef.current.innerHTML)
                                                        }}
                                                        disabled={!linkURL.trim()}
                                                        className={
                                                            `text-sm h-9 font-medium  text-white px-3 py-1 w-full rounded-full  ` +
                                                            (!linkURL.trim()
                                                                ? "bg-[#f3f5f7] text-[#a7a9ac] cursor-not-allowed"
                                                                : "text-white bg-[#f7641b] hover:bg-[#eb611f] shadow-[#f7641b] hover:shadow-[#eb611f]")
                                                        }
                                                    >
                                                        Insert
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="icon-button flex-shrink-0"
                                    onMouseDown={(e) => e.preventDefault()}
                                    onClick={() => {
                                        setShowImageInput(true)
                                        // Save the current selection
                                        const selection = window.getSelection()
                                        if (selection && selection.rangeCount > 0) {
                                            setSavedSelection(selection.getRangeAt(0))
                                        }
                                    }}
                                >
                                    <ImageIcon className="h-4 w-4 stroke-[3.2]" />
                                </Button>
                                {showImageInput && (
                                    <div className="absolute bottom-12 m-4 left-48 bg-white dark:bg-[#23272f] border border-gray-200 dark:border-[#23272f] rounded-lg shadow-lg p-6 flex flex-col gap-2 z-50 w-[350px]">
                                        {/* Arrow pointer at the bottom */}
                                        <div
                                            className="absolute -bottom-2 left-36 w-0 h-0"
                                            style={{
                                                borderLeft: "8px solid transparent",
                                                borderRight: "8px solid transparent",
                                                borderTop: "8px solid #fff",
                                            }}
                                        />
                                        {/* Heading with icon, text, and close button */}
                                        <div className="flex items-center justify-between mb-4">
                                            <div className="flex items-center gap-1">
                                                <ImageIcon className="h-6 w-6 text-black dark:text-white" />
                                                <span className="font-semibold text-lg text-black dark:text-white">Add Image</span>
                                            </div>
                                            <button
                                                onClick={() => setShowImageInput(false)}
                                                className="p-1 rounded-full hover:bg-[rgba(15,55,95,0.05)] dark:hover:bg-[#363739] text-[#6b6d70] hover:text-[#76787b] dark:hover:text-white"
                                                aria-label="Close"
                                            >
                                                <X className="h-6 w-6" />
                                            </button>
                                        </div>
                                        <div className="flex flex-col space-y-8">
                                            {/* Upload image section */}
                                            <div className="flex flex-col space-y-2">
                                                <label className="text-[12.25px] text-black dark:text-white font-semibold">
                                                    Upload image
                                                </label>
                                                <div className="flex items-center gap-3">
                                                    <input
                                                        type="file"
                                                        accept="image/*"
                                                        className="hidden"
                                                        id="image-upload-input"
                                                        onChange={handleImageFileChange}
                                                    />
                                                    <label
                                                        htmlFor="image-upload-input"
                                                        className="px-3 py-2 h-9 rounded-full w-fit border border-[#f7641b] text-[#f7641b] bg-white hover:bg-[#fbece3] dark:bg-[#481802] dark:text-[#f97936] dark:border-[#f97936] dark:hover:border-[#f7641b] dark:hover:text-[#f7641b] dark:hover:bg-[#612203] text-sm font-medium cursor-pointer"
                                                    >
                                                        Choose
                                                    </label>
                                                    <span className="text-sm text-[#a7a9ac] dark:text-[#8b8d90]">
                                                        {imageInsertFile ? imageInsertFile.name : "Nothing selected"}
                                                    </span>
                                                </div>
                                            </div>
                                            {/* Image from URL section */}
                                            <div className="flex flex-col space-y-2">
                                                <label className="text-[12.25px] text-black dark:text-white font-semibold">
                                                    Image from URL
                                                </label>
                                                <input
                                                    type="text"
                                                    placeholder="Image URL"
                                                    value={imageInsertUrl}
                                                    onChange={handleImageUrlChange}
                                                    className="pt-[9px] pb-[9px] pl-[16px] pr-[16px] rounded-lg border border-[rgba(3,12,25,0.23)] dark:bg-[#2d2f31] focus:border-[#f7641b] outline-none dark:text-white text-black text-sm"
                                                />
                                                {/* Placement options */}
                                                <span className="text-[12.25px] text-black dark:text-white font-semibold mr-2 pt-4">
                                                    Placement:
                                                </span>
                                                <div className="flex flex-row mt-1 w-full">
                                                    <button
                                                        onClick={() => setSelected("left")}
                                                        className={cn(
                                                            "w-1/2 py-2 h-9 rounded-l-full border text-sm font-medium focus:outline-none flex flex-row justify-center items-center gap-1",
                                                            selected === "left"
                                                                ? "bg-[#f7641b] border-[#f7641b] text-white hover:bg-[#eb611f] hover:border-[#eb611f] "
                                                                : "text-[#6b6d70] border-[#dfe1e4] hover:bg-white hover:text-[#f7641b] hover:border-[#dfe1e4] ",
                                                        )}
                                                    >
                                                        <AlignLeft className="h-6 w-6" />
                                                        <span>Left</span>
                                                    </button>
                                                    <button
                                                        onClick={() => setSelected("middle")}
                                                        className={cn(
                                                            "w-1/2 py-2 h-9 -ml-[1px] rounded-r-full border text-sm font-medium focus:outline-none flex flex-row justify-center items-center gap-1",
                                                            selected === "middle"
                                                                ? "bg-[#f7641b] border-[#f7641b] text-white hover:bg-[#eb611f] hover:border-[#eb611f] "
                                                                : "text-[#6b6d70] border-[#dfe1e4] hover:bg-white hover:text-[#f7641b] hover:border-[#dfe1e4] ",
                                                        )}
                                                    >
                                                        <AlignCenter className="h-6 w-6" />
                                                        <span>Middle</span>
                                                    </button>
                                                </div>

                                                <div className="pt-4">
                                                    <button
                                                        onClick={handlePlaceImage}
                                                        className="text-sm h-9 font-medium text-white px-3 py-1 w-full rounded-full bg-[#f7641b] hover:bg-[#eb611f] shadow-[#f7641b] hover:shadow-[#eb611f]"
                                                        disabled={!imageInsertFile && !imageInsertUrl}
                                                    >
                                                        Place image
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    const renderStepContent = () => {
        switch (currentStep) {
            case 0:
                return (
                    <>
                        <div className="block md:hidden p-2">{renderCase0Mobile()}</div>
                        <div className="hidden md:block min-h-screen w-full ">{renderCase0Desktop()}</div>
                    </>
                )
            case 1:
                return (
                    <>
                        <div className="block md:hidden h-auto overflow-y-auto p-2">{renderCase1Mobile()}</div>
                        <div className="hidden md:block w-full">
                            {/* Restore the original desktop JSX for case 1 here */}
                            <div
                                className="flex flex-col items-center justify-center flex-1 animate-fade-in-up !m-0 !p-0  h-full w-full "
                                style={{ animationDelay: "0.1s", animationFillMode: "both" }}
                            >
                                <div className="w-full  max-w-2xl mx-auto space-y-8">
                                    <h1 className="text-2xl md:text-3xl font-semibold text-[#000] dark:text-[#fff] text-left mb-8">
                                        Let's start with the essential information
                                    </h1>
                                    {/* Title Section */}
                                    <div className="">
                                        <div className="flex justify-between items-center">
                                            <label className="dark:text-white text-black text-sm font-semibold pb-[1.75px]">
                                                discount code title <span className="text-[rgba(4,8,13,0.59)] dark:text-[hsla(0,0%,100%,0.75)] font-normal">(required)</span>
                                            </label>
                                            <span className="dark:text-[hsla(0,0%,100%,0.75)] text-sm">{140 - discount.length}</span>
                                        </div>
                                        <Input
                                            value={discount}
                                            onChange={e => {
                                                setDiscount(e.target.value);
                                                if (discountError) setDiscountError("");
                                            }}
                                            placeholder="A short description of the discount code..."
                                            className={cn(
                                                "w-full border text-black dark:border-[hsla(0,0%,100%,0.35)] dark:bg-[#1d1f20] dark:text-white dark:focus:ring-0 placeholder:text-gray-400 rounded-lg pt-2 pb-2 pl-4 pr-4 dark:focus:border-[#f97936]",
                                                discountError ? "border-red-500 focus:border-red-500" : "border-[rgba(3,12,25,0.23)]"
                                            )}
                                            onFocus={() => setDiscountFocused(true)}
                                            onBlur={() => setDiscountFocused(false)}
                                        />
                                        {discountError && (
                                            <div className="text-red-500 text-xs mt-1">{discountError}</div>
                                        )}
                                        
                                    </div>
                                    {/* Discount Details Section */}
                                    <div className="">
                                        <h2 className="text-xl font-semibold dark:text-white text-black pb-4">Discount type <span className="text-sm text-[rgba(4,8,13,0.59)] dark:text-[hsla(0,0%,100%,0.75)] font-normal">(required)</span></h2>
                                        <div className="space-y-3">
                                        <div className="flex items-center space-x-3">
                                           <label
  htmlFor="percentage"
  className="flex items-center space-x-3 cursor-pointer"
>
  <input
    type="radio"
    id="percentage"
    name="discountType"
    value="percentage"
    checked={discountType === "percentage"}
    onChange={(e) => {
      setDiscountType(e.target.value);
      setDiscountValue("");
    }}
    className="hidden peer"
  />
  <div
    className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-colors duration-200
      ${discountType === "percentage" 
        ? "border-[#f7641b]" 
        : "border-[rgba(3,12,25,0.23)] dark:border-[hsla(0,0%,100%,0.35)]"
      }`}
  >
    {discountType === "percentage" && (
      <div className="w-2 h-2 rounded-full bg-[#f7641b]"></div>
    )}
  </div>
  <span className="dark:text-white text-black text-sm">Discount (%)</span>
</label>

                                        </div>

                                        {discountType === "percentage" && (
                                            <div className="relative w-[200px] mt-1">
                                            <span className="absolute left-14 top-1/2 transform -translate-y-1/2 text-gray-400">%</span>
                                            <Input
                                                type="number"
                                                step="0.01"
                                                min="0"
                                                placeholder="0.00"
                                                value={discountValue}
                                                onChange={(e) => setDiscountValue(e.target.value)}
                                                className="pl-8 ml-11 w-full text-sm bg-[#fff] dark:bg-[#1d1f20] border border-[rgba(3,12,25,0.23)] dark:border-[hsla(0,0%,100%,0.35)] text-black dark:text-white rounded-lg [&::-webkit-inner-spin-button]:appearance-none
             [&::-webkit-outer-spin-button]:appearance-none
             [&::-webkit-inner-spin-button]:m-0 focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:shadow-none focus-visible:outline-none focus:border-[#f7641b] focus:border-2"
                                            />
                                            </div>
                                        )}

                                        <div className="flex items-center space-x-3">
                                           <input
  type="radio"
  id="euro"
  name="discountType"
  value="euro"
  checked={discountType === "euro"}
  onChange={(e) => {
    setDiscountType(e.target.value);
    setDiscountValue("");
  }}
  className="hidden peer"
/>
<div
  className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-colors duration-200
    ${discountType === "euro" 
      ? "border-[#f7641b]" 
      : "border-[rgba(3,12,25,0.23)] dark:border-[hsla(0,0%,100%,0.35)]"
    }`}
>
  {discountType === "euro" && (
    <div className="w-2 h-2 rounded-full bg-[#f7641b]"></div>
  )}
</div>
<label
  htmlFor="euro"
  className="dark:text-white text-black text-sm cursor-pointer"
>
  Discount (₹)
</label>

                                        </div>

                                            {discountType === "euro" && (
                                                <div className="relative w-[200px] mt-1">
                                                <span className="absolute left-14 top-1/2 transform -translate-y-1/2 text-gray-400">€</span>
                                                <Input
                                                    type="number"
                                                    step="0.01"
                                                    min="0"
                                                    placeholder="0.00"
                                                    value={discountValue}
                                                    onChange={(e) => setDiscountValue(e.target.value)}
                                                    className="pl-8 ml-11 w-full text-sm bg-[#fff] dark:bg-[#1d1f20] border border-[rgba(3,12,25,0.23)] dark:border-[hsla(0,0%,100%,0.35)] text-black dark:text-white rounded-lg [&::-webkit-inner-spin-button]:appearance-none
             [&::-webkit-outer-spin-button]:appearance-none
             [&::-webkit-inner-spin-button]:m-0 focus:outline-none focus:ring-0 focus:shadow-none focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:shadow-none focus-visible:outline-none focus:border-[#f7641b] focus:border-2"
                                                />
                                                </div>
                                            )}
                                    {/* Free shipping */}
                                    <div className="flex items-center space-x-3">
                                        <input
  type="radio"
  id="freeShipping"
  name="discountType"
  value="freeShipping"
  checked={discountType === "freeShipping"}
  onChange={(e) => {
    setDiscountType(e.target.value);
    setDiscountValue("");
  }}
  className="hidden peer"
/>
<div
  className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-colors duration-200
    ${discountType === "freeShipping" 
      ? "border-[#f7641b]" 
      : "border-[rgba(3,12,25,0.23)] dark:border-[hsla(0,0%,100%,0.35)]"
    }`}
>
  {discountType === "freeShipping" && (
    <div className="w-2 h-2 rounded-full bg-[#f7641b]"></div>
  )}
</div>
<label
  htmlFor="freeShipping"
  className="dark:text-white text-black text-sm cursor-pointer"
>
  Free shipping
</label>

                                    </div>
                                    {/* None of the above */}
                                    <div className="flex items-center space-x-3">
                                    <input
  type="radio"
  id="none"
  name="discountType"
  value="none"
  checked={discountType === "none"}
  onChange={(e) => {
    setDiscountType(e.target.value);
    setDiscountValue("");
  }}
  className="hidden peer"
/>
<div
  className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-colors duration-200
    ${discountType === "none" 
      ? "border-[#f7641b]" 
      : "border-[rgba(3,12,25,0.23)] dark:border-[hsla(0,0%,100%,0.35)]"
    }`}
>
  {discountType === "none" && (
    <div className="w-2 h-2 rounded-full bg-[#f7641b]"></div>
  )}
</div>
<label
  htmlFor="none"
  className="dark:text-white text-black text-sm cursor-pointer"
>
  None of the above
</label>

                                    </div>

                                    </div>

                                    </div>
                                   
                                    {/* Availability Section */}
                                    <div className="space-y-4">
                                        <h2 className="text-xl font-semibold dark:text-white text-black">Availability</h2>
                                        <div className="flex w-full">
                                            <Button
                                                onClick={() => setAvailability("online")}
                                                className={cn(
                                                    "flex-1 py-3 border",
                                                    availability === "online"
                                                        ? "bg-[#fbf3ef] hover:bg-[#fbece3] border-[#f7641b] hover:border-[#eb611f] hover:text-[#eb611f] dark:bg-[#481802] text-[#f7641b]  dark:text-[#f97936] dark:border-[#f97936] dark:hover:border-[#f7641b] dark:hover:text-[#f7641b] dark:hover:bg-[#612203]"
                                                        : "text-black bg-[#fff] hover:border-[#d7d9dd] hover:text-[#f7641b] hover:bg-[#fff] dark:bg-[#1d1f20] dark:hover:bg-[#1d1f20] dark:text-white dark:hover:border-[#525457] dark:hover:text-[#f97936]",
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
                                                        ? "bg-[#fbf3ef] hover:bg-[#fbece3] border-[#f7641b] hover:border-[#eb611f] hover:text-[#eb611f] dark:bg-[#481802] text-[#f7641b]  dark:text-[#f97936] dark:border-[#f97936] dark:hover:border-[#f7641b] dark:hover:text-[#f7641b] dark:hover:bg-[#612203]"
                                                        : "text-black bg-[#fff] hover:border-[#d7d9dd] hover:text-[#f7641b] hover:bg-[#fff] dark:bg-[#1d1f20] dark:hover:bg-[#1d1f20] dark:text-white dark:hover:border-[#525457] dark:hover:text-[#f97936]",
                                                    "rounded-r-full", // Right outer corner rounded
                                                    "rounded-l-none", // Inner corner flat
                                                )}
                                            >
                                                Offline
                                            </Button>
                                        </div>
                                    </div>
                                    {/* Postage and Shipping Section or Location Selection for Offline */}
                                    {availability === "offline" ? (
                                        <div className=" rounded-lg relative">
                                            <label className="dark:text-white text-sm font-semibold pb-[1.75px]">Select location(s)</label>
                                            <Input
                                                value={shippingFrom}
                                                onChange={(e) => setShippingFrom(e.target.value)}
                                                placeholder="Type to search or add city..."
                                                className="w-full border border-[rgba(3,12,25,0.23)] dark:border-[hsla(0,0%,100%,0.35)] text-black dark:bg-[#1d1f20] dark:text-white dark:focus:ring-0 focus:ring-0 placeholder:text-gray-400 rounded-lg pt-2 pb-2 pl-4 pr-4 dark:focus:border-[#f97936]"
                                                onFocus={() => setShowCityDropdown(true)}
                                                onBlur={() => setTimeout(() => setShowCityDropdown(false), 150)}
                                            />
                                            {showCityDropdown && (
                                                <ul className="absolute left-0 right-0 z-10 mt-2 max-h-56 overflow-y-auto bg-[#f3f5f7] dark:bg-[#23272f] rounded-lg shadow-lg border border-gray-200 dark:border-[#23272f] text-sm font-medium text-black dark:text-white">
                                                    {cityList.map((city) => (
                                                        <li
                                                            key={city}
                                                            className="px-4 py-2 cursor-pointer hover:bg-[#e3e4e8] dark:hover:bg-[#363739]"
                                                            onMouseDown={() => {
                                                                setShippingFrom(city)
                                                                setShowCityDropdown(false)
                                                            }}
                                                        >
                                                            {city}
                                                        </li>
                                                    ))}
                                                </ul>
                                            )}
                                        </div>
                                    ) : (<div> </div>
                                        // <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        //     <div className="">
                                        //         <label className="dark:text-white font-semibold text-black text-sm pb-[1.75px]">
                                        //             Postage costs
                                        //         </label>
                                        //         <div className="relative">
                                        //             <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">₹</span>
                                        //             <Input
                                        //                 value={postageCosts}
                                        //                 onChange={(e) => setPostageCosts(e.target.value)}
                                        //                 placeholder="0.00"
                                        //                 className="w-full border border-[rgba(3,12,25,0.23)] dark:border-[hsla(0,0%,100%,0.35)] text-black dark:bg-[#1d1f20] dark:text-white placeholder:text-gray-400 rounded-lg pt-2 pb-2 pl-9 pr-4 focus:outline-none !focus:ring-0 focus:border-[#f97936] dark:focus:ring-0 dark:focus:border-[#f97936]"
                                        //             />
                                        //         </div>
                                        //     </div>
                                        //     <div className="">
                                        //         <label className="dark:text-white font-semibold text-sm pb-[1.75px]">Shipping from</label>
                                        //         <div className="relative">
                                        //             <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                                        //             <Input
                                        //                 value={shippingFrom}
                                        //                 onChange={(e) => setShippingFrom(e.target.value)}
                                        //                 placeholder="Search..."
                                        //                 className="w-full border border-[rgba(3,12,25,0.23)] dark:border-[hsla(0,0%,100%,0.35)] text-black dark:bg-[#1d1f20] dark:text-white dark:focus:ring-0 placeholder:text-gray-400 rounded-lg pt-2 pb-2 pl-9 pr-4 dark:focus:border-[#f97936]"
                                        //             />
                                        //         </div>
                                        //     </div>
                                        // </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </>
                )
            case 2:
                return (
                    <div
                        className="flex items-center justify-center flex-1 p-2 md:p-0 animate-fade-in-up"
                        style={{ animationDelay: "0.1s", animationFillMode: "both" }}
                    >
                        <div className="max-w-[682px] space-y-8 w-full">
                            <div className="text-left mt-8 md:mt-28 space-y-6">
                                <h1 className="text-2xl md:text-[32px] font-bold text-[#000] dark:text-[#fff]">
                                    Make your deal stand out with images
                                </h1>
                                <p className="text-base md:text-lg text-[rgba(4,8,13,0.59)] dark:text-[hsla(0,0%,100%,0.75)]">
                                    Upload up to 8 images to post your discount code. You can drag and drop to rearrange them and choose the cover.
                                </p>
                            </div>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-w-3xl mx-auto border border-dashed border-[rgba(9,24,47,0.13)] dark:border-[hsla(0,0%,100%,0.18)] p-4 rounded-lg">
                                {/* Render uploaded images */}
                                {uploadedImages.map((image, index) => (
                                    <div key={image.id} className="relative group">
                                        <div className="aspect-square bg-[#525457] rounded-lg overflow-hidden relative">
                                            <img
                                                src={image.url || "/placeholder.svg"}
                                                alt={`Upload ${index + 1}`}
                                                className="w-full h-full object-cover"
                                            />
                                            {/* Remove button */}
                                            <button
                                                onClick={() => removeImage(image.id)}
                                                className="absolute top-2 right-2 w-6 h-6 bg-black bg-opacity-50 rounded-full flex items-center justify-center text-white hover:bg-opacity-70 transition-opacity"
                                            >
                                                <X className="w-4 h-4" />
                                            </button>
                                            {/* Cover label */}
                                            {image.isCover && (
                                                <div className="absolute bottom-2 left-2 bg-[#f7641b] text-white px-2 py-1 rounded text-xs font-medium">
                                                    Cover
                                                </div>
                                            )}
                                            {/* Click to set as cover */}
                                            {!image.isCover && (
                                                <button
                                                    onClick={() => setCoverImage(image.id)}
                                                    className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-20 transition-all duration-200 flex items-center justify-center"
                                                >
                                                    <span className="text-white opacity-0 group-hover:opacity-100 text-sm font-medium">
                                                        Set as cover
                                                    </span>
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                ))}

                                {/* Empty slots */}
                                {Array.from({ length: Math.max(0, 8 - uploadedImages.length) }).map((_, index) => {
                                    const isCenter = uploadedImages.length === 0 && index === 4 // Center position when no images
                                    const showUploadButton = uploadedImages.length === 0 ? isCenter : index === 0

                                    return (
                                        <div key={`empty-${index}`} className="aspect-square">
                                            {showUploadButton ? (
                                                <label className="aspect-square bg-[rgba(15,55,95,0.05)] dark:bg-[hsla(0,0%,100%,0.11)] rounded-lg flex flex-col items-center justify-center cursor-pointer transition-colors relative">
                                                    <input
                                                        type="file"
                                                        multiple
                                                        accept="image/*"
                                                        onChange={(e) => handleFileUpload(e.target.files)}
                                                        className="hidden"
                                                    />
                                                    {uploadedImages.length === 0 ? (
                                                        <div className="flex flex-col items-center z-20 pb-60 pl-36 fixed">
                                                            <Button
                                                                onClick={(e) => {
                                                                    e.preventDefault()
                                                                    e.stopPropagation()
                                                                    const fileInput = e.currentTarget.parentElement?.parentElement?.querySelector(
                                                                        'input[type="file"]',
                                                                    ) as HTMLInputElement
                                                                    if (fileInput) {
                                                                        fileInput.click()
                                                                    }
                                                                }}
                                                                className="bg-[#f7641b] hover:bg-[#eb611f] h-9 text-white rounded-full px-[14px] text-sm font-medium relative -mt-12 -ml-36"
                                                            >
                                                                <Plus className="w-4 h-4" />
                                                                Upload images
                                                            </Button>
                                                        </div>
                                                    ) : (
                                                        <div className="flex flex-col items-center text-[#f7641b]">
                                                            <Plus className="w-8 h-8 mb-2" />
                                                            <span className="text-sm font-medium">Add or drag images</span>
                                                        </div>
                                                    )}
                                                </label>
                                            ) : (
                                                <div className="aspect-square bg-[rgba(15,55,95,0.05)] dark:bg-[hsla(0,0%,100%,0.11)] rounded-lg"></div>
                                            )}
                                        </div>
                                    )
                                })}
                            </div>
                            {/* Upload via URL */}
                            <div className="space-y-2">
                                <h3 className="text-[12.25px] font-bold text-[#000] dark:text-[#fff]">Upload via URL</h3>
                                <div className="relative pb-[40px]">
                                    <Input
                                        value={imageUrlInput}
                                        onChange={(e) => setImageUrlInput(e.target.value)}
                                        placeholder="https://"
                                        className="w-full bg-[#fff] dark:bg-[#1d1f20] text-black border-[rgba(3,12,25,0.23)] dark:border-[hsla(0,0%,100%,0.35)] focus:ring-0 dark:text-white placeholder:text-gray-400 rounded-lg text-sm pr-12"
                                    />
                                    <Button
                                        onClick={handleUrlUpload}
                                        disabled={!imageUrlInput.trim() || uploadedImages.length >= 8}
                                        className="absolute right-3 top-5 transform -translate-y-1/2 w-7 h-7 disabled:text-[#a7a9ac] dark:disabled:text-[#8b8d90] font-bold text-sm p-0 disabled:bg-[#f3f5f7] dark:disabled:bg-[#363739] border-none rounded-full"
                                    >
                                        <ArrowRight className="w-4 h-4" />
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                )
            case 3:
                return (
                    <>
                        <div className="block md:hidden min-h-screen w-full">{renderCase3Mobile()}</div>
                        <div className="hidden md:block min-h-screen w-full">{renderCase3Desktop()}</div>
                    </>
                )
            case 4:
                return (
                    <div
                        className="flex items-center justify-center flex-1 p-2 md:p-0 animate-fade-in-up"
                        style={{ animationDelay: "0.1s", animationFillMode: "both" }}
                    >
                        <div className="max-w-[682px] w-full space-y-8">
                            {/* Header */}
                            <div className="text-start mt-2 md:-mt-20">
                                <h1 className="text-2xl md:text-[32px] font-semibold text-[#000] dark:text-[#fff]">Final details</h1>
                            </div>

                            {/* Date Fields */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-[12.25px] font-bold text-[#000] dark:text-[#fff]">Starting day</label>
                                    <div className="relative">
                                        <input
                                            ref={startDateRef}
                                            type="date"
                                            value={startDate}
                                            onChange={(e) => {
                                                setStartDate(e.target.value)
                                                setShowStartTimeInput(true)
                                            }}
                                            onFocus={() => setShowStartTimeInput(true)}
                                            placeholder="dd/mm/yyyy"
                                            className="w-full bg-[#fff] dark:bg-[#1d1f20] border border-[rgba(3,12,25,0.23)] dark:border-[hsla(0,0%,100%,0.35)] text-black dark:text-white placeholder:text-gray-400 focus:border-[#f97936] dark:focus:border-[#f97936] rounded-lg p-2"
                                        />
                                    </div>
                                    {showStartTimeInput && (
                                        <div className="relative pt-4 space-y-1">
                                            <label className="text-[12.25px] font-bold text-[#000] dark:text-[#fff]">Time</label>
                                            <input
                                                ref={startTimeRef}
                                                type="time"
                                                value={startTime}
                                                onChange={(e) => setStartTime(e.target.value)}
                                                onFocus={() => setShowStartTimeInput(true)}
                                                className="w-full bg-[#fff] dark:bg-[#1d1f20] border border-[rgba(3,12,25,0.23)] dark:border-[hsla(0,0%,100%,0.35)] text-black dark:text-white placeholder:text-gray-400 focus:border-[#f97936] dark:focus:border-[#f97936] rounded-lg p-2"
                                            />
                                        </div>
                                    )}
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[12.25px] font-bold text-[#000] dark:text-[#fff]">End date</label>
                                    <div className="relative">
                                        <input
                                            ref={endDateRef}
                                            type="date"
                                            value={endDate}
                                            onChange={(e) => {
                                                setEndDate(e.target.value)
                                                setShowEndTimeInput(true)
                                            }}
                                            onFocus={() => setShowEndTimeInput(true)}
                                            placeholder="dd/mm/yyyy"
                                            className="w-full bg-[#fff] dark:bg-[#1d1f20] border border-[rgba(3,12,25,0.23)] dark:border-[hsla(0,0%,100%,0.35)] text-black dark:text-white placeholder:text-gray-400 focus:border-[#f97936] dark:focus:border-[#f97936] rounded-lg p-2"
                                        />
                                    </div>
                                    {showEndTimeInput && (
                                        <div className="relative pt-4 space-y-1">
                                            <label className="text-[12.25px] font-bold text-[#000] dark:text-[#fff]">Time</label>
                                            <input
                                                ref={endTimeRef}
                                                type="time"
                                                value={endTime}
                                                onChange={(e) => setEndTime(e.target.value)}
                                                onFocus={() => setShowEndTimeInput(true)}
                                                className="w-full bg-[#fff] dark:bg-[#1d1f20] border border-[rgba(3,12,25,0.23)] dark:border-[hsla(0,0%,100%,0.35)] text-black dark:text-white placeholder:text-gray-400 focus:border-[#f97936] dark:focus:border-[#f97936] rounded-lg p-2"
                                            />
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Category Section */}
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <h2 className="text-[12.25px] font-bold text-[#000] dark:text-[#fff]">
                                        Category{" "}
                                        <span className="text-sm text-[rgba(4,8,13,0.59)] dark:text-[hsla(0,0%,100%,0.75)] font-semibold">
                                            (required)
                                        </span>
                                    </h2>
                                    <p className="text-sm text-[rgba(4,8,13,0.59)] dark:text-gray-400">
                                        What is the most relevant category for your offer?
                                    </p>
                                </div>

                                {/* Category Grid */}
                                <div className="flex flex-wrap gap-2 mb-[7px]">
                                    {(selectedCategories.length === 0
                                        ? categories
                                        : categories.filter((category) => selectedCategories.includes(category))
                                    ).map((category) => (
                                        <Button
                                            key={category}
                                            onClick={() => toggleCategory(category)}
                                            variant="outline"
                                            className={cn(
                                                "h-9 w-fit px-[14px] text-sm font-bold text-left justify-start border border-[#dfe1e4] hover:border-[#d7d9dd] hover:bg-[#f3f5f7] text-[#6b6d70] hover:text-[#76787b] rounded-full transition-all duration-200",
                                                selectedCategories.includes(category)
                                                    ? "bg-[#fbf3ef] border-[#f7641b] text-[#f7641b] hover:bg-[#fbece3] hover:border-[#eb611f] hover:text-[#eb611f] dark:bg-[#481802] dark:text-[#f97936] dark:border-[#f97936] dark:hover:border-[#f7641b] dark:hover:text-[#f7641b] dark:hover:bg-[#612203]"
                                                    : "bg-[#fff] border-[#dfe1e4] text-[#6b6d70] hover:border-[#d7d9dd] hover:text-[#76787b] hover:bg-[#f3f5f7] dark:bg-[#1d1f20] dark:border-[#46484b] dark:text-[#c5c7ca] dark:hover:border-[#525457] dark:hover:text-[#babcbf] dark:hover:bg-[#28292a]",
                                            )}
                                        >
                                            {selectedCategories.includes(category) ? (
                                                <Check className="h-4 w-4 flex-shrink-0 stroke-[2.5]" />
                                            ) : (
                                                <Plus className="h-4 w-4 flex-shrink-0 stroke-[2.5]" />
                                            )}
                                            <span className="text-sm font-semibold">{category}</span>
                                        </Button>
                                    ))}
                                </div>
                                {categoryError && (
                                    <div className="text-red-500 text-xs mt-1">{categoryError}</div>
                                )}
                            </div>
                        </div>
                    </div>
                )
            case 5:
                return (
                    <div
                        className="flex items-center justify-center flex-1 p-2 md:p-0 animate-fade-in-up"
                        style={{ animationDelay: "0.1s", animationFillMode: "both" }}
                    >
                        <div className="max-w-[682px] w-full space-y-2 mb-[84px]">
                            {/* Header */}
                            <div className="text-left mt-8 md:mt-28 space-y-8 mb-5">
                                <h1 className="text-3xl md:text-5xl font-semibold text-[#000] dark:text-[#fff]">Check your discount code</h1>
                            </div>

                            {/* Link Section */}
                            <div className="space-y-4">
                                <div className="flex flex-col items-start p-6 border rounded-lg dark:border-[hsla(0,0%,100%,0.18)] space-y-6">
                                    <h2 className="text-2xl font-bold text-[#000] dark:text-[#fff]">Link & code</h2>
                                    <h4 className="text-base font-semibold text-[#000] dark:text-[#fff] mb-1">Link</h4>
                                    <div className="text-base text-[#000] dark:text-[#fff] break-all">{discountlinkValue || "example.com"}</div>
                                    <div>
                                            <h4 className="text-base font-semibold text-[#000] dark:text-[#fff] mb-1">Discount code</h4>
                                            <p className="text-sm text-[#000] dark:text-[#fff]">{discountCode || "-"}</p>
                                        </div>
                                    <Button
                                        onClick={() => setCurrentStep(0)}
                                        variant="ghost"
                                        className="text-sm h-7 border rounded-full border-[#dfe1e4] hover:border-[#d7d9dd] hover:bg-[#f3f5f7] text-[#6b6d70] hover:text-[#76787b] dark:border-[#46484b] dark:hover:border-[#525457] dark:hover:bg-[#28292a] dark:text-[#c5c7ca] dark:hover:text-[#babcbf]"
                                    >
                                        To adjust
                                    </Button>
                                </div>
                            </div>

                            {/* Essentials Section */}
                            <div className="space-y-4">
                                <div className="flex flex-col items-start p-6 border rounded-lg dark:border-[hsla(0,0%,100%,0.18)] space-y-6">
                                    <h2 className="text-2xl font-bold text-[#000] dark:text-[#fff]">Essentials</h2>

                                    <div className="space-y-6 w-full">
                                        <div>
                                            <h3 className="text-base font-semibold text-[#000] dark:text-[#fff] mb-1">Title of discount code</h3>
                                            <p className="text-sm text-[#000] dark:text-[#fff]">{discount || "No title provided"}</p>
                                        </div>
                                        <div>
                                            <h4 className="text-base font-semibold text-[#000] dark:text-[#fff] mb-1">Discount type</h4>
                                            <p className="text-sm text-[#000] dark:text-[#fff]">
                                                {discountType === "percentage" && "Discount (%)"}
                                                {discountType === "euro" && "Discount (₹)"}
                                                {discountType === "freeShipping" && "Free shipping"}
                                                {discountType === "none" && "None of the above"}
                                                {!discountType && "-"}
                                            </p>
                                        </div>
                                        {(discountType === "percentage" || discountType === "euro") && (
                                            <div>
                                                <h4 className="text-base font-semibold text-[#000] dark:text-[#fff] mb-1">Discount value</h4>
                                                <p className="text-sm text-[#000] dark:text-[#fff]">
                                                    {discountValue ? `${discountValue}${discountType === "percentage" ? "%" : "₹"}` : "-"}
                                                </p>
                                            </div>
                                        )}
                                        
                                        <div>
                                            <h4 className="text-base font-semibold text-[#000] dark:text-[#fff] mb-1">Availability</h4>
                                            <p className="text-sm text-[#000] dark:text-[#fff]">{availability || "-"}</p>
                                        </div>
                                        <Button
                                            onClick={() => setCurrentStep(1)}
                                            variant="ghost"
                                            className="text-sm h-7 border rounded-full border-[#dfe1e4] hover:border-[#d7d9dd] hover:bg-[#f3f5f7] text-[#6b6d70] hover:text-[#76787b] dark:border-[#46484b] dark:hover:border-[#525457] dark:hover:bg-[#28292a] dark:text-[#c5c7ca] dark:hover:text-[#babcbf]"
                                        >
                                            To adjust
                                        </Button>
                                    </div>
                                </div>
                            </div>

                            {/* Image Gallery Section */}
                            <div className="space-y-4">
                                <div className="flex flex-col items-start p-6 border rounded-lg dark:border-[hsla(0,0%,100%,0.18)] space-y-6">
                                    <h2 className="text-2xl font-bold text-[#000] dark:text-[#fff]">Image gallery</h2>
                                    <div className="text-base text-gray-500 dark:text-gray-400">
                                        {uploadedImages.length > 0 ? `${uploadedImages.length} image(s) uploaded` : "No info"}
                                    </div>
                                    <Button
                                        onClick={() => setCurrentStep(2)}
                                        variant="ghost"
                                        className="text-sm h-7 border rounded-full border-[#dfe1e4] hover:border-[#d7d9dd] hover:bg-[#f3f5f7] text-[#6b6d70] hover:text-[#76787b] dark:border-[#46484b] dark:hover:border-[#525457] dark:hover:bg-[#28292a] dark:text-[#c5c7ca] dark:hover:text-[#babcbf]"
                                    >
                                        To adjust
                                    </Button>
                                </div>
                            </div>

                            {/* Description Section */}
                            <div className="space-y-4">
                                <div className="flex flex-col items-start p-6 border rounded-lg dark:border-[hsla(0,0%,100%,0.18)] space-y-6">
                                    <h2 className="text-xl font-semibold text-[#000] dark:text-[#fff]">Description</h2>
                                    <div className="space-y-2 w-full">
                                        <h3 className="text-base font-medium text-[#000] dark:text-[#fff]">
                                            Why is your discount code worth sharing?
                                        </h3>
                                        {description ? (
                                            <div
                                                className="prose prose-sm max-w-none dark:prose-invert text-[#000] dark:text-[#fff]"
                                                dangerouslySetInnerHTML={{ __html: description }}
                                            />
                                        ) : (
                                            <div className="text-sm text-gray-400 italic">No description provided.</div>
                                        )}
                                    </div>
                                    <Button
                                        onClick={() => setCurrentStep(3)}
                                        variant="ghost"
                                        className="text-sm h-7 border rounded-full border-[#dfe1e4] hover:border-[#d7d9dd] hover:bg-[#f3f5f7] text-[#6b6d70] hover:text-[#76787b] dark:border-[#46484b] dark:hover:border-[#525457] dark:hover:bg-[#28292a] dark:text-[#c5c7ca] dark:hover:text-[#babcbf]"
                                    >
                                        To adjust
                                    </Button>
                                </div>
                            </div>

                            {/* Final Details Section */}
                            <div className="space-y-4">
                                <div className="flex flex-col items-start p-6 border rounded-lg dark:border-[hsla(0,0%,100%,0.18)] space-y-6">
                                    <h2 className="text-xl font-semibold text-[#000] dark:text-[#fff]">Final details</h2>

                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
                                        <div>
                                            <h4 className="text-sm font-medium text-[#000] dark:text-[#fff] mb-1">Starting day</h4>
                                            <p className="text-sm text-[#000] dark:text-[#fff]">{startDate || "-"}</p>
                                        </div>
                                        <div>
                                            <h4 className="text-sm font-medium text-[#000] dark:text-[#fff] mb-1">End date</h4>
                                            <p className="text-sm text-[#000] dark:text-[#fff]">{endDate || "-"}</p>
                                        </div>
                                        <div>
                                            <h4 className="text-sm font-medium text-[#000] dark:text-[#fff] mb-1">Category</h4>
                                            <p className="text-sm text-[#000] dark:text-[#fff]">{selectedCategories.join(", ") || "-"}</p>
                                        </div>
                                    </div>
                                    <Button
                                        onClick={() => setCurrentStep(4)}
                                        variant="ghost"
                                        className="text-sm h-7 border rounded-full border-[#dfe1e4] hover:border-[#d7d9dd] hover:bg-[#f3f5f7] text-[#6b6d70] hover:text-[#76787b] dark:border-[#46484b] dark:hover:border-[#525457] dark:hover:bg-[#28292a] dark:text-[#c5c7ca] dark:hover:text-[#babcbf]"
                                    >
                                        To adjust
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                )
            default:
                return null
        }
    }

    // Shared props for both components
    const sharedProps = {
        currentStep,
        setCurrentStep,
        discountlinkValue,
        setDiscountLinkValue,
        isLoading,
        setIsLoading,
        progressWidth,
        setProgressWidth,
        hoveredStep,
        setHoveredStep,
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
        imageUrlInput,
        setImageUrlInput,
        isDragOver,
        setIsDragOver,
        description,
        setDescription,
        descriptionFocused,
        setDescriptionFocused,
        showLinkInput,
        setShowLinkInput,
        linkURL,
        setLinkURL,
        linkText,
        setLinkText,
        showImageInput,
        setShowImageInput,
        selected,
        setSelected,
        startDate,
        setStartDate,
        startTime,
        setStartTime,
        showStartTimeInput,
        setShowStartTimeInput,
        endDate,
        setEndDate,
        endTime,
        setEndTime,
        showEndTimeInput,
        setShowEndTimeInput,
        selectedCategories,
        setSelectedCategories,
        showMoreDescription,
        setShowMoreDescription,
        editorRef,
        showCityDropdown,
        setShowCityDropdown,
        cityList,
        categories,
        steps,
        fileInputRef,
        textareaRef,
        savedSelection,
        setSavedSelection,
        startDateRef,
        startTimeRef,
        endDateRef,
        endTimeRef,
        handleFileUpload,
        handleUrlUpload,
        removeImage,
        setCoverImage,
        handleDragOver,
        handleDragLeave,
        handleDrop,
        handleNext,
        handleBack,
        handleProceedAnyway,
        handleCancelSubmission,
        toggleCategory,
        handleContinue,
        calculateDiscount,
        handleBold,
        handleItalic,
        handleStrikethrough,
        handleList,
        handleHorizontalLine,
        handleEmoji,
        handleSubmit,
        handleInput,
        showEmojiPicker,
        setShowEmojiPicker,
        emojiList,
        imageInsertUrl,
        setImageInsertUrl,
        imageInsertFile,
        setImageInsertFile,
        handleImageFileChange,
        handleImageUrlChange,
        handlePlaceImage,
        renderStepContent,
    }

    // TIPTAP EDITOR INIT
    const editor = useEditor({
        extensions: [
            StarterKit,
            Link.configure({ openOnClick: false }),
            Image,
            Underline,
            TextAlign.configure({ types: ['heading', 'paragraph'] }),
            Placeholder.configure({
                placeholder: 'Add the details about the product, links to relevant info/reviews and why you think it\'s a good deal',
            }),
        ],
        content: description,
        immediatelyRender: false,
        onUpdate: ({ editor }) => {
            setDescription(editor.getHTML());
        },
        editorProps: {
            attributes: {
                class: cn(
                    "w-full min-h-[400px] bg-white dark:bg-[#1d1f20] border border-[rgba(3,12,25,0.23)] dark:border-[hsla(0,0%,100%,0.35)] text-black focus:outline-none dark:text-white rounded-lg p-4 pb-16 resize-none text-base leading-6 transition-all duration-300 ease-in-out flex-shrink-0 list-disc list-inside",
                    descriptionError ? "border-red-500 focus:border-red-500" : ""
                ),
            },
            handleDOMEvents: {
                focus: () => {
                    setDescriptionFocused(true);
                    return false;
                },
                blur: () => {
                    setDescriptionFocused(false);
                    return false;
                },
            },
        },
    });



    return (
        <div className="fixed inset-0 w-screen h-screen min-h-screen bg-[#fff] dark:bg-[#1d1f20] flex z-30">
            {/* Mobile Layout */}
            <div className="block md:hidden w-full overflow-y-auto h-screen">
                <MobileDiscountSubmission {...sharedProps} />
            </div>

            {/* Desktop Layout */}
            <div className="hidden md:block w-full">
                <DesktopDiscountSubmission {...sharedProps} />
            </div>
        </div>
    )
}
