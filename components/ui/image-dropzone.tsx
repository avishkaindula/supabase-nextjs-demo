"use client";

import { useCallback, useState, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import { v4 as uuidv4 } from "uuid";
import { createClient } from "@/utils/supabase/client";

interface UploadedFileInfo {
  path?: string;
  filename?: string;
  previewUrl?: string;
  uploading?: boolean;
}

interface ImageUploaderProps {
  maxImages: number;
  onImagesChange: (images: UploadedFileInfo[]) => void;
  onUploadStateChange: (isUploading: boolean) => void;
  isUploading?: boolean;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({
  maxImages,
  onImagesChange,
  onUploadStateChange,
  isUploading = false,
}) => {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFileInfo[]>([]);
  const [uploadingIndices, setUploadingIndices] = useState<Set<number>>(
    new Set()
  );

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      const newFiles = acceptedFiles.slice(0, maxImages - uploadedFiles.length);
      // Add placeholders for uploading
      const uploadingPlaceholders = newFiles.map(() => ({ uploading: true }));
      setUploadedFiles((prev) => [...prev, ...uploadingPlaceholders]);
      onUploadStateChange(true);

      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        onUploadStateChange(false);
        return;
      }
      for (let i = 0; i < newFiles.length; i++) {
        const file = newFiles[i];
        const ext = file.name.split(".").pop();
        const filename = `${uuidv4()}.${ext}`;
        const path = `private/${user.id}/${filename}`;
        // Get signed upload URL
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from("prescriptions")
          .createSignedUploadUrl(path);
        if (uploadError || !uploadData) {
          // Remove placeholder if upload fails
          setUploadedFiles((prev) => {
            const idx = prev.findIndex((f) => f.uploading);
            return prev.filter((_, j) => j !== idx);
          });
          continue;
        }
        // Upload file
        const uploadRes = await fetch(uploadData.signedUrl, {
          method: "PUT",
          body: file,
          headers: { "Content-Type": file.type },
        });
        if (!uploadRes.ok) {
          setUploadedFiles((prev) => {
            const idx = prev.findIndex((f) => f.uploading);
            return prev.filter((_, j) => j !== idx);
          });
          continue;
        }
        // Get signed download URL for preview
        const { data: previewData, error: previewError } =
          await supabase.storage
            .from("prescriptions")
            .createSignedUrl(path, 60 * 60); // 1 hour
        if (previewError || !previewData) {
          setUploadedFiles((prev) => {
            const idx = prev.findIndex((f) => f.uploading);
            return prev.filter((_, j) => j !== idx);
          });
          continue;
        }
        // Replace the first uploading placeholder with the real file info
        setUploadedFiles((prev) => {
          const idx = prev.findIndex((f) => f.uploading);
          if (idx === -1) return prev;
          const newArr = [...prev];
          newArr[idx] = { path, filename, previewUrl: previewData.signedUrl };
          return newArr;
        });
      }
      onUploadStateChange(false);
    },
    [uploadedFiles, maxImages, onImagesChange, onUploadStateChange]
  );

  const removeImage = (index: number) => {
    setUploadedFiles((prev) => prev.filter((_, i) => i !== index));
    onImagesChange(uploadedFiles.filter((_, i) => i !== index));
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [] },
    maxFiles: maxImages,
  });

  useEffect(() => {
    // Only pass fully uploaded files to parent
    onImagesChange(uploadedFiles.filter((f) => !f.uploading));
  }, [uploadedFiles, onImagesChange]);

  return (
    <div className="flex p-1 mt-2">
      <div className="flex flex-wrap lg:flex-nowrap gap-2">
        {uploadedFiles.map((file, index) => (
          <div
            key={index}
            className="relative cursor-pointer min-h-[100px] min-w-[100px]"
          >
            {file.uploading ? (
              <div className="absolute inset-0 z-10 bg-black/50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-[3px] border-white border-t-transparent"></div>
              </div>
            ) : (
              <>
                <img
                  src={file.previewUrl}
                  alt={`preview image ${index + 1}`}
                  className="min-h-[100px] max-h-[100px] min-w-[100px] max-w-[100px] object-cover"
                />
                <button
                  onClick={() => removeImage(index)}
                  className="absolute top-0 right-0 p-1 bg-white rounded-full z-20"
                >
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 14 14"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M1 13L13 1M1 1L13 13"
                      stroke="black"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
              </>
            )}
          </div>
        ))}
        {uploadedFiles.length < maxImages && (
          <div
            {...getRootProps()}
            className="dropzone flex items-center justify-center cursor-pointer"
          >
            <input {...getInputProps()} />
            {isDragActive ? (
              <p>Drop the files here ...</p>
            ) : (
              <img
                src="/image1.svg"
                alt="plus icon"
                className="mt-[14px] w-10 h-10"
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageUploader;
