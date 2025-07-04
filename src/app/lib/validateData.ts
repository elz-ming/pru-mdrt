import supabaseAdmin from "./supabaseAdmin";

const TIERS = ["bronze", "silver", "gold", "MDRT", "COT", "TOT"];
const ROLES = ["agency leader", "agency member"];
const DEMO_MILESTONES = ["followup_pro", "first_case_closed", "ten_cases_club"];

export async function validateData(encodedUserId: string, name: string) {
  console.log(`✅ Validating demo data for: ${encodedUserId}`);

  // STEP 1: Fetch user
  const { data: userData, error: userFetchError } = await supabaseAdmin
    .from("users")
    .select("tier, role, agency")
    .eq("encoded_id", encodedUserId)
    .single();

  if (userFetchError) {
    console.error("❌ Failed to fetch user:", userFetchError);
    return;
  }

  let { tier, role, agency } = userData || {};

  // STEP 2: Randomize role if missing
  if (!role) {
    role = ROLES[Math.floor(Math.random() * ROLES.length)];
    console.log(`👔 Assigned role "${role}"`);
  }

  // STEP 3: Assign tier based on role if missing
  if (!tier) {
    let allowedTiers: string[] = [];
    if (role === "agency leader") {
      allowedTiers = ["MDRT", "COT", "TOT"];
    } else {
      allowedTiers = ["bronze", "silver", "gold", "MDRT"];
    }
    tier = allowedTiers[Math.floor(Math.random() * allowedTiers.length)];
    console.log(`🎖️ Assigned tier "${tier}"`);
  }

  // STEP 4: Assign agency based on role
  if (!agency) {
    if (role === "agency leader") {
      agency = `${name} Agency`;
      console.log(`🏢 Created new agency "${agency}"`);
    } else {
      // Try to find an existing agency leader to assign under
      const { data: existingLeaders, error: leadersError } = await supabaseAdmin
        .from("users")
        .select("agency")
        .eq("role", "agency leader")
        .not("agency", "is", null);

      if (!leadersError && existingLeaders.length > 0) {
        const randomLeader =
          existingLeaders[Math.floor(Math.random() * existingLeaders.length)];
        agency = randomLeader.agency;
        console.log(`👥 Assigned to existing agency "${agency}"`);
      } else {
        // Fallback: if no leader exists, assign a generic agency
        agency = `Default Agency`;
        console.log(`⚠️ No leaders found. Assigned to "${agency}"`);
      }
    }
  }

  // STEP 5: Update user with new values if needed
  await supabaseAdmin
    .from("users")
    .update({ tier, role, agency })
    .eq("encoded_id", encodedUserId);

  console.log(
    `✅ Updated user with tier "${tier}", role "${role}", agency "${agency}".`
  );

  // STEP 6: Insert demo milestones if none exist
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

  // STEP 7: Add any future validations here
}
