"use client";

import { useEffect, useState } from "react";

import axios from "axios";
import { CustomError } from "@/app/lib/errors/client.error";

export default function TestPage() {
  const [searchResult, setSearchResult] = useState([]);

  useEffect(() => {
    (async () => {
      const response = await axios
        .post("/api/maniadb", {
          songName: "tik tak tok",
        })
        .then((res) => res.data.data)
        .catch((e) => {
          //TODO: 에러모달
          throw CustomError.SearchSong;
        });
      console.log(response);
      setSearchResult(response);
    })();
  }, []);

  return <div></div>;
}
