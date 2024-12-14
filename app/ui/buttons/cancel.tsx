const CancelButton = ({ onClick }: { onClick: () => void }) => {
  return (
    <button
      style={{
        width: "167.5px",
        height: "44px",

        border: "1px solid #535355",
        borderRadius: "8px",

        padding: "10px 12px",

        fontFamily: "SUIT-BODY",
        fontSize: "16px",
        color: "#C0C0C5",
      }}
      onClick={onClick}
    >
      취소
    </button>
  );
};
export default CancelButton;
