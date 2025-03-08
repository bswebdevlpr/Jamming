import X from "@/app/ui/images/common/x";
import PopupTemplate from "@/app/ui/templates/popup";

interface FlexColProp {
  bpm: {
    text: string;
    color: string;
  };
  tempoEng: string;
  tempoKor: string;
}

const FlexCol = ({ props }: { props: FlexColProp }) => {
  const { bpm, tempoEng, tempoKor } = props;

  return (
    <div
      className="w-full flex justify-between"
      style={{
        fontFamily: "SUIT-BODY",
        fontSize: "0.75rem",
        color: "#FFF",
        padding: "11px 0px",

        borderTop: "1px solid var(--border)",
      }}
    >
      <p
        style={{
          width: "25.64%",
          color: bpm.color,
        }}
      >
        {bpm.text} BPM
      </p>
      <p
        className="text-center"
        style={{
          width: "19.23%",
        }}
      >
        {tempoEng}
      </p>
      <p
        className=""
        style={{
          width: "35.89%",
        }}
      >
        {tempoKor}
      </p>
    </div>
  );
};

export default function BPMPopup({
  isTurnedOn,
  turnOff,
}: {
  isTurnedOn: boolean;
  turnOff: () => void;
}) {
  const props: FlexColProp[] = [
    {
      bpm: {
        color: "#FF3773",
        text: "200-180",
      },
      tempoEng: "Presto",
      tempoKor: "매우 빠르고 활기차게",
    },
    {
      bpm: {
        color: "#E37355",
        text: "180-168",
      },
      tempoEng: "Vivace",
      tempoKor: "아주 빠르게",
    },
    {
      bpm: {
        color: "#D59145",
        text: "168-132",
      },
      tempoEng: "Allegro",
      tempoKor: "빠르게",
    },
    {
      bpm: {
        color: "#BDC52A",
        text: "132-120",
      },
      tempoEng: "Allegretto",
      tempoKor: "조금 빠르게",
    },
    {
      bpm: {
        color: "#A3FF0C",
        text: "120-108",
      },
      tempoEng: "Moderato",
      tempoKor: "보통 빠르게",
    },
    {
      bpm: {
        color: "#B5FF3D",
        text: "108-76",
      },
      tempoEng: "Andante",
      tempoKor: "조금 느리게",
    },
    {
      bpm: {
        color: "#D5FF8F",
        text: "76-60",
      },
      tempoEng: "Adagio",
      tempoKor: "느리게",
    },
    {
      bpm: {
        color: "#E2FFB4",
        text: "60-40",
      },
      tempoEng: "Largo",
      tempoKor: "아주 느리게",
    },
    {
      bpm: {
        color: "#FFFFFF",
        text: "40-20",
      },
      tempoEng: "Grave",
      tempoKor: "매우 느리고 무겁게",
    },
  ];

  return (
    <PopupTemplate
      isTurnedOn={isTurnedOn}
      className="flex items-center justify-center"
      style={{
        backgroundColor: "rgb(0, 0, 0, 0.5)",
      }}
    >
      <div
        className="relative w-full flex flex-col items-center px-6 pt-7 pb-2 mx-4 gap-5"
        style={{
          //   height: "73.5%",
          backgroundColor: "#242426",
          border: "1px solid #323234",
          borderRadius: "12px",
        }}
      >
        <X onClick={turnOff} className="absolute top-4 right-4" />
        <p
          style={{
            fontFamily: "SBAggroM",
            fontSize: "1.25rem",
            color: "#FFF",
          }}
        >
          What is BPM?
        </p>
        <p
          style={{
            width: "270px",
            fontFamily: "SUIT-BODY",
            fontSize: "0.75rem",
            color: "#FFF",
            textAlign: "center",
          }}
        >
          BPM은 잼 참여 횟수, 노쇼 횟수 등을 종합해서 매겨지는 사용자 매너
          지표를 음악의 박자로 네이밍한 것입니다.
        </p>
        <div className="w-full">
          <p
            style={{
              fontFamily: "SUIT-BODY",
              fontSize: "0.625rem",
              color: "#FFF",
              opacity: 0.8,
            }}
          >
            잼 참가&nbsp;&nbsp;
            <span
              style={{
                color: "#A3FF0C",
              }}
            >
              +1
            </span>{" "}
            &nbsp;&nbsp; 잼 노쇼&nbsp;&nbsp;
            <span
              style={{
                color: "#FF3773",
              }}
            >
              -2
            </span>
          </p>
        </div>
        <div className="w-full flex flex-col">
          {props.map((val, idx) => (
            <FlexCol key={idx} props={val} />
          ))}
        </div>
      </div>
    </PopupTemplate>
  );
}
