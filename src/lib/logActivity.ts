import { supabase } from "@/lib/supabase";

function detectDevice() {
  if (typeof navigator === "undefined") return undefined;
  const ua = navigator.userAgent;
  const os = ua.includes("Windows") ? "Windows" : ua.includes("Mac") ? "macOS" : ua.includes("Linux") ? "Linux" : ua.includes("Android") ? "Android" : ua.includes("iPhone") || ua.includes("iPad") ? "iOS" : "Unknown";
  return `Web · ${os}`;
}

export async function logActivity(params: {
  action: string;
  module: string;
  affectedItem?: string;
  description: string;
}) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;

  const { data: profile } = await supabase
    .from("admin_profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  await supabase.from("activity_log").insert({
    actor_email: user.email ?? null,
    actor_name: user.user_metadata?.full_name || user.email?.split("@")[0] || null,
    actor_role: profile?.role ?? null,
    action: params.action,
    module: params.module,
    affected_item: params.affectedItem ?? null,
    description: params.description,
    device: detectDevice(),
  });
}
