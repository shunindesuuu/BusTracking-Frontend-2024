import https from "https";

// Create an HTTPS agent that ignores self-signed certificates
const agent = new https.Agent({
  rejectUnauthorized: false, // Disable certificate validation
});

export const customFetch = async (url: string, options: RequestInit = {}) => {
  // Merge custom agent into fetch options
  const mergedOptions = {
    ...options,
    agent, // This is supported in Node.js
  } as any; // Cast to `any` to avoid TypeScript error

  return fetch(url, mergedOptions);
};
