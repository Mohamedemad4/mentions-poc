import * as React from "react";
import { useRef, useState } from "react";
import {
  KeyboardAvoidingView,
  SafeAreaView,
  TextInput,
  Text,
  View,
} from "react-native";
import { useMentions } from "./src/features/Mentions/hooks/use-mentions";
import { generateValueFromMentionStateAndChangedText } from "./src/features/Mentions/utils";
import { Suggestions } from "./src/features/Mentions/components/suggestions";
import { users } from "./data";

// Config of suggestible triggers
const triggersConfig = {
  mention: {
    trigger: "@",
  },
};

export default function App() {
  const textInput = useRef<TextInput>(null);
  const [textValue, setTextValue] = useState("");

  const { textInputProps, triggers, mentionState } = useMentions({
    value: textValue,
    onChange: setTextValue,
    triggersConfig,
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
      <KeyboardAvoidingView>
        <SafeAreaView>
          <Text>
            Mentions are {mentionState.parts.filter((m) => m.data?.name).length}
          </Text>
          {mentionState.parts
            .filter((m) => m.data?.name)
            .map((m) => (
              <Text>
                {" "}
                {m.data?.name} -- {m.data?.id}{" "}
              </Text>
            ))}
          <TextInput
            ref={textInput}
            placeholder="Type here..."
            style={{ padding: 12 }}
            {...textInputProps}
          />
          <Suggestions suggestions={users} {...triggers.mention} />
        </SafeAreaView>
      </KeyboardAvoidingView>
    </View>
  );
}
