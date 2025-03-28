"use client";

import { useEffect, useState } from "react";

import axios from "axios";
import { CustomError } from "@/app/lib/errors/client.error";

export default function TestPage() {
  const [searchResult, setSearchResult] = useState([]);

  useEffect(() => {
    (async () => {
      const response = await axios
        .post("/api/tmap", {
          location: "언더그라운드 미금",
        })
        .then((res) => res.data.data)
        .catch((e) => {
          console.log(e);
        });
      console.log(response);
      setSearchResult(response);
    })();
  }, []);

  return <div></div>;
}
