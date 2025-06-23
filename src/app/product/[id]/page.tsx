"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/Button";
import { useCart } from "@/contexts/CartContext";
import { getProductById, getAllProducts } from "@/lib/database";
import { Product } from "@/data/products";
import {
  StarIcon as StarIconSolid,
  HeartIcon as HeartIconSolid,
  ShoppingCartIcon,
  CheckCircleIcon,
  ShieldCheckIcon,
  TruckIcon,
  ArrowLeftIcon,
  ShareIcon,
  InformationCircleIcon,
} from "@heroicons/react/24/solid";
import { HeartIcon, MinusIcon, PlusIcon } from "@heroicons/react/24/outline";

const ProductPage = () => {
  const params = useParams();
  const router = useRouter();
  const { addItem, openCart } = useCart();
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<
    "description" | "ingredients" | "nutrition" | "reviews"
  >("description");
  const [isFavorite, setIsFavorite] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProductData = async () => {
      try {
        setLoading(true);
        const productId = parseInt(params.id as string);

        // Fetch the specific product
        const foundProduct = await getProductById(productId);

        if (foundProduct) {
          setProduct(foundProduct);

          // Fetch all products to find related ones
          const allProducts = await getAllProducts();
          const related = allProducts
            .filter(
              (p) =>
                p.id !== foundProduct.id &&
                (p.category === foundProduct.category ||
                  p.tags.some((tag) => foundProduct.tags.includes(tag)))
            )
            .slice(0, 4);

          setRelatedProducts(related);
        }
      } catch (error) {
        console.error("Error fetching product:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProductData();
  }, [params.id]);

  const handleAddToCart = () => {
    if (!product) return;

    for (let i = 0; i < quantity; i++) {
      addItem({
        id: product.id,
        name: product.name,
        price: product.price,
        originalPrice: product.originalPrice,
        image: product.image,
        benefits: product.benefits,
        inStock: product.inStock,
      });
    }

    openCart();
  };

  const getBadgeColor = (badge: string | null) => {
    switch (badge) {
      case "Best Seller":
        return "bg-emerald-500 text-white";
      case "New":
        return "bg-blue-500 text-white";
      case "Sale":
        return "bg-red-500 text-white";
      case "Top Rated":
        return "bg-purple-500 text-white";
      default:
        return "bg-gray-500 text-white";
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen bg-gray-50 pt-20 pb-12 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
        </div>
      </Layout>
    );
  }

  if (!product) {
    return (
      <Layout>
        <div className="min-h-screen bg-gray-50 pt-20 pb-12 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Product Not Found
            </h1>
            <p className="text-gray-600 mb-8">
              The product you&apos;re looking for doesn&apos;t exist.
            </p>
            <Link href="/catalog">
              <Button className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-4 rounded-xl">
                Browse Products
              </Button>
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 pt-20 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <div className="flex items-center space-x-2 text-sm text-gray-600 mb-8">
            <Link href="/" className="hover:text-emerald-600">
              Home
            </Link>
            <span>/</span>
            <Link href="/catalog" className="hover:text-emerald-600">
              Products
            </Link>
            <span>/</span>
            <span className="text-gray-900 font-medium">{product.name}</span>
          </div>

          {/* Back Button */}
          <button
            onClick={() => router.back()}
            className="flex items-center text-emerald-600 hover:text-emerald-700 mb-8 group"
          >
            <ArrowLeftIcon className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform duration-200" />
            Back to Products
          </button>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
            {/* Product Images */}
            <div className="space-y-4">
              {/* Main Image */}
              <div className="aspect-square bg-white rounded-2xl shadow-lg overflow-hidden relative">
                <img
                  src={product.images[selectedImage]}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
                {product.badge && (
                  <div className="absolute top-4 left-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold ${getBadgeColor(
                        product.badge
                      )}`}
                    >
                      {product.badge}
                    </span>
                  </div>
                )}
                {!product.inStock && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <span className="bg-red-500 text-white px-4 py-2 rounded-full font-semibold">
                      Out of Stock
                    </span>
                  </div>
                )}
              </div>

              {/* Thumbnail Images */}
              <div className="flex space-x-2">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`w-20 h-20 rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                      selectedImage === index
                        ? "border-emerald-500 ring-2 ring-emerald-200"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${product.name} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Product Info */}
            <div className="space-y-6">
              {/* Header */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h1 className="text-3xl font-bold text-gray-900">
                    {product.name}
                  </h1>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setIsFavorite(!isFavorite)}
                      className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
                    >
                      {isFavorite ? (
                        <HeartIconSolid className="w-6 h-6 text-red-500" />
                      ) : (
                        <HeartIcon className="w-6 h-6 text-gray-400" />
                      )}
                    </button>
                    <button className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200">
                      <ShareIcon className="w-6 h-6 text-gray-400" />
                    </button>
                  </div>
                </div>

                {/* Rating */}
                <div className="flex items-center space-x-2 mb-4">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <StarIconSolid
                        key={i}
                        className={`w-5 h-5 ${
                          i < Math.floor(product.rating)
                            ? "text-yellow-400"
                            : "text-gray-200"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-gray-600">
                    {product.rating} ({product.reviews} reviews)
                  </span>
                </div>

                {/* Price */}
                <div className="flex items-center space-x-3 mb-4">
                  <span className="text-3xl font-bold text-gray-900">
                    ${product.price.toFixed(2)}
                  </span>
                  {product.originalPrice && (
                    <>
                      <span className="text-xl text-gray-500 line-through">
                        ${product.originalPrice.toFixed(2)}
                      </span>
                      <span className="bg-red-100 text-red-600 px-2 py-1 rounded-full text-sm font-semibold">
                        Save $
                        {(product.originalPrice - product.price).toFixed(2)}
                      </span>
                    </>
                  )}
                </div>

                {/* Stock Status */}
                <div className="flex items-center space-x-2 mb-6">
                  {product.inStock ? (
                    <>
                      <CheckCircleIcon className="w-5 h-5 text-green-500" />
                      <span className="text-green-600 font-medium">
                        In Stock ({product.stockCount} available)
                      </span>
                    </>
                  ) : (
                    <>
                      <InformationCircleIcon className="w-5 h-5 text-red-500" />
                      <span className="text-red-600 font-medium">
                        Out of Stock
                      </span>
                    </>
                  )}
                </div>
              </div>

              {/* Description */}
              <div>
                <p className="text-gray-600 leading-relaxed mb-4">
                  {product.description}
                </p>
              </div>

              {/* Benefits */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  Key Benefits
                </h3>
                <div className="flex flex-wrap gap-2">
                  {product.benefits.map((benefit, index) => (
                    <span
                      key={index}
                      className="px-3 py-2 bg-emerald-50 text-emerald-600 text-sm rounded-full font-medium"
                    >
                      ✓ {benefit}
                    </span>
                  ))}
                </div>
              </div>

              {/* Quantity & Add to Cart */}
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <span className="text-sm font-medium text-gray-700">
                    Quantity:
                  </span>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                      disabled={quantity <= 1}
                    >
                      <MinusIcon className="w-4 h-4 text-gray-600" />
                    </button>
                    <span className="w-12 text-center font-semibold text-gray-900">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                      disabled={!product.inStock}
                    >
                      <PlusIcon className="w-4 h-4 text-gray-600" />
                    </button>
                  </div>
                </div>

                <Button
                  onClick={handleAddToCart}
                  disabled={!product.inStock}
                  className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-semibold py-5 rounded-xl shadow-lg hover:shadow-emerald-500/25 transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  <ShoppingCartIcon className="w-5 h-5 mr-2" />
                  {product.inStock
                    ? `Add ${quantity} to Health Pack`
                    : "Out of Stock"}
                </Button>
              </div>

              {/* Trust Indicators */}
              <div className="grid grid-cols-3 gap-4 pt-6 border-t border-gray-200">
                <div className="text-center">
                  <ShieldCheckIcon className="w-8 h-8 text-emerald-600 mx-auto mb-2" />
                  <div className="text-xs text-gray-600">
                    Third-Party Tested
                  </div>
                </div>
                <div className="text-center">
                  <TruckIcon className="w-8 h-8 text-emerald-600 mx-auto mb-2" />
                  <div className="text-xs text-gray-600">Free Shipping</div>
                </div>
                <div className="text-center">
                  <CheckCircleIcon className="w-8 h-8 text-emerald-600 mx-auto mb-2" />
                  <div className="text-xs text-gray-600">30-Day Guarantee</div>
                </div>
              </div>
            </div>
          </div>

          {/* Product Details Tabs */}
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-16">
            {/* Tab Navigation */}
            <div className="flex space-x-8 border-b border-gray-200 mb-8">
              {[
                { id: "description", label: "Description" },
                { id: "ingredients", label: "Ingredients" },
                { id: "nutrition", label: "Nutrition Facts" },
                { id: "reviews", label: "Reviews" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as typeof activeTab)}
                  className={`pb-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                    activeTab === tab.id
                      ? "border-emerald-500 text-emerald-600"
                      : "border-transparent text-gray-500 hover:text-gray-700"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <div className="min-h-[300px]">
              {activeTab === "description" && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">
                      Product Overview
                    </h3>
                    <p className="text-gray-600 leading-relaxed mb-6">
                      {product.detailedDescription}
                    </p>
                  </div>

                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-3">
                      Key Features
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {product.features.map((feature, index) => (
                        <div
                          key={index}
                          className="flex items-center space-x-2"
                        >
                          <CheckCircleIcon className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                          <span className="text-gray-700">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-3">
                      Usage Instructions
                    </h4>
                    <p className="text-gray-600">
                      {product.servingInfo.directions}
                    </p>
                  </div>

                  {product.warnings.length > 0 && (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                      <h4 className="text-lg font-semibold text-yellow-800 mb-2">
                        Important Warnings
                      </h4>
                      <ul className="space-y-1">
                        {product.warnings.map((warning, index) => (
                          <li key={index} className="text-yellow-700 text-sm">
                            • {warning}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}

              {activeTab === "ingredients" && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">
                      Key Ingredients
                    </h3>
                    <div className="space-y-4">
                      {product.keyIngredients.map((ingredient, index) => (
                        <div
                          key={index}
                          className="border border-gray-200 rounded-lg p-4"
                        >
                          <div className="flex justify-between items-start mb-2">
                            <h4 className="font-semibold text-gray-900">
                              {ingredient.name}
                            </h4>
                            <span className="text-emerald-600 font-medium">
                              {ingredient.amount}
                            </span>
                          </div>
                          <p className="text-gray-600 text-sm">
                            {ingredient.description}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-3">
                      Serving Information
                    </h4>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <span className="font-medium text-gray-700">
                            Serving Size:
                          </span>
                          <span className="ml-2 text-gray-600">
                            {product.servingInfo.servingSize}
                          </span>
                        </div>
                        <div>
                          <span className="font-medium text-gray-700">
                            Servings Per Container:
                          </span>
                          <span className="ml-2 text-gray-600">
                            {product.servingInfo.servingsPerContainer}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "nutrition" && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">
                      Supplement Facts
                    </h3>
                    <div className="border border-gray-300 rounded-lg overflow-hidden">
                      <div className="bg-gray-50 px-4 py-3 border-b border-gray-300">
                        <div className="flex justify-between items-center">
                          <span className="font-semibold">
                            Serving Size: {product.servingInfo.servingSize}
                          </span>
                          <span className="text-sm text-gray-600">
                            Servings Per Container:{" "}
                            {product.servingInfo.servingsPerContainer}
                          </span>
                        </div>
                      </div>
                      <div className="divide-y divide-gray-200">
                        {product.nutritionFacts.map((fact, index) => (
                          <div
                            key={index}
                            className="px-4 py-3 flex justify-between items-center"
                          >
                            <span className="text-gray-900">{fact.name}</span>
                            <div className="flex items-center space-x-4">
                              <span className="font-medium">{fact.amount}</span>
                              {fact.dailyValue && (
                                <span className="text-sm text-gray-600 w-12 text-right">
                                  {fact.dailyValue}
                                </span>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "reviews" && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-semibold text-gray-900">
                      Customer Reviews
                    </h3>
                    <div className="flex items-center space-x-2">
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <StarIconSolid
                            key={i}
                            className={`w-5 h-5 ${
                              i < Math.floor(product.rating)
                                ? "text-yellow-400"
                                : "text-gray-200"
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-gray-600">
                        {product.rating} out of 5 ({product.reviews} reviews)
                      </span>
                    </div>
                  </div>

                  {/* Sample Reviews */}
                  <div className="space-y-6">
                    {[
                      {
                        name: "Sarah M.",
                        rating: 5,
                        date: "2 weeks ago",
                        review:
                          "Excellent quality! I've been taking this for a month and feel more energetic.",
                        verified: true,
                      },
                      {
                        name: "Mike R.",
                        rating: 4,
                        date: "1 month ago",
                        review:
                          "Good product, easy to swallow. Noticed improvements in my overall health.",
                        verified: true,
                      },
                      {
                        name: "Jennifer L.",
                        rating: 5,
                        date: "2 months ago",
                        review:
                          "Love this supplement! Great value for money and excellent customer service.",
                        verified: true,
                      },
                    ].map((review, index) => (
                      <div
                        key={index}
                        className="border border-gray-200 rounded-lg p-6"
                      >
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
                              <span className="text-emerald-600 font-semibold">
                                {review.name.charAt(0)}
                              </span>
                            </div>
                            <div>
                              <div className="flex items-center space-x-2">
                                <span className="font-medium text-gray-900">
                                  {review.name}
                                </span>
                                {review.verified && (
                                  <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                                    Verified Purchase
                                  </span>
                                )}
                              </div>
                              <div className="flex items-center space-x-2">
                                <div className="flex">
                                  {[...Array(5)].map((_, i) => (
                                    <StarIconSolid
                                      key={i}
                                      className={`w-4 h-4 ${
                                        i < review.rating
                                          ? "text-yellow-400"
                                          : "text-gray-200"
                                      }`}
                                    />
                                  ))}
                                </div>
                                <span className="text-sm text-gray-500">
                                  {review.date}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                        <p className="text-gray-600">{review.review}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Related Products */}
          {relatedProducts.length > 0 && (
            <div className="mb-16">
              <h2 className="text-2xl font-bold text-gray-900 mb-8">
                You Might Also Like
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {relatedProducts.map((relatedProduct) => (
                  <Link
                    key={relatedProduct.id}
                    href={`/product/${relatedProduct.id}`}
                    className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 overflow-hidden"
                  >
                    <div className="aspect-square relative">
                      <img
                        src={relatedProduct.image}
                        alt={relatedProduct.name}
                        className="w-full h-full object-cover"
                      />
                      {relatedProduct.badge && (
                        <div className="absolute top-2 left-2">
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-bold ${getBadgeColor(
                              relatedProduct.badge
                            )}`}
                          >
                            {relatedProduct.badge}
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                        {relatedProduct.name}
                      </h3>
                      <div className="flex items-center space-x-2 mb-2">
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <StarIconSolid
                              key={i}
                              className={`w-3 h-3 ${
                                i < Math.floor(relatedProduct.rating)
                                  ? "text-yellow-400"
                                  : "text-gray-200"
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-xs text-gray-600">
                          ({relatedProduct.reviews})
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="font-bold text-gray-900">
                          ${relatedProduct.price.toFixed(2)}
                        </span>
                        {relatedProduct.originalPrice && (
                          <span className="text-sm text-gray-500 line-through">
                            ${relatedProduct.originalPrice.toFixed(2)}
                          </span>
                        )}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default ProductPage;
