import { startServer } from "./main.ts";

import { Command } from "@cliffy/command";

new Command().env("CLOUDFLARE_R2_ACCOUNT_ID=<cloudflareR2AccountId>", "", {
  required: true,
}).env("CLOUDFLARE_R2_BUCKET=<bucket>", "", { required: true }).env(
  "CLOUDFLARE_R2_KEY_ID=<keyId>",
  "",
  { required: true },
).env("CLOUDFLARE_R2_SECRET_KEY=<secretKey>", "", { required: true }).action(
  (
    {
      cloudflareR2AccountId,
      cloudflareR2Bucket,
      cloudflareR2KeyId,
      cloudflareR2SecretKey,
    },
  ) => {
    startServer({
      cloudflareR2: {
        accountId: cloudflareR2AccountId,
        bucket: cloudflareR2Bucket,
        keyId: cloudflareR2KeyId,
        secretKey: cloudflareR2SecretKey,
      },
    });
  },
).parse();
