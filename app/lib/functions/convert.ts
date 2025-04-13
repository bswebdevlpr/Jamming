export const convertBPMToTempo = (input: number) => {
  let ret = "";

  if (input >= 180) ret = "Presto";
  else if (input >= 168) ret = "Vivace";
  else if (input >= 132) ret = "Allegro";
  else if (input >= 120) ret = "Allegretto";
  else if (input >= 108) ret = "Moderato";
  else if (input >= 76) ret = "Andante";
  else if (input >= 60) ret = "Adagio";
  else if (input >= 40) ret = "Largo";
  else if (input >= 20) ret = "Grave";

  return ret;
};
