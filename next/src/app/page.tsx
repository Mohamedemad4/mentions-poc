"use client";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useDebounce } from "@uidotdev/usehooks";
import { Mention, MentionsInput } from "react-mentions";

const PAT =
  "";

type mentionsData = { display: string; id: string }[];
export default function Home() {
  const [text, setText] = useState("");
  const [query, setQuery] = useState("");
  const [mentions, setMentions] = useState<mentionsData>([]);

  const debouncedQuery = useDebounce(query, 200);

  const autocompleteSuggestionsQuery = useQuery<mentionsData>({
    queryKey: ["user-mentions", debouncedQuery],
    queryFn: async () => {
      if (!query) return [];
      const res = await (
        await fetch(`https://api.github.com/search/users?q=${debouncedQuery}`, {
          headers: {
            Authorization: `token ${PAT}`,
            Accept: "application/vnd.github.v3+json",
          },
        })
      ).json();

      return res.items.map((user: { login: string }) => ({
        display: user.login,
        id: user.login,
      }));
    },
    // keep serving the last fetched value as you fetch new data
    placeholderData: (prev) => prev,
  });

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="z-10 w-full">
        {autocompleteSuggestionsQuery.isError ? <h1>Error</h1> : <h1></h1>}
        <MentionsInput
          className="border-black border-2 rounded-lg"
          value={text}
          onChange={(event, newValue, plainText, mentions) => {
            setMentions(mentions);
            setText(newValue);
          }}
          placeholder="Mention any Github user by typing `@` followed by at least one char"
          a11ySuggestionsListLabel={"Suggested Github users for mention"}
          allowSuggestionsAboveCursor={true}
          customSuggestionsContainer={(children) => (
            <div>
              {children}
              {autocompleteSuggestionsQuery.isFetching ? (
                <h4>loading...</h4>
              ) : (
                <></>
              )}
            </div>
          )}
        >
          <Mention
            displayTransform={(login) => `@${login}`}
            trigger="@"
            data={(query) => {
              setQuery(query);
              return autocompleteSuggestionsQuery.data ?? [];
            }}
            appendSpaceOnAdd={true}
            isLoading={autocompleteSuggestionsQuery.isFetching}
          />
        </MentionsInput>
      </div>
      <h1>You have mentioned {mentions.length} people </h1>
      {mentions.map(({ display }) => (
        <h1>{display}</h1>
      ))}
    </main>
  );
}

