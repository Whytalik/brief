"use client";

import { cn } from "@/lib/utils";
import { FileText, Image as ImageIcon, Upload, X } from "lucide-react";
import React, { useRef, useState } from "react";

import { Button } from "@/components/ui/Button";

interface FileUploadProps {
  label: string;
  onChange?: (files: File[]) => void;
  error?: string;
  required?: boolean;
  multiple?: boolean;
  accept?: string;
  className?: string;
}

export function FileUpload({
  label,
  onChange,
  error,
  required,
  multiple = false,
  accept,
  className,
}: FileUploadProps) {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFiles = (files: FileList | null) => {
    if (!files) return;
    const newFiles = Array.from(files);
    const updatedFiles = multiple ? [...selectedFiles, ...newFiles] : newFiles;
    setSelectedFiles(updatedFiles);
    onChange?.(updatedFiles);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFiles(e.target.files);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const removeFile = (index: number) => {
    const updatedFiles = selectedFiles.filter((_, i) => i !== index);
    setSelectedFiles(updatedFiles);
    onChange?.(updatedFiles);
  };

  return (
    <div className={cn("flex w-full flex-col gap-1.5", className)}>
      <label className="text-sm font-medium leading-none">
        {label}
        {required && <span className="ml-1 text-red-500">*</span>}
      </label>

      <div
        className={cn(
          "border-muted-foreground/25 hover:bg-muted/50 relative flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-6 text-center transition-colors",
          dragActive && "border-blue-500 bg-blue-50",
          error && "border-red-500",
        )}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          ref={inputRef}
          type="file"
          multiple={multiple}
          accept={accept}
          onChange={handleChange}
          className="absolute inset-0 cursor-pointer opacity-0"
        />

        <div className="flex flex-col items-center gap-2">
          <div className="bg-muted rounded-full p-3">
            <Upload className="text-muted-foreground h-6 w-6" />
          </div>
          <div className="text-sm">
            <span className="font-semibold text-blue-600">
              Натисніть для вибору
            </span>{" "}
            або перетягніть файли сюди
          </div>
          <p className="text-muted-foreground text-xs">
            SVG, PNG, JPG, PDF або DOC (макс. 10MB)
          </p>
        </div>
      </div>

      {selectedFiles.length > 0 && (
        <div className="mt-3 space-y-2">
          {selectedFiles.map((file, index) => (
            <div
              key={`${file.name}-${index}`}
              className="border-input bg-background flex items-center justify-between rounded-md border p-2 text-sm"
            >
              <div className="flex items-center gap-2 overflow-hidden">
                {file.type.startsWith("image/") ? (
                  <ImageIcon className="h-4 w-4 shrink-0 text-blue-500" />
                ) : (
                  <FileText className="h-4 w-4 shrink-0 text-gray-500" />
                )}
                <span className="truncate font-medium">{file.name}</span>
                <span className="text-muted-foreground text-xs">
                  ({(file.size / 1024 / 1024).toFixed(2)} MB)
                </span>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => removeFile(index)}
                className="h-8 w-8 rounded-full p-0"
              >
                <X className="h-4 w-4 text-muted-foreground" />
              </Button>
            </div>
          ))}
        </div>
      )}

      {error && <p className="text-sm font-medium text-red-500">{error}</p>}
    </div>
  );
}
