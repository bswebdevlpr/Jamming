import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

import xml2js from "xml2js";
import { JaroWinklerDistance } from "natural";

interface FetchResult {
  status: number;
  msg: string;
  data: any;
}

export async function POST(req: NextRequest) {
  const { songName } = await req.json();
  if (!songName)
    return {
      status: 500,
      msg: "Failed to get the name of song.",
      data: null,
    };

  const parser = new xml2js.Parser();
  const compare = JaroWinklerDistance;

  const data: FetchResult = await axios
    .get(
      `https://www.maniadb.com/api/search/${songName}/?sr=song&display=10&key=***REMOVED***&v=0.5`
    )
    .then(async (res) => {
      const parsedByPromise = await parser
        .parseStringPromise(res.data)
        .then((result) => {
          if (!result)
            return {
              status: 500,
              msg: "Failed to parse the result",
              data: null,
            };

          const { item } = result?.rss?.channel[0];

          const data = item
            .map((row) => {
              const title = row.title[0].replace(/&nbsp;/g, " ");
              const artist = row["maniadb:artist"][0].name[0].replace(
                /&nbsp;/g,
                " "
              );
              const albumTitle = row["maniadb:album"][0].title[0].replace(
                /&nbsp;/g,
                " "
              );
              const albumCoverUrl = row["maniadb:album"][0].image[0];

              return {
                title,
                artist,
                albumTitle,
                albumCoverUrl,
                titleSimiliarity: !title ? 0 : compare(songName, title),
                albumTitleSimiliarity: !albumTitle
                  ? 0
                  : compare(songName, albumTitle),
              };
            })
            .filter((row) => row.title.length >= songName.length)
            .filter((row) => !/inst\./i.test(row.title))
            .sort((b, a) =>
              a.titleSimiliarity !== b.titleSimiliarity
                ? a.titleSimiliarity - b.titleSimiliarity
                : a.albumTitleSimiliarity - b.albumTitleSimiliarity
            );

          return {
            status: 200,
            msg: "Success",
            data,
          };
        })
        .catch(() => ({
          status: 500,
          msg: "Failed to request",
          data: null,
        }));
      return parsedByPromise;
    });

  return NextResponse.json(data);
}
