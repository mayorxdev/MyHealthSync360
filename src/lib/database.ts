import { supabase } from "./supabase";
import { Product } from "../data/products";

// Product-related functions
export async function getAllProducts(): Promise<Product[]> {
  const { data: products, error } = await supabase
    .from("products")
    .select(
      `
      *,
      product_ingredients (*),
      product_nutrition (
        *,
        nutrition_facts (*)
      ),
      product_features (*),
      product_certifications (*),
      product_reviews (
        id,
        rating,
        title,
        comment,
        is_verified,
        helpful_count,
        created_at,
        users (name)
      )
    `
    )
    .order("id");

  if (error) {
    console.error("Error fetching products:", error);
    return [];
  }

  return products.map(transformProductData);
}

export async function getProductById(id: number): Promise<Product | null> {
  const { data: product, error } = await supabase
    .from("products")
    .select(
      `
      *,
      product_ingredients (*),
      product_nutrition (
        *,
        nutrition_facts (*)
      ),
      product_features (*),
      product_certifications (*),
      product_reviews (
        id,
        rating,
        title,
        comment,
        is_verified,
        helpful_count,
        created_at,
        users (name)
      )
    `
    )
    .eq("id", id)
    .single();

  if (error) {
    console.error("Error fetching product:", error);
    return null;
  }

  return transformProductData(product);
}

export async function getProductsByCategory(
  category: string
): Promise<Product[]> {
  let query = supabase.from("products").select(`
      *,
      product_ingredients (*),
      product_nutrition (
        *,
        nutrition_facts (*)
      ),
      product_features (*),
      product_certifications (*),
      product_reviews (
        id,
        rating,
        title,
        comment,
        is_verified,
        helpful_count,
        created_at,
        users (name)
      )
    `);

  if (category !== "all") {
    query = query.contains("tags", [category]);
  }

  const { data: products, error } = await query.order("id");

  if (error) {
    console.error("Error fetching products by category:", error);
    return [];
  }

  return products.map(transformProductData);
}

// Transform database product data to match the Product interface
function transformProductData(dbProduct: any): Product {
  const nutrition = dbProduct.product_nutrition?.[0];

  return {
    id: dbProduct.id,
    name: dbProduct.name,
    category: getCategoryFromTags(dbProduct.tags),
    price: dbProduct.price,
    originalPrice: dbProduct.original_price,
    rating: dbProduct.rating,
    reviews: dbProduct.review_count,
    image: dbProduct.image,
    images: [dbProduct.image], // For now, using single image
    badge: getBadgeFromTags(dbProduct.tags),
    description:
      dbProduct.detailed_description?.substring(0, 100) + "..." || "",
    detailedDescription: dbProduct.detailed_description || "",
    benefits: dbProduct.benefits || [],
    keyIngredients:
      dbProduct.product_ingredients?.map((ing: any) => ({
        name: ing.name,
        amount: ing.amount,
        description: ing.description,
      })) || [],
    servingInfo: {
      servingSize: nutrition?.serving_size || "",
      servingsPerContainer: parseInt(nutrition?.servings_per_container) || 0,
      directions: dbProduct.usage_instructions || "",
    },
    nutritionFacts:
      nutrition?.nutrition_facts?.map((fact: any) => ({
        name: fact.nutrient_name,
        amount: fact.amount,
        dailyValue: fact.daily_value,
      })) || [],
    features: dbProduct.product_features?.map((f: any) => f.feature) || [],
    warnings: dbProduct.warnings?.split(". ").filter(Boolean) || [],
    certifications:
      dbProduct.product_certifications?.map((c: any) => c.certification) || [],
    inStock: dbProduct.in_stock,
    stockCount: dbProduct.stock_count,
    sku: dbProduct.sku || "",
    weight: dbProduct.weight || "",
    dimensions: dbProduct.dimensions || "",
    shelfLife: dbProduct.shelf_life || "",
    tags: dbProduct.tags || [],
  };
}

