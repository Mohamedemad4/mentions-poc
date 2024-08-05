import * as React from "react";
import { MentionsScreen } from "#screens/mentions";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

export default function App() {
  const queryClient = new QueryClient();
  return (
    <QueryClientProvider client={queryClient}>
      <MentionsScreen />
    </QueryClientProvider>
  );
}
