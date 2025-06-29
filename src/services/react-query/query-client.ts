"use client";

import { QueryClient } from "@tanstack/react-query";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: true,
      retry: 3,
      refetchOnMount: true,
      refetchOnReconnect: true,
    },
  },
});

export default queryClient;
