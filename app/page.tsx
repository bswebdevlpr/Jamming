import Image from "next/image";

export default function SignIn() {
  return (
    <div className="grid grid-rows-[86px_1fr_222px] justify-items-center min-h-screen font-[family-name:var(--font-geist-sans)]">
      <div></div> {/* 빈칸 */}
      <div className="flex flex-col items-center">
        <div className="relative">
          <Image
            className="shrink-0 absolute"
            style={{
              transform: "translate(144.4px, 42.05px)",
            }}
            src="/love.svg"
            alt="love-right"
            width={36.46}
            height={43.02}
          />
          <Image
            className="shrink-0 absolute"
            style={{
              transform: "translate(-30px, 120px) rotate(-60deg)",
            }}
            src="/love.svg"
            alt="love-left"
            width={24.09}
            height={28.71}
          />
          <Image
            className="mb-14"
            src="/logo.svg"
            alt="Logo"
            width={149}
            height={138}
          />
        </div>
        <p
          style={{
            fontFamily: "SBAggroM",
            color: "#A3FF0C",
            fontSize: "50px",
          }}
          className=""
        >
          JAMMING
        </p>
        <p
          style={{
            fontFamily: "SBAggroM",
            fontSize: "24px",
          }}
          className=""
        >
          놀기 위해 모였다!
        </p>
        <p
          style={{
            fontFamily: "SUIT-Body",
            fontSize: "14px",
            color: "#C0C0C5",
          }}
        >
          음악인을 위한 합주 플랫폼
        </p>
      </div>
      <div className="flex gap-4 items-center flex-col">
        <a
          className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5"
          href="https://vercel.com/new?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            className="dark:invert"
            src="/vercel.svg"
            alt="Vercel logomark"
            width={20}
            height={20}
          />
          카카오로 로그인
        </a>
        <a
          className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5"
          href="https://vercel.com/new?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            className="dark:invert"
            src="/vercel.svg"
            alt="Vercel logomark"
            width={20}
            height={20}
          />
          네이버로 로그인
        </a>
        <a
          className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5"
          href="https://vercel.com/new?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            className="dark:invert"
            src="/vercel.svg"
            alt="Vercel logomark"
            width={20}
            height={20}
          />
          구글로 로그인
        </a>
      </div>
    </div>
  );
}
