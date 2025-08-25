import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
    try {
        const CLOUDFLARE_ACCOUNT_ID = process.env.CLOUDFLARE_ACCOUNT_ID
        const CLOUDFLARE_API_TOKEN = process.env.CLOUDFLARE_API_TOKEN

        // Check if environment variables are set
        if (!CLOUDFLARE_ACCOUNT_ID || !CLOUDFLARE_API_TOKEN) {
            console.error('Missing Cloudflare environment variables')
            return NextResponse.json({ 
                error: 'Cloudflare configuration missing' 
            }, { status: 500 })
        }

        // Get form data first
        const formData = await req.formData()
        if (!formData) {
            return NextResponse.json({ 
                error: 'No form data provided' 
            }, { status: 400 })
        }

        // Get upload URL from Cloudflare
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

        if (!uploadURLRes.ok) {
            const errorData = await uploadURLRes.text()
            console.error('Cloudflare API error:', errorData)
            return NextResponse.json({ 
                error: 'Failed to get Cloudflare upload URL',
                details: errorData
            }, { status: uploadURLRes.status })
        }

        const uploadURLData = await uploadURLRes.json()
        const uploadURL = uploadURLData?.result?.uploadURL
        
        if (!uploadURL) {
            console.error('No upload URL in Cloudflare response:', uploadURLData)
            return NextResponse.json({ 
                error: 'Failed to get Cloudflare upload URL',
                details: uploadURLData
            }, { status: 500 })
        }

        // Upload to Cloudflare
        const uploadRes = await fetch(uploadURL, {
            method: 'POST',
            body: formData,
        })

        if (!uploadRes.ok) {
            const errorData = await uploadRes.text()
            console.error('Cloudflare upload error:', errorData)
            return NextResponse.json({ 
                error: 'Failed to upload image to Cloudflare', 
                details: errorData 
            }, { status: uploadRes.status })
        }

        const result = await uploadRes.json()
        return NextResponse.json(result)

    } catch (error) {
        console.error('Upload images API error:', error)
        return NextResponse.json({ 
            error: 'Internal server error',
            details: error instanceof Error ? error.message : 'Unknown error'
        }, { status: 500 })
    }
}
