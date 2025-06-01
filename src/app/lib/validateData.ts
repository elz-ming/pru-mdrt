import supabaseAdmin from "./supabaseAdmin";

const TIERS = ["bronze", "silver", "gold", "MDRT", "COT", "TOT"];
const DEMO_MILESTONES = ["followup_pro", "first_case_closed", "ten_cases_club"];

export async function validateData(encodedUserId: string) {
  console.log(`✅ Validating demo data for: ${encodedUserId}`);

  // STEP 1: Assign random tier if missing
  const { data: userData, error: userFetchError } = await supabaseAdmin
    .from("users")
    .select("tier")
    .eq("encoded_id", encodedUserId)
    .single();

  if (!userFetchError && userData && !userData.tier) {
    const randomTier = TIERS[Math.floor(Math.random() * TIERS.length)];
    await supabaseAdmin
      .from("users")
      .update({ tier: randomTier })
      .eq("encoded_id", encodedUserId);
    console.log(`🎖️ Assigned tier "${randomTier}" to user.`);
  }

  // STEP 2: Insert demo user_milestones if not exists
  const { data: progressData, error: progressError } = await supabaseAdmin
    .from("user_milestones")
    .select("milestone_name")
    .eq("user_encoded_id", encodedUserId);

  if (!progressError && progressData.length === 0) {
    const demoProgress = DEMO_MILESTONES.slice(0, 2).map((name) => ({
      user_encoded_id: encodedUserId,
      milestone_name: name,
      completed_at: new Date().toISOString(),
    }));

    await supabaseAdmin.from("user_milestones").insert(demoProgress);
    console.log(`🏅 Inserted demo milestones for user.`);
  }

  // STEP 3: Add any future validations here
}
