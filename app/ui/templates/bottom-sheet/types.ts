export type BottomSheetHeight =
  | null
  | "high"
  | "middle"
  | "row-2"
  | "row-1"
  | number
  | "hidden";

export interface BottomSheetInput {
  children?: React.ReactNode;
  location?: BottomSheetHeight;
  header?: boolean;
}
