"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SuiClientProvider, WalletProvider, createNetworkConfig } from "@mysten/dapp-kit";
import { useState } from "react";
import "@mysten/dapp-kit/dist/index.css";

const { networkConfig } = createNetworkConfig({
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  testnet: { url: "https://fullnode.testnet.sui.io:443", network: "testnet" as any },
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  mainnet: { url: "https://fullnode.mainnet.sui.io:443", network: "mainnet" as any },
});

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <SuiClientProvider networks={networkConfig} defaultNetwork="testnet">
        <WalletProvider autoConnect>
          {children}
        </WalletProvider>
      </SuiClientProvider>
    </QueryClientProvider>
  );
}
