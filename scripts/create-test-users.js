import { createClient } from "@supabase/supabase-js";

// You'll need to add your service role key to .env.local
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY; // Add this to .env.local

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

const testUsers = [
  {
    email: "test.user@mailinator.com",
    password: "password123",
    name: "Test User",
  },
  {
    email: "john.doe@guerrillamail.com",
    password: "password123",
    name: "John Doe",
  },
  {
    email: "jane.smith@10minutemail.com",
    password: "password123",
    name: "Jane Smith",
  },
];

async function createTestUsers() {
  console.log("Creating test users...");

  for (const user of testUsers) {
    try {
      const { data, error } = await supabaseAdmin.auth.admin.createUser({
        email: user.email,
        password: user.password,
        email_confirm: true,
        user_metadata: {
          name: user.name,
        },
      });

      if (error) {
        console.error(`Error creating user ${user.email}:`, error.message);
      } else {
        console.log(`✅ Created user: ${user.email}`);

        // Create or update user profile in database
        const { error: profileError } = await supabaseAdmin
          .from("users")
          .upsert({
            id: data.user.id,
            email: user.email,
            name: user.name,
            created_at: new Date().toISOString(),
          });

        if (profileError) {
          console.error(
            `Error creating profile for ${user.email}:`,
            profileError.message
          );
        } else {
          console.log(`✅ Created profile for: ${user.email}`);
        }
      }
    } catch (err) {
      console.error(`Error with user ${user.email}:`, err.message);
    }
  }
}

createTestUsers()
  .then(() => {
    console.log("Done creating test users!");
    console.log("\nYou can now login with:");
    testUsers.forEach((user) => {
      console.log(`Email: ${user.email}, Password: ${user.password}`);
    });
  })
  .catch(console.error);