// Helper functions
function getCategoryFromTags(tags: string[]): string {
  if (
    tags.includes("vitamins") ||
    tags.includes("vitamin-b12") ||
    tags.includes("vitamin-d3")
  ) {
    return "vitamins";
  }
  if (
    tags.includes("minerals") ||
    tags.includes("calcium") ||
    tags.includes("magnesium")
  ) {
    return "minerals";
  }
  if (
    tags.includes("supplements") ||
    tags.includes("omega-3") ||
    tags.includes("probiotics")
  ) {
    return "supplements";
  }
  return "supplements";
}

function getBadgeFromTags(tags: string[]): string | null {
  if (tags.includes("bestseller")) return "Best Seller";
  if (tags.includes("new")) return "New";
  if (tags.includes("sale")) return "Sale";
  if (tags.includes("top-rated")) return "Top Rated";
  return null;
}

// User-related functions
export async function getUserById(id: string) {
  try {
    console.log("Fetching user by ID:", id);

    const { data: user, error } = await supabase
      .from("users")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      console.error("Error fetching user:", {
        code: error.code,
        message: error.message,
        details: error.details,
        hint: error.hint,
        userId: id,
      });

      // If user doesn't exist, return null (don't try to create here to avoid recursion)
      if (error.code === "PGRST116") {
        console.log("User not found in database");
        return null;
      }

      return null;
    }

    console.log("User found successfully:", user?.email);
    return user;
  } catch (error) {
    console.error("Unexpected error in getUserById:", error);
    return null;
  }
}

// Enhanced user profile function with additional stats
export async function getUserProfile(id: string) {
  try {
    console.log("Fetching user profile for ID:", id);

    const { data: user, error: userError } = await supabase
      .from("users")
      .select("*")
      .eq("id", id)
      .single();

    if (userError) {
      console.error("Error fetching user profile:", userError);

      // If user doesn't exist, return null (user creation handled elsewhere)
      if (userError.code === "PGRST116") {
        console.log("User not found in database");
        return null;
      }

      return null;
    }

    console.log("User found:", user);

    // Return user data immediately without fetching orders for faster loading
    // Orders can be fetched separately when needed (e.g., on dashboard)
    const memberSince = user.created_at
      ? new Date(user.created_at)
      : new Date();

    return {
      ...user,
      // Reconstruct address object from individual columns
      address: {
        street: user.address_street || "",
        city: user.address_city || "",
        state: user.address_state || "",
        zipCode: user.address_zip_code || "",
      },
      stats: {
        memberSince: memberSince.toLocaleDateString("en-US", {
          month: "short",
          year: "numeric",
        }),
        totalOrders: user.total_orders || 0,
        totalSpent: 0, // This can be calculated separately if needed
      },
    };
  } catch (error) {
    console.error("Unexpected error in getUserProfile:", error);
    return null;
  }
}

