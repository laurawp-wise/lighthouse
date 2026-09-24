import { defineCloudflareConfig } from "@opennextjs/cloudflare";

// The game has no server data or ISR, so it needs no external cache resources.
export default defineCloudflareConfig();
