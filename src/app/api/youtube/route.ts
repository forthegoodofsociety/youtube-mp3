"use server";
import axios from "axios";
import type { APIReponse } from "../../../types/APIResponse";

export async function POST(request: Request) {
  const { links } = await request.json();

  const requests = links.map((url: APIReponse) => {
    const options = {
      method: "GET",
      url: "https://youtube-mp3-downloader2.p.rapidapi.com/ytmp3/ytmp3/custom/",
      params: {
        url: url,
        quality: "320",
      },
      headers: {
        "X-RapidAPI-Key": "a91211aea6msh3579ba254a2acdbp18aa5fjsnc1fda1c456bb",
        "X-RapidAPI-Host": "youtube-mp3-downloader2.p.rapidapi.com",
      },
    };

    return axios.request(options).then((response) => response.data);
  });

  try {
    const data = await Promise.all(requests);
    return new Response(JSON.stringify({ downloadLinks: data }));
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: "Failed to repond" }));
  }
}