// Function to ensure user exists in our database
export async function ensureUserExists(userId: string, authUserData?: any) {
  try {
    console.log("Ensuring user exists for ID:", userId);

    // If authUserData is provided, use it directly (passed from AuthContext)
    // This avoids the problematic supabase.auth.getUser() call
    if (!authUserData) {
      console.log("No auth user data provided, cannot create user");
      return null;
    }

    // Create user in our database using the provided auth data
    const userData = {
      id: userId,
      email: authUserData.email!,
      name:
        authUserData.user_metadata?.full_name ||
        `${authUserData.user_metadata?.first_name || ""} ${
          authUserData.user_metadata?.last_name || ""
        }`.trim() ||
        authUserData.email!.split("@")[0],
      phone: authUserData.user_metadata?.phone || null,
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(
        authUserData.user_metadata?.full_name ||
          authUserData.email!.split("@")[0]
      )}&size=128&background=10b981&color=ffffff&bold=true`,
    };

    console.log("Creating user with data:", userData);

    const { data: newUser, error: createError } = await supabase
      .from("users")
      .insert(userData)
      .select()
      .single();

    if (createError) {
      console.error("Error creating user:", createError);
      return null;
    }

    console.log("User created successfully:", newUser);
    return newUser;
  } catch (error) {
    console.error("Error in ensureUserExists:", error);
    return null;
  }
}

export async function updateUser(id: string, updates: any) {
  const { data, error } = await supabase
    .from("users")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("Error updating user:", error);
    return null;
  }

  return data;
}

// Enhanced profile update function
export async function updateUserProfile(
  id: string,
  profileData: {
    name?: string;
    email?: string;
    phone?: string;
    address?: {
      street?: string;
      city?: string;
      state?: string;
      zipCode?: string;
    };
    avatar?: string;
    email_notifications?: boolean;
    sms_notifications?: boolean;
    marketing_emails?: boolean;
  }
) {
  try {
    console.log("updateUserProfile called with:", { id, profileData });

    // Prepare the update object
    const updateData: any = {};

    if (profileData.name !== undefined) updateData.name = profileData.name;
    if (profileData.email !== undefined) updateData.email = profileData.email;
    if (profileData.phone !== undefined) updateData.phone = profileData.phone;

    // Handle address fields separately since they're stored as individual columns
    if (profileData.address) {
      if (profileData.address.street !== undefined)
        updateData.address_street = profileData.address.street;
      if (profileData.address.city !== undefined)
        updateData.address_city = profileData.address.city;
      if (profileData.address.state !== undefined)
        updateData.address_state = profileData.address.state;
      if (profileData.address.zipCode !== undefined)
        updateData.address_zip_code = profileData.address.zipCode;
    }

    if (profileData.avatar !== undefined)
      updateData.avatar = profileData.avatar;
    if (profileData.email_notifications !== undefined)
      updateData.email_notifications = profileData.email_notifications;
    if (profileData.sms_notifications !== undefined)
      updateData.sms_notifications = profileData.sms_notifications;
    if (profileData.marketing_emails !== undefined)
      updateData.marketing_emails = profileData.marketing_emails;

    updateData.updated_at = new Date().toISOString();

    console.log("Prepared update data:", updateData);

    const { data, error } = await supabase
      .from("users")
      .update(updateData)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Supabase error updating user profile:", error);
      return { success: false, error: error.message };
    }

    console.log("Profile updated successfully:", data);
    return { success: true, data };
  } catch (error) {
    console.error("Unexpected error in updateUserProfile:", error);
    return { success: false, error: "An unexpected error occurred" };
  }
}

// Upload user avatar to Supabase Storage
export async function uploadUserAvatar(
  userId: string,
  file: File
): Promise<{ success: boolean; url?: string; error?: string }> {
  try {
    // Validate file
    if (!file.type.startsWith("image/")) {
      return { success: false, error: "Please select a valid image file" };
    }

    if (file.size > 5 * 1024 * 1024) {
      // 5MB limit
      return { success: false, error: "Image size should be less than 5MB" };
    }

    // Create unique filename
    const fileExt = file.name.split(".").pop();
    const fileName = `${userId}-${Date.now()}.${fileExt}`;
    const filePath = `avatars/${fileName}`;

    // Upload to Supabase Storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from("product-images") // Using existing bucket
      .upload(filePath, file, {
        cacheControl: "3600",
        upsert: true,
      });

    if (uploadError) {
      console.error("Error uploading avatar:", uploadError);
      return { success: false, error: "Failed to upload image" };
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from("product-images")
      .getPublicUrl(filePath);

    const avatarUrl = urlData.publicUrl;

    // Update user profile with new avatar URL
    const { error: updateError } = await supabase
      .from("users")
      .update({ avatar: avatarUrl, updated_at: new Date().toISOString() })
      .eq("id", userId);

    if (updateError) {
      console.error("Error updating user avatar:", updateError);
      return { success: false, error: "Failed to update profile" };
    }

    return { success: true, url: avatarUrl };
  } catch (error) {
    console.error("Error in uploadUserAvatar:", error);
    return { success: false, error: "An unexpected error occurred" };
  }
}

// Delete user avatar from Supabase Storage
export async function deleteUserAvatar(
  userId: string,
  avatarUrl: string
): Promise<{ success: boolean; error?: string }> {
  try {
    // Extract file path from URL
    const urlParts = avatarUrl.split("/");
    const fileName = urlParts[urlParts.length - 1];
    const filePath = `avatars/${fileName}`;

    // Delete from storage
    const { error: deleteError } = await supabase.storage
      .from("product-images")
      .remove([filePath]);

    if (deleteError) {
      console.error("Error deleting avatar file:", deleteError);
    }

    // Generate default avatar URL
    const { data: userData } = await supabase
      .from("users")
      .select("name")
      .eq("id", userId)
      .single();

    const defaultAvatar = userData?.name
      ? `https://ui-avatars.com/api/?name=${encodeURIComponent(
          userData.name
        )}&size=128&background=10b981&color=ffffff&bold=true`
      : `https://ui-avatars.com/api/?name=User&size=128&background=10b981&color=ffffff&bold=true`;

    // Update user profile to remove avatar
    const { error: updateError } = await supabase
      .from("users")
      .update({
        avatar: defaultAvatar,
        updated_at: new Date().toISOString(),
      })
      .eq("id", userId);

    if (updateError) {
      console.error("Error updating user profile:", updateError);
      return { success: false, error: "Failed to update profile" };
    }

    return { success: true };
  } catch (error) {
    console.error("Error in deleteUserAvatar:", error);
    return { success: false, error: "An unexpected error occurred" };
  }
}

