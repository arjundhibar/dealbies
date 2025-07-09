"use client"

import { useEffect, useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Link2, Sparkles, ImageIcon, FileText, Eye, ListCheck, CircleCheck, Pencil, MapPin, Info, Scissors, ArrowRight, Plus, X, Link, Smile, Minus, List, Italic, Strikethrough, Bold, AlignLeft, AlignCenter, Calendar, ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { url } from "inspector"
import { NextResponse } from "next/server"
import { formatDistanceStrict } from "date-fns"
import { Textarea } from "@/components/ui/textarea"

interface DuplicateDeal {
    title: string;
    image: string;
    price?: string;
    merchant?: string;
    createdAt?: string;
}

interface UploadedImage {
    id: string,
    url: string,
    file?: File,
    isCover: boolean,


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

    const [priceOfferFocused, setPriceOfferFocused] = useState(false)
    const [lowestPriceFocused, setLowestPriceFocused] = useState(false)
    const [discountCodeFocused, setDiscountCodeFocused] = useState(false)

    const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([])
    const [imageUrlInput, setImageUrlInput] = useState("")
    const [isDragOver, setIsDragOver] = useState(false)

    const [description, setDescription] = useState("")
    const [descriptionFocused, setDescriptionFocused] = useState(false)

    const [showLinkInput, setShowLinkInput] = useState(false);
    const [linkURL, setLinkURL] = useState("");
    const [linkText, setLinkText] = useState("");

    const [showImageInput, setShowImageInput] = useState(false);

    const [selected, setSelected] = useState<"left" | "middle">("left");

    const [startDate, setStartDate] = useState("")
    const [endDate, setEndDate] = useState("")
    const [selectedCategories, setSelectedCategories] = useState<string[]>([])

    const [showMoreDescription, setShowMoreDescription] = useState(false)

    const editorRef = useRef<HTMLDivElement>(null);

    const [showCityDropdown, setShowCityDropdown] = useState(false)
    const cityList = [
        'Mumbai, Maharashtra',
        'Delhi, Delhi',
        'Bengaluru, Karnataka',
        'Hyderabad, Telangana',
        'Ahmedabad, Gujarat',
        'Chennai, Tamil Nadu',
        'Kolkata, West Bengal',
        'Pune, Maharashtra',
        'Jaipur, Rajasthan',
        'Lucknow, Uttar Pradesh',
        'Chandigarh, Chandigarh',
        'Bhopal, Madhya Pradesh',
        'Patna, Bihar',
        'Indore, Madhya Pradesh',
        'Guwahati, Assam',
    ];

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

    const [savedSelection, setSavedSelection] = useState<Range | null>(null);

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

    const handleUrlUpload = () => {
        if (imageUrlInput.trim() && uploadedImages.length < 8) {
            const newImage: UploadedImage = {
                id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
                url: imageUrlInput.trim(),
                isCover: uploadedImages.length === 0,
            }
            setUploadedImages((prev) => [...prev, newImage])
            setImageUrlInput("")
        }
    }
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

    const toggleCategory = (category: string) => {
        setSelectedCategories((prev) =>
            prev.includes(category) ? prev.filter((c) => c !== category) : [...prev, category],
        )
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
        const offer = Number.parseFloat(priceOffer) || 0;
        const lowest = Number.parseFloat(lowestPrice) || 0;
        if (lowest > 0) {
            const discount = Math.round(((lowest - offer) / lowest) * 100);
            return discount > 0 ? discount : 0;
        }
        return 0;
    }

   

    // Formatting handlers
    const handleBold = () => {
        document.execCommand("bold");
    };

    const handleItalic = () => {
        document.execCommand("italic");
    };

    const handleStrikethrough = () => {
        document.execCommand("strikeThrough");
    };
    const handleList = () => {
        document.execCommand("insertUnorderedList");
    };
    const handleHorizontalLine = () => {
        document.execCommand("insertHorizontalRule");
    };
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
        const html = editorRef.current?.innerHTML;
        console.log("Final formatted HTML:", html);
    };
    const handleInput = () => {
        if (editorRef.current) {
            setDescription(editorRef.current.innerHTML);
        }
    };
    // Emoji picker state
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const emojiList = ["😀", "😂", "😍", "😎", "👍", "🎉", "🔥", "🙏", "😊", "🥳"];

    // Add state for image URL input and file input
    const [imageInsertUrl, setImageInsertUrl] = useState("");
    const [imageInsertFile, setImageInsertFile] = useState<File | null>(null);

    // Handler for file input change
    const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] || null;
        setImageInsertFile(file);
        setImageInsertUrl(""); // Clear URL if file is chosen
    };

    // Handler for image URL input change
    const handleImageUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setImageInsertUrl(e.target.value);
        setImageInsertFile(null); // Clear file if URL is entered
    };

    // Handler for placing the image
    const handlePlaceImage = async () => {
        if (!editorRef.current) return;
        editorRef.current.focus();
        let imageUrl = imageInsertUrl;
        if (imageInsertFile) {
            // Read file as data URL
            imageUrl = await new Promise<string>((resolve) => {
                const reader = new FileReader();
                reader.onload = (e) => resolve(e.target?.result as string);
                reader.readAsDataURL(imageInsertFile);
            });
        }
        if (!imageUrl) return;
        const selection = window.getSelection();
        if (!selection || !selection.rangeCount) return;
        const range = selection.getRangeAt(0);
        range.deleteContents();
        const img = document.createElement('img');
        img.src = imageUrl;
        img.alt = "Inserted image";
        img.style.maxWidth = '100%';
        img.style.height = 'auto';
        img.style.display = 'block';
        img.style.margin = selected === 'middle' ? '0 auto' : '0';
        img.style.float = selected === 'left' ? 'left' : 'none';
        range.insertNode(img);
        // Move caret after the inserted image
        range.setStartAfter(img);
        range.collapse(true);
        selection.removeAllRanges();
        selection.addRange(range);
        setShowImageInput(false);
        setImageInsertFile(null);
        setImageInsertUrl("");
        setDescription(editorRef.current.innerHTML);
    };

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
                        className="flex flex-col items-center justify-center flex-1 animate-fade-in-up !m-0 !p-0"
                        style={{ animationDelay: "0.1s", animationFillMode: "both" }}
                    >
                        <div className="w-full  max-w-2xl mx-auto space-y-8">
                            <h1 className="text-3xl -ml-20 font-semibold text-[#000] dark:text-[#fff] text-center mb-8 ">
                                Let's start with the essential information
                            </h1>

                            {/* Title Section */}
                            <div className="">
                                <div className="flex justify-between items-center">
                                    <label className="dark:text-white text-black text-sm font-semibold pb-[1.75px]">
                                        Title of offer <span className="dark:text-[hsla(0,0%,100%,0.75)] font-normal">(required)</span>
                                    </label>
                                    <span className="dark:text-[hsla(0,0%,100%,0.75)] text-sm">{140 - title.length}</span>
                                </div>
                                <Input
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    placeholder="A short, clear title of your offer"
                                    className="w-full border border-[rgba(3,12,25,0.23)] text-black dark:border-[hsla(0,0%,100%,0.35)] dark:bg-[#1d1f20] dark:text-white dark:focus:ring-0 placeholder:text-gray-400 rounded-lg pt-2 pb-2 pl-4 pr-4 dark:focus:border-[#f97936]"
                                    onFocus={() => setTitleFocused(true)}
                                    onBlur={() => setTitleFocused(false)}
                                />

                                {/* Help Section  */}
                                <div
                                    className={cn(
                                        'transition-[height] duration-300 ease-in-out overflow-hidden',
                                        !titleFocused && 'expand-leave-to'
                                    )}
                                    style={{ height: titleFocused ? 110 : 0 }}
                                >
                                    <div className="mt-2 bg-[#f3f5f7] dark:bg-[#363739] rounded-lg px-4 py-3 flex flex-col gap-1">
                                        <div className="flex items-center">
                                            <div className="flex items-center mr-1">
                                                <Info className="w-[18px] h-[18px] dark:text-[hsla(0,0%,100%,0.75)] text-black" />
                                            </div>
                                            <span className="font-semibold text-base text-black dark:text-[#e3e4e8]">Make your title stand out</span>
                                        </div>
                                        <div className="text-sm leading-5 dark:text-[hsla(0,0%,100%,0.75)] text-[#6b6d70]  mt-1">
                                            Please include the brand, product type, color and model in the title (e.g. adidas UltraBoost (black))
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Price Details Section */}
                            <div className="">
                                <h2 className="text-xl font-semibold dark:text-white text-black pb-4">Price details</h2>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="">
                                        <label className="dark:text-white text-black font-semibold text-sm pb-[1.75px]">Price Offer</label>
                                        <div className="relative">
                                            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">₹</span>
                                            <Input
                                                value={priceOffer}
                                                onChange={(e) => setPriceOffer(e.target.value)}
                                                placeholder="15,55"
                                                className="w-full border border-[rgba(3,12,25,0.23)] dark:border-[hsla(0,0%,100%,0.35)] text-black dark:bg-[#1d1f20] dark:text-white dark:focus:ring-0 text-sm placeholder:text-gray-400 rounded-lg pt-2 pb-2 pl-9 pr-12 dark:focus:border-[#f97936]"
                                                onFocus={() => setPriceOfferFocused(true)}
                                                onBlur={() => setPriceOfferFocused(false)}
                                            />
                                        </div>

                                        {/* Help Section for Price Offer - animated */}
                                        <div
                                            className={cn(
                                                'transition-[height] duration-300 ease-in-out overflow-hidden',
                                                !priceOfferFocused && 'expand-leave-to'
                                            )}
                                            style={{ height: priceOfferFocused ? 110 : 0 }}
                                        >
                                            <div className="bg-[#f3f5f7] dark:bg-[#363739] rounded-lg px-4 py-3 flex flex-col gap-1 mt-2">
                                                <div className="flex items-center">
                                                    <div className="flex items-center mr-1">
                                                        <Info className="w-[18px] h-[18px] text-black dark:text-[hsla(0,0%,100%,0.75)]" />
                                                    </div>
                                                    <span className="font-semibold text-base text-black dark:text-[#e3e4e8]">Tell us the price</span>
                                                </div>
                                                <div className="text-sm font-normal leading-5 dark:text-[hsla(0,0%,100%,0.75)] text-[#6b6d70]  mt-1">
                                                    This should be the total price after discount(s)
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="">
                                        <label className="dark:text-white text-black font-semibold text-sm pb-[1.75px]">Lowest price elsewhere</label>
                                        <div className="relative flex-1">
                                            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">₹</span>
                                            <Input
                                                value={lowestPrice}
                                                onChange={(e) => setLowestPrice(e.target.value)}
                                                placeholder="0.00"
                                                className="w-full border border-[rgba(3,12,25,0.23)] dark:border-[hsla(0,0%,100%,0.35)] text-black dark:bg-[#1d1f20] dark:text-white dark:focus:ring-0 placeholder:text-gray-400 rounded-lg pt-2 pb-2 pl-9 pr-12 dark:focus:border-[#f97936]"
                                                onFocus={() => setLowestPriceFocused(true)}
                                                onBlur={() => setLowestPriceFocused(false)}
                                            />
                                            <span
                                                className={cn(
                                                    "absolute right-3 top-1/2 transform -translate-y-1/2 text-xs font-semibold px-2 py-0.5 rounded bg-[#f3f5f7] dark:bg-[hsla(0,0%,100%,0.11)]",
                                                    calculateDiscount() > 0 ? "text-green-600 dark:bg-[#052f01] dark:text-[#78c86b]" : "text-[#f7641b] dark:text-[hsla(0,0%,100%,0.75)]"
                                                )}
                                            >
                                                {calculateDiscount()}%
                                            </span>
                                        </div>

                                        {/* Help Section for Lowest Price Elsewhere - animated */}
                                        <div
                                            className={cn(
                                                'transition-[height] duration-300 ease-in-out overflow-hidden',
                                                !lowestPriceFocused && 'expand-leave-to'
                                            )}
                                            style={{ height: lowestPriceFocused ? 150 : 0 }}
                                        >
                                            <div className="bg-[#f3f5f7] dark:bg-[#363739] rounded-lg px-4 py-3 flex flex-col gap-1 mt-2">
                                                <div className="flex items-center">
                                                    <div className="flex items-center mr-1">
                                                        <Info className="w-[18px] h-[18px] text-black dark:text-[hsla(0,0%,100%,0.75)]" />
                                                    </div>
                                                    <span className="font-semibold text-base text-black dark:text-[#e3e4e8]">Tell us lowest price elsewhere</span>
                                                </div>
                                                <div className="text-sm font-normal leading-5 dark:text-[hsla(0,0%,100%,0.75)] text-[#6b6d70]  mt-1">
                                                    This is the lowest price you can find for the product elsewhere through price comparison (not for the recommended retail price)
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Discount Code Section */}
                            <div className="">
                                <label className="dark:text-white text-sm font-semibold pb-[1.75px]">Discount code</label>
                                <div className="relative">
                                    <Scissors className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                                    <Input
                                        value={discountCode}
                                        onChange={(e) => setDiscountCode(e.target.value)}
                                        placeholder="Enter the discount code"
                                        className="w-full border border-[rgba(3,12,25,0.23)] dark:border-[hsla(0,0%,100%,0.35)] text-black dark:bg-[#1d1f20] dark:text-white dark:focus:ring-0 placeholder:text-gray-400 rounded-lg pt-2 pb-2 pl-9 pr-4 dark:focus:border-[#f97936]"
                                        onFocus={() => setDiscountCodeFocused(true)}
                                        onBlur={() => setDiscountCodeFocused(false)}
                                    />
                                </div>

                                {/* Help Section for Discount Code - animated */}
                                <div
                                    className={cn(
                                        'transition-[height] duration-300 ease-in-out overflow-hidden',
                                        !discountCodeFocused && 'expand-leave-to'
                                    )}
                                    style={{ height: discountCodeFocused ? 100 : 0 }}
                                >
                                    <div className="bg-[#f3f5f7] dark:bg-[#363739]rounded-lg px-4 py-3 flex flex-col gap-1 mt-2">
                                        <div className="flex items-center">
                                            <div className="flex items-center mr-1">
                                                <Info className="w-[18px] h-[18px] text-black dark:text-[hsla(0,0%,100%,0.75)]" />
                                            </div>
                                            <span className="font-semibold text-base text-black dark:text-[#e3e4e8]">Tell us the discount code</span>
                                        </div>
                                        <div className="text-sm leading-5 dark:text-[hsla(0,0%,100%,0.75)] text-[#6b6d70]  mt-1">
                                            Add only one code and instructions to the description
                                        </div>
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
                                            "rounded-r-full",           // Right outer corner rounded
                                            "rounded-l-none"          // Inner corner flat
                                        )}
                                    >
                                        Offline
                                    </Button>
                                </div>

                            </div>

                            {/* Postage and Shipping Section or Location Selection for Offline */}
                            {availability === 'offline' ? (
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
                                                        setShippingFrom(city);
                                                        setShowCityDropdown(false);
                                                    }}
                                                >
                                                    {city}
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </div>
                            ) : (
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="">
                                        <label className="dark:text-white font-semibold text-black text-sm pb-[1.75px]">Postage costs</label>
                                        <div className="relative">
                                            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">₹</span>
                                            <Input
                                                value={postageCosts}
                                                onChange={(e) => setPostageCosts(e.target.value)}
                                                placeholder="0.00"
                                                className="w-full border border-[rgba(3,12,25,0.23)] dark:border-[hsla(0,0%,100%,0.35)] 
             text-black dark:bg-[#1d1f20] dark:text-white 
             placeholder:text-gray-400 
             rounded-lg pt-2 pb-2 pl-9 pr-4 
             focus:outline-none !focus:ring-0 focus:border-[#f97936] 
              dark:focus:ring-0 dark:focus:border-[#f97936]"
                                            />
                                        </div>
                                    </div>
                                    <div className="">
                                        <label className="dark:text-white font-semibold text-sm pb-[1.75px]">Shipping from</label>
                                        <div className="relative">
                                            <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                                            <Input
                                                value={shippingFrom}
                                                onChange={(e) => setShippingFrom(e.target.value)}
                                                placeholder="Search..."
                                                className="w-full border border-[rgba(3,12,25,0.23)] dark:border-[hsla(0,0%,100%,0.35)] text-black dark:bg-[#1d1f20] dark:text-white dark:focus:ring-0 placeholder:text-gray-400 rounded-lg pt-2 pb-2 pl-9 pr-4 dark:focus:border-[#f97936]"
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )
            case 2:
                return (
                    <div className="flex items-center justify-center flex-1 !p-0 !m-0 animate-fade-in-up " style={{ animationDelay: '0.1s', animationFillMode: 'both' }}>
                        <div className="max-w-[682px] space-y-8">
                            <div className="text-left mt-28 space-y-6">
                                <h1 className="text-[32px] font-bold text-[#000] dark:text-[#fff]">
                                    Make your deal stand out with images
                                </h1>
                                <p className="text-lg text-[rgba(4,8,13,0.59)] dark:text-[hsla(0,0%,100%,0.75)]">
                                    Upload up to 8 images to post your deal. You can drag and drop to reorder and choose the cover.
                                </p>
                            </div>
                            <div className="grid grid-cols-3 gap-4 max-w-3xl mx-auto border border-dashed border-[rgba(9,24,47,0.13)] dark:border-[hsla(0,0%,100%,0.18)] p-4 rounded-lg">
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
                                                <label className="aspect-square bg-[rgba(15,55,95,0.05)] dark:bg-[hsla(0,0%,100%,0.11)] rounded-lg flex flex-col items-center justify-center cursor-pointer hover:bg-[#5a5d61] transition-colors relative">
                                                    <input
                                                        type="file"
                                                        multiple
                                                        accept="image/*"
                                                        onChange={(e) => handleFileUpload(e.target.files)}
                                                        className="hidden"
                                                    />
                                                    {uploadedImages.length === 0 ? (
                                                        <div className="flex flex-col items-center">
                                                            <Button
                                                                onClick={(e) => {
                                                                    e.preventDefault();
                                                                    e.stopPropagation();
                                                                    const fileInput = e.currentTarget.parentElement?.parentElement?.querySelector('input[type="file"]') as HTMLInputElement;
                                                                    if (fileInput) {
                                                                        fileInput.click();
                                                                    }
                                                                }}
                                                                className="bg-[#f7641b] hover:bg-[#eb611f] h-9 text-white rounded-full px-[14px] text-sm font-medium relative"
                                                            >
                                                                <Plus className="w-4 h-4" />
                                                                Upload images
                                                            </Button>
                                                            {/* <p className="dark:text-[hsla(0,0%,100%,0.75)] text-sm leading-6 font-semibold">Or drag them</p>
                                                            <p className="dark:text-[hsla(0,0%,100%,0.75)] text-sm leading-6 font-semibold ">(6MB max file size, max dimensions 6000px. Min dimensions are 150x150px)</p> */}
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
                    <div
                        className="flex flex-col items-center justify-center flex-1 !m-0 !p-0 animate-fade-in-up"
                        style={{ animationDelay: "0.1s", animationFillMode: "both" }}
                    >
                        <div className="max-w-[682px] w-full space-y-8">
                            {/* Header */}
                            <div className="text-left">
                                <h1 className="text-[32px]  leading-10 font-semibold text-[#000] dark:text-[#fff]">
                                    Why is this offer worth sharing?
                                </h1>
                            </div>

                            {/* Description Text Area */}
                            <div className="space-y-4">
                                <div className="relative h-[400px]">
                                    <div
                                        ref={editorRef}
                                        contentEditable
                                        onInput={handleInput}
                                        suppressContentEditableWarning
                                        onFocus={() => setDescriptionFocused(true)}
                                        onBlur={() => setDescriptionFocused(false)}
                                        className={cn(
                                            "w-full min-h-[400px] bg-[#fff] dark:bg-[#1d1f20] border border-[rgba(3,12,25,0.23)] dark:border-[hsla(0,0%,100%,0.35)] text-black focus:outline-none dark:text-white rounded-lg p-4 pb-16 resize-none text-base leading-6 transition-all duration-300 ease-in-out flex-shrink-0 list-disc list-inside",
                                            descriptionFocused ? "min-h-[510px]" : "min-h-[400px]"
                                        )}

                                    />

                                    {/* Help Section for Description - animated */}
                                    <div
                                        className={cn(
                                            'transition-[height] duration-300 ease-in-out overflow-hidden absolute top-[353px] left-2 right-2 z-10',
                                            !descriptionFocused && 'expand-leave-to'
                                        )}
                                        style={{ height: descriptionFocused ? 110 : 0 }}
                                    >
                                        <div className="bg-[#f3f5f7] dark:bg-[#363739] rounded-lg px-4 py-3 flex flex-col gap-1">
                                            <div className="flex items-center">
                                                <div className="flex items-center mr-1">
                                                    <Info className="w-[18px] h-[18px] dark:text-[hsla(0,0%,100%,0.75)] text-black" />
                                                </div>
                                                <span className="font-semibold text-base text-black dark:text-[#e3e4e8]">Tell us about your deal.</span>
                                            </div>
                                            <div className="text-sm leading-5 dark:text-[hsla(0,0%,100%,0.75)] text-[rgba(4,8,13,0.59)] mt-1">
                                                Add the details about the product,links to relevant info/reviews and why you think it's a good deal
                                            </div>
                                        </div>
                                    </div>

                                    {/* Formatting Toolbar */}
                                    <div className="relative -top-14 w-fit left-2 inline-flex items-center gap-1 bg-[#fff] dark:bg-[#2a2b2d] rounded-xl  p-[7px] border border-[rgba(3,12,25,0.1)] dark:border-[hsla(0,0%,100%,0.1)] shadow-lg">
                                        <Button variant="ghost" size="sm" className="icon-button" onMouseDown={e => e.preventDefault()} onClick={handleBold}>
                                            <Bold className="h-4 w-4 stroke-[3.2]" />
                                        </Button>
                                        <Button variant="ghost" size="sm" className="icon-button" onMouseDown={e => e.preventDefault()} onClick={handleStrikethrough}>
                                            <Strikethrough className="h-4 w-4 stroke-[3.2]" />
                                        </Button>
                                        <Button variant="ghost" size="sm" className="icon-button" onMouseDown={e => e.preventDefault()} onClick={handleItalic}>
                                            <Italic className="h-4 w-4 stroke-[3.2]" />
                                        </Button>
                                        <Button variant="ghost" size="sm" className="icon-button" onMouseDown={e => e.preventDefault()} onClick={handleList}>
                                            <List className="h-4 w-4 stroke-[3.2]" />
                                        </Button>
                                        <Button variant="ghost" size="sm" className="icon-button" onMouseDown={e => e.preventDefault()} onClick={handleHorizontalLine}>
                                            <Minus className="h-4 w-4 stroke-[3.2]" />
                                        </Button>
                                        <Button variant="ghost" size="sm" className="icon-button" onMouseDown={e => e.preventDefault()} onClick={() => setShowEmojiPicker((v) => !v)}>
                                            <Smile className="h-4 w-4 stroke-[3.2]" />
                                        </Button>
                                        {showEmojiPicker && (
                                            <div className="absolute bottom-12 left-0 bg-white dark:bg-[#23272f] border border-gray-200 dark:border-[#23272f] rounded-lg shadow-lg p-2 flex flex-wrap gap-1 z-50">
                                                {emojiList.map((emoji) => (
                                                    <button
                                                        key={emoji}
                                                        className="text-xl p-1 hover:bg-gray-100 dark:hover:bg-[#363739] rounded"
                                                        onMouseDown={e => e.preventDefault()}
                                                        onClick={() => { handleEmoji(emoji); setShowEmojiPicker(false); }}
                                                    >
                                                        {emoji}
                                                    </button>
                                                ))}
                                            </div>
                                        )}
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="icon-button "
                                            onMouseDown={(e) => e.preventDefault()}
                                            onClick={() => {
                                                setShowLinkInput(true);
                                                // Save the current selection
                                                const selection = window.getSelection();
                                                if (selection && selection.rangeCount > 0) {
                                                    setSavedSelection(selection.getRangeAt(0));
                                                }
                                            }}
                                        >
                                            <Link className="h-4 w-4 stroke-[3.2]" />
                                        </Button>
                                        {showLinkInput && (
                                            <div className="absolute bottom-12 m-4 left-24 bg-white dark:bg-[#23272f] border border-gray-200 dark:border-[#23272f] rounded-lg shadow-lg p-6 flex flex-col gap-2 z-50 w-[350px]">
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
                                                        <label className="text-[12.25px] text-black dark:text-white font-semibold">
                                                            URL
                                                        </label>
                                                        <input
                                                            type="text"
                                                            value={linkURL}
                                                            onChange={(e) => setLinkURL(e.target.value)}
                                                            className="pt-[9px] pb-[9px] pl-[16px] pr-[16px] rounded-lg border border-[rgba(3,12,25,0.23)] dark:bg-[#2d2f31] focus:border-[#f7641b] outline-none dark:text-white text-black text-sm"
                                                        />
                                                    </div>
                                                    <div className="flex flex-col space-y-2">
                                                        <label className="text-[12.25px] text-black dark:text-white font-semibold">
                                                            Text
                                                        </label>
                                                        <input
                                                            type="text"
                                                            value={linkText}
                                                            onChange={(e) => setLinkText(e.target.value)}
                                                            className="pt-[9px] pb-[9px] pl-[16px] pr-[16px] rounded-lg border border-[rgba(3,12,25,0.23)] dark:bg-[#2d2f31] focus:border-[#f7641b] outline-none dark:text-white text-black text-sm"
                                                        />
                                                        <div className="pt-4">
                                                            <button
                                                                onClick={() => {
                                                                    if (!editorRef.current) return;
                                                                    editorRef.current.focus();
                                                                    if (savedSelection) {
                                                                        const selection = window.getSelection();
                                                                        selection?.removeAllRanges();
                                                                        selection?.addRange(savedSelection);
                                                                    }
                                                                    const selection = window.getSelection();
                                                                    if (!selection || !selection.rangeCount) return;
                                                                    const range = selection.getRangeAt(0);
                                                                    range.deleteContents();
                                                                    // Create a real <a> element
                                                                    const a = document.createElement('a');
                                                                    a.href = linkURL;
                                                                    a.textContent = linkText || linkURL;
                                                                    a.target = "_blank";
                                                                    a.rel = "noopener noreferrer";
                                                                    range.insertNode(a);
                                                                    // Move caret after link
                                                                    range.setStartAfter(a);
                                                                    range.collapse(true);
                                                                    selection.removeAllRanges();
                                                                    selection.addRange(range);
                                                                    setShowLinkInput(false);
                                                                    setLinkURL("");
                                                                    setLinkText("");
                                                                    setDescription(editorRef.current.innerHTML);
                                                                }}

                                                                disabled={!linkURL.trim()}
                                                                className={
                                                                    `text-sm h-9 font-medium  text-white px-3 py-1 w-full rounded-full  ` +
                                                                    (!linkURL.trim() ? 'bg-[#f3f5f7] text-[#a7a9ac] cursor-not-allowed' : 'text-white bg-[#f7641b] hover:bg-[#eb611f] shadow-[#f7641b] hover:shadow-[#eb611f]')
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
                                            className="icon-button"
                                            onMouseDown={(e) => e.preventDefault()}
                                            onClick={() => setShowImageInput((v) => !v)}
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
                                                        <label className="text-[12.25px] text-black dark:text-white font-semibold">Upload image</label>
                                                        <div className="flex items-center gap-3">
                                                            <input
                                                                type="file"
                                                                accept="image/*"
                                                                className="hidden"
                                                                id="image-upload-input"
                                                                onChange={handleImageFileChange}
                                                            />
                                                            <label htmlFor="image-upload-input" className="px-3 py-2 h-9 rounded-full w-fit border border-[#f7641b] text-[#f7641b] bg-white hover:bg-[#fbece3] dark:bg-[#481802] dark:text-[#f97936] dark:border-[#f97936] dark:hover:border-[#f7641b] dark:hover:text-[#f7641b] dark:hover:bg-[#612203] text-sm font-medium cursor-pointer">
                                                                Choose
                                                            </label>
                                                            <span className="text-sm text-[#a7a9ac] dark:text-[#8b8d90]">{imageInsertFile ? imageInsertFile.name : "Nothing selected"}</span>
                                                        </div>
                                                    </div>
                                                    {/* Image from URL section */}
                                                    <div className="flex flex-col space-y-2">
                                                        <label className="text-[12.25px] text-black dark:text-white font-semibold">Image from URL</label>
                                                        <input
                                                            type="text"
                                                            placeholder="Image URL"
                                                            value={imageInsertUrl}
                                                            onChange={handleImageUrlChange}
                                                            className="pt-[9px] pb-[9px] pl-[16px] pr-[16px] rounded-lg border border-[rgba(3,12,25,0.23)] dark:bg-[#2d2f31] focus:border-[#f7641b] outline-none dark:text-white text-black text-sm"
                                                        />
                                                        {/* Placement options */}
                                                        <span className="text-[12.25px] text-black dark:text-white font-semibold mr-2 pt-4">Placement:</span>
                                                        <div className="flex flex-row mt-1 w-full">
                                                            <button
                                                                onClick={() => setSelected("left")}
                                                                className={cn(
                                                                    "w-1/2 py-2 h-9 rounded-l-full border text-sm font-medium focus:outline-none flex flex-row justify-center items-center gap-1",
                                                                    selected === "left"
                                                                        ? "bg-[#f7641b] border-[#f7641b] text-white hover:bg-[#eb611f] hover:border-[#eb611f] "
                                                                        : "text-[#6b6d70] border-[#dfe1e4] hover:bg-white hover:text-[#f7641b] hover:border-[#dfe1e4] "
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
                                                                        : "text-[#6b6d70] border-[#dfe1e4] hover:bg-white hover:text-[#f7641b] hover:border-[#dfe1e4] "
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
                )
            case 4:
                return (
                    <div
                        className="flex flex-col items-center justify-center flex-1 !m-0 !p-0 animate-fade-in-up"
                        style={{ animationDelay: "0.1s", animationFillMode: "both" }}
                    >
                        <div className="max-w-[682px] w-full space-y-8">
                            {/* Header */}
                            <div className="text-start">
                                <h1 className="text-3xl font-semibold text-[#000] dark:text-[#fff]">Final details</h1>
                            </div>

                            {/* Date Fields */}
                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-[#000] dark:text-[#fff]">Start day</label>
                                    <div className="relative">
                                        <Input
                                            type="text"
                                            value={startDate}
                                            onChange={(e) => setStartDate(e.target.value)}
                                            placeholder="dd/mm/yyyy"
                                            className="w-full bg-[#fff] dark:bg-[#1d1f20] border border-[rgba(3,12,25,0.23)] dark:border-[hsla(0,0%,100%,0.35)] text-black dark:text-white placeholder:text-gray-400 focus:border-[#f97936] dark:focus:border-[#f97936] rounded-lg p-3 pr-10"
                                        />
                                        <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-[#000] dark:text-[#fff]">End date</label>
                                    <div className="relative">
                                        <Input
                                            type="text"
                                            value={endDate}
                                            onChange={(e) => setEndDate(e.target.value)}
                                            placeholder="dd/mm/yyyy"
                                            className="w-full bg-[#fff] dark:bg-[#1d1f20] border border-[rgba(3,12,25,0.23)] dark:border-[hsla(0,0%,100%,0.35)] text-black dark:text-white placeholder:text-gray-400 focus:border-[#f97936] dark:focus:border-[#f97936] rounded-lg p-3 pr-10"
                                        />
                                        <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                                    </div>
                                </div>
                            </div>

                            {/* Category Section */}
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <h2 className="text-lg font-semibold text-[#000] dark:text-[#fff]">
                                        Category <span className="text-gray-500 font-normal">(required)</span>
                                    </h2>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                        What is the most relevant category for your offer?
                                    </p>
                                </div>

                                {/* Category Grid */}
                                <div className="grid grid-cols-4 gap-3">
                                    {categories.map((category) => (
                                        <Button
                                            key={category}
                                            onClick={() => toggleCategory(category)}
                                            variant="outline"
                                            className={cn(
                                                "h-auto p-3 text-left justify-start border rounded-lg transition-all duration-200",
                                                selectedCategories.includes(category)
                                                    ? "bg-[#fbf3ef] border-[#f7641b] text-[#f7641b] hover:bg-[#fbece3] hover:border-[#eb611f] hover:text-[#eb611f] dark:bg-[#481802] dark:text-[#f97936] dark:border-[#f97936] dark:hover:border-[#f7641b] dark:hover:text-[#f7641b] dark:hover:bg-[#612203]"
                                                    : "bg-[#fff] border-[rgba(3,12,25,0.23)] text-[#000] hover:border-[#d7d9dd] hover:text-[#f7641b] hover:bg-[#fff] dark:bg-[#1d1f20] dark:border-[hsla(0,0%,100%,0.35)] dark:text-white dark:hover:border-[#525457] dark:hover:text-[#f97936]",
                                            )}
                                        >
                                            <Plus className="h-4 w-4 mr-2 flex-shrink-0" />
                                            <span className="text-sm font-medium">{category}</span>
                                        </Button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                )
            case 5:
                return (
                    <div
                        className="flex flex-col items-center justify-center flex-1 !m-0 !p-0 animate-fade-in-up"
                        style={{ animationDelay: "0.1s", animationFillMode: "both" }}
                    >
                        <div className="max-w-[682px] w-full space-y-8">
                            {/* Header */}
                            <div className="text-center">
                                <h1 className="text-3xl font-semibold text-[#000] dark:text-[#fff]">Check your deal</h1>
                            </div>

                            {/* Link Section */}
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <h2 className="text-xl font-semibold text-[#000] dark:text-[#fff]">Link</h2>
                                    <Button
                                        onClick={() => setCurrentStep(0)}
                                        variant="ghost"
                                        className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                                    >
                                        To adjust
                                    </Button>
                                </div>
                                <div className="text-base text-[#000] dark:text-[#fff]">{linkValue || "example.com"}</div>
                            </div>

                            {/* Image Gallery Section */}
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <h2 className="text-xl font-semibold text-[#000] dark:text-[#fff]">Image gallery</h2>
                                    <Button
                                        onClick={() => setCurrentStep(2)}
                                        variant="ghost"
                                        className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                                    >
                                        To adjust
                                    </Button>
                                </div>
                                <div className="text-base text-gray-500 dark:text-gray-400">
                                    {uploadedImages.length > 0 ? `${uploadedImages.length} image(s) uploaded` : "No info"}
                                </div>
                            </div>

                            {/* Description Section */}
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <h2 className="text-xl font-semibold text-[#000] dark:text-[#fff]">Description</h2>
                                    <Button
                                        onClick={() => setCurrentStep(3)}
                                        variant="ghost"
                                        className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                                    >
                                        To adjust
                                    </Button>
                                </div>
                                <div className="space-y-2">
                                    <h3 className="text-base font-medium text-[#000] dark:text-[#fff]">
                                        Why is this offer worth sharing?
                                    </h3>
                                    {description ? (
                                        <div className="space-y-2">
                                            <ul className="list-disc list-inside text-sm text-[#000] dark:text-[#fff] space-y-1">
                                                {description
                                                    .split("\n")
                                                    .slice(0, showMoreDescription ? undefined : 6)
                                                    .map((line, index) => line.trim() && <li key={index}>{line.trim()}</li>)}
                                            </ul>
                                            {description.split("\n").length > 6 && (
                                                <Button
                                                    onClick={() => setShowMoreDescription(!showMoreDescription)}
                                                    variant="ghost"
                                                    className="text-sm text-[#f7641b] hover:text-[#eb611f] p-0 h-auto font-normal"
                                                >
                                                    {showMoreDescription ? "Show less" : "Show more"}{" "}
                                                    <ChevronDown
                                                        className={cn("h-4 w-4 ml-1 transition-transform", showMoreDescription && "rotate-180")}
                                                    />
                                                </Button>
                                            )}
                                        </div>
                                    ) : (
                                        <ul className="list-disc list-inside text-sm text-[#000] dark:text-[#fff] space-y-1">
                                            <li>worse</li>
                                            <li>annoyedlgrg</li>
                                            <li>terribly</li>
                                            <li>harrow</li>
                                            <li>rg</li>
                                            <li>rgr</li>
                                            {!showMoreDescription && (
                                                <Button
                                                    onClick={() => setShowMoreDescription(true)}
                                                    variant="ghost"
                                                    className="text-sm text-[#f7641b] hover:text-[#eb611f] p-0 h-auto font-normal"
                                                >
                                                    Show more <ChevronDown className="h-4 w-4 ml-1" />
                                                </Button>
                                            )}
                                            {showMoreDescription && (
                                                <>
                                                    <li>get</li>
                                                    <Button
                                                        onClick={() => setShowMoreDescription(false)}
                                                        variant="ghost"
                                                        className="text-sm text-[#f7641b] hover:text-[#eb611f] p-0 h-auto font-normal"
                                                    >
                                                        Show less <ChevronDown className="h-4 w-4 ml-1 rotate-180" />
                                                    </Button>
                                                </>
                                            )}
                                        </ul>
                                    )}
                                </div>
                            </div>

                            {/* Essentials Section */}
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <h2 className="text-xl font-semibold text-[#000] dark:text-[#fff]">Essentials</h2>
                                    <Button
                                        onClick={() => setCurrentStep(1)}
                                        variant="ghost"
                                        className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                                    >
                                        To adjust
                                    </Button>
                                </div>
                                <div className="space-y-4">
                                    <div>
                                        <h3 className="text-base font-medium text-[#000] dark:text-[#fff] mb-1">Title of offer</h3>
                                        <p className="text-sm text-[#000] dark:text-[#fff]">{title || "dvdffvdvdbdbfb"}</p>
                                    </div>
                                    <div className="grid grid-cols-3 gap-6">
                                        <div>
                                            <h4 className="text-sm font-medium text-[#000] dark:text-[#fff] mb-1">Price Offer</h4>
                                            <p className="text-sm text-[#000] dark:text-[#fff]">{priceOffer ? `₹${priceOffer}` : "-"}</p>
                                        </div>
                                        <div>
                                            <h4 className="text-sm font-medium text-[#000] dark:text-[#fff] mb-1">Lowest price elsewhere</h4>
                                            <p className="text-sm text-[#000] dark:text-[#fff]">{lowestPrice ? `₹${lowestPrice}` : "-"}</p>
                                        </div>
                                        <div>
                                            <h4 className="text-sm font-medium text-[#000] dark:text-[#fff] mb-1">Postage costs</h4>
                                            <p className="text-sm text-[#000] dark:text-[#fff]">{postageCosts ? `₹${postageCosts}` : "-"}</p>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-6">
                                        <div>
                                            <h4 className="text-sm font-medium text-[#000] dark:text-[#fff] mb-1">Shipping from</h4>
                                            <p className="text-sm text-[#000] dark:text-[#fff]">{shippingFrom || "-"}</p>
                                        </div>
                                        <div>
                                            <h4 className="text-sm font-medium text-[#000] dark:text-[#fff] mb-1">Availability</h4>
                                            <p className="text-sm text-[#000] dark:text-[#fff]">{availability || "-"}</p>
                                        </div>
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-medium text-[#000] dark:text-[#fff] mb-1">Discount code</h4>
                                        <p className="text-sm text-[#000] dark:text-[#fff]">{discountCode || "-"}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Final Details Section */}
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <h2 className="text-xl font-semibold text-[#000] dark:text-[#fff]">Final details</h2>
                                    <Button
                                        onClick={() => setCurrentStep(4)}
                                        variant="ghost"
                                        className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                                    >
                                        To adjust
                                    </Button>
                                </div>
                                <div className="grid grid-cols-3 gap-6">
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
                                        <p className="text-sm text-[#000] dark:text-[#fff]">
                                            {selectedCategories.length > 0 ? selectedCategories.join(", ") : "Electronics"}
                                        </p>
                                    </div>
                                </div>
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
            {/* Mobile: Horizontal Step Bar */}
            <div className="block md:hidden w-full bg-[#f3f5f7] mt-12 h-fit dark:bg-[#28292a] border-b border-gray-200 dark:border-[#23272f]">
                <nav className="flex flex-row items-center justify-between px-2 py-4 overflow-x-auto">
                    {steps.map((step, index) => {
                        let IconComponent = step.icon;
                        const isActive = index === currentStep;
                        const isCompleted = index < currentStep;
                        const isFuture = index > currentStep;
                        if (isCompleted) {
                            IconComponent = hoveredStep === index ? Pencil : CircleCheck;
                        }
                        return (
                            <div key={step.id} className="flex items-center">
                                <button
                                    onClick={() => {
                                        if (!isFuture) setCurrentStep(index);
                                    }}
                                    disabled={isFuture}
                                    onMouseEnter={() => setHoveredStep(index)}
                                    onMouseLeave={() => setHoveredStep(null)}
                                    className={cn(
                                        "flex flex-col items-center px-2 py-1 focus:outline-none",
                                        isActive
                                            ? "text-[#f7641b] dark:text-[#f97936]"
                                            : isCompleted
                                                ? "text-[#238012] dark:text-green-400"
                                                : "text-[#a7a9ac] dark:text-[#525457]",
                                        isFuture && "cursor-not-allowed opacity-60"
                                    )}
                                >
                                    <IconComponent className="h-5 w-5 mb-1" />
                                    <span className="text-xs font-medium whitespace-nowrap">{step.title}</span>
                                </button>
                                {/* Horizontal line except after last step */}
                                {index < steps.length - 1 && (
                                    <div className="h-6 w-px bg-[#dfe1e4] dark:bg-[#46484b] mx-2" />
                                )}
                            </div>
                        );
                    })}
                </nav>
            </div>
            {/* Desktop: Sidebar + Content */}
            <div className="hidden md:flex w-full h-full flex-row">
                {/* Sidebar */}
                <div className="w-[272px] mt-14 bg-[#f3f5f7] dark:bg-[#28292a] flex flex-col">
                    <div className="p-6 pt-6 border-gray-700">
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
                                    <IconComponent className={cn("h-5 w-5 flex-shrink-0", isCompleted && hoveredStep !== index && "text-[#238012] dark:text-[#78c86b]")} />
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
                                className="h-9 px-4 border-[#dfe1e4] rounded-full hover:border-[#d7d9dd] hover:bg-[#f3f5f7] text-[#6b6d70] hover:text-[#76787b] dark:border-[#46484b] dark:hover:border-[#525457] dark:hover:bg-[#363739] dark:text-[#c5c7ca] dark:hover:text-[#d7d9dd] dark:bg-[#1d1f20]"
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
            </div>
            {/* Mobile: Main Content Area */}
            <div className="flex-1 flex flex-col overflow-auto md:hidden">
                <div className="flex-1 flex">{renderStepContent()}</div>
                {currentStep > 0 && (
                    <div className="border-t border-[#dfe1e4] dark:border-[#46484b] p-6 flex justify-between">
                        <Button
                            onClick={handleBack}
                            variant="outline"
                            className="h-9 px-4 border-[#dfe1e4] rounded-full hover:border-[#d7d9dd] hover:bg-[#f3f5f7] text-[#6b6d70] hover:text-[#76787b] dark:border-[#46484b] dark:hover:border-[#525457] dark:hover:bg-[#363739] dark:text-[#c5c7ca] dark:hover:text-[#d7d9dd] dark:bg-[#1d1f20]"
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
        </div>
    )
}

