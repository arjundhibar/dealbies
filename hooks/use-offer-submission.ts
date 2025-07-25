import { useState } from "react"
import { useRouter } from "next/navigation"
import { getSupabase } from "@/lib/supabase"
import { useAuth } from "@/lib/auth-context"

export function useOfferSubmission(uploadedImages: any[], title: string) {
    const [isLoading, setIsLoading] = useState(false)
    const router = useRouter()
    const { session } = useAuth();

    async function handleSubmitDeal(payloadBase: any) {
        try {
            setIsLoading(true)
            let accessToken = session?.access_token;
            if (!accessToken) {
                const supabase = getSupabase();
                const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
                if (sessionError || !sessionData?.session || !sessionData.session.user) {
                    throw new Error("Failed to retrieve session after login");
                }
                accessToken = sessionData.session.access_token;
            }
            if (!accessToken) {
                throw new Error("Access token not found in session");
            }
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
                    const slugBase = title ? title : `image-${i + 1}`;
                    const slug = slugBase.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") + `-${i + 1}.jpg`;
                    const seoUrl = `https://images.dealbies.com/${slug}`;
                    imageUploadResults.push({ url: seoUrl, slug, isCover: i === 0, cloudflareUrl: publicUrl });
                } else {
                    console.warn("Skipped non-uploaded image:", img.url);
                }
            }
            const imageUrls = imageUploadResults;
            const coverImageIndex = imageUploadResults.findIndex((img) => img.isCover);
            const payload = {
                ...payloadBase,
                imageUrls,
                coverImageIndex,
            };
            const dealRes = await fetch("/api/deals", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${accessToken}`,
                },
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

    return { handleSubmitDeal, isLoading }
}