// Order-related functions
export async function getUserOrders(userId: string) {
  try {
    console.log("Fetching orders for user:", userId);

    const { data: orders, error } = await supabase
      .from("orders")
      .select(
        `
        *,
        order_items (*)
      `
      )
      .eq("user_id", userId)
      .order("order_date", { ascending: false });

    if (error) {
      console.error("Error fetching user orders:", {
        code: error.code,
        message: error.message,
        userId: userId,
      });
      return [];
    }

    console.log(`Found ${orders?.length || 0} orders for user`);
    return orders || [];
  } catch (error) {
    console.error("Unexpected error in getUserOrders:", error);
    return [];
  }
}

export async function createOrder(orderData: any) {
  const { data, error } = await supabase
    .from("orders")
    .insert(orderData)
    .select()
    .single();

  if (error) {
    console.error("Error creating order:", error);
    return null;
  }

  return data;
}

// Enhanced order creation with items
export async function createOrderWithItems(orderData: {
  user_id: string;
  order_number: string;
  status: string;
  total_amount: number;
  shipping_amount: number;
  tax_amount: number;
  discount_amount?: number;
  promo_code?: string;
  billing_cycle?: string;
  shipping_address: any;
  billing_address: any;
  items: Array<{
    product_id: number;
    product_name: string;
    quantity: number;
    price: number;
  }>;
}) {
  try {
    // Start a transaction by creating the order first
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert({
        user_id: orderData.user_id,
        order_number: orderData.order_number,
        status: orderData.status,
        total_amount: orderData.total_amount,
        shipping_amount: orderData.shipping_amount,
        tax_amount: orderData.tax_amount,
        discount_amount: orderData.discount_amount || 0,
        promo_code: orderData.promo_code,
        billing_cycle: orderData.billing_cycle || "monthly",
        shipping_address: orderData.shipping_address,
        billing_address: orderData.billing_address,
        order_date: new Date().toISOString(),
        estimated_delivery: new Date(
          Date.now() + 5 * 24 * 60 * 60 * 1000
        ).toISOString(), // 5 days from now
        tracking_number: `TRK${Date.now()}${Math.floor(Math.random() * 1000)}`,
      })
      .select()
      .single();

    if (orderError) {
      console.error("Error creating order:", orderError);
      return null;
    }

    // Create order items
    const orderItems = orderData.items.map((item) => ({
      order_id: order.id,
      product_id: item.product_id,
      product_name: item.product_name,
      quantity: item.quantity,
      price: item.price,
    }));

    const { error: itemsError } = await supabase
      .from("order_items")
      .insert(orderItems);

    if (itemsError) {
      console.error("Error creating order items:", itemsError);
      // Could implement rollback here if needed
      return null;
    }

    // Update user's total orders count
    const { data: currentUser } = await supabase
      .from("users")
      .select("total_orders")
      .eq("id", orderData.user_id)
      .single();

    const { error: userUpdateError } = await supabase
      .from("users")
      .update({
        total_orders: (currentUser?.total_orders || 0) + 1,
      })
      .eq("id", orderData.user_id);

    if (userUpdateError) {
      console.error("Error updating user order count:", userUpdateError);
    }

    return order;
  } catch (error) {
    console.error("Error in createOrderWithItems:", error);
    return null;
  }
}

