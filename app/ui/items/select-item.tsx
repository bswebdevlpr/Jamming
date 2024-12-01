const SelectItem = ({ content }: { content: string }) => {
  return (
    <div
      className="p-4"
      style={{
        width: "112px",
        height: "52px",
        borderRadius: "8px",

        background: "#323234",

        fontFamily: "SUIT-Body",
        fontSize: "14px",
        color: "#C0C0C5",

        textAlign: "center",
      }}
    >
      {content}
    </div>
  );
};

const ItemBox = () => {};

export { SelectItem };
