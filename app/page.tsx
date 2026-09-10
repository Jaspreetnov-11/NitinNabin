import Site from "@/components/Site";
import { getSiteContent } from "@/lib/data";

// Re-fetch from Supabase at most once a minute (ISR). Edits in the Supabase
// Table Editor show up on the live site within ~60s without a redeploy.
export const revalidate = 60;

export default async function Page() {
  const content = await getSiteContent();
  return <Site content={content} />;
}
