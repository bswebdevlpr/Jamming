"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { ZodSchema_Band, ZodType_Band } from "@/app/lib/zod";
import { createBand } from "@/app/api/functions/band/create";
import { useSessionStore } from "@/app/stores";
import ButtonTemplate from "@/app/ui/templates/buttons";
import { GenreEnum } from "@/app/lib/enums/genre.enum";
import { LevelEnum } from "@/app/lib/enums/level.enum";
import { LocationEnum } from "@/app/lib/enums/location.enum";
import { toast } from "@/app/ui/components/toast";

export default function BandCreatePage() {
  const router = useRouter();
  const { userProfile } = useSessionStore();
  const queryClient = useQueryClient();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageThumbnail, setImageThumbnail] = useState<string | null>(null);
  const [imageError, setImageError] = useState<string | undefined>(undefined);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const t = imageThumbnail;
    return () => { if (t) URL.revokeObjectURL(t); };
  }, [imageThumbnail]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) {
      setImageError("10MB 이하의 이미지를 선택해주세요");
      e.target.value = "";
      return;
    }
    setImageError(undefined);
    setImageFile(file);
    setImageThumbnail(URL.createObjectURL(file));
  };

  const handleImageCancel = () => {
    setImageFile(null);
    setImageThumbnail(null);
    setImageError(undefined);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    setValue,
    watch,
  } = useForm<ZodType_Band>({
    resolver: zodResolver(ZodSchema_Band),
    mode: "onChange",
    defaultValues: {
      name: "",
      description: "",
      genre: [],
      location: userProfile.location ?? LocationEnum.SeoUl,
      level: userProfile.level ?? LevelEnum.Hobby,
      tags: [],
    },
  });

  const selectedGenres = (watch("genre") ?? []) as GenreEnum[];
  const selectedLevel = watch("level");
  const selectedLocation = watch("location");

  const toggleGenre = (genre: GenreEnum) => {
    const current = selectedGenres;
    if (current.includes(genre)) {
      setValue(
        "genre",
        current.filter((g) => g !== genre) as [GenreEnum, ...GenreEnum[]],
        { shouldValidate: true }
      );
    } else {
      setValue("genre", [...current, genre] as unknown as [GenreEnum, ...GenreEnum[]], {
        shouldValidate: true,
      });
    }
  };

  const onSubmit = async (data: ZodType_Band) => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    const result = await createBand({
      leader_id: userProfile.id!,
      name: data.name,
      description: data.description,
      genre: data.genre,
      location: data.location,
      level: data.level,
      tags: data.tags,
      ...(imageFile && { profile_image: imageFile }),
    });

    if (result.success) {
      // 캐시 무효화: 밴드 목록 새로고침
      await queryClient.invalidateQueries({ queryKey: ["my-bands"] });
      toast.success("밴드가 생성되었습니다!");
      router.push("/band");
    } else if (result.success === false) {
      toast.error(result.error.message);
    }
    setIsSubmitting(false);
  };

  const inputStyle = {
    background: "#242426",
    border: "1px solid #323234",
    borderRadius: "8px",
    padding: "10px 12px",
    color: "#ededed",
    fontFamily: "SUIT-BODY",
    fontSize: "16px" as const,
  };

  const labelStyle = {
    fontFamily: "SUIT-TITLE",
    fontSize: "0.875rem",
    color: "#E5E5E9",
  };

  return (
    <div className="grow flex flex-col overflow-without-scroll">
      <div className="flex items-center px-5 py-3">
        <button
          onClick={() => router.back()}
          style={{
            fontFamily: "SUIT-BODY",
            fontSize: "0.875rem",
            color: "#9F9FA2",
            background: "none",
            border: "none",
            cursor: "pointer",
          }}
          type="button"
          aria-label="뒤로가기"
        >
          &lt; 뒤로
        </button>
        <p
          className="flex-1 text-center"
          style={{
            fontFamily: "SUIT-TITLE",
            fontSize: "1.125rem",
            color: "#FFF",
          }}
        >
          밴드 만들기
        </p>
        <div style={{ width: "40px" }} />
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-5 px-5 pb-20 overflow-without-scroll"
      >
        {/* 프로필 이미지 */}
        <div className="flex flex-col items-center gap-2 pt-2">
          <div style={{ position: "relative", display: "inline-block" }}>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              style={{
                width: "80px",
                height: "80px",
                borderRadius: "50%",
                background: "#242426",
                border: "2px dashed #444447",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                overflow: "hidden",
                transition: "border-color 0.2s",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#6C9EFF"; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = "#444447"; }}
            >
              {imageThumbnail ? (
                <img
                  src={imageThumbnail}
                  alt="프로필 미리보기"
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              ) : (
                <>
                  <span style={{ fontSize: "1.5rem", color: "#535355" }}>♪</span>
                  <span style={{ fontSize: "0.5rem", color: "#535355", fontFamily: "SUIT-BODY", marginTop: "2px" }}>사진 추가</span>
                </>
              )}
            </button>
            {imageThumbnail && (
              <button
                type="button"
                onClick={handleImageCancel}
                style={{
                  position: "absolute",
                  top: "-4px",
                  right: "-4px",
                  width: "20px",
                  height: "20px",
                  borderRadius: "50%",
                  background: "#323234",
                  border: "1px solid #444447",
                  color: "#9F9FA2",
                  fontSize: "0.625rem",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                }}
              >
                ✕
              </button>
            )}
          </div>
          <p style={{ fontFamily: "SUIT-BODY", fontSize: "0.75rem", color: "#9F9FA2" }}>
            밴드 프로필 사진 (선택)
          </p>
          {imageError && (
            <p style={{ color: "#FF3E2F", fontSize: "0.75rem", fontFamily: "SUIT-BODY" }}>
              {imageError}
            </p>
          )}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            style={{ display: "none" }}
          />
        </div>

        {/* 밴드명 */}
        <div className="flex flex-col gap-2">
          <label style={labelStyle}>
            밴드명 *
          </label>
          <input
            {...register("name")}
            placeholder="밴드명을 입력하세요 (2-20자)"
            maxLength={20}
            style={inputStyle}
          />
          {errors.name && (
            <p style={{ color: "#FF3E2F", fontSize: "0.75rem", fontFamily: "SUIT-BODY" }}>
              {errors.name.message}
            </p>
          )}
        </div>

        {/* 소개 */}
        <div className="flex flex-col gap-2">
          <label style={labelStyle}>
            밴드 소개
          </label>
          <textarea
            {...register("description")}
            placeholder="밴드를 소개해주세요 (최대 500자)"
            maxLength={500}
            rows={4}
            style={{
              background: "#242426",
              border: "1px solid #323234",
              borderRadius: "8px",
              padding: "10px 12px",
              color: "#ededed",
              fontFamily: "SUIT-BODY",
              fontSize: "16px",
              resize: "none",
            }}
          />
        </div>

        {/* 장르 */}
        <div className="flex flex-col gap-2">
          <label style={labelStyle}>
            활동 장르 *
          </label>
          <div className="flex flex-wrap gap-2">
            {Object.values(GenreEnum).map((genre) => (
              <button
                key={genre}
                type="button"
                onClick={() => toggleGenre(genre)}
                style={{
                  padding: "6px 14px",
                  borderRadius: "4px",
                  fontFamily: "SUIT-BODY",
                  fontSize: "0.875rem",
                  cursor: "pointer",
                  border: selectedGenres.includes(genre)
                    ? "1px solid #A3FF0C"
                    : "1px solid #444447",
                  background: selectedGenres.includes(genre)
                    ? "rgba(163, 255, 12, 0.16)"
                    : "#323234",
                  color: selectedGenres.includes(genre) ? "#A3FF0C" : "#9F9FA2",
                }}
              >
                {genre}
              </button>
            ))}
          </div>
        </div>

        {/* 지역 */}
        <div className="flex flex-col gap-2">
          <label style={labelStyle}>
            활동 지역 *
          </label>
          <select
            {...register("location")}
            value={selectedLocation}
            style={{
              background: "#323234",
              border: "1px solid #444447",
              borderRadius: "4px",
              padding: "8px 12px",
              color: "#ededed",
              fontFamily: "SUIT-BODY",
              fontSize: "16px",
            }}
          >
            {Object.values(LocationEnum).map((loc) => (
              <option key={loc} value={loc}>
                {loc}
              </option>
            ))}
          </select>
        </div>

        {/* 실력대 */}
        <div className="flex flex-col gap-2">
          <label style={labelStyle}>
            실력대 *
          </label>
          <div className="flex flex-wrap gap-2">
            {Object.values(LevelEnum).map((level) => (
              <button
                key={level}
                type="button"
                onClick={() => setValue("level", level, { shouldValidate: true })}
                style={{
                  padding: "6px 14px",
                  borderRadius: "4px",
                  fontFamily: "SUIT-BODY",
                  fontSize: "0.875rem",
                  cursor: "pointer",
                  border:
                    selectedLevel === level
                      ? "1px solid #A3FF0C"
                      : "1px solid #444447",
                  background:
                    selectedLevel === level
                      ? "rgba(163, 255, 12, 0.16)"
                      : "#323234",
                  color: selectedLevel === level ? "#A3FF0C" : "#9F9FA2",
                }}
              >
                {level}
              </button>
            ))}
          </div>
        </div>

        {/* 제출 버튼 */}
        <ButtonTemplate
          text={isSubmitting ? "생성 중..." : "밴드 만들기"}
          isActive={isValid && !isSubmitting}
          type="submit"
        />
      </form>
    </div>
  );
}
