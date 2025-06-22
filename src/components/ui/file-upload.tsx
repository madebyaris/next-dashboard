'use client'

import * as React from 'react'
import { useCallback, useState } from 'react'
import { Upload, X, File, Image, FileText } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from './button'
import { Progress } from './progress'

interface FileUploadProps {
  onUpload?: (files: File[]) => Promise<void>
  onRemove?: (index: number) => void
  accept?: string
  multiple?: boolean
  maxFiles?: number
  maxSize?: number // in bytes
  disabled?: boolean
  value?: FilePreview[]
  onChange?: (files: FilePreview[]) => void
  className?: string
}

interface FilePreview {
  file: File
  url: string
  progress?: number
  error?: string
}

export function FileUpload({
  onUpload,
  onRemove,
  accept = '*/*',
  multiple = false,
  maxFiles = 10,
  maxSize = 10 * 1024 * 1024, // 10MB
  disabled = false,
  value = [],
  onChange,
  className,
}: FileUploadProps) {
  const [dragActive, setDragActive] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [files, setFiles] = useState<FilePreview[]>(value)

  const updateFiles = useCallback((newFiles: FilePreview[]) => {
    setFiles(newFiles)
    onChange?.(newFiles)
  }, [onChange])

  const validateFile = (file: File): string | null => {
    if (file.size > maxSize) {
      return `File size must be less than ${Math.round(maxSize / 1024 / 1024)}MB`
    }
    
    if (accept !== '*/*') {
      const acceptedTypes = accept.split(',').map(type => type.trim())
      const isValidType = acceptedTypes.some(type => {
        if (type.startsWith('.')) {
          return file.name.toLowerCase().endsWith(type.toLowerCase())
        }
        return file.type.match(type.replace('*', '.*'))
      })
      
      if (!isValidType) {
        return `File type not accepted. Accepted types: ${accept}`
      }
    }
    
    return null
  }

  const processFiles = useCallback(async (fileList: FileList) => {
    const newFiles: FilePreview[] = []
    
    for (let i = 0; i < fileList.length; i++) {
      const file = fileList[i]
      const error = validateFile(file)
      
      if (files.length + newFiles.length >= maxFiles) {
        break
      }
      
      const preview: FilePreview = {
        file,
        url: URL.createObjectURL(file),
        error,
        progress: 0,
      }
      
      newFiles.push(preview)
    }
    
    if (newFiles.length === 0) return
    
    const updatedFiles = multiple ? [...files, ...newFiles] : newFiles
    updateFiles(updatedFiles)
    
    if (onUpload && !newFiles.some(f => f.error)) {
      setUploading(true)
      try {
        await onUpload(newFiles.map(f => f.file))
        
        // Update progress to 100% for all uploaded files
        const completedFiles = updatedFiles.map(f => 
          newFiles.includes(f) ? { ...f, progress: 100, error: undefined } : f
        )
        updateFiles(completedFiles)
      } catch (error) {
        const errorFiles = updatedFiles.map(f =>
          newFiles.includes(f) ? { ...f, error: 'Upload failed' } : f
        )
        updateFiles(errorFiles)
      } finally {
        setUploading(false)
      }
    }
  }, [files, maxFiles, multiple, onUpload, updateFiles])

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
  }, [])

  const handleDragIn = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
      setDragActive(true)
    }
  }, [])

  const handleDragOut = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    
    if (disabled) return
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFiles(e.dataTransfer.files)
    }
  }, [disabled, processFiles])

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFiles(e.target.files)
    }
  }, [processFiles])

  const removeFile = useCallback((index: number) => {
    const newFiles = files.filter((_, i) => i !== index)
    updateFiles(newFiles)
    onRemove?.(index)
  }, [files, onRemove, updateFiles])

  const getFileIcon = (file: File) => {
    if (file.type.startsWith('image/')) return Image
    if (file.type.includes('pdf') || file.type.includes('document')) return FileText
    return File
  }

  return (
    <div className={cn("space-y-4", className)}>
      <div
        className={cn(
          "border-2 border-dashed rounded-lg p-6 text-center transition-colors",
          dragActive && "border-primary bg-primary/5",
          disabled && "opacity-50 cursor-not-allowed",
          !disabled && "hover:border-primary/50 cursor-pointer"
        )}
        onDragEnter={handleDragIn}
        onDragLeave={handleDragOut}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => !disabled && document.getElementById('file-upload')?.click()}
      >
        <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
        <p className="text-sm text-muted-foreground mb-2">
          {multiple
            ? `Drop files here or click to upload (max ${maxFiles} files)`
            : 'Drop file here or click to upload'
          }
        </p>
        <p className="text-xs text-muted-foreground">
          Max file size: {Math.round(maxSize / 1024 / 1024)}MB
          {accept !== '*/*' && ` • Accepted: ${accept}`}
        </p>
        
        <input
          id="file-upload"
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={handleFileInput}
          disabled={disabled}
          className="hidden"
        />
      </div>

      {files.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium">Uploaded Files</h4>
          <div className="space-y-2">
            {files.map((filePreview, index) => {
              const FileIcon = getFileIcon(filePreview.file)
              return (
                <div
                  key={index}
                  className="flex items-center gap-3 p-3 border rounded-lg"
                >
                  <FileIcon className="h-4 w-4 text-muted-foreground" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">
                      {filePreview.file.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {(filePreview.file.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                    {filePreview.progress !== undefined && filePreview.progress < 100 && (
                      <Progress value={filePreview.progress} className="mt-1" />
                    )}
                    {filePreview.error && (
                      <p className="text-xs text-destructive mt-1">
                        {filePreview.error}
                      </p>
                    )}
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation()
                      removeFile(index)
                    }}
                    disabled={uploading}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
} 