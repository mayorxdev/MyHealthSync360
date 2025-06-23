"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import Image from "next/image";
import {
  CreditCardIcon,
  ShieldCheckIcon,
  TruckIcon,
  CheckCircleIcon,
  LockClosedIcon,
} from "@heroicons/react/24/outline";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
// Import database functions
import {
  createOrderWithItems,
  createUser,
  getUserByEmail,
  createSubscription,
  generateOrderNumber,
  validatePromoCode,
  getUserProfile,
  ensureUserExists,
  updateUserProfile,
  getUserPaymentMethods,
  savePaymentMethod,
} from "@/lib/database";

interface BillingDetails {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

interface PaymentMethod {
  cardNumber: string;
  expiryDate: string;
  cvv: string;
  nameOnCard: string;
}

interface AccountDetails {
  email: string;
  password: string;
  confirmPassword: string;
  createAccount: boolean;
}

const CheckoutPage = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const { state: cartState, clearCart } = useCart();
  const { state: authState, login, updateUser } = useAuth();

  // Monitor cart state
  useEffect(() => {
    // Cart state monitoring for checkout page
  }, [cartState]);

  // Load user profile data and populate form when user is logged in
  useEffect(() => {
    const loadUserData = async () => {
      if (authState.user && authState.isLoggedIn) {
        try {
          console.log("Loading user profile for checkout:", authState.user.id);

          // Fetch full user profile from database
          const userProfile = await getUserProfile(authState.user.id);

          if (userProfile) {
            console.log("User profile loaded:", userProfile);

            // Parse the name into first and last name
            const nameParts = userProfile.name.split(" ");
            const firstName = nameParts[0] || "";
            const lastName = nameParts.slice(1).join(" ") || "";

            // Auto-populate billing details
            setBillingDetails({
              firstName: firstName,
              lastName: lastName,
              email: userProfile.email,
              phone: userProfile.phone || "",
              address: userProfile.address?.street || "",
              city: userProfile.address?.city || "",
              state: userProfile.address?.state || "",
              zipCode: userProfile.address?.zipCode || "",
              country: "US",
            });

            // Set account details
            setAccountDetails((prev) => ({
              ...prev,
              email: userProfile.email,
              createAccount: false, // User is already logged in
            }));

            console.log("Form auto-populated with user data");
          } else {
            console.log("No user profile found, will create one on order");
          }

          // Load saved payment methods
          const paymentMethods = await getUserPaymentMethods(authState.user.id);
          setSavedPaymentMethods(paymentMethods);

          // If user has saved payment methods, select the default one
          if (paymentMethods.length > 0) {
            const defaultMethod =
              paymentMethods.find((pm) => pm.is_default) || paymentMethods[0];
            setSelectedPaymentMethod(defaultMethod.id);
          }
        } catch (error) {
          console.error("Error loading user profile:", error);
        }
      }
    };

    loadUserData();
  }, [authState.user, authState.isLoggedIn]);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [billingPlan, setBillingPlan] = useState<
    "monthly" | "quarterly" | "yearly"
  >("monthly");

