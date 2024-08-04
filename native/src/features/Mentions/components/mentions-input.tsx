import { useMentions } from "../hooks/use-mentions";
import React, { ReactElement, Ref, useEffect } from "react";
import { TextInput } from "react-native";
import { Triggers, UseMentionsConfig } from "../types/index";
import { TextInputProps } from "react-native";

type MentionInputProps<TriggerName extends string> = Omit<
  TextInputProps,
  "onChange"
> &
  UseMentionsConfig<TriggerName> & {
    onTriggersChange?: (triggers: Triggers<TriggerName>) => void;
  };

export { MentionInputProps };
const MentionInputComponent = <TriggerName extends string>(
  { onTriggersChange, ...props }: MentionInputProps<TriggerName>,
  ref: Ref<TextInput>
) => {
  const { triggers, textInputProps } = useMentions(props);

  useEffect(() => {
    onTriggersChange && onTriggersChange(triggers);
  }, [triggers]);

  return <TextInput ref={ref} {...textInputProps} />;
};

const MentionInput = React.forwardRef(MentionInputComponent) as <
  TriggerName extends string
>(
  p: MentionInputProps<TriggerName> & { ref?: Ref<TextInput> }
) => ReactElement | null;

export { MentionInput };
