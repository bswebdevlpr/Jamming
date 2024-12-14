import Age from "../images/categories/age";
import Genre from "../images/categories/genre";
import Level from "../images/categories/level";
import Location from "../images/categories/location";
import Position from "../images/categories/position";

export default function CategoryFilter() {
  return (
    <div className="flex flex-row gap-4">
      <Location />
      <Position />
      <Genre />
      <Level />
      <Age />
    </div>
  );
}