// Get order by ID with items
export async function getOrderById(orderId: string) {
  const { data: order, error } = await supabase
    .from("orders")
    .select(
      `
      *,
      order_items (*)
    `
    )
    .eq("id", orderId)
    .single();

  if (error) {
    console.error("Error fetching order:", error);
    return null;
  }

  return order;
}

// Get order by order number
export async function getOrderByNumber(orderNumber: string) {
  const { data: order, error } = await supabase
    .from("orders")
    .select(
      `
      *,
      order_items (*)
    `
    )
    .eq("order_number", orderNumber)
    .single();

  if (error) {
    console.error("Error fetching order by number:", error);
    return null;
  }

  return order;
}

// Create user account
export async function createUser(userData: {
  email: string;
  name: string;
  phone?: string;
  address?: {
    street?: string;
    city?: string;
    state?: string;
    zipCode?: string;
  };
  avatar?: string;
}) {
  // Generate UUID using crypto.getRandomValues (browser-compatible)
  const userId = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
    /[xy]/g,
    function (c) {
      const r = (Math.random() * 16) | 0;
      const v = c == "x" ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    }
  );

  const { data: user, error } = await supabase
    .from("users")
    .insert({
      id: userId,
      email: userData.email,
      name: userData.name,
      phone: userData.phone,
      address_street: userData.address?.street,
      address_city: userData.address?.city,
      address_state: userData.address?.state,
      address_zip_code: userData.address?.zipCode,
      avatar:
        userData.avatar ||
        `https://ui-avatars.com/api/?name=${encodeURIComponent(
          userData.name
        )}&size=128&background=10b981&color=ffffff&bold=true`,
      health_score: 75, // Default starting health score
      total_orders: 0,
      created_at: new Date().toISOString(),
    })
    .select()
    .single();

  if (error) {
    console.error("Error creating user:", error);
    return null;
  }

  return user;
}

// Create user with specific ID (for Supabase Auth integration)
export async function createUserWithId(userData: {
  id: string;
  email: string;
  name: string;
  phone?: string;
  address?: {
    street?: string;
    city?: string;
    state?: string;
    zipCode?: string;
  };
  avatar?: string;
}) {
  const { data: user, error } = await supabase
    .from("users")
    .insert({
      id: userData.id,
      email: userData.email,
      name: userData.name,
      phone: userData.phone,
      address_street: userData.address?.street,
      address_city: userData.address?.city,
      address_state: userData.address?.state,
      address_zip_code: userData.address?.zipCode,
      avatar:
        userData.avatar ||
        `https://ui-avatars.com/api/?name=${encodeURIComponent(
          userData.name
        )}&size=128&background=10b981&color=ffffff&bold=true`,
      health_score: 75, // Default starting health score
      total_orders: 0,
      created_at: new Date().toISOString(),
    })
    .select()
    .single();

  if (error) {
    console.error("Error creating user with ID:", error);
    return null;
  }

  return user;
}

// Check if user exists by email
export async function getUserByEmail(email: string) {
  const { data: user, error } = await supabase
    .from("users")
    .select("*")
    .eq("email", email)
    .single();

  if (error && error.code !== "PGRST116") {
    // PGRST116 is "not found" error
    console.error("Error fetching user by email:", error);
    return null;
  }

  return user;
}

