"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Layout from "@/components/layout/Layout";

interface QuizData {
  // Personal Information
  age: string;
  gender: string;
  weight: string;
  height: string;
  activityLevel: string;

  // Health Goals
  primaryGoals: string[];
  specificConcerns: string[];

  // Lifestyle
  sleepHours: string;
  stressLevel: string;
  smokingStatus: string;
  alcoholConsumption: string;

  // Dietary Information
  dietType: string;
  allergies: string[];
  supplements: string[];
  medications: string[];

  // Additional Info
  pregnantOrNursing: string;
  medicalConditions: string[];
}

const Quiz = () => {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [isAnimating, setIsAnimating] = useState(false);
  const [quizData, setQuizData] = useState<QuizData>({
    age: "",
    gender: "",
    weight: "",
    height: "",
    activityLevel: "",
    primaryGoals: [],
    specificConcerns: [],
    sleepHours: "",
    stressLevel: "",
    smokingStatus: "",
    alcoholConsumption: "",
    dietType: "",
    allergies: [],
    supplements: [],
    medications: [],
    pregnantOrNursing: "",
    medicalConditions: [],
  });

  const totalSteps = 9;

  const updateQuizData = (field: keyof QuizData, value: string | string[]) => {
    setQuizData((prev) => ({ ...prev, [field]: value }));
  };

  const handleArrayToggle = (field: keyof QuizData, value: string) => {
    const currentArray = quizData[field] as string[];
    const updated = currentArray.includes(value)
      ? currentArray.filter((item) => item !== value)
      : [...currentArray, value];
    updateQuizData(field, updated);
  };

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentStep(currentStep + 1);
        setIsAnimating(false);
      }, 150);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentStep(currentStep - 1);
        setIsAnimating(false);
      }, 150);
    }
  };

  const handleSubmit = () => {
    console.log("Quiz Data:", quizData);
    localStorage.setItem("quizData", JSON.stringify(quizData));
    router.push("/quiz/results");
  };

  const isStepComplete = (step: number) => {
    switch (step) {
      case 1:
        return quizData.age && quizData.gender && quizData.activityLevel;
      case 2:
        return quizData.primaryGoals.length > 0;
      case 3:
        return true; // Optional health concerns step
      case 4:
        return quizData.sleepHours && quizData.stressLevel;
      case 5:
        return true; // Optional lifestyle step
      case 6:
        return quizData.dietType;
      case 7:
        return true; // Optional allergies step
      case 8:
        return true; // Optional supplements step
      case 9:
        return quizData.pregnantOrNursing;
      default:
        return false;
    }
  };

  const canProceed = () => {
    return isStepComplete(currentStep);
  };

  const renderStep = () => {
    const stepProps = {
      quizData,
      updateQuizData,
      handleArrayToggle,
      isAnimating,
    };

    switch (currentStep) {
      case 1:
        return <PersonalInfoStep {...stepProps} />;
      case 2:
        return <HealthGoalsStep {...stepProps} />;
      case 3:
        return <HealthConcernsStep {...stepProps} />;
      case 4:
        return <SleepStressStep {...stepProps} />;
      case 5:
        return <LifestyleHabitsStep {...stepProps} />;
      case 6:
        return <DietaryStep {...stepProps} />;
      case 7:
        return <AllergiesStep {...stepProps} />;
      case 8:
        return <SupplementsStep {...stepProps} />;
      case 9:
        return <MedicalStep {...stepProps} />;
      default:
        return null;
    }
  };

  const stepTitles = [
    "Tell us about yourself",
    "What are your health goals?",
    "Any specific health concerns?",
    "Your sleep and stress levels",
    "Your lifestyle habits",
    "Your dietary preferences",
    "Food allergies or intolerances",
    "Current supplements",
    "Medical information",
  ];

  const stepDescriptions = [
    "Help us understand your basic profile",
    "What would you like to achieve?",
    "Let us know about any health issues",
    "How well do you sleep and manage stress?",
    "Tell us about your daily habits",
    "Any dietary restrictions or preferences?",
    "Important allergy information",
    "What are you currently taking?",
    "Important health considerations",
  ];

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50">
        {/* Progress Steps Header */}
        <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-emerald-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-semibold text-sm">
                      {currentStep}
                    </span>
                  </div>
                  <span className="text-sm font-medium text-gray-500">
                    of {totalSteps}
                  </span>
                </div>
                <div className="hidden sm:block">
                  <span className="text-sm text-gray-600">
                    {Math.round((currentStep / totalSteps) * 100)}% Complete
                  </span>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm text-gray-500">Estimated time</div>
                <div className="text-sm font-medium text-gray-900">
                  {Math.max(1, 6 - currentStep)} min remaining
                </div>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
              <div
                className="bg-gradient-to-r from-emerald-500 to-emerald-600 h-2 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${(currentStep / totalSteps) * 100}%` }}
              />
            </div>

            {/* Step Indicators */}
            <div className="flex justify-between">
              {Array.from({ length: totalSteps }, (_, i) => i + 1).map(
                (step) => (
                  <div
                    key={step}
                    className={`flex flex-col items-center space-y-2 ${
                      step <= currentStep ? "text-emerald-600" : "text-gray-400"
                    }`}
                  >
                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium transition-all duration-300 ${
                        step < currentStep
                          ? "bg-emerald-600 text-white"
                          : step === currentStep
                          ? "bg-emerald-100 text-emerald-600 ring-2 ring-emerald-600"
                          : "bg-gray-200 text-gray-400"
                      }`}
                    >
                      {step < currentStep ? "✓" : step}
                    </div>
                    <div className="hidden md:block text-xs text-center max-w-16">
                      Step {step}
                    </div>
                  </div>
                )
              )}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Step Content */}
          <div
            className={`transition-all duration-300 ${
              isAnimating
                ? "opacity-0 transform translate-x-4"
                : "opacity-100 transform translate-x-0"
            }`}
          >
            <div className="text-center mb-8">
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
                {stepTitles[currentStep - 1]}
              </h1>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                {stepDescriptions[currentStep - 1]}
              </p>
            </div>

            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 md:p-12">
              {renderStep()}
            </div>
          </div>

          {/* Navigation */}
          <div className="flex justify-between items-center mt-8">
            <button
              onClick={prevStep}
              disabled={currentStep === 1}
              className={`flex items-center px-6 py-3 border border-gray-300 rounded-lg transition-colors ${
                currentStep === 1
                  ? "opacity-50 cursor-not-allowed bg-gray-100 text-gray-400"
                  : "hover:bg-gray-50 bg-white text-gray-700"
              }`}
            >
              ← Previous
            </button>

            <div className="flex items-center space-x-4">
              {currentStep < totalSteps && (
                <button
                  onClick={() => {
                    nextStep();
                  }}
                  className="text-gray-500 hover:text-gray-700 px-4 py-2"
                >
                  Skip this step
                </button>
              )}

              {currentStep === totalSteps ? (
                <button
                  onClick={handleSubmit}
                  disabled={!canProceed()}
                  className={`bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-3 rounded-lg transition-colors ${
                    !canProceed() ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  Get My Results
                </button>
              ) : (
                <button
                  onClick={nextStep}
                  disabled={!canProceed()}
                  className={`bg-emerald-600 hover:bg-emerald-700 text-white flex items-center px-8 py-3 rounded-lg transition-colors ${
                    !canProceed() ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  Continue →
                </button>
              )}
            </div>
          </div>

          {/* Help Text */}
          <div className="text-center mt-6">
            <p className="text-sm text-gray-500">
              Your information is secure and will only be used to create your
              personalized recommendations.
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

// Step Components
interface StepProps {
  quizData: QuizData;
  updateQuizData: (field: keyof QuizData, value: string | string[]) => void;
  handleArrayToggle?: (field: keyof QuizData, value: string) => void;
  isAnimating: boolean;
}

const PersonalInfoStep = ({
  quizData,
  updateQuizData,
  isAnimating,
}: StepProps) => (
  <div
    className={`space-y-8 transition-all duration-300 ${
      isAnimating ? "opacity-0" : "opacity-100"
    }`}
  >
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="space-y-2">
        <label className="block text-sm font-semibold text-gray-700">
          Age Range *
        </label>
        <select
          value={quizData.age}
          onChange={(e) => updateQuizData("age", e.target.value)}
          className={`w-full p-4 border-2 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200 font-medium ${
            quizData.age
              ? "border-emerald-500 bg-emerald-50 text-emerald-700"
              : "border-gray-200 bg-white text-gray-900 hover:border-gray-300"
          }`}
        >
          <option value="">Select your age range</option>
          <option value="18-24">18-24 years</option>
          <option value="25-34">25-34 years</option>
          <option value="35-44">35-44 years</option>
          <option value="45-54">45-54 years</option>
          <option value="55-64">55-64 years</option>
          <option value="65+">65+ years</option>
        </select>
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-semibold text-gray-700">
          Gender *
        </label>
        <select
          value={quizData.gender}
          onChange={(e) => updateQuizData("gender", e.target.value)}
          className={`w-full p-4 border-2 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200 font-medium ${
            quizData.gender
              ? "border-emerald-500 bg-emerald-50 text-emerald-700"
              : "border-gray-200 bg-white text-gray-900 hover:border-gray-300"
          }`}
        >
          <option value="">Select gender</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="other">Other</option>
          <option value="prefer-not-to-say">Prefer not to say</option>
        </select>
      </div>
    </div>

    <div className="space-y-4">
      <label className="block text-sm font-semibold text-gray-700">
        Activity Level *
      </label>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[
          {
            value: "sedentary",
            label: "Sedentary",
            desc: "Little to no exercise",
            icon: "🪑",
          },
          {
            value: "light",
            label: "Light Activity",
            desc: "Light exercise 1-3 days/week",
            icon: "🚶",
          },
          {
            value: "moderate",
            label: "Moderate Activity",
            desc: "Moderate exercise 3-5 days/week",
            icon: "🏃",
          },
          {
            value: "very-active",
            label: "Very Active",
            desc: "Hard exercise 6-7 days/week",
            icon: "💪",
          },
        ].map((option) => (
          <label
            key={option.value}
            className={`p-6 border-2 rounded-xl cursor-pointer transition-all duration-200 hover:shadow-md ${
              quizData.activityLevel === option.value
                ? "border-emerald-500 bg-emerald-50 shadow-lg"
                : "border-gray-200 hover:border-gray-300 bg-white"
            }`}
          >
            <input
              type="radio"
              name="activityLevel"
              value={option.value}
              checked={quizData.activityLevel === option.value}
              onChange={(e) => updateQuizData("activityLevel", e.target.value)}
              className="sr-only"
            />
            <div className="flex items-center space-x-3">
              <span className="text-2xl">{option.icon}</span>
              <div>
                <div className="font-semibold text-gray-900">
                  {option.label}
                </div>
                <div className="text-sm text-gray-600">{option.desc}</div>
              </div>
            </div>
          </label>
        ))}
      </div>
    </div>
  </div>
);

const HealthGoalsStep = ({
  quizData,
  handleArrayToggle,
  isAnimating,
}: StepProps) => (
  <div
    className={`space-y-8 transition-all duration-300 ${
      isAnimating ? "opacity-0" : "opacity-100"
    }`}
  >
    <div className="space-y-6">
      <label className="block text-lg font-bold text-gray-900 mb-2">
        Primary Health Goals * (Select all that apply)
      </label>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {[
          { value: "Boost immune system", icon: "🛡️" },
          { value: "Increase energy levels", icon: "⚡" },
          { value: "Improve sleep quality", icon: "😴" },
          { value: "Support heart health", icon: "❤️" },
          { value: "Enhance mental clarity", icon: "🧠" },
          { value: "Build muscle mass", icon: "💪" },
          { value: "Support weight management", icon: "⚖️" },
          { value: "Improve digestion", icon: "🌱" },
          { value: "Reduce stress", icon: "🧘" },
          { value: "Support joint health", icon: "🦴" },
          { value: "Improve skin health", icon: "✨" },
          { value: "General wellness", icon: "🌟" },
        ].map((goal) => (
          <label
            key={goal.value}
            className={`p-5 border-2 rounded-xl cursor-pointer transition-all duration-200 hover:shadow-lg text-center transform hover:scale-105 ${
              quizData.primaryGoals.includes(goal.value)
                ? "border-emerald-500 bg-emerald-50 shadow-lg"
                : "border-gray-200 hover:border-gray-300 bg-white"
            }`}
          >
            <input
              type="checkbox"
              checked={quizData.primaryGoals.includes(goal.value)}
              onChange={() => handleArrayToggle?.("primaryGoals", goal.value)}
              className="sr-only"
            />
            <div className="space-y-3">
              <div className="text-3xl">{goal.icon}</div>
              <div className="font-semibold text-sm leading-tight text-gray-900">
                {goal.value}
              </div>
              {quizData.primaryGoals.includes(goal.value) && (
                <div className="text-emerald-600 text-xs font-medium">
                  ✓ Selected
                </div>
              )}
            </div>
          </label>
        ))}
      </div>
    </div>
  </div>
);

const HealthConcernsStep = ({
  quizData,
  handleArrayToggle,
  isAnimating,
}: StepProps) => (
  <div
    className={`space-y-8 transition-all duration-300 ${
      isAnimating ? "opacity-0" : "opacity-100"
    }`}
  >
    <div className="space-y-6">
      <label className="block text-lg font-bold text-gray-900 mb-2">
        Specific Health Concerns (Optional)
      </label>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {[
          { value: "Frequent fatigue", icon: "😴" },
          { value: "Poor sleep", icon: "🌙" },
          { value: "High stress levels", icon: "😰" },
          { value: "Digestive issues", icon: "🤢" },
          { value: "Joint pain", icon: "🦴" },
          { value: "Skin problems", icon: "😔" },
          { value: "Hair/nail issues", icon: "💅" },
          { value: "Memory/focus problems", icon: "🧠" },
          { value: "Mood swings", icon: "😕" },
          { value: "Frequent illness", icon: "🤒" },
          { value: "None of the above", icon: "😊" },
        ].map((concern) => (
          <label
            key={concern.value}
            className={`p-4 border-2 rounded-xl cursor-pointer transition-all duration-200 hover:shadow-lg text-center transform hover:scale-105 ${
              quizData.specificConcerns.includes(concern.value)
                ? "border-emerald-500 bg-emerald-50 shadow-lg"
                : "border-gray-200 hover:border-gray-300 bg-white"
            }`}
          >
            <input
              type="checkbox"
              checked={quizData.specificConcerns.includes(concern.value)}
              onChange={() =>
                handleArrayToggle?.("specificConcerns", concern.value)
              }
              className="sr-only"
            />
            <div className="space-y-2">
              <div className="text-2xl">{concern.icon}</div>
              <div className="font-medium text-sm leading-tight text-gray-900">
                {concern.value}
              </div>
              {quizData.specificConcerns.includes(concern.value) && (
                <div className="text-emerald-600 text-xs font-medium">
                  ✓ Selected
                </div>
              )}
            </div>
          </label>
        ))}
      </div>
    </div>
  </div>
);

const SleepStressStep = ({
  quizData,
  updateQuizData,
  isAnimating,
}: StepProps) => (
  <div
    className={`space-y-8 transition-all duration-300 ${
      isAnimating ? "opacity-0" : "opacity-100"
    }`}
  >
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div className="space-y-6">
        <label className="block text-lg font-bold text-gray-900 mb-2">
          Sleep Hours per Night *
        </label>
        <div className="space-y-3">
          {[
            {
              value: "less-than-5",
              label: "Less than 5 hours",
              icon: "😴",
            },
            {
              value: "5-6",
              label: "5-6 hours",
              icon: "😪",
            },
            {
              value: "7-8",
              label: "7-8 hours",
              icon: "😊",
            },
            {
              value: "more-than-8",
              label: "More than 8 hours",
              icon: "😌",
            },
          ].map((option) => (
            <label
              key={option.value}
              className={`p-4 border-2 rounded-xl cursor-pointer transition-all duration-200 hover:shadow-lg flex items-center space-x-4 ${
                quizData.sleepHours === option.value
                  ? "border-emerald-500 bg-emerald-50 shadow-lg"
                  : "border-gray-200 hover:border-gray-300 bg-white"
              }`}
            >
              <input
                type="radio"
                name="sleepHours"
                value={option.value}
                checked={quizData.sleepHours === option.value}
                onChange={(e) => updateQuizData("sleepHours", e.target.value)}
                className="sr-only"
              />
              <span className="text-2xl">{option.icon}</span>
              <div className="flex-1">
                <div className="font-semibold text-gray-900">
                  {option.label}
                </div>
              </div>
              {quizData.sleepHours === option.value && (
                <div className="text-emerald-600 font-bold">✓</div>
              )}
            </label>
          ))}
        </div>
      </div>

      <div className="space-y-6">
        <label className="block text-lg font-bold text-gray-900 mb-2">
          Stress Level *
        </label>
        <div className="space-y-3">
          {[
            {
              value: "low",
              label: "Low stress",
              icon: "😌",
            },
            {
              value: "moderate",
              label: "Moderate stress",
              icon: "😐",
            },
            {
              value: "high",
              label: "High stress",
              icon: "😰",
            },
            {
              value: "very-high",
              label: "Very high stress",
              icon: "😵",
            },
          ].map((option) => (
            <label
              key={option.value}
              className={`p-4 border-2 rounded-xl cursor-pointer transition-all duration-200 hover:shadow-lg flex items-center space-x-4 ${
                quizData.stressLevel === option.value
                  ? "border-emerald-500 bg-emerald-50 shadow-lg"
                  : "border-gray-200 hover:border-gray-300 bg-white"
              }`}
            >
              <input
                type="radio"
                name="stressLevel"
                value={option.value}
                checked={quizData.stressLevel === option.value}
                onChange={(e) => updateQuizData("stressLevel", e.target.value)}
                className="sr-only"
              />
              <span className="text-2xl">{option.icon}</span>
              <div className="flex-1">
                <div className="font-semibold text-gray-900">
                  {option.label}
                </div>
              </div>
              {quizData.stressLevel === option.value && (
                <div className="text-emerald-600 font-bold">✓</div>
              )}
            </label>
          ))}
        </div>
      </div>
    </div>
  </div>
);

const LifestyleHabitsStep = ({
  quizData,
  updateQuizData,
  isAnimating,
}: StepProps) => (
  <div
    className={`space-y-8 transition-all duration-300 ${
      isAnimating ? "opacity-0" : "opacity-100"
    }`}
  >
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div className="space-y-4">
        <label className="block text-sm font-semibold text-gray-700">
          Smoking Status
        </label>
        <div className="space-y-3">
          {[
            {
              value: "never",
              label: "Never smoked",
              icon: "🚭",
            },
            {
              value: "former",
              label: "Former smoker",
              icon: "🔄",
            },
            {
              value: "current",
              label: "Current smoker",
              icon: "🚬",
            },
          ].map((option) => (
            <label
              key={option.value}
              className={`p-4 border-2 rounded-xl cursor-pointer transition-all duration-200 hover:shadow-lg flex items-center space-x-4 ${
                quizData.smokingStatus === option.value
                  ? "border-emerald-500 bg-emerald-50 shadow-lg"
                  : "border-gray-200 hover:border-gray-300 bg-white"
              }`}
            >
              <input
                type="radio"
                name="smokingStatus"
                value={option.value}
                checked={quizData.smokingStatus === option.value}
                onChange={(e) =>
                  updateQuizData("smokingStatus", e.target.value)
                }
                className="sr-only"
              />
              <span className="text-2xl">{option.icon}</span>
              <div className="flex-1">
                <div className="font-semibold text-gray-900">
                  {option.label}
                </div>
              </div>
              {quizData.smokingStatus === option.value && (
                <div className="text-emerald-600 font-bold">✓</div>
              )}
            </label>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <label className="block text-sm font-semibold text-gray-700">
          Alcohol Consumption
        </label>
        <div className="space-y-3">
          {[
            {
              value: "never",
              label: "Never",
              icon: "🚫",
            },
            {
              value: "rarely",
              label: "Rarely",
              icon: "🥂",
            },
            {
              value: "moderate",
              label: "Moderate",
              icon: "🍷",
            },
            {
              value: "frequent",
              label: "Frequent",
              icon: "🍻",
            },
          ].map((option) => (
            <label
              key={option.value}
              className={`p-4 border-2 rounded-xl cursor-pointer transition-all duration-200 hover:shadow-lg flex items-center space-x-4 ${
                quizData.alcoholConsumption === option.value
                  ? "border-emerald-500 bg-emerald-50 shadow-lg"
                  : "border-gray-200 hover:border-gray-300 bg-white"
              }`}
            >
              <input
                type="radio"
                name="alcoholConsumption"
                value={option.value}
                checked={quizData.alcoholConsumption === option.value}
                onChange={(e) =>
                  updateQuizData("alcoholConsumption", e.target.value)
                }
                className="sr-only"
              />
              <span className="text-2xl">{option.icon}</span>
              <div className="flex-1">
                <div className="font-semibold text-gray-900">
                  {option.label}
                </div>
              </div>
              {quizData.alcoholConsumption === option.value && (
                <div className="text-emerald-600 font-bold">✓</div>
              )}
            </label>
          ))}
        </div>
      </div>
    </div>
  </div>
);

const DietaryStep = ({
  quizData,
  updateQuizData,
  handleArrayToggle,
  isAnimating,
}: StepProps) => (
  <div
    className={`space-y-8 transition-all duration-300 ${
      isAnimating ? "opacity-0" : "opacity-100"
    }`}
  >
    <div className="space-y-4">
      <label className="block text-sm font-semibold text-gray-700">
        Dietary Preference *
      </label>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[
          {
            value: "omnivore",
            label: "Omnivore",
            desc: "I eat everything",
            icon: "🍽️",
          },
          {
            value: "vegetarian",
            label: "Vegetarian",
            desc: "No meat, but eat dairy/eggs",
            icon: "🥗",
          },
          {
            value: "vegan",
            label: "Vegan",
            desc: "No animal products",
            icon: "🌱",
          },
          {
            value: "pescatarian",
            label: "Pescatarian",
            desc: "Fish but no meat",
            icon: "🐟",
          },
          {
            value: "keto",
            label: "Ketogenic",
            desc: "High fat, low carb",
            icon: "🥑",
          },
          {
            value: "paleo",
            label: "Paleo",
            desc: "Whole foods, no processed",
            icon: "🥩",
          },
        ].map((diet) => (
          <label
            key={diet.value}
            className={`p-6 border-2 rounded-xl cursor-pointer transition-all duration-200 hover:shadow-md ${
              quizData.dietType === diet.value
                ? "border-emerald-500 bg-emerald-50 shadow-lg"
                : "border-gray-200 hover:border-gray-300 bg-white"
            }`}
          >
            <input
              type="radio"
              name="dietType"
              value={diet.value}
              checked={quizData.dietType === diet.value}
              onChange={(e) => updateQuizData("dietType", e.target.value)}
              className="sr-only"
            />
            <div className="flex items-center space-x-3">
              <span className="text-2xl">{diet.icon}</span>
              <div>
                <div className="font-semibold text-gray-900">{diet.label}</div>
                <div className="text-sm text-gray-600">{diet.desc}</div>
              </div>
            </div>
          </label>
        ))}
      </div>
    </div>
  </div>
);

const AllergiesStep = ({
  quizData,
  handleArrayToggle,
  isAnimating,
}: StepProps) => (
  <div
    className={`space-y-8 transition-all duration-300 ${
      isAnimating ? "opacity-0" : "opacity-100"
    }`}
  >
    <div className="space-y-6">
      <label className="block text-lg font-bold text-gray-900 mb-2">
        Food Allergies or Intolerances (Optional)
      </label>
      <div className="grid grid-cols-3 md:grid-cols-4 gap-4">
        {[
          { value: "Dairy/Lactose", icon: "🥛" },
          { value: "Gluten", icon: "🌾" },
          { value: "Nuts", icon: "🥜" },
          { value: "Shellfish", icon: "🦐" },
          { value: "Soy", icon: "🫘" },
          { value: "Eggs", icon: "🥚" },
          { value: "Fish", icon: "🐟" },
          { value: "Sesame", icon: "🌰" },
          { value: "None", icon: "✅" },
        ].map((allergy) => (
          <label
            key={allergy.value}
            className={`p-4 border-2 rounded-xl cursor-pointer transition-all duration-200 hover:shadow-lg text-center transform hover:scale-105 ${
              quizData.allergies.includes(allergy.value)
                ? "border-emerald-500 bg-emerald-50 shadow-lg"
                : "border-gray-200 hover:border-gray-300 bg-white"
            }`}
          >
            <input
              type="checkbox"
              checked={quizData.allergies.includes(allergy.value)}
              onChange={() => handleArrayToggle?.("allergies", allergy.value)}
              className="sr-only"
            />
            <div className="space-y-2">
              <div className="text-2xl">{allergy.icon}</div>
              <div className="font-medium text-sm leading-tight text-gray-900">
                {allergy.value}
              </div>
              {quizData.allergies.includes(allergy.value) && (
                <div className="text-emerald-600 text-xs font-medium">
                  ✓ Selected
                </div>
              )}
            </div>
          </label>
        ))}
      </div>
    </div>
  </div>
);

const SupplementsStep = ({
  quizData,
  handleArrayToggle,
  isAnimating,
}: StepProps) => (
  <div
    className={`space-y-6 transition-all duration-300 ${
      isAnimating ? "opacity-0" : "opacity-100"
    }`}
  >
    <div className="text-center p-6 bg-blue-50 rounded-xl border border-blue-200">
      <div className="text-blue-600 text-lg font-medium mb-2">
        💡 This helps us avoid duplicates
      </div>
      <p className="text-blue-700">
        Tell us what you're currently taking so we can create a complementary
        plan
      </p>
    </div>

    <div className="space-y-4">
      <label className="block text-sm font-semibold text-gray-700">
        Current Supplements (Select all that apply)
      </label>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          "Multivitamin",
          "Vitamin D",
          "Vitamin C",
          "B-Complex",
          "Omega-3",
          "Probiotics",
          "Magnesium",
          "Calcium",
          "Iron",
          "Zinc",
          "Protein Powder",
          "Creatine",
          "CoQ10",
          "Turmeric",
          "Ashwagandha",
          "Melatonin",
          "None",
        ].map((supplement) => (
          <label
            key={supplement}
            className={`p-3 border-2 rounded-lg cursor-pointer transition-all duration-200 hover:shadow-sm text-center ${
              quizData.supplements.includes(supplement)
                ? "border-emerald-500 bg-emerald-50"
                : "border-gray-200 hover:border-gray-300 bg-white"
            }`}
          >
            <input
              type="checkbox"
              checked={quizData.supplements.includes(supplement)}
              onChange={() => handleArrayToggle?.("supplements", supplement)}
              className="sr-only"
            />
            <div className="font-medium text-gray-900 text-sm">
              {supplement}
            </div>
          </label>
        ))}
      </div>
    </div>
  </div>
);

const MedicalStep = ({
  quizData,
  updateQuizData,
  handleArrayToggle,
  isAnimating,
}: StepProps) => (
  <div
    className={`space-y-8 transition-all duration-300 ${
      isAnimating ? "opacity-0" : "opacity-100"
    }`}
  >
    <div className="space-y-4">
      <label className="block text-sm font-semibold text-gray-700">
        Are you currently pregnant or nursing? *
      </label>
      <div className="flex gap-4">
        {["Yes", "No", "Not applicable"].map((option) => (
          <label
            key={option}
            className={`flex-1 p-4 border-2 rounded-xl cursor-pointer transition-all duration-200 hover:shadow-sm text-center ${
              quizData.pregnantOrNursing === option
                ? "border-emerald-500 bg-emerald-50"
                : "border-gray-200 hover:border-gray-300 bg-white"
            }`}
          >
            <input
              type="radio"
              name="pregnantOrNursing"
              value={option}
              checked={quizData.pregnantOrNursing === option}
              onChange={(e) =>
                updateQuizData("pregnantOrNursing", e.target.value)
              }
              className="sr-only"
            />
            <div className="font-medium text-gray-900">{option}</div>
          </label>
        ))}
      </div>
    </div>

    <div className="space-y-4">
      <label className="block text-sm font-semibold text-gray-700">
        Medical Conditions (Optional)
      </label>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {[
          "Diabetes",
          "High blood pressure",
          "Heart disease",
          "Thyroid disorder",
          "Kidney disease",
          "Liver disease",
          "Autoimmune condition",
          "Depression/Anxiety",
          "Osteoporosis",
          "Anemia",
          "None of the above",
        ].map((condition) => (
          <label
            key={condition}
            className={`p-4 border-2 rounded-lg cursor-pointer transition-all duration-200 hover:shadow-sm ${
              quizData.medicalConditions.includes(condition)
                ? "border-emerald-500 bg-emerald-50"
                : "border-gray-200 hover:border-gray-300 bg-white"
            }`}
          >
            <input
              type="checkbox"
              checked={quizData.medicalConditions.includes(condition)}
              onChange={() =>
                handleArrayToggle?.("medicalConditions", condition)
              }
              className="sr-only"
            />
            <div className="font-medium text-gray-900">{condition}</div>
          </label>
        ))}
      </div>
    </div>
  </div>
);

export default Quiz;
