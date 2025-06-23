"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/Button";
import Layout from "@/components/layout/Layout";
import ProtectedRoute from "@/components/ProtectedRoute";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import {
  getUserProfile,
  updateUserProfile,
  uploadUserAvatar,
  deleteUserAvatar,
} from "@/lib/database";
import {
  UserIcon,
  EnvelopeIcon,
  MapPinIcon,
  BellIcon,
  ShieldCheckIcon,
  HomeIcon,
  ChevronRightIcon,
  ChartBarIcon,
  ShoppingBagIcon,
  CreditCardIcon,
  CameraIcon,
} from "@heroicons/react/24/outline";

interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  avatar: string | null;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
  } | null;
  email_notifications: boolean;
  sms_notifications: boolean;
  marketing_emails: boolean;
  health_score: number;
  total_orders: number;
  stats?: {
    memberSince: string;
    totalOrders: number;
    totalSpent: number;
  };
}

const Profile = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { state: authState, updateUser } = useAuth();

  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState<"success" | "error">("success");

  // Load user profile data from database
  useEffect(() => {
    let isSubscribed = true; // Prevent state updates if component unmounts

    const loadUserProfile = async () => {
      if (!authState.user?.id || !authState.isLoggedIn) {
        console.log("No authenticated user, skipping profile load");
        if (isSubscribed) setIsLoading(false);
        return;
      }

      console.log("Loading profile for user ID:", authState.user.id);

      try {
        const profileData = await getUserProfile(authState.user.id);
        console.log("Profile data received:", profileData);

        if (profileData && isSubscribed) {
          setUserProfile({
            id: profileData.id,
            name: profileData.name || "",
            email: profileData.email || "",
            phone: profileData.phone || "",
            avatar: profileData.avatar,
            address: profileData.address || {
              street: "",
              city: "",
              state: "",
              zipCode: "",
            },
            email_notifications: profileData.email_notifications ?? true,
            sms_notifications: profileData.sms_notifications ?? true,
            marketing_emails: profileData.marketing_emails ?? false,
            health_score: profileData.health_score || 0,
            total_orders: profileData.total_orders || 0,
            stats: profileData.stats,
          });
          console.log("Profile state updated successfully");
        } else if (!profileData && isSubscribed) {
          console.log("No profile data returned");
          showAlertMessage("Failed to load profile data", "error");
        }
      } catch (error) {
        console.error("Error loading user profile:", error);
        if (isSubscribed) {
          showAlertMessage("Failed to load profile data", "error");
        }
      } finally {
        if (isSubscribed) setIsLoading(false);
      }
    };

    loadUserProfile();

    return () => {
      isSubscribed = false; // Cleanup function to prevent memory leaks
    };
  }, [authState.user?.id, authState.isLoggedIn]);

  const showAlertMessage = (
    message: string,
    type: "success" | "error" = "success"
  ) => {
    setAlertMessage(message);
    setAlertType(type);
    setShowAlert(true);
    setTimeout(() => setShowAlert(false), 4000);
  };

  const handleAvatarUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file || !userProfile?.id) return;

    setIsUploadingAvatar(true);

    try {
      const result = await uploadUserAvatar(userProfile.id, file);

      if (result.success && result.url) {
        setUserProfile((prev) =>
          prev ? { ...prev, avatar: result.url || null } : null
        );

        // Update AuthContext
        updateUser({ avatar: result.url });

        showAlertMessage("Avatar uploaded successfully!", "success");
      } else {
        showAlertMessage(result.error || "Failed to upload avatar", "error");
      }
    } catch (error) {
      console.error("Error uploading avatar:", error);
      showAlertMessage("An unexpected error occurred", "error");
    } finally {
      setIsUploadingAvatar(false);
    }
  };

  const handleAvatarClick = () => {
    if (!isUploadingAvatar) {
      fileInputRef.current?.click();
    }
  };

  const handleRemoveAvatar = async () => {
    if (!userProfile?.id || !userProfile.avatar) return;

    // Don't try to delete default UI avatars
    if (userProfile.avatar.includes("ui-avatars.com")) {
      showAlertMessage("No custom avatar to remove", "error");
      return;
    }

    setIsUploadingAvatar(true);

    try {
      const result = await deleteUserAvatar(userProfile.id, userProfile.avatar);

      if (result.success) {
        // Generate new default avatar
        const defaultAvatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(
          userProfile.name
        )}&size=128&background=10b981&color=ffffff&bold=true`;

        setUserProfile((prev) =>
          prev ? { ...prev, avatar: defaultAvatar } : null
        );

        // Update AuthContext
        updateUser({ avatar: defaultAvatar });

        showAlertMessage("Avatar removed successfully!", "success");
      } else {
        showAlertMessage(result.error || "Failed to remove avatar", "error");
      }
    } catch (error) {
      console.error("Error removing avatar:", error);
      showAlertMessage("An unexpected error occurred", "error");
    } finally {
      setIsUploadingAvatar(false);
    }
  };

  const getAvatarSrc = () => {
    if (userProfile?.avatar) {
      return userProfile.avatar;
    }
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(
      userProfile?.name || "User"
    )}&size=128&background=10b981&color=ffffff&bold=true`;
  };

  const handleSaveChanges = async () => {
    if (!userProfile?.id) {
      showAlertMessage("User not found", "error");
      return;
    }

    if (isSaving) {
      console.log("Save already in progress, ignoring duplicate request");
      return;
    }

    const nameParts = userProfile.name.trim().split(" ");
    const firstName = nameParts[0] || "";
    const lastName = nameParts.slice(1).join(" ") || "";

    if (!firstName.trim() || !userProfile.email.trim()) {
      showAlertMessage("Please fill in all required fields", "error");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(userProfile.email.trim())) {
      showAlertMessage("Please enter a valid email address", "error");
      return;
    }

    setIsSaving(true);
    console.log("Starting profile update...");

    try {
      const updateData = {
        name: userProfile.name.trim(),
        email: userProfile.email.trim(),
        phone: userProfile.phone?.trim() || undefined,
        address: userProfile.address || undefined,
        email_notifications: userProfile.email_notifications,
        sms_notifications: userProfile.sms_notifications,
        marketing_emails: userProfile.marketing_emails,
      };

      console.log("Updating profile with data:", updateData);

      const result = await updateUserProfile(userProfile.id, updateData);

      if (result.success) {
        // Update AuthContext
        updateUser({
          name: updateData.name,
          email: updateData.email,
        });

        showAlertMessage("Profile updated successfully!", "success");
        console.log("Profile update completed successfully");
      } else {
        console.error("Profile update failed:", result.error);
        showAlertMessage(result.error || "Failed to update profile", "error");
      }
    } catch (error) {
      console.error("Error saving profile:", error);
      showAlertMessage("An unexpected error occurred", "error");
    } finally {
      setIsSaving(false);
      console.log("Profile update process completed");
    }
  };

  const handleInputChange = (field: string, value: any) => {
    setUserProfile((prev) => {
      if (!prev) return null;

      if (field.includes(".")) {
        const [parent, child] = field.split(".");

        // Handle address field specially since it can be null
        if (parent === "address") {
          return {
            ...prev,
            address: {
              ...(prev.address || {
                street: "",
                city: "",
                state: "",
                zipCode: "",
              }),
              [child]: value,
            },
          };
        }

        // For other nested fields
        const parentValue = prev[parent as keyof UserProfile];
        if (typeof parentValue === "object" && parentValue !== null) {
          return {
            ...prev,
            [parent]: {
              ...parentValue,
              [child]: value,
            },
          };
        }

        return prev;
      }

      return {
        ...prev,
        [field]: value,
      };
    });
  };

  if (isLoading) {
    return (
      <ProtectedRoute>
        <Layout>
          <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 pt-8 pb-16">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex items-center justify-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
                <span className="ml-3 text-gray-600">Loading profile...</span>
              </div>
            </div>
          </div>
        </Layout>
      </ProtectedRoute>
    );
  }

  if (!userProfile) {
    return (
      <ProtectedRoute>
        <Layout>
          <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 pt-8 pb-16">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center py-20">
                <p className="text-gray-600">Failed to load profile data</p>
              </div>
            </div>
          </div>
        </Layout>
      </ProtectedRoute>
    );
  }

  const nameParts = userProfile.name.split(" ");
  const firstName = nameParts[0] || "";
  const lastName = nameParts.slice(1).join(" ") || "";

  return (
    <ProtectedRoute>
      <Layout>
        <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 pt-8 pb-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <nav className="flex mb-6" aria-label="Breadcrumb">
              <ol className="flex items-center space-x-2">
                <li>
                  <Link
                    href="/"
                    className="text-gray-500 hover:text-emerald-600 transition-colors duration-200"
                  >
                    <HomeIcon className="h-5 w-5" />
                  </Link>
                </li>
                <ChevronRightIcon className="h-4 w-4 text-gray-400" />
                <li>
                  <span className="text-emerald-600 font-medium">
                    Profile Settings
                  </span>
                </li>
              </ol>
            </nav>

            <div className="mb-8">
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 shadow-lg border border-white/20">
                <div className="flex flex-wrap gap-4">
                  <Link href="/dashboard">
                    <Button
                      variant="outline"
                      className="border-gray-200 text-gray-600 hover:bg-gray-50"
                    >
                      <ChartBarIcon className="h-4 w-4 mr-2" />
                      Dashboard
                    </Button>
                  </Link>
                  <Link href="/profile">
                    <Button className="bg-emerald-600 hover:bg-emerald-700 text-white">
                      <UserIcon className="h-4 w-4 mr-2" />
                      Profile Settings
                    </Button>
                  </Link>
                  <Link href="/orders">
                    <Button
                      variant="outline"
                      className="border-gray-200 text-gray-600 hover:bg-gray-50"
                    >
                      <ShoppingBagIcon className="h-4 w-4 mr-2" />
                      Order History
                    </Button>
                  </Link>
                  <Link href="/subscription">
                    <Button
                      variant="outline"
                      className="border-gray-200 text-gray-600 hover:bg-gray-50"
                    >
                      <CreditCardIcon className="h-4 w-4 mr-2" />
                      Subscription
                    </Button>
                  </Link>
                </div>
              </div>
            </div>

            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Profile Settings
              </h1>
              <p className="text-gray-600">
                Manage your personal information and preferences
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-1">
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
                  <div className="text-center">
                    <div className="relative inline-block">
                      <img
                        src={getAvatarSrc()}
                        alt="Profile"
                        className="w-32 h-32 rounded-full mx-auto mb-4 object-cover border-4 border-white shadow-lg"
                      />
                      <button
                        onClick={handleAvatarClick}
                        disabled={isUploadingAvatar}
                        className="absolute bottom-0 right-0 bg-emerald-600 text-white p-2 rounded-full hover:bg-emerald-700 transition-colors duration-200 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                        title={
                          isUploadingAvatar
                            ? "Uploading..."
                            : "Upload new avatar"
                        }
                      >
                        {isUploadingAvatar ? (
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        ) : (
                          <CameraIcon className="h-4 w-4" />
                        )}
                      </button>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleAvatarUpload}
                        className="hidden"
                        disabled={isUploadingAvatar}
                      />
                    </div>

                    {userProfile.avatar &&
                      !userProfile.avatar.includes("ui-avatars.com") && (
                        <div className="mb-4">
                          <button
                            onClick={handleRemoveAvatar}
                            disabled={isUploadingAvatar}
                            className="text-sm text-red-600 hover:text-red-700 underline disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {isUploadingAvatar
                              ? "Processing..."
                              : "Remove Avatar"}
                          </button>
                        </div>
                      )}

                    <h2 className="text-xl font-semibold text-gray-900 mb-1">
                      {userProfile.name || "User"}
                    </h2>
                    <p className="text-gray-600 mb-4">{userProfile.email}</p>
                    <div className="flex items-center justify-center space-x-2 text-sm text-emerald-600">
                      <ShieldCheckIcon className="h-4 w-4" />
                      <span>Verified Account</span>
                    </div>
                  </div>
                </div>

                <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20 mt-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Account Stats
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Member Since</span>
                      <span className="font-medium text-gray-900">
                        {userProfile.stats?.memberSince || "Recently"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Total Orders</span>
                      <span className="font-medium text-gray-900">
                        {userProfile.stats?.totalOrders ||
                          userProfile.total_orders ||
                          0}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Health Score</span>
                      <span className="font-medium text-emerald-600">
                        {userProfile.health_score || 0}/100
                      </span>
                    </div>
                    {userProfile.stats?.totalSpent &&
                      userProfile.stats.totalSpent > 0 && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Total Spent</span>
                          <span className="font-medium text-gray-900">
                            ${userProfile.stats.totalSpent.toFixed(2)}
                          </span>
                        </div>
                      )}
                  </div>
                </div>
              </div>

              <div className="lg:col-span-2">
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
                  <form
                    className="space-y-6"
                    onSubmit={(e) => e.preventDefault()}
                  >
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                        <UserIcon className="h-5 w-5 mr-2 text-emerald-600" />
                        Personal Information
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            First Name *
                          </label>
                          <input
                            type="text"
                            value={firstName}
                            onChange={(e) => {
                              const newName =
                                `${e.target.value} ${lastName}`.trim();
                              handleInputChange("name", newName);
                            }}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-gray-900 bg-white"
                            required
                            disabled={isSaving}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Last Name *
                          </label>
                          <input
                            type="text"
                            value={lastName}
                            onChange={(e) => {
                              const newName =
                                `${firstName} ${e.target.value}`.trim();
                              handleInputChange("name", newName);
                            }}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-gray-900 bg-white"
                            required
                            disabled={isSaving}
                          />
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                        <EnvelopeIcon className="h-5 w-5 mr-2 text-emerald-600" />
                        Contact Information
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Email Address *
                          </label>
                          <input
                            type="email"
                            value={userProfile.email}
                            onChange={(e) =>
                              handleInputChange("email", e.target.value)
                            }
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-gray-900 bg-white"
                            required
                            disabled={isSaving}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Phone Number
                          </label>
                          <input
                            type="tel"
                            value={userProfile.phone || ""}
                            onChange={(e) =>
                              handleInputChange("phone", e.target.value)
                            }
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-gray-900 bg-white"
                            disabled={isSaving}
                          />
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                        <MapPinIcon className="h-5 w-5 mr-2 text-emerald-600" />
                        Shipping Address
                      </h3>
                      <div className="space-y-4">
                        <input
                          type="text"
                          placeholder="Street Address"
                          value={userProfile.address?.street || ""}
                          onChange={(e) =>
                            handleInputChange("address.street", e.target.value)
                          }
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-gray-900 bg-white placeholder-gray-500"
                          disabled={isSaving}
                        />
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <input
                            type="text"
                            placeholder="City"
                            value={userProfile.address?.city || ""}
                            onChange={(e) =>
                              handleInputChange("address.city", e.target.value)
                            }
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-gray-900 bg-white placeholder-gray-500"
                            disabled={isSaving}
                          />
                          <input
                            type="text"
                            placeholder="State"
                            value={userProfile.address?.state || ""}
                            onChange={(e) =>
                              handleInputChange("address.state", e.target.value)
                            }
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-gray-900 bg-white placeholder-gray-500"
                            disabled={isSaving}
                          />
                          <input
                            type="text"
                            placeholder="ZIP Code"
                            value={userProfile.address?.zipCode || ""}
                            onChange={(e) =>
                              handleInputChange(
                                "address.zipCode",
                                e.target.value
                              )
                            }
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-gray-900 bg-white placeholder-gray-500"
                            disabled={isSaving}
                          />
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                        <BellIcon className="h-5 w-5 mr-2 text-emerald-600" />
                        Notification Preferences
                      </h3>
                      <div className="space-y-4">
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            checked={userProfile.email_notifications}
                            onChange={(e) =>
                              handleInputChange(
                                "email_notifications",
                                e.target.checked
                              )
                            }
                            className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded"
                            disabled={isSaving}
                          />
                          <span className="ml-3 text-sm text-gray-700">
                            Email notifications for order updates and health
                            insights
                          </span>
                        </label>
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            checked={userProfile.sms_notifications}
                            onChange={(e) =>
                              handleInputChange(
                                "sms_notifications",
                                e.target.checked
                              )
                            }
                            className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded"
                            disabled={isSaving}
                          />
                          <span className="ml-3 text-sm text-gray-700">
                            SMS notifications for delivery updates
                          </span>
                        </label>
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            checked={userProfile.marketing_emails}
                            onChange={(e) =>
                              handleInputChange(
                                "marketing_emails",
                                e.target.checked
                              )
                            }
                            className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded"
                            disabled={isSaving}
                          />
                          <span className="ml-3 text-sm text-gray-700">
                            Marketing emails and special promotions
                          </span>
                        </label>
                      </div>
                    </div>

                    <div className="flex space-x-4 pt-6 border-t border-gray-200">
                      <Button
                        type="button"
                        className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 disabled:opacity-50 disabled:cursor-not-allowed"
                        onClick={handleSaveChanges}
                        disabled={isSaving || isUploadingAvatar}
                      >
                        {isSaving ? (
                          <div className="flex items-center">
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                            Saving...
                          </div>
                        ) : (
                          "Save Changes"
                        )}
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        className="border-gray-300 text-gray-700 hover:bg-gray-50 px-6 py-3"
                        onClick={() => window.location.reload()}
                        disabled={isSaving || isUploadingAvatar}
                      >
                        Reset
                      </Button>
                    </div>
                  </form>
                </div>
              </div>
            </div>

            {showAlert && (
              <div className="fixed top-4 right-4 z-50">
                <div
                  className={`p-4 rounded-lg shadow-lg ${
                    alertType === "success"
                      ? "bg-green-100 border border-green-200"
                      : "bg-red-100 border border-red-200"
                  }`}
                >
                  <div className="flex items-center">
                    <span
                      className={`mr-2 ${
                        alertType === "success"
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {alertType === "success" ? "✅" : "❌"}
                    </span>
                    <p
                      className={`${
                        alertType === "success"
                          ? "text-green-800"
                          : "text-red-800"
                      }`}
                    >
                      {alertMessage}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </Layout>
    </ProtectedRoute>
  );
};

export default Profile;
