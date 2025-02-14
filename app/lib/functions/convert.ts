export const convertFormData = (input: { [key: string]: any }) => {
  Object.entries(input).forEach(([key, val]) => {
    if (key === "pos" || key === "position" || key === "level")
      input[key] =
        typeof val === "string"
          ? val.charAt(0).toLowerCase()
          : (val as Array<string>).map((v) => v.charAt(0).toLowerCase());
    else if (key === "genre") {
      if (typeof val === "string") {
        const firstLetter = val.charAt(0).toLowerCase();
        input[key] =
          firstLetter === "p"
            ? (val as string).slice(0, 2).toLowerCase()
            : firstLetter;
      } else {
        input[key] = (val as Array<string>).map((v) => {
          const firstLetter = v.charAt(0).toLowerCase();
          return firstLetter === "p"
            ? (v as string).slice(0, 2).toLowerCase()
            : firstLetter;
        });
      }
    } else if (key === "location") {
      if (typeof val === "string") {
        input[key] = val
          .split("")
          .filter((c) => 65 <= c.charCodeAt(0) && c.charCodeAt(0) <= 90)
          .map((val) => val.toLowerCase())
          .join("");
      } else {
        input[key] = (val as Array<string>).map((v) =>
          v
            .split("")
            .filter((c) => 65 <= c.charCodeAt(0) && c.charCodeAt(0) <= 90)
            .map((val) => val.toLowerCase())
            .join("")
        );
      }
    } else input[key] = val;
  });

  return input;
};