// Create subscription
export async function createSubscription(subscriptionData: {
  user_id: string;
  plan_name: string;
  billing_cycle: string;
  monthly_total: number;
  status: string;
  products: Array<{
    product_id: number;
    quantity: number;
    price: number;
  }>;
}) {
  try {
    // Create subscription
    const { data: subscription, error: subError } = await supabase
      .from("subscriptions")
      .insert({
        user_id: subscriptionData.user_id,
        plan_name: subscriptionData.plan_name,
        billing_cycle: subscriptionData.billing_cycle,
        monthly_total: subscriptionData.monthly_total,
        status: subscriptionData.status,
        start_date: new Date().toISOString(),
        next_billing_date: getNextBillingDate(subscriptionData.billing_cycle),
        created_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (subError) {
      console.error("Error creating subscription:", subError);
      return null;
    }

    // Create subscription products
    const subscriptionProducts = subscriptionData.products.map((product) => ({
      subscription_id: subscription.id,
      product_id: product.product_id,
      quantity: product.quantity,
      price: product.price,
    }));

    const { error: productsError } = await supabase
      .from("subscription_products")
      .insert(subscriptionProducts);

    if (productsError) {
      console.error("Error creating subscription products:", productsError);
      return null;
    }

    return subscription;
  } catch (error) {
    console.error("Error in createSubscription:", error);
    return null;
  }
}

// Helper function to calculate next billing date
function getNextBillingDate(billingCycle: string): string {
  const now = new Date();
  switch (billingCycle) {
    case "quarterly":
      return new Date(now.getTime() + 90 * 24 * 60 * 60 * 1000).toISOString();
    case "yearly":
      return new Date(now.getTime() + 365 * 24 * 60 * 60 * 1000).toISOString();
    default: // monthly
      return new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000).toISOString();
  }
}

// Generate unique order number
export function generateOrderNumber(): string {
  const timestamp = Date.now().toString();
  const random = Math.floor(Math.random() * 1000)
    .toString()
    .padStart(3, "0");
  return `ORD-${timestamp.slice(-6)}${random}`;
}

// Validate promo code
export async function validatePromoCode(
  promoCode: string
): Promise<{ valid: boolean; discount: number; message: string }> {
  // For now, we'll use hardcoded promo codes
  // In a real app, this would check a promo_codes table
  const promoCodes: { [key: string]: { discount: number; message: string } } = {
    WELCOME10: { discount: 10, message: "10% off your first order!" },
    HEALTH20: { discount: 20, message: "20% off for health enthusiasts!" },
    SAVE15: { discount: 15, message: "15% off your order!" },
    NEWUSER: { discount: 25, message: "25% off for new users!" },
  };

  const code = promoCode.toUpperCase();
  if (promoCodes[code]) {
    return {
      valid: true,
      discount: promoCodes[code].discount,
      message: promoCodes[code].message,
    };
  }

  return {
    valid: false,
    discount: 0,
    message: "Invalid promo code",
  };
}

// Subscription-related functions
export async function getUserSubscription(userId: string) {
  try {
    console.log("Fetching subscription for user:", userId);

    // Query subscriptions table without the join since subscription_products table may not exist
    const { data: subscription, error } = await supabase
      .from("subscriptions")
      .select("*")
      .eq("user_id", userId)
      .single();

    if (error) {
      // If no subscription found, that's normal - return null
      if (error.code === "PGRST116") {
        console.log("No subscription found for user - this is normal");
        return null;
      }

      console.error("Error fetching user subscription:", {
        code: error.code || "unknown",
        message: error.message || "Unknown error",
        details: error.details || "No details available",
        hint: error.hint || "No hint available",
        userId: userId,
      });

      return null;
    }

    if (subscription) {
      console.log("Subscription found successfully");

      // Return the subscription with empty products array since we don't have subscription_products table
      return {
        ...subscription,
        subscription_products: [], // Empty array for now
      };
    }

    return null;
  } catch (error) {
    console.error("Unexpected error in getUserSubscription:", {
      error: error instanceof Error ? error.message : String(error),
      userId: userId,
    });
    return null;
  }
}

export async function updateSubscription(id: string, updates: any) {
  try {
    console.log("Updating subscription:", id);

    const { data, error } = await supabase
      .from("subscriptions")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Error updating subscription:", {
        code: error.code,
        message: error.message,
        details: error.details,
        subscriptionId: id,
        updates: updates,
      });
      return null;
    }

    console.log("Subscription updated successfully");
    return data;
  } catch (error) {
    console.error("Unexpected error in updateSubscription:", error);
    return null;
  }
}

// Review-related functions
export async function getProductReviews(productId: number) {
  const { data: reviews, error } = await supabase
    .from("product_reviews")
    .select(
      `
      *,
      users (name)
    `
    )
    .eq("product_id", productId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching product reviews:", error);
    return [];
  }

  return reviews;
}

