import { useAuth } from "@/lib/auth-context";
import { getSupabase } from "@/lib/supabase";
import { useRouter } from "next/navigation"
import { useState } from "react";

export function useCouponSubmission(uploadedImages: any[], title: string) {
    const [isLoading, setIsLoading] = useState(false)
    const router = useRouter()
    const { session } = useAuth();

    async function handleSubmitCoupon(payloadBase: any) {
        try {
            setIsLoading(true)
            let accessToken = session?.access_token;
            if (!accessToken) {
                const supabase = getSupabase();
                const { data: sessionData,
                    error: sessionError
                } = await supabase.auth.getSession();
                if (sessionError || !sessionData?.session || !sessionData.session.user) {
                    throw new Error("Failed to retrieve session after login");
                }
                accessToken = sessionData.session.access_token;
                if (!accessToken) {
                    throw new Error("Access token not found in session")
                }
            }
            
            console.log("Starting image upload process...");
            const imageUploadResults = [];
            for (let i = 0; i < uploadedImages.length; i++){
                const img = uploadedImages[i];
                if (img.file) {
                    console.log(`Uploading image ${i + 1}/${uploadedImages.length}`);
                    const formData = new FormData();
                    formData.append("file", img.file);
                    const uploadRes = await fetch("/api/upload-images", {
                        method: "POST",
                        body: formData,
                    });
                    if (!uploadRes.ok) throw new Error("Failed to upload image to Cloudflare");
                    const uploadResult = await uploadRes.json();
                    const publicUrl = uploadResult.result.variants[0];
                    const slugBase = title ? title : `image-${i + 1}`;
                    const slug = slugBase.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") + `-${i + 1}.jpg`;
                    const seoUrl = `https://images.dealbies.com/${slug}`;
                    imageUploadResults.push({ url: seoUrl, slug, isCover: i === 0, cloudflareUrl: publicUrl });
                } else {
                    console.warn("Skipped non-uploaded image:", img.url);
                }
            }
            console.log("Image upload completed, preparing payload...");
            const imageUrls = imageUploadResults;
            const coverImageIndex = imageUploadResults.findIndex((img) => img.isCover);
            const payload = {
                ...payloadBase,
                imageUrls,
                coverImageIndex
            }
            console.log("Final payload being sent:", payload);
            const couponRes = await fetch("/api/coupons", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${accessToken}`,
                },
                body: JSON.stringify(payload),
            })
            if (!couponRes.ok) {
                const error = await couponRes.json();
                throw new Error(error.message || "Failed to post coupon");
            }
            const data = await couponRes.json();
            console.log("✅ Coupon Posted:", data)
            router.push("/")
        } catch (error: any) {
            console.error("🚨 Coupon post failed:", error); 
            alert(error.message || "Something went wrong");
            
        } finally {
            setIsLoading(false);
        }
    }
    return {handleSubmitCoupon, isLoading}
}