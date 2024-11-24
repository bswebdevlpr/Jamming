import { Camera } from "@/app/ui/images/camera";
import { BandType } from "@/app/ui/images/signup/band-type";
import { Genre } from "@/app/ui/images/signup/genre";
import { Position } from "@/app/ui/images/signup/position";

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
      <div className="flex flex-col">
        <div className="flex flex-row justify-between min-w-full">
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
          <div className="flex flex-col items-end relative">
            <div
              className="absolute z-10"
              style={{
                width: "16px",
                height: "76px",
                backgroundColor: "#242426",
                clipPath: "polygon(16px 0px, 16px 76px, 0px 76px)",
                transform: "translate(-160px)",
              }}
            />
            <div
              style={{
                width: "160px",
                height: "76px",
                backgroundColor: "#242426",
                clipPath: "polygon(0px 0px, 0px 76px, 160px 76px, 160px 0px)",
              }}
            >
              <div
                className="flex flex-col justify-between"
                style={{
                  width: "100%",
                  height: "100%",
                  padding: "14px 16px 10px 16px",
                }}
              >
                <p
                  style={{
                    fontFamily: "SUIT-Body",
                    fontSize: "12px",
                  }}
                >
                  <span style={{ color: "#A3FF0C" }}>*</span>닉네임
                </p>
                <div className="flex flex-row justify-between">
                  <p
                    style={{
                      fontFamily: "SUIT-Body",
                      fontSize: "12px",
                      color: "#9F9FA2",
                    }}
                  >
                    입력
                  </p>
                  <p
                    style={{
                      fontFamily: "SUIT-Body",
                      fontSize: "12px",
                      color: "#767678",
                    }}
                  >
                    0/8
                  </p>
                </div>
              </div>
            </div>
            <div
              className="flex flex-col justify-between"
              style={{
                width: "171px",
                height: "100px",
                padding: "14px 8px",
              }}
            >
              <p
                style={{
                  fontFamily: "SUIT-Body",
                  fontSize: "14px",
                  color: "#E5E5E9",
                }}
              >
                나를 나타내는 태그
                <span
                  style={{
                    fontSize: "12px",
                    color: "#9F9FA2",
                  }}
                >
                  (최대 4개)
                </span>
              </p>
              <p
                style={{
                  fontFamily: "SUIT-Body",
                  fontSize: "12px",
                  color: "#9F9FA2",
                }}
              >
                # 입력
              </p>
            </div>
          </div>
        </div>
        <div className="flex flex-col">
          <div className="relative">
            <div
              className="absolute z-10 w-full flex flex-col justify-between"
              style={{
                padding: "14px 16px 16px",
              }}
            >
              <p
                style={{
                  fontFamily: "SUIT-Body",
                  fontSize: "14px",
                  color: "#E5E5E9",
                }}
              >
                하위
              </p>
              <p
                style={{
                  fontFamily: "SUIT-Body",
                  fontSize: "14px",
                  color: "#E5E5E9",
                }}
              >
                선택
              </p>
            </div>
            <Position />
          </div>
          <div className="relative">
            <Genre
              style={{
                transform: "translate(0px, -19px)",
              }}
            />
          </div>
          <div className="relative">
            <BandType
              style={{
                transform: "translate(0px, -41px)",
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
