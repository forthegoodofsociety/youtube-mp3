"use client";

import { useRef, useState } from "react";
import type { APIReponse } from "../types/APIResponse";

export default function Home() {
  const linksStringRef = useRef<HTMLInputElement>(null);
  const [youtubeDownloadLinks, setYoutubeDownloadLinks] = useState<
    APIReponse[] | undefined
  >(undefined);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (
      linksStringRef.current?.value === "" ||
      linksStringRef.current?.value === undefined
    ) {
      return;
    }

    const linksStringWithoutSpaces = linksStringRef.current.value.replace(
      /\s/g,
      ""
    );

    const linksArray = linksStringWithoutSpaces.split(",");

    const parsedArray = linksArray.map((link: string) => {
      return link.split("=")[1];
    });

    const response = await fetch("/api/youtube", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ links: parsedArray }),
    });

    const { downloadLinks } = await response.json();

    console.log("downloadLinks");
    console.log(typeof downloadLinks);
    console.log(downloadLinks);
    setYoutubeDownloadLinks(downloadLinks);
  }

  return (
    <main className="flex items-center gap-y-5 flex-col justify-center mx-auto min-h-screen p-24">
      <h1 className="text-bold text-3xl text-blue-700">
        Open Source Youtube to MP3 Converter (No Ads + No Scam)
      </h1>

      <form onSubmit={handleSubmit} className="w-[50svw] grid gap-y-5">
        <div className="w-full">
          <label htmlFor="mp3-links">Youtube Links</label>
          <input
            ref={linksStringRef}
            className="border px-3 w-full"
            type="text"
            name="mp3-links"
            placeholder="https://www.youtube.com/watch?v=_,https://www.youtube.com/watch?v=_..."
          />
        </div>
        <button className="bg-blue-600  text-white " type="submit">
          Convert to MP3
        </button>
      </form>

      {youtubeDownloadLinks && (
        <div>
          <p>Success!</p>
          <p>Youtube Download Links</p>

          {youtubeDownloadLinks && (
            <div>
              {youtubeDownloadLinks.map((link: APIReponse, index) => {
                return (
                  <div key={index} className="my-2">
                    <a
                      className="underline hover:text-blue-600"
                      href={link.link}
                    >
                      {link.title}
                    </a>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </main>
  );
}
