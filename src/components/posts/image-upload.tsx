'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { ImagePlus, Loader2, X } from 'lucide-react'

interface ImageUploadProps {
  defaultImage?: string | null
  onImageChange: (imageData: { url: string; key: string } | null) => void
}

export function ImageUpload({ defaultImage, onImageChange }: ImageUploadProps) {
  const [image, setImage] = useState<string | null>(defaultImage || null)
  const [isUploading, setIsUploading] = useState(false)

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (file.size > 5 * 1024 * 1024) {
      alert('File size must be less than 5MB')
      return
    }

    try {
      setIsUploading(true)

      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        throw new Error('Upload failed')
      }

      const data = await response.json()
      setImage(data.url)
      onImageChange({ url: data.url, key: data.key })
    } catch (error) {
      console.error('Upload error:', error)
      alert('Failed to upload image')
    } finally {
      setIsUploading(false)
    }
  }

  const handleRemoveImage = () => {
    setImage(null)
    onImageChange(null)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Post Image</CardTitle>
        <CardDescription>
          Upload a cover image for your post. Maximum size 5MB.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {image ? (
          <div className="relative aspect-video w-full overflow-hidden rounded-lg">
            <Image
              src={image}
              alt="Post cover"
              fill
              className="object-cover"
              priority
            />
            <Button
              variant="destructive"
              size="icon"
              className="absolute right-2 top-2"
              onClick={handleRemoveImage}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-4">
            <div className="flex h-48 w-full items-center justify-center rounded-lg border border-dashed">
              {isUploading ? (
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              ) : (
                <ImagePlus className="h-8 w-8 text-muted-foreground" />
              )}
            </div>
            <Input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              disabled={isUploading}
              className="max-w-xs"
            />
          </div>
        )}
      </CardContent>
    </Card>
  )
}
