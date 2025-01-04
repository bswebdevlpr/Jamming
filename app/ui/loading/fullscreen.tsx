import PopupTemplate from "@/app/ui/templates/popup";
import Image from "next/image";

export default function FullScreenLoading({
  isTurnedOn,
}: {
  isTurnedOn: boolean;
}) {
  return (
    <PopupTemplate
      isTurnedOn={isTurnedOn}
      className="flex justify-center items-center"
    >
      <style jsx>{`
        @keyframes infinite_rotate {
          100% {
            transform: rotate(360deg);
          }
        }
      `}</style>
      <Image
        src="/logo.svg"
        alt="Logo"
        width={149}
        height={138}
        style={{
          animation: "infinite_rotate 3s linear infinite",
          transformOrigin: "50% 50%",
        }}
      />
    </PopupTemplate>
  );
}
