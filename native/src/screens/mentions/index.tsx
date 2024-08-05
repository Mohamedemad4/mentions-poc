import * as React from "react";
import { useRef, useState } from "react";
import {
  KeyboardAvoidingView,
  SafeAreaView,
  TextInput,
  Text,
  View,
} from "react-native";
import { useDebounce } from "@uidotdev/usehooks";
import { useQuery } from "@tanstack/react-query";

import { useMentions } from "#features/Mentions/hooks/use-mentions";
import { Suggestion } from "#features/Mentions/types";
import { Suggestions } from "#features/Mentions/components/suggestions";

const PAT =
  "";

export function MentionsScreen() {
  const textInput = useRef<TextInput>(null);
  const [textValue, setTextValue] = useState("");

  const { textInputProps, triggers, mentionState } = useMentions({
    value: textValue,
    onChange: setTextValue,
    triggersConfig: {
      mention: {
        trigger: "@",
      },
    },
  });

  const query = triggers.mention.keyword;
  const debouncedQuery = useDebounce(query, 200);

  const contextSuggestions = [
    { name: "MohammadHelal", id: "MohammadHelal" },
    { name: "Feras", id: "Feras" },
  ];

  const autocompleteSuggestionsQuery = useQuery<Suggestion[]>({
    queryKey: ["user-mentions", debouncedQuery],
    queryFn: async () => {
      if (!query) return contextSuggestions;
      const res = await (
        await fetch(
          `https://api.github.com/search/users?q=${debouncedQuery}&per_page=5`,
          {
            headers: {
              Authorization: `token ${PAT}`,
              Accept: "application/vnd.github.v3+json",
            },
          }
        )
      ).json();

      return res.items.map((user: { login: string }) => ({
        name: user.login,
        id: user.login,
      }));
    },
    // keep serving the last fetched value as you fetch new data
    placeholderData: (prev) => prev,
  });

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "#fff",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <KeyboardAvoidingView style={{ gap: 30, padding: 10 }}>
        <Text>Mohammad Helal and Feras are instant contextual clues</Text>
        <Text>This uses github username search as a backend</Text>
        <SafeAreaView>
          <Text>
            Mentions are {mentionState.parts.filter((m) => m.data?.name).length}
          </Text>
          {mentionState.parts
            .filter((m) => m.data?.name)
            .map((m) => (
              <Text key={m.data?.id}>{m.data?.name}</Text>
            ))}

          <Suggestions
            suggestions={autocompleteSuggestionsQuery.data ?? []}
            isFetching={autocompleteSuggestionsQuery.isFetching}
            {...triggers.mention}
          />
          <TextInput
            ref={textInput}
            placeholder="Type here..."
            style={{ padding: 12 }}
            {...textInputProps}
          />
        </SafeAreaView>
      </KeyboardAvoidingView>
    </View>
  );
}
