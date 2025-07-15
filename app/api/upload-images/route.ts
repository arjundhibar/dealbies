import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
    const CLOUDFLARE_ACCOUNT_ID = process.env.CLOUDFLARE_ACCOUNT_ID
    const CLOUDFLARE_API_TOKEN = process.env.CLOUDFLARE_API_TOKEN

    const uploadURLRes = await fetch(
        `https://api.cloudflare.com/client/v4/accounts/${CLOUDFLARE_ACCOUNT_ID}/images/v2/direct_upload`,
        {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${CLOUDFLARE_API_TOKEN}`,
                'Content-Type': 'application/json',
            },
        }
    )

    const uploadURLData = await uploadURLRes.json()
    const uploadURL = uploadURLData?.result?.uploadURL
    if (!uploadURL) {
        return NextResponse.json({ error: 'Failed to get Cloudflare upload URL' }, { status: 500 })
    }

    // forward the upload
    const formData = await req.formData()
    const uploadRes = await fetch(uploadURL, {
        method: 'POST',
        body: formData,
    })

    const result = await uploadRes.json()
    if (!uploadRes.ok) {
        return NextResponse.json({ error: 'Failed to upload image to Cloudflare', details: result }, { status: 500 })
    }

    return NextResponse.json(result)
}
