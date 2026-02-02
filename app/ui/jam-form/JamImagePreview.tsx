"use client";

import { memo } from "react";
import Image from "next/image";
import { CreateJam_ImageRemoveIcon } from "@/app/ui/images/jamsession/popup/create-jam";
import { ZodType_Image } from "@/app/lib/zod";

interface JamImagePreviewProps {
  images: ZodType_Image[];
  existingImages?: string[];
  onRemove: (idx: number) => void;
  onExistingRemove?: (idx: number) => void;
}

export const JamImagePreview = memo(function JamImagePreview({
  images,
  existingImages = [],
  onRemove,
  onExistingRemove,
}: JamImagePreviewProps) {
  const hasImages = existingImages.length > 0 || images.length > 0;

  if (!hasImages) return null;

  return (
    <>
      {existingImages.length > 0 && onExistingRemove && (
        <ImageGrid
          images={existingImages.map((url) => ({ url, isExisting: true }))}
          onRemove={onExistingRemove}
          keyPrefix="existing"
        />
      )}
      {images.length > 0 && (
        <ImageGrid
          images={images.map((img) => ({ url: img.thumbnail, isExisting: false }))}
          onRemove={onRemove}
          keyPrefix="new"
        />
      )}
    </>
  );
});

interface ImageGridProps {
  images: { url: string; isExisting: boolean }[];
  onRemove: (idx: number) => void;
  keyPrefix: string;
}

const ImageGrid = memo(function ImageGrid({
  images,
  onRemove,
  keyPrefix,
}: ImageGridProps) {
  return (
    <div
      className="flex flex-col gap-3"
      style={{
        color: "#9F9FA2",
        fontFamily: "SUIT-BODY",
        fontSize: "0.75rem",
        lineHeight: "140%",
        letterSpacing: "-0.288px",
      }}
    >
      <div className="flex flex-wrap gap-4">
        {images.map((image, idx) => (
          <div key={`${keyPrefix}-${idx}`} className="relative">
            <div
              style={{
                width: "80px",
                height: "80px",
                position: "relative",
              }}
            >
              <Image
                src={image.url}
                alt=""
                fill
                style={{ objectFit: "cover" }}
              />
            </div>
            <CreateJam_ImageRemoveIcon
              style={{
                position: "absolute",
                top: -8,
                right: -8,
              }}
              onClick={() => onRemove(idx)}
            />
          </div>
        ))}
      </div>
      <div>
        <p>*첫번째 사진은 게시글의 대표사진으로 지정됩니다.</p>
        <p>사진은 최대 5개까지 첨부 가능합니다.</p>
      </div>
    </div>
  );
});
