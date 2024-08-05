// Custom component for rendering suggestions
import { FC } from "react";
import { Suggestion, SuggestionsProvidedProps } from "../types";
import { ActivityIndicator, Pressable, Text, View } from "react-native";
import * as React from "react";

const Suggestions: FC<
  SuggestionsProvidedProps & { suggestions: Suggestion[]; isFetching: boolean }
> = ({ keyword, onSelect, suggestions, isFetching }) => {
  if (keyword == null) {
    return null;
  }

  return (
    <View
      style={{ gap: 2, borderColor: "black", borderWidth: 1, borderRadius: 5 }}
    >
      {suggestions.map((one) => (
        <Pressable
          key={one.id}
          onPress={() => onSelect(one)}
          style={{
            padding: 12,
            borderColor: "black",
            borderBottomWidth: 1,
          }}
        >
          <Text>{one.name}</Text>
        </Pressable>
      ))}
      {isFetching ? <ActivityIndicator /> : <></>}
    </View>
  );
};

export { Suggestions };
