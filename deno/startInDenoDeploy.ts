import { savePlayers, startServer } from "./main.ts";
import { saveOnlinePlayers } from "./saveOnlinePlayers.ts";

const getRequiredEnv = (name: string): string => {
  const value = Deno.env.get(name);
  if (!value) {
    throw new Error(`env ${name} is empty or undefined`);
  }
  return value;
};

const cloudflareR2AccountId = getRequiredEnv("CLOUDFLARE_R2_ACCOUNT_ID");
const cloudflareR2Bucket = getRequiredEnv("CLOUDFLARE_R2_BUCKET");
const cloudflareR2SecretKey = getRequiredEnv("CLOUDFLARE_R2_SECRET_KEY");
const cloudflareR2KeyId = getRequiredEnv("CLOUDFLARE_R2_KEY_ID");
const supabaseUrl = getRequiredEnv("SUPABASE_URL");
const supabaseSecret = getRequiredEnv("SUPABASE_SECRET");
const mongodbUri = getRequiredEnv("MONGODB_URI");

// Deno.cron("playerIn", "* * * * *", () => {
//   savePlayers({
//     supabase: {
//       url: supabaseUrl,
//       secretKey: supabaseSecret,
//     },
//   });
// });

Deno.cron("playerOnline", "20 13 * * *", () => {
  saveOnlinePlayers(mongodbUri);
});

startServer({
  cloudflareR2: {
    accountId: cloudflareR2AccountId,
    bucket: cloudflareR2Bucket,
    keyId: cloudflareR2KeyId,
    secretKey: cloudflareR2SecretKey,
  },
});
