"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ZodSchema_Band, ZodType_Band } from "@/app/lib/zod";
import { getBand } from "@/app/api/functions/band/read";
import { updateBand } from "@/app/api/functions/band/update";
import ButtonTemplate from "@/app/ui/templates/buttons";
import { GenreEnum } from "@/app/lib/enums/genre.enum";
import { LevelEnum } from "@/app/lib/enums/level.enum";
import { LocationEnum } from "@/app/lib/enums/location.enum";

export default function BandEditPage() {
  const router = useRouter();
  const params = useParams();
  const bandId = Number(params.id);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    setValue,
    watch,
    reset,
  } = useForm<ZodType_Band>({
    resolver: zodResolver(ZodSchema_Band),
    mode: "onChange",
  });

  const selectedGenres = (watch("genre") ?? []) as GenreEnum[];
  const selectedLevel = watch("level");
  const selectedLocation = watch("location");

  useEffect(() => {
    (async () => {
      try {
        const band = await getBand(bandId);
        reset({
          name: band.name ?? "",
          description: band.description ?? "",
          genre: (band.genre ?? []) as [GenreEnum, ...GenreEnum[]],
          location: band.location ?? LocationEnum.SeoUl,
          level: band.level ?? LevelEnum.Hobby,
          tags: band.tags ?? [],
        });
      } catch {
        router.push("/band");
      }
      setIsLoading(false);
    })();
  }, [bandId, reset, router]);

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

    const result = await updateBand(bandId, {
      name: data.name,
      description: data.description,
      genre: data.genre,
      location: data.location,
      level: data.level,
      tags: data.tags,
    });

    if (result.success) {
      router.push(`/band/${bandId}`);
    } else if (result.success === false) {
      alert(result.error.message);
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

  if (isLoading) {
    return (
      <div className="grow flex justify-center items-center">
        <p style={{ color: "#9F9FA2", fontFamily: "SUIT-BODY" }}>loading...</p>
      </div>
    );
  }

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
          밴드 수정
        </p>
        <div style={{ width: "40px" }} />
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-5 px-5 pb-20 overflow-without-scroll"
      >
        <div className="flex flex-col gap-2">
          <label style={labelStyle}>
            밴드명 *
          </label>
          <input
            {...register("name")}
            maxLength={20}
            style={inputStyle}
          />
          {errors.name && (
            <p style={{ color: "#FF3E2F", fontSize: "0.75rem", fontFamily: "SUIT-BODY" }}>
              {errors.name.message}
            </p>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <label style={labelStyle}>
            밴드 소개
          </label>
          <textarea
            {...register("description")}
            maxLength={500}
            rows={4}
            style={{ ...inputStyle, resize: "none" }}
          />
        </div>

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
                  border: selectedGenres.includes(genre) ? "1px solid #A3FF0C" : "1px solid #444447",
                  background: selectedGenres.includes(genre) ? "rgba(163, 255, 12, 0.16)" : "#323234",
                  color: selectedGenres.includes(genre) ? "#A3FF0C" : "#9F9FA2",
                }}
              >
                {genre}
              </button>
            ))}
          </div>
        </div>

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
              <option key={loc} value={loc}>{loc}</option>
            ))}
          </select>
        </div>

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
                  border: selectedLevel === level ? "1px solid #A3FF0C" : "1px solid #444447",
                  background: selectedLevel === level ? "rgba(163, 255, 12, 0.16)" : "#323234",
                  color: selectedLevel === level ? "#A3FF0C" : "#9F9FA2",
                }}
              >
                {level}
              </button>
            ))}
          </div>
        </div>

        <ButtonTemplate
          text={isSubmitting ? "수정 중..." : "수정 완료"}
          isActive={isValid && !isSubmitting}
          type="submit"
        />
      </form>
    </div>
  );
}
