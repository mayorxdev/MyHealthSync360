import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { createUserWithId } from "@/lib/database";

export async function POST(request: NextRequest) {
  try {
    const { token_hash, type } = await request.json();

    if (!token_hash || !type) {
      return NextResponse.json(
        { success: false, error: "Missing token_hash or type" },
        { status: 400 }
      );
    }

    // Verify the email confirmation
    const { data, error } = await supabase.auth.verifyOtp({
      token_hash,
      type: type as "email",
    });

    if (error) {
      console.error("Email verification error:", error);
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 400 }
      );
    }

    if (data.user) {
      // Check if user profile exists, create if not
      try {
        const { data: existingUser } = await supabase
          .from("users")
          .select("*")
          .eq("id", data.user.id)
          .single();

        if (!existingUser) {
          // Create user profile
          await createUserWithId({
            id: data.user.id,
            email: data.user.email!,
            name:
              data.user.user_metadata?.full_name ||
              `${data.user.user_metadata?.first_name || ""} ${
                data.user.user_metadata?.last_name || ""
              }`.trim() ||
              data.user.email!.split("@")[0],
            phone: data.user.user_metadata?.phone,
          });
        }
      } catch (profileError) {
        console.error("Error creating user profile:", profileError);
        // Continue anyway, profile can be created later
      }

      return NextResponse.json({ success: true });
    }

    return NextResponse.json(
      { success: false, error: "Verification failed" },
      { status: 400 }
    );
  } catch (error) {
    console.error("Verification API error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
