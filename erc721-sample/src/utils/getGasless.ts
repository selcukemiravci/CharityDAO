export function getGasless(
  relayerUrl?: string,
  biconomyApiKey?: string,
  biconomyApiId?: string,
) {
  return {
    gasless: relayerUrl
      ? {
          openzeppelin: { relayerUrl },
        }
      : biconomyApiKey
      ? {
          biconomy: {
            apiKey: biconomyApiKey
          },
        }
      : undefined,
  };
}
