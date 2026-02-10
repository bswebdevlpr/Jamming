"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ZodSchema_RecruitPost, ZodType_RecruitPost } from "@/app/lib/zod";
import { createRecruitPost } from "@/app/api/functions/recruit/create";
import { getMyBands } from "@/app/api/functions/band/read";
import { useSessionStore } from "@/app/stores";
import ButtonTemplate from "@/app/ui/templates/buttons";
import { GenreEnum } from "@/app/lib/enums/genre.enum";
import { LevelEnum } from "@/app/lib/enums/level.enum";
import { LocationEnum } from "@/app/lib/enums/location.enum";
import { PositionEnum } from "@/app/lib/enums/position.enum";
import { Entity_Band } from "@/app/lib/interfaces/entity.interface";

export default function RecruitWritePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const bandIdParam = searchParams.get("band_id");
  const { userProfile } = useSessionStore();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [myLeaderBands, setMyLeaderBands] = useState<Entity_Band[]>([]);
  const [selectedBandId, setSelectedBandId] = useState<number | null>(
    bandIdParam ? Number(bandIdParam) : null
  );

  // Positions management
  const [posEntries, setPosEntries] = useState<
    { pos: string; headcnt: number }[]
  >([{ pos: PositionEnum.Guitar, headcnt: 1 }]);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    setValue,
    watch,
  } = useForm<ZodType_RecruitPost>({
    resolver: zodResolver(ZodSchema_RecruitPost),
    mode: "onChange",
    defaultValues: {
      title: "",
      body: "",
      positions: [{ pos: PositionEnum.Guitar, headcnt: 1 }],
      genre: [],
      level: [],
      location: userProfile.location ?? LocationEnum.SeoUl,
      video_url: "",
      openchat: "",
      deadline: "",
    },
  });

  const selectedGenres = (watch("genre") ?? []) as GenreEnum[];
  const selectedLevels = (watch("level") ?? []) as LevelEnum[];
  const selectedLocation = watch("location");

  useEffect(() => {
    (async () => {
      try {
        const bands = await getMyBands();
        const leaderBands = bands
          .filter((b) => b.role === "leader")
          .map((b) => b.band);
        setMyLeaderBands(leaderBands);
        if (!selectedBandId && leaderBands.length > 0) {
          setSelectedBandId(leaderBands[0].id!);
        }
      } catch {
        // ignore
      }
    })();
  }, []);

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

  const toggleLevel = (level: LevelEnum) => {
    const current = selectedLevels;
    if (current.includes(level)) {
      setValue(
        "level",
        current.filter((l) => l !== level) as [LevelEnum, ...LevelEnum[]],
        { shouldValidate: true }
      );
    } else {
      setValue("level", [...current, level] as unknown as [LevelEnum, ...LevelEnum[]], {
        shouldValidate: true,
      });
    }
  };

  const addPosition = () => {
    const updated = [...posEntries, { pos: PositionEnum.Guitar, headcnt: 1 }];
    setPosEntries(updated);
    setValue("positions", updated as [{ pos: string; headcnt: number }, ...{ pos: string; headcnt: number }[]], {
      shouldValidate: true,
    });
  };

  const removePosition = (idx: number) => {
    const updated = posEntries.filter((_, i) => i !== idx);
    setPosEntries(updated);
    setValue("positions", updated as [{ pos: string; headcnt: number }, ...{ pos: string; headcnt: number }[]], {
      shouldValidate: true,
    });
  };

  const updatePosition = (
    idx: number,
    field: "pos" | "headcnt",
    value: string | number
  ) => {
    const updated = posEntries.map((p, i) =>
      i === idx ? { ...p, [field]: value } : p
    );
    setPosEntries(updated);
    setValue("positions", updated as [{ pos: string; headcnt: number }, ...{ pos: string; headcnt: number }[]], {
      shouldValidate: true,
    });
  };

  const onSubmit = async (data: ZodType_RecruitPost) => {
    if (isSubmitting || !selectedBandId) return;
    setIsSubmitting(true);

    const result = await createRecruitPost({
      band_id: selectedBandId,
      user_id: userProfile.id!,
      title: data.title,
      body: data.body,
      positions: data.positions as { pos: string; headcnt: number }[],
      genre: data.genre as GenreEnum[],
      level: data.level as LevelEnum[],
      location: data.location,
      video_url: data.video_url || undefined,
      openchat: data.openchat || undefined,
      deadline: data.deadline || undefined,
    });

    if (result.success) {
      router.push("/recruit");
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
          style={{ fontFamily: "SUIT-TITLE", fontSize: "1.125rem", color: "#FFF" }}
        >
          구인글 작성
        </p>
        <div style={{ width: "40px" }} />
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-5 px-5 pb-20 overflow-without-scroll"
      >
        {/* 밴드 선택 */}
        <div className="flex flex-col gap-2">
          <label style={labelStyle}>밴드 선택 *</label>
          <select
            value={selectedBandId ?? ""}
            onChange={(e) => setSelectedBandId(Number(e.target.value))}
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
            {myLeaderBands.map((band) => (
              <option key={band.id} value={band.id}>
                {band.name}
              </option>
            ))}
          </select>
          {myLeaderBands.length === 0 && (
            <p style={{ color: "#FF3E2F", fontSize: "0.75rem", fontFamily: "SUIT-BODY" }}>
              밴드장인 밴드가 없습니다. 먼저 밴드를 생성해주세요.
            </p>
          )}
        </div>

        {/* 제목 */}
        <div className="flex flex-col gap-2">
          <label style={labelStyle}>제목 *</label>
          <input
            {...register("title")}
            placeholder="구인글 제목 (최대 30자)"
            maxLength={30}
            style={inputStyle}
          />
          {errors.title && (
            <p style={{ color: "#FF3E2F", fontSize: "0.75rem", fontFamily: "SUIT-BODY" }}>
              {errors.title.message}
            </p>
          )}
        </div>

        {/* 본문 */}
        <div className="flex flex-col gap-2">
          <label style={labelStyle}>내용</label>
          <textarea
            {...register("body")}
            placeholder="구인 내용을 작성해주세요 (최대 1000자)"
            maxLength={1000}
            rows={6}
            style={{ ...inputStyle, resize: "none" as const }}
          />
        </div>

        {/* 모집 포지션 */}
        <div className="flex flex-col gap-2">
          <label style={labelStyle}>모집 포지션 *</label>
          {posEntries.map((entry, idx) => (
            <div key={idx} className="flex gap-2 items-center">
              <select
                value={entry.pos}
                onChange={(e) => updatePosition(idx, "pos", e.target.value)}
                style={{
                  background: "#323234",
                  border: "1px solid #444447",
                  borderRadius: "4px",
                  padding: "6px 8px",
                  color: "#ededed",
                  fontFamily: "SUIT-BODY",
                  fontSize: "16px",
                  flex: 1,
                }}
              >
                {Object.values(PositionEnum).map((pos) => (
                  <option key={pos} value={pos}>{pos}</option>
                ))}
              </select>
              <input
                type="number"
                min={1}
                max={10}
                value={entry.headcnt}
                onChange={(e) =>
                  updatePosition(idx, "headcnt", Number(e.target.value))
                }
                style={{
                  ...inputStyle,
                  width: "60px",
                  textAlign: "center" as const,
                }}
              />
              <span style={{ color: "#9F9FA2", fontSize: "0.75rem" }}>명</span>
              {posEntries.length > 1 && (
                <button
                  type="button"
                  onClick={() => removePosition(idx)}
                  style={{
                    color: "#FF3E2F",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    fontSize: "1rem",
                  }}
                >
                  X
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={addPosition}
            style={{
              fontFamily: "SUIT-BODY",
              fontSize: "0.75rem",
              color: "#A3FF0C",
              background: "none",
              border: "1px dashed #A3FF0C",
              borderRadius: "4px",
              padding: "6px",
              cursor: "pointer",
            }}
          >
            + 포지션 추가
          </button>
        </div>

        {/* 장르 */}
        <div className="flex flex-col gap-2">
          <label style={labelStyle}>장르 *</label>
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

        {/* 실력대 */}
        <div className="flex flex-col gap-2">
          <label style={labelStyle}>실력대 *</label>
          <div className="flex flex-wrap gap-2">
            {Object.values(LevelEnum).map((level) => (
              <button
                key={level}
                type="button"
                onClick={() => toggleLevel(level)}
                style={{
                  padding: "6px 14px",
                  borderRadius: "4px",
                  fontFamily: "SUIT-BODY",
                  fontSize: "0.875rem",
                  cursor: "pointer",
                  border: selectedLevels.includes(level) ? "1px solid #A3FF0C" : "1px solid #444447",
                  background: selectedLevels.includes(level) ? "rgba(163, 255, 12, 0.16)" : "#323234",
                  color: selectedLevels.includes(level) ? "#A3FF0C" : "#9F9FA2",
                }}
              >
                {level}
              </button>
            ))}
          </div>
        </div>

        {/* 지역 */}
        <div className="flex flex-col gap-2">
          <label style={labelStyle}>지역 *</label>
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

        {/* 영상 URL */}
        <div className="flex flex-col gap-2">
          <label style={labelStyle}>영상 URL (선택)</label>
          <input
            {...register("video_url")}
            placeholder="유튜브 영상 URL"
            style={inputStyle}
          />
        </div>

        {/* 오픈채팅 */}
        <div className="flex flex-col gap-2">
          <label style={labelStyle}>오픈채팅 링크 (선택)</label>
          <input
            {...register("openchat")}
            placeholder="카카오톡 오픈채팅 링크"
            style={inputStyle}
          />
        </div>

        {/* 마감일 */}
        <div className="flex flex-col gap-2">
          <label style={labelStyle}>마감일 (선택)</label>
          <input
            {...register("deadline")}
            type="datetime-local"
            style={inputStyle}
          />
        </div>

        <ButtonTemplate
          text={isSubmitting ? "작성 중..." : "구인글 올리기"}
          isActive={isValid && !isSubmitting && !!selectedBandId}
          type="submit"
        />
      </form>
    </div>
  );
}
