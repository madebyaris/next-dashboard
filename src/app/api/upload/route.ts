import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import crypto from 'crypto'

const s3Client = new S3Client({
  region: process.env.AWS_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
})

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const formData = await request.formData()
    const file = formData.get('file') as File
    if (!file) {
      return new NextResponse('No file provided', { status: 400 })
    }

    // Generate unique file key
    const fileKey = `${crypto.randomBytes(16).toString('hex')}-${file.name}`
    const buffer = Buffer.from(await file.arrayBuffer())

    // Upload to S3
    const command = new PutObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME!,
      Key: fileKey,
      Body: buffer,
      ContentType: file.type,
    })

    await s3Client.send(command)

    // Generate signed URL for the uploaded file
    const getCommand = new PutObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME!,
      Key: fileKey,
    })
    const url = await getSignedUrl(s3Client, getCommand, { expiresIn: 3600 })

    return NextResponse.json({
      url,
      key: fileKey,
    })
  } catch (error) {
    console.error('[UPLOAD_POST]', error)
    return new NextResponse('Internal Error', { status: 500 })
  }
}
