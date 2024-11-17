import { Camera } from "@/app/ui/images/camera";

export default function SignUp_Profile() {
  return (
    <div className="flex flex-col">
      <p
        style={{
          fontFamily: "SBAggroM",
          fontSize: "24px",
          color: "#C0C0C5",
          marginBottom: "18px",
        }}
      >
        프로필을 설정해주세요
      </p>
      <div>
        <div className="flex flex-row min-w-full">
          <div
            style={{
              width: "175.765px",
              height: "184.92px",
              backgroundColor: "#242426",
              clipPath: "polygon(0% 0%, 0% 100%, 85% 85%, 100% 0%)",
            }}
          >
            <span
              className="inline-block"
              style={{
                marginTop: "66px",
                marginLeft: "54px",
              }}
            >
              <div className="flex flex-col items-center">
                <Camera style={{ marginBottom: "6px" }} />
                <p
                  style={{
                    fontFamily: "SUIT-Body",
                    fontSize: "12px",
                  }}
                >
                  프로필 사진
                </p>
              </div>
            </span>
          </div>
          <div>
            {/* 닉네임 */}
            {/* 나를 나타내는 태그 */}
          </div>
        </div>
        {/* 포지션 */}
        {/* 선호장르 */}
        {/* 밴드 유형 */}
      </div>
    </div>
  );
}