export async function createReview(reviewData: any) {
  const { data, error } = await supabase
    .from("product_reviews")
    .insert(reviewData)
    .select()
    .single();

  if (error) {
    console.error("Error creating review:", error);
    return null;
  }

  return data;
}

// Storage-related functions
export async function uploadProductImage(
  file: File,
  fileName: string
): Promise<string | null> {
  try {
    const { data, error } = await supabase.storage
      .from("product-images")
      .upload(fileName, file, {
        upsert: true,
      });

    if (error) {
      console.error("Error uploading image:", error);
      return null;
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from("product-images")
      .getPublicUrl(fileName);

    return urlData.publicUrl;
  } catch (error) {
    console.error("Error uploading image:", error);
    return null;
  }
}

export async function deleteProductImage(fileName: string): Promise<boolean> {
  try {
    const { error } = await supabase.storage
      .from("product-images")
      .remove([fileName]);

    if (error) {
      console.error("Error deleting image:", error);
      return false;
    }

    return true;
  } catch (error) {
    console.error("Error deleting image:", error);
    return false;
  }
}

export function getImageUrl(fileName: string): string {
  const { data } = supabase.storage
    .from("product-images")
    .getPublicUrl(fileName);

  return data.publicUrl;
}

// Payment Methods functions
export async function getUserPaymentMethods(userId: string) {
  try {
    if (!userId) {
      console.log("No userId provided to getUserPaymentMethods");
      return [];
    }

    const { data: paymentMethods, error } = await supabase
      .from("payment_methods")
      .select("*")
      .eq("user_id", userId)
      .eq("is_active", true)
      .order("is_default", { ascending: false })
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching payment methods:", error);
      return [];
    }

    console.log(
      `Found ${paymentMethods?.length || 0} payment methods for user ${userId}`
    );
    return paymentMethods || [];
  } catch (error) {
    console.error("Error in getUserPaymentMethods:", error);
    return [];
  }
}

export async function savePaymentMethod(paymentMethodData: {
  user_id: string;
  card_last_four: string;
  card_brand: string;
  card_exp_month: string;
  card_exp_year: string;
  cardholder_name: string;
  is_default?: boolean;
  billing_address?: any;
}) {
  try {
    // If this is being set as default, remove default from other methods
    if (paymentMethodData.is_default) {
      await supabase
        .from("payment_methods")
        .update({ is_default: false })
        .eq("user_id", paymentMethodData.user_id);
    }

    const { data: paymentMethod, error } = await supabase
      .from("payment_methods")
      .insert({
        ...paymentMethodData,
        is_active: true,
        created_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) {
      console.error("Error saving payment method:", error);
      return null;
    }

    return paymentMethod;
  } catch (error) {
    console.error("Error in savePaymentMethod:", error);
    return null;
  }
}

export async function updatePaymentMethod(
  paymentMethodId: string,
  updates: {
    cardholder_name?: string;
    card_exp_month?: string;
    card_exp_year?: string;
    is_default?: boolean;
    billing_address?: any;
  }
) {
  try {
    // If setting as default, remove default from other methods for this user
    if (updates.is_default) {
      const { data: currentMethod } = await supabase
        .from("payment_methods")
        .select("user_id")
        .eq("id", paymentMethodId)
        .single();

      if (currentMethod) {
        await supabase
          .from("payment_methods")
          .update({ is_default: false })
          .eq("user_id", currentMethod.user_id);
      }
    }

    const { data: paymentMethod, error } = await supabase
      .from("payment_methods")
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq("id", paymentMethodId)
      .select()
      .single();

    if (error) {
      console.error("Error updating payment method:", error);
      return null;
    }

    return paymentMethod;
  } catch (error) {
    console.error("Error in updatePaymentMethod:", error);
    return null;
  }
}

export async function deletePaymentMethod(paymentMethodId: string) {
  try {
    const { error } = await supabase
      .from("payment_methods")
      .update({
        is_active: false,
        updated_at: new Date().toISOString(),
      })
      .eq("id", paymentMethodId);

    if (error) {
      console.error("Error deleting payment method:", error);
      return false;
    }

    return true;
  } catch (error) {
    console.error("Error in deletePaymentMethod:", error);
    return false;
  }
}
