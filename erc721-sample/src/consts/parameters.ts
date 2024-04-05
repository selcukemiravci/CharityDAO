/** Change these values to configure the application for your own use. **/

// Your smart contract address (available on the thirdweb dashboard)
// For existing collections: import your existing contracts on the dashboard: https://thirdweb.com/dashboard
export const contractConst = "0x334841D9738edF7763e10b1A49ea5ce911128f10";

// The name of the chain your contract is deployed to.
// Refer to README.md on how to specify the chain name.
export const chainConst = "mumbai";

// It is IMPORTANT to provide your own API key to use the thirdweb SDK and infrastructure.
// Please ensure that you define the correct domain for your API key from the API settings page.
// You can get one for free at https://thirdweb.com/create-api-key
// Learn more here: https://blog.thirdweb.com/changelog/api-keys-to-access-thirdweb-infra
export const clientIdConst = import.meta.env.VITE_TEMPLATE_CLIENT_ID || "ly9MxW8CrHv41lRrl0FGxpDsA6oGKQYFFfQyjkbvgSq7TCDmJWiPTlgIoH1W4Ntfq1GUlweh3PJSVNWJZtYWKA";

// Configure the primary color for buttons and other UI elements
export const primaryColorConst = "blue";

// Choose between "light" and "dark" mode
export const themeConst = "dark";

// Gasless relayer configuration options
export const relayerUrlConst = "Hubu6j4zYbrba2Mhd4pMDppfTTVxnLWn"; // OpenZeppelin relayer URL
export const biconomyApiKeyConst = "kGm-uan3z.18ea8a6c-76cf-4915-8822-9912d02e3e73"; // Biconomy API key