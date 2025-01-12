export default function debounce(
  func: (...args: any[]) => void,
  delay: number = 300
) {
  let timer: NodeJS.Timeout | null = null;

  return (...args: any[]) => {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => {
      func(...args);
    }, delay);
  };
}