  const [billingDetails, setBillingDetails] = useState<BillingDetails>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    country: "US",
  });

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>({
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    nameOnCard: "",
  });

  const [accountDetails, setAccountDetails] = useState<AccountDetails>({
    email: "",
    password: "",
    confirmPassword: "",
    createAccount: true,
  });

  const [promoCode, setPromoCode] = useState("");
  const [promoDiscount, setPromoDiscount] = useState(0);
  const [promoMessage, setPromoMessage] = useState("");
  const [isValidatingPromo, setIsValidatingPromo] = useState(false);

  // Payment method states
  const [savedPaymentMethods, setSavedPaymentMethods] = useState<any[]>([]);
  const [selectedPaymentMethod, setSelectedPaymentMethod] =
    useState<string>("new");
  const [saveNewPaymentMethod, setSaveNewPaymentMethod] = useState(false);

  // Address auto-fill states
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const [addressSuggestions, setAddressSuggestions] = useState<any[]>([]);
  const [showAddressSuggestions, setShowAddressSuggestions] = useState(false);
  const [isLoadingZipInfo, setIsLoadingZipInfo] = useState(false);

  const subtotal = cartState.items.reduce(
    (sum, item) => sum + (item.price || 0) * (item.quantity || 0),
    0
  );
  const bundleDiscount = cartState.items.length > 1 ? subtotal * 0.2 : 0;
  const promoAmount =
    (subtotal - bundleDiscount) * ((promoDiscount || 0) / 100);
  const shipping = subtotal > 50 ? 0 : 4.99;
  const tax = (subtotal - bundleDiscount - promoAmount) * 0.08; // 8% tax
  const total = subtotal - bundleDiscount - promoAmount + shipping + tax;

  const getBillingMultiplier = () => {
    switch (billingPlan) {
      case "quarterly":
        return 3;
      case "yearly":
        return 12;
      default:
        return 1;
    }
  };

  const getBillingDiscount = () => {
    switch (billingPlan) {
      case "quarterly":
        return 0.1; // 10% discount
      case "yearly":
        return 0.2; // 20% discount
      default:
        return 0;
    }
  };

  const finalTotal =
    total * getBillingMultiplier() * (1 - getBillingDiscount());

  const getCardBrand = (cardNumber: string): string => {
    const number = cardNumber.replace(/\D/g, "");
    if (number.startsWith("4")) return "Visa";
    if (number.startsWith("5") || number.startsWith("2")) return "Mastercard";
    if (number.startsWith("3")) return "American Express";
    if (number.startsWith("6")) return "Discover";
    return "Unknown";
  };

  // Address auto-fill functions
  const getCurrentLocation = async () => {
    setIsLoadingLocation(true);
    try {
      if (!navigator.geolocation) {
        throw new Error("Geolocation is not supported by this browser");
      }

      const position = await new Promise<GeolocationPosition>(
        (resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject, {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 300000, // 5 minutes
          });
        }
      );

      const { latitude, longitude } = position.coords;

      // Use reverse geocoding to get address from coordinates
      const response = await fetch(
        `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
      );

      if (!response.ok) {
        throw new Error("Failed to get address from location");
      }

      const data = await response.json();

      // Auto-fill the address fields
      setBillingDetails((prev) => ({
        ...prev,
        address: `${data.streetNumber || ""} ${data.streetName || ""}`.trim(),
        city: data.city || data.locality || "",
        state: data.principalSubdivision || "",
        zipCode: data.postcode || "",
        country: data.countryCode || "US",
      }));

      showError("Address auto-filled from your current location!");
    } catch (error) {
      console.error("Error getting current location:", error);
      showError(
        "Unable to get your current location. Please enter your address manually."
      );
    } finally {
      setIsLoadingLocation(false);
    }
  };

  const lookupZipCode = async (zipCode: string) => {
    if (zipCode.length !== 5) return;

    setIsLoadingZipInfo(true);
    try {
      const response = await fetch(`https://api.zippopotam.us/us/${zipCode}`);

      if (response.ok) {
        const data = await response.json();
        const place = data.places[0];

        setBillingDetails((prev) => ({
          ...prev,
          city: place["place name"],
          state: place["state abbreviation"],
        }));
      }
    } catch (error) {
      console.error("Error looking up ZIP code:", error);
    } finally {
      setIsLoadingZipInfo(false);
    }
  };

  const parseFullAddress = (fullAddress: string) => {
    // Simple address parsing - can be enhanced with more sophisticated parsing
    const parts = fullAddress.split(",").map((part) => part.trim());

    if (parts.length >= 3) {
      const street = parts[0];
      const city = parts[1];
      const stateZip = parts[2].split(" ");
      const state = stateZip[0];
      const zipCode = stateZip[1];

      setBillingDetails((prev) => ({
        ...prev,
        address: street,
        city: city,
        state: state || prev.state,
        zipCode: zipCode || prev.zipCode,
      }));
    }
  };

  const searchAddresses = async (query: string) => {
    if (query.length < 3) {
      setAddressSuggestions([]);
      setShowAddressSuggestions(false);
      return;
    }

    try {
      // Using a simple address suggestion API (you can replace with Google Places API for better results)
      const response = await fetch(
        `https://api.bigdatacloud.net/data/address-autocomplete?query=${encodeURIComponent(
          query
        )}&countryCode=US&limit=5`
      );

      if (response.ok) {
        const data = await response.json();
        setAddressSuggestions(data.suggestions || []);
        setShowAddressSuggestions(true);
      }
    } catch (error) {
      console.error("Error searching addresses:", error);
      setAddressSuggestions([]);
      setShowAddressSuggestions(false);
    }
  };

  const selectAddressSuggestion = (suggestion: any) => {
    setBillingDetails((prev) => ({
      ...prev,
      address: suggestion.streetAddress || suggestion.address,
      city: suggestion.city || suggestion.locality,
      state: suggestion.state || suggestion.principalSubdivision,
      zipCode: suggestion.postalCode || suggestion.postcode,
    }));
    setShowAddressSuggestions(false);
    setAddressSuggestions([]);
  };

  const showError = (message: string) => {
    setErrorMessage(message);
    setShowErrorModal(true);
  };

  const handleBillingDetailsChange = (
    field: keyof BillingDetails,
    value: string
  ) => {
    setBillingDetails((prev) => ({ ...prev, [field]: value }));
  };

  const handlePaymentMethodChange = (
    field: keyof PaymentMethod,
    value: string
  ) => {
    setPaymentMethod((prev) => ({ ...prev, [field]: value }));
  };

  const handleAccountDetailsChange = (
    field: keyof AccountDetails,
    value: string | boolean
  ) => {
    setAccountDetails((prev) => ({ ...prev, [field]: value }));
  };

  const applyPromoCode = async () => {
    if (!promoCode.trim()) {
      showError("Please enter a promo code");
      return;
    }

    setIsValidatingPromo(true);
    try {
      const result = await validatePromoCode(promoCode);

      if (result.valid) {
        setPromoDiscount(result.discount);
        setPromoMessage(result.message);
      } else {
        showError(result.message);
        setPromoDiscount(0);
        setPromoMessage("");
      }
    } catch (error) {
      showError("Error validating promo code");
      console.error("Promo code validation error:", error);
    } finally {
      setIsValidatingPromo(false);
    }
  };

  const validateForm = (): boolean => {
    // Validate billing details
    if (
      !billingDetails.firstName ||
      !billingDetails.lastName ||
      !billingDetails.email
    ) {
      showError("Please fill in all required billing fields");
      return false;
    }

    if (
      !billingDetails.address ||
      !billingDetails.city ||
      !billingDetails.state ||
      !billingDetails.zipCode
    ) {
      showError("Please fill in all address fields");
      return false;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(billingDetails.email)) {
      showError("Please enter a valid email address");
      return false;
    }

    // Validate payment method
    if (
      !paymentMethod.cardNumber ||
      !paymentMethod.expiryDate ||
      !paymentMethod.cvv ||
      !paymentMethod.nameOnCard
    ) {
      showError("Please fill in all payment details");
      return false;
    }

    // Validate account creation fields if creating account (only for non-logged-in users)
    if (!authState.isLoggedIn && accountDetails.createAccount) {
      if (
        !accountDetails.email ||
        !accountDetails.password ||
        !accountDetails.confirmPassword
      ) {
        showError("Please fill in all account creation fields");
        return false;
      }

      if (accountDetails.password !== accountDetails.confirmPassword) {
        showError("Passwords do not match");
        return false;
      }

      if (accountDetails.password.length < 6) {
        showError("Password must be at least 6 characters long");
        return false;
      }
    }

    return true;
  };

  const handleSubmitOrder = async () => {
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      let userId = authState.user?.id;

      if (authState.isLoggedIn && userId) {
        // User is logged in - ensure their profile exists in database and update it
        console.log("Processing order for logged-in user:", userId);

        // Ensure user exists in database (create if doesn't exist)
        let userProfile = await getUserProfile(userId);

        if (!userProfile) {
          console.log("User profile not found, creating one");
          const createdUser = await ensureUserExists(userId, {
            id: userId,
            email: authState.user?.email || billingDetails.email,
            user_metadata: {
              full_name: `${billingDetails.firstName} ${billingDetails.lastName}`,
              phone: billingDetails.phone,
            },
          });

          if (!createdUser) {
            showError("Failed to create user profile");
            setLoading(false);
            return;
          }
          userProfile = createdUser;
        }

        // Update user profile with current billing information
        const profileUpdateResult = await updateUserProfile(userId, {
          name: `${billingDetails.firstName} ${billingDetails.lastName}`,
          email: billingDetails.email,
          phone: billingDetails.phone,
          address: {
            street: billingDetails.address,
            city: billingDetails.city,
            state: billingDetails.state,
            zipCode: billingDetails.zipCode,
          },
        });

        if (!profileUpdateResult.success) {
          console.warn(
            "Failed to update user profile:",
            profileUpdateResult.error
          );
          // Continue with order creation even if profile update fails
        } else {
          console.log("User profile updated successfully");
        }
      } else if (accountDetails.createAccount) {
        // Create new user account
        console.log("Creating new user account");

        // Check if user already exists
        const existingUser = await getUserByEmail(accountDetails.email);

        if (existingUser) {
          showError("An account with this email already exists");
          setLoading(false);
          return;
        }

        // Create new user
        const newUser = await createUser({
          email: accountDetails.email,
          name: `${billingDetails.firstName} ${billingDetails.lastName}`,
          phone: billingDetails.phone,
          address: {
            street: billingDetails.address,
            city: billingDetails.city,
            state: billingDetails.state,
            zipCode: billingDetails.zipCode,
          },
        });

        if (!newUser) {
          showError("Failed to create user account");
          setLoading(false);
          return;
        }

        userId = newUser.id;

        // Update user context with new user data
        updateUser({
          id: newUser.id,
          email: newUser.email,
          name: newUser.name,
          avatar: newUser.avatar,
        });
      } else {
        // Guest checkout - create a temporary user record
        console.log("Processing guest checkout");

        const guestUser = await createUser({
          email: billingDetails.email,
          name: `${billingDetails.firstName} ${billingDetails.lastName}`,
          phone: billingDetails.phone,
          address: {
            street: billingDetails.address,
            city: billingDetails.city,
            state: billingDetails.state,
            zipCode: billingDetails.zipCode,
          },
        });

        if (!guestUser) {
          showError("Failed to process guest checkout");
          setLoading(false);
          return;
        }

        userId = guestUser.id;
      }

      if (!userId) {
        showError("User authentication required");
        setLoading(false);
        return;
      }

      // Generate order number
      const orderNumber = generateOrderNumber();

      // Prepare order data
      const orderData = {
        user_id: userId,
        order_number: orderNumber,
        status: "processing",
        total_amount: finalTotal,
        shipping_amount: shipping,
        tax_amount: tax,
        discount_amount: bundleDiscount + promoAmount,
        promo_code: promoCode || undefined,
        billing_cycle: billingPlan,
        shipping_address: {
          name: `${billingDetails.firstName} ${billingDetails.lastName}`,
          street: billingDetails.address,
          city: billingDetails.city,
          state: billingDetails.state,
          zipCode: billingDetails.zipCode,
          country: billingDetails.country,
          phone: billingDetails.phone,
        },
        billing_address: {
          name: `${billingDetails.firstName} ${billingDetails.lastName}`,
          street: billingDetails.address,
          city: billingDetails.city,
          state: billingDetails.state,
          zipCode: billingDetails.zipCode,
          country: billingDetails.country,
          phone: billingDetails.phone,
        },
        items: cartState.items.map((item) => ({
          product_id: item.id,
          product_name: item.name,
          quantity: item.quantity,
          price: item.price,
        })),
      };

      // Save payment method if requested and user is logged in
      if (
        saveNewPaymentMethod &&
        authState.isLoggedIn &&
        selectedPaymentMethod === "new"
      ) {
        const cardBrand = getCardBrand(paymentMethod.cardNumber);
        const cardLastFour = paymentMethod.cardNumber.slice(-4);
        const [expMonth, expYear] = paymentMethod.expiryDate.split("/");

        await savePaymentMethod({
          user_id: userId,
          card_last_four: cardLastFour,
          card_brand: cardBrand,
          card_exp_month: expMonth,
          card_exp_year: expYear,
          cardholder_name: paymentMethod.nameOnCard,
          is_default: savedPaymentMethods.length === 0, // Set as default if it's the first one
          billing_address: {
            name: `${billingDetails.firstName} ${billingDetails.lastName}`,
            street: billingDetails.address,
            city: billingDetails.city,
            state: billingDetails.state,
            zipCode: billingDetails.zipCode,
            country: billingDetails.country,
          },
        });
      }

      // Create order
      const order = await createOrderWithItems(orderData);

      if (!order) {
        showError("Failed to create order");
        setLoading(false);
        return;
      }

      // Create subscription if billing cycle is not monthly
      if (billingPlan !== "monthly") {
        const subscriptionData = {
          user_id: userId,
          plan_name: `${
            billingPlan.charAt(0).toUpperCase() + billingPlan.slice(1)
          } Health Plan`,
          billing_cycle: billingPlan,
          monthly_total: finalTotal,
          status: "active",
          products: cartState.items.map((item) => ({
            product_id: item.id,
            quantity: item.quantity,
            price: item.price,
          })),
        };

        await createSubscription(subscriptionData);
      }

      // Clear cart after successful order
      clearCart();

      // Store order number for success page
      sessionStorage.setItem("lastOrderNumber", orderNumber);

      // Redirect to success page
      router.push("/success");
    } catch (error) {
      console.error("Order submission error:", error);
      showError(
        "An error occurred while processing your order. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      {cartState.items.length === 0 ? (
        <div className="min-h-screen bg-gray-50 pt-20 pb-12 flex items-center justify-center">
          <div className="text-center">
            <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
              <TruckIcon className="w-12 h-12 text-gray-400" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Your cart is empty
            </h2>
            <p className="text-gray-600 mb-8">
              Add some products to your cart before checkout
            </p>
            <Link href="/catalog">
              <Button className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-4 rounded-xl">
                Browse Products
              </Button>
            </Link>
          </div>
        </div>
      ) : (
        <div className="min-h-screen bg-gray-50 pt-20 pb-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Header */}
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Complete Your Order
              </h1>
              <p className="text-gray-600">
                Secure checkout for your personalized supplement plan (
                {cartState.totalItems} items)
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Main Checkout Form */}
              <div className="lg:col-span-2 space-y-8">
                {/* Billing Plan Selection */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">
                    Choose Your Billing Plan
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {[
                      {
                        value: "monthly",
                        label: "Monthly",
                        discount: "0%",
                        popular: false,
                        description: "Pay monthly, cancel anytime",
                      },
                      {
                        value: "quarterly",
                        label: "Quarterly",
                        discount: "10%",
                        popular: true,
                        description: "Save 10% with 3-month plan",
                      },
                      {
                        value: "yearly",
                        label: "Yearly",
                        discount: "20%",
                        popular: false,
                        description: "Best value with annual plan",
                      },
                    ].map((plan) => (
                      <label
                        key={plan.value}
                        className={`relative p-4 border-2 rounded-xl cursor-pointer transition-all duration-200 ${
                          billingPlan === plan.value
                            ? "border-emerald-500 bg-emerald-50"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                      >
                        {plan.popular && (
                          <div className="absolute -top-2 left-1/2 transform -translate-x-1/2">
                            <span className="bg-emerald-500 text-white text-xs font-medium px-3 py-1 rounded-full">
                              Most Popular
                            </span>
                          </div>
                        )}
                        <input
                          type="radio"
                          name="billingPlan"
                          value={plan.value}
                          checked={billingPlan === plan.value}
                          onChange={(e) =>
                            setBillingPlan(e.target.value as typeof billingPlan)
                          }
                          className="sr-only"
                        />
                        <div className="text-center">
                          <div className="font-semibold text-gray-900">
                            {plan.label}
                          </div>
                          <div className="text-sm text-emerald-600 font-medium">
                            Save {plan.discount}
                          </div>
                          <div className="text-xs text-gray-600 mt-1">
                            {plan.description}
                          </div>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Billing Information */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-semibold text-gray-900">
                      Billing Information
                    </h2>
                    {authState.isLoggedIn && (
                      <div className="flex items-center space-x-2 text-sm text-emerald-600">
                        <svg
                          className="w-4 h-4"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                            clipRule="evenodd"
                          />
                        </svg>
                        <span>Auto-filled from your profile</span>
                      </div>
                    )}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        First Name *
                      </label>
                      <input
                        type="text"
                        value={billingDetails.firstName}
                        onChange={(e) =>
                          handleBillingDetailsChange(
                            "firstName",
                            e.target.value
                          )
                        }
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-gray-900 placeholder-gray-500"
                        placeholder="John"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Last Name *
                      </label>
                      <input
                        type="text"
                        value={billingDetails.lastName}
                        onChange={(e) =>
                          handleBillingDetailsChange("lastName", e.target.value)
                        }
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-gray-900 placeholder-gray-500"
                        placeholder="Doe"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        value={
                          accountDetails.createAccount
                            ? accountDetails.email
                            : billingDetails.email
                        }
                        onChange={(e) => {
                          if (accountDetails.createAccount) {
                            handleAccountDetailsChange("email", e.target.value);
                          } else {
                            handleBillingDetailsChange("email", e.target.value);
                          }
                        }}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-gray-900 placeholder-gray-500"
                        placeholder="john@example.com"
                      />
                      {accountDetails.createAccount && (
                        <p className="text-xs text-emerald-600 mt-1">
                          This email will be used for both billing and your
                          account
                        </p>
                      )}
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        value={billingDetails.phone}
                        onChange={(e) =>
                          handleBillingDetailsChange("phone", e.target.value)
                        }
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-gray-900 placeholder-gray-500"
                        placeholder="(555) 123-4567"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <div className="flex items-center justify-between mb-2">
                        <label className="block text-sm font-medium text-gray-700">
                          Address *
                        </label>
                        <button
                          type="button"
                          onClick={getCurrentLocation}
                          disabled={isLoadingLocation}
                          className="inline-flex items-center px-3 py-1 text-xs font-medium text-emerald-600 bg-emerald-50 rounded-full hover:bg-emerald-100 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                        >
                          {isLoadingLocation ? (
                            <>
                              <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-emerald-600 mr-1"></div>
                              Getting location...
                            </>
                          ) : (
                            <>
                              <svg
                                className="w-3 h-3 mr-1"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                                />
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                                />
                              </svg>
                              Use my location
                            </>
                          )}
                        </button>
                      </div>
                      <div className="relative">
                        <input
                          type="text"
                          value={billingDetails.address}
                          onChange={(e) => {
                            handleBillingDetailsChange(
                              "address",
                              e.target.value
                            );
                            searchAddresses(e.target.value);
                          }}
                          onFocus={() => {
                            if (billingDetails.address.length >= 3) {
                              searchAddresses(billingDetails.address);
                            }
                          }}
                          onBlur={() => {
                            // Delay hiding suggestions to allow clicking on them
                            setTimeout(
                              () => setShowAddressSuggestions(false),
                              200
                            );
                          }}
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-gray-900 placeholder-gray-500"
                          placeholder="123 Main Street or start typing for suggestions..."
                        />

                        {/* Address Suggestions Dropdown */}
                        {showAddressSuggestions &&
                          addressSuggestions.length > 0 && (
                            <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                              {addressSuggestions.map((suggestion, index) => (
                                <button
                                  key={index}
                                  type="button"
                                  onClick={() =>
                                    selectAddressSuggestion(suggestion)
                                  }
                                  className="w-full px-4 py-3 text-left hover:bg-gray-50 focus:bg-gray-50 focus:outline-none border-b border-gray-100 last:border-b-0"
                                >
                                  <div className="font-medium text-gray-900">
                                    {suggestion.streetAddress ||
                                      suggestion.address}
                                  </div>
                                  <div className="text-sm text-gray-600">
                                    {suggestion.city}, {suggestion.state}{" "}
                                    {suggestion.postalCode}
                                  </div>
                                </button>
                              ))}
                            </div>
                          )}
                      </div>

                      {/* Quick Address Parser */}
                      <div className="mt-2">
                        <button
                          type="button"
                          onClick={() => {
                            const fullAddress = prompt(
                              "Paste your full address (e.g., 123 Main St, New York, NY 10001):"
                            );
                            if (fullAddress) {
                              parseFullAddress(fullAddress);
                            }
                          }}
                          className="text-xs text-emerald-600 hover:text-emerald-700 underline"
                        >
                          Paste full address instead
                        </button>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        City *
                      </label>
                      <input
                        type="text"
                        value={billingDetails.city}
                        onChange={(e) =>
                          handleBillingDetailsChange("city", e.target.value)
                        }
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-gray-900 placeholder-gray-500"
                        placeholder="New York"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        State *
                      </label>
                      <select
                        value={billingDetails.state}
                        onChange={(e) =>
                          handleBillingDetailsChange("state", e.target.value)
                        }
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-gray-900"
                      >
                        <option value="">Select State</option>
                        <option value="AL">Alabama</option>
                        <option value="AK">Alaska</option>
                        <option value="AZ">Arizona</option>
                        <option value="AR">Arkansas</option>
                        <option value="CA">California</option>
                        <option value="CO">Colorado</option>
                        <option value="CT">Connecticut</option>
                        <option value="DE">Delaware</option>
                        <option value="FL">Florida</option>
                        <option value="GA">Georgia</option>
                        <option value="HI">Hawaii</option>
                        <option value="ID">Idaho</option>
                        <option value="IL">Illinois</option>
                        <option value="IN">Indiana</option>
                        <option value="IA">Iowa</option>
                        <option value="KS">Kansas</option>
                        <option value="KY">Kentucky</option>
                        <option value="LA">Louisiana</option>
                        <option value="ME">Maine</option>
                        <option value="MD">Maryland</option>
                        <option value="MA">Massachusetts</option>
                        <option value="MI">Michigan</option>
                        <option value="MN">Minnesota</option>
                        <option value="MS">Mississippi</option>
                        <option value="MO">Missouri</option>
                        <option value="MT">Montana</option>
                        <option value="NE">Nebraska</option>
                        <option value="NV">Nevada</option>
                        <option value="NH">New Hampshire</option>
                        <option value="NJ">New Jersey</option>
                        <option value="NM">New Mexico</option>
                        <option value="NY">New York</option>
                        <option value="NC">North Carolina</option>
                        <option value="ND">North Dakota</option>
                        <option value="OH">Ohio</option>
                        <option value="OK">Oklahoma</option>
                        <option value="OR">Oregon</option>
                        <option value="PA">Pennsylvania</option>
                        <option value="RI">Rhode Island</option>
                        <option value="SC">South Carolina</option>
                        <option value="SD">South Dakota</option>
                        <option value="TN">Tennessee</option>
                        <option value="TX">Texas</option>
                        <option value="UT">Utah</option>
                        <option value="VT">Vermont</option>
                        <option value="VA">Virginia</option>
                        <option value="WA">Washington</option>
                        <option value="WV">West Virginia</option>
                        <option value="WI">Wisconsin</option>
                        <option value="WY">Wyoming</option>
                        <option value="DC">District of Columbia</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        ZIP Code *
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          value={billingDetails.zipCode}
                          onChange={(e) => {
                            const zipCode = e.target.value
                              .replace(/\D/g, "")
                              .slice(0, 5);
                            handleBillingDetailsChange("zipCode", zipCode);
                            if (zipCode.length === 5) {
                              lookupZipCode(zipCode);
                            }
                          }}
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-gray-900 placeholder-gray-500"
                          placeholder="10001"
                          maxLength={5}
                        />
                        {isLoadingZipInfo && (
                          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-emerald-600"></div>
                          </div>
                        )}
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        City and state will auto-fill when you enter a valid ZIP
                        code
                      </p>
                    </div>
                  </div>
                </div>

                {/* Account Creation - Only show for non-logged-in users */}
                {!authState.isLoggedIn && (
                  <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">
                      Account Information
                    </h2>

                    <div className="mb-4">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={accountDetails.createAccount}
                          onChange={(e) =>
                            handleAccountDetailsChange(
                              "createAccount",
                              e.target.checked
                            )
                          }
                          className="h-4 w-4 rounded border-2 border-gray-300 bg-white checked:bg-emerald-600 checked:border-emerald-600 focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 transition-colors duration-200 hover:border-emerald-400 accent-emerald-600"
                        />
                        <span className="ml-2 text-sm text-gray-700">
                          Create an account to track your orders and manage your
                          subscription
                        </span>
                      </label>
                    </div>

                    {accountDetails.createAccount && (
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Email Address *
                          </label>
                          <input
                            type="email"
                            value={accountDetails.email}
                            onChange={(e) =>
                              handleAccountDetailsChange(
                                "email",
                                e.target.value
                              )
                            }
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-gray-900 placeholder-gray-500"
                            placeholder="your@email.com"
                          />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Password *
                            </label>
                            <input
                              type="password"
                              value={accountDetails.password}
                              onChange={(e) =>
                                handleAccountDetailsChange(
                                  "password",
                                  e.target.value
                                )
                              }
                              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-gray-900 placeholder-gray-500"
                              placeholder="Create a password"
                              minLength={8}
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Confirm Password *
                            </label>
                            <input
                              type="password"
                              value={accountDetails.confirmPassword}
                              onChange={(e) =>
                                handleAccountDetailsChange(
                                  "confirmPassword",
                                  e.target.value
                                )
                              }
                              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-gray-900 placeholder-gray-500"
                              placeholder="Confirm your password"
                              minLength={8}
                            />
                          </div>
                        </div>

                        {accountDetails.password &&
                          accountDetails.confirmPassword &&
                          accountDetails.password !==
                            accountDetails.confirmPassword && (
                            <div className="text-red-600 text-sm">
                              Passwords do not match
                            </div>
                          )}

                        <div className="text-xs text-gray-600">
                          Password must be at least 8 characters long
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Logged-in User Info */}
                {authState.isLoggedIn && (
                  <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">
                      Account Information
                    </h2>
                    <div className="flex items-center space-x-3 p-4 bg-emerald-50 rounded-lg">
                      <div className="flex-shrink-0">
                        <img
                          src={
                            authState.user?.avatar ||
                            `https://ui-avatars.com/api/?name=${encodeURIComponent(
                              authState.user?.name || "User"
                            )}&size=40&background=10b981&color=ffffff&bold=true`
                          }
                          alt={authState.user?.name || "User"}
                          className="w-10 h-10 rounded-full"
                        />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">
                          {authState.user?.name}
                        </p>
                        <p className="text-sm text-gray-600">
                          {authState.user?.email}
                        </p>
                      </div>
                      <div className="flex-1 text-right">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
                          Logged In
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Payment Information */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                    <CreditCardIcon className="w-6 h-6 mr-2" />
                    Payment Information
                  </h2>

                  {/* Payment Method Selection - Only show for logged-in users with saved methods */}
                  {authState.isLoggedIn && savedPaymentMethods.length > 0 && (
                    <div className="mb-6">
                      <h3 className="text-lg font-medium text-gray-900 mb-3">
                        Choose Payment Method
                      </h3>
                      <div className="space-y-3">
                        {savedPaymentMethods.map((method) => (
                          <label
                            key={method.id}
                            className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all duration-200 ${
                              selectedPaymentMethod === method.id
                                ? "border-emerald-500 bg-emerald-50"
                                : "border-gray-200 hover:border-gray-300"
                            }`}
                          >
                            <input
                              type="radio"
                              name="paymentMethod"
                              value={method.id}
                              checked={selectedPaymentMethod === method.id}
                              onChange={(e) =>
                                setSelectedPaymentMethod(e.target.value)
                              }
                              className="sr-only"
                            />
                            <div className="flex items-center space-x-3 flex-1">
                              <div className="flex-shrink-0">
                                <div className="w-10 h-6 bg-gradient-to-r from-blue-500 to-purple-600 rounded text-white text-xs flex items-center justify-center font-bold">
                                  {method.card_brand === "Visa"
                                    ? "VISA"
                                    : method.card_brand === "Mastercard"
                                    ? "MC"
                                    : method.card_brand === "American Express"
                                    ? "AMEX"
                                    : method.card_brand
                                        .slice(0, 4)
                                        .toUpperCase()}
                                </div>
                              </div>
                              <div className="flex-1">
                                <div className="font-medium text-gray-900">
                                  {method.card_brand} ••••{" "}
                                  {method.card_last_four}
                                </div>
                                <div className="text-sm text-gray-600">
                                  Expires {method.card_exp_month}/
                                  {method.card_exp_year} •{" "}
                                  {method.cardholder_name}
                                </div>
                              </div>
                              {method.is_default && (
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
                                  Default
                                </span>
                              )}
                            </div>
                          </label>
                        ))}

                        {/* Add New Payment Method Option */}
                        <label
                          className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all duration-200 ${
                            selectedPaymentMethod === "new"
                              ? "border-emerald-500 bg-emerald-50"
                              : "border-gray-200 hover:border-gray-300"
                          }`}
                        >
                          <input
                            type="radio"
                            name="paymentMethod"
                            value="new"
                            checked={selectedPaymentMethod === "new"}
                            onChange={(e) =>
                              setSelectedPaymentMethod(e.target.value)
                            }
                            className="sr-only"
                          />
                          <div className="flex items-center space-x-3">
                            <div className="flex-shrink-0">
                              <div className="w-10 h-6 border-2 border-dashed border-gray-300 rounded flex items-center justify-center">
                                <svg
                                  className="w-4 h-4 text-gray-400"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M12 4v16m8-8H4"
                                  />
                                </svg>
                              </div>
                            </div>
                            <div>
                              <div className="font-medium text-gray-900">
                                Add New Payment Method
                              </div>
                              <div className="text-sm text-gray-600">
                                Use a different card
                              </div>
                            </div>
                          </div>
                        </label>
                      </div>
                    </div>
                  )}

                  {/* New Payment Method Form - Show when "new" is selected or no saved methods */}
                  {(selectedPaymentMethod === "new" ||
                    savedPaymentMethods.length === 0) && (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Name on Card *
                        </label>
                        <input
                          type="text"
                          value={paymentMethod.nameOnCard}
                          onChange={(e) =>
                            handlePaymentMethodChange(
                              "nameOnCard",
                              e.target.value
                            )
                          }
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-gray-900 placeholder-gray-500"
                          placeholder="John Doe"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Card Number *
                        </label>
                        <input
                          type="text"
                          value={paymentMethod.cardNumber}
                          onChange={(e) =>
                            handlePaymentMethodChange(
                              "cardNumber",
                              e.target.value
                            )
                          }
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-gray-900 placeholder-gray-500"
                          placeholder="1234 5678 9012 3456"
                          maxLength={19}
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Expiry Date *
                          </label>
                          <input
                            type="text"
                            value={paymentMethod.expiryDate}
                            onChange={(e) =>
                              handlePaymentMethodChange(
                                "expiryDate",
                                e.target.value
                              )
                            }
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-gray-900 placeholder-gray-500"
                            placeholder="MM/YY"
                            maxLength={5}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            CVV *
                          </label>
                          <input
                            type="text"
                            value={paymentMethod.cvv}
                            onChange={(e) =>
                              handlePaymentMethodChange("cvv", e.target.value)
                            }
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-gray-900 placeholder-gray-500"
                            placeholder="123"
                            maxLength={4}
                          />
                        </div>
                      </div>

                      {/* Save Payment Method Option for logged-in users */}
                      {authState.isLoggedIn &&
                        selectedPaymentMethod === "new" && (
                          <div className="mt-4">
                            <label className="flex items-center">
                              <input
                                type="checkbox"
                                checked={saveNewPaymentMethod}
                                onChange={(e) =>
                                  setSaveNewPaymentMethod(e.target.checked)
                                }
                                className="h-4 w-4 rounded border-2 border-gray-300 bg-white checked:bg-emerald-600 checked:border-emerald-600 focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 transition-colors duration-200 hover:border-emerald-400 accent-emerald-600"
                              />
                              <span className="ml-2 text-sm text-gray-700">
                                Save this payment method for future purchases
                              </span>
                            </label>
                          </div>
                        )}
                    </div>
                  )}

                  {/* Security Notice */}
                  <div className="mt-4 p-3 bg-gray-50 rounded-lg flex items-center text-sm text-gray-600">
                    <LockClosedIcon className="w-4 h-4 mr-2 text-gray-500" />
                    Your payment information is encrypted and secure
                  </div>
                </div>
              </div>

              {/* Order Summary */}
              <div className="lg:col-span-1">
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sticky top-20">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">
                    Order Summary
                  </h3>

                  {/* Items */}
                  <div className="space-y-3 mb-6">
                    {cartState.items.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center space-x-3"
                      >
                        <Image
                          src={item.image}
                          alt={item.name}
                          width={48}
                          height={48}
                          className="rounded-lg object-cover"
                          style={{ width: "auto", height: "auto" }}
                        />
                        <div className="flex-1">
                          <div className="text-sm font-medium text-gray-900">
                            {item.name}
                          </div>
                          <div className="text-xs text-gray-500">
                            Qty: {item.quantity}
                          </div>
                        </div>
                        <div className="text-sm font-medium text-gray-900">
                          ${item.price.toFixed(2)}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Promo Code */}
                  <div className="mb-6">
                    <div className="flex space-x-2">
                      <input
                        type="text"
                        value={promoCode}
                        onChange={(e) => setPromoCode(e.target.value)}
                        placeholder="Promo code"
                        className="flex-1 p-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-gray-900 placeholder-gray-500"
                      />
                      <Button
                        onClick={applyPromoCode}
                        variant="outline"
                        size="sm"
                        className="px-4"
                        disabled={isValidatingPromo}
                      >
                        {isValidatingPromo ? "..." : "Apply"}
                      </Button>
                    </div>
                    {promoDiscount > 0 && promoMessage && (
                      <div className="mt-2 text-sm text-emerald-600">
                        ✓ {promoMessage}
                      </div>
                    )}
                  </div>

                  {/* Pricing Breakdown */}
                  <div className="border-t border-gray-200 pt-4 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Subtotal</span>
                      <span className="text-gray-900">
                        ${subtotal.toFixed(2)}
                      </span>
                    </div>
                    {bundleDiscount > 0 && (
                      <div className="flex justify-between text-sm">
                        <span className="text-emerald-600">
                          Bundle Discount
                        </span>
                        <span className="text-emerald-600">
                          -${bundleDiscount.toFixed(2)}
                        </span>
                      </div>
                    )}
                    {promoAmount > 0 && (
                      <div className="flex justify-between text-sm">
                        <span className="text-emerald-600">Promo Discount</span>
                        <span className="text-emerald-600">
                          -${promoAmount.toFixed(2)}
                        </span>
                      </div>
                    )}
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Shipping</span>
                      <span className="text-gray-900">
                        {shipping === 0 ? "FREE" : `$${shipping.toFixed(2)}`}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Tax</span>
                      <span className="text-gray-900">${tax.toFixed(2)}</span>
                    </div>
                    {getBillingDiscount() > 0 && (
                      <div className="flex justify-between text-sm">
                        <span className="text-emerald-600">
                          {billingPlan.charAt(0).toUpperCase() +
                            billingPlan.slice(1)}{" "}
                          Discount
                        </span>
                        <span className="text-emerald-600">
                          -{(getBillingDiscount() * 100).toFixed(0)}%
                        </span>
                      </div>
                    )}
                    <div className="border-t border-gray-200 pt-2 mt-2">
                      <div className="flex justify-between text-lg font-semibold">
                        <span className="text-gray-900">Total</span>
                        <span className="text-gray-900">
                          ${finalTotal.toFixed(2)}
                        </span>
                      </div>
                      <div className="text-xs text-gray-500 text-right mt-1">
                        {billingPlan === "monthly"
                          ? "per month"
                          : billingPlan === "quarterly"
                          ? "every 3 months"
                          : "per year"}
                      </div>
                    </div>
                  </div>

                  {/* Complete Order Button */}
                  <Button
                    onClick={handleSubmitOrder}
                    disabled={loading}
                    className="w-full mt-6 bg-emerald-600 hover:bg-emerald-700 text-lg py-3"
                  >
                    {loading ? (
                      <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                        Processing...
                      </div>
                    ) : (
                      `Complete Order - $${finalTotal.toFixed(2)}`
                    )}
                  </Button>

                  {/* Trust Indicators */}
                  <div className="mt-6 space-y-3">
                    <div className="flex items-center text-sm text-gray-600">
                      <ShieldCheckIcon className="w-4 h-4 mr-2 text-emerald-500" />
                      30-day money-back guarantee
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <TruckIcon className="w-4 h-4 mr-2 text-emerald-500" />
                      Free shipping on orders over $50
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <CheckCircleIcon className="w-4 h-4 mr-2 text-emerald-500" />
                      Cancel or modify anytime
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Back to Results */}
            <div className="mt-8 text-center">
              <Link href="/quiz/results">
                <Button variant="outline">← Back to Results</Button>
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Error Modal */}
      {showErrorModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white/95 backdrop-blur-md rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl border border-white/20">
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
                <svg
                  className="h-6 w-6 text-red-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Error
              </h3>
              <p className="text-sm text-gray-600 mb-6">{errorMessage}</p>
              <Button
                className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2"
                onClick={() => setShowErrorModal(false)}
              >
                OK
              </Button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default CheckoutPage;
