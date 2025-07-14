
import { NextResponse } from 'next/server'

export async function POST() {
    const CLOUDFLARE_ACCOUNT_ID = process.env.CLOUDFLARE_ACCOUNT_ID
    const CLOUDFLARE_API_TOKEN = process.env.CLOUDFLARE_API_TOKEN

    console.log("ACCOUNT_ID:", CLOUDFLARE_ACCOUNT_ID)
    console.log("API_TOKEN:", CLOUDFLARE_API_TOKEN)

    const response = await fetch(`https://api.cloudflare.com/client/v4/accounts/${CLOUDFLARE_ACCOUNT_ID}/images/v2/direct_upload`, {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${CLOUDFLARE_API_TOKEN}`,
            'Content-Type': 'application/json',
        },
    })

    const data = await response.json()
    console.log("Cloudflare Response:", data)
    if (!data.success) {
        console.error("Cloudflare Error:", data.errors)
        return NextResponse.json({ error: 'Failed to get upload URL', details: data.errors }, { status: 500 })
    }


    return NextResponse.json({
        uploadURL: data.result.uploadURL,
        imageID: data.result.id,
    })
}
