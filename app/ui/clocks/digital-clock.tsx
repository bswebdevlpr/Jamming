"use client";

import * as React from "react";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { MultiSectionDigitalClock } from "@mui/x-date-pickers/MultiSectionDigitalClock";
import moment from "moment";

export default function DigitalClockComponent({
  selectedDate,
  setSelectedDate,
}: {
  selectedDate: moment.Moment;
  setSelectedDate: React.Dispatch<React.SetStateAction<moment.Moment>>;
}) {
  // STATES
  const [localDate, setLocalDate] = React.useState<moment.Moment>(moment());
  //

  React.useEffect(() => {
    if (localDate)
      setSelectedDate(
        selectedDate
          .clone()
          .set("hour", localDate.hour())
          .set("minute", localDate.minute())
      );
  }, [localDate]);

  return (
    <LocalizationProvider dateAdapter={AdapterMoment}>
      <MultiSectionDigitalClock
        value={localDate}
        onChange={(val) => {
          setLocalDate(val);
        }}
        timeSteps={{
          minutes: 1,
        }}
        autoFocus={true}
        slotProps={{
          digitalClockSectionItem: {
            sx: {
              "&.Mui-selected": {
                backgroundColor: "var(--highlight)",
                opacity: 0.98,

                "&:focus": {
                  backgroundColor: "var(--highlight)",
                  opacity: 0.98,
                },
                "&:focus-visible": {
                  backgroundColor: "var(--highlight)",
                  opacity: 0.98,
                },
                "&:hover": {
                  backgroundColor: "var(--highlight)",
                  opacity: 0.98,
                },
              },
            },
          },
        }}
        sx={{
          justifyContent: "center",
        }}
      />
    </LocalizationProvider>
  );
}
