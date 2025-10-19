import { Metadata } from "next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  HelpCircle,
  Search,
  ShoppingBag,
  Users,
  Shield,
  Mail,
  ExternalLink,
  CheckCircle,
} from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Frequently Asked Questions - Dealbies",
  description:
    "Find answers to common questions about Dealbies, how to use coupons, submit deals, and more.",
  keywords: "FAQ, help, support, deals, coupons, how to use",
  openGraph: {
    title: "Frequently Asked Questions - Dealbies",
    description:
      "Find answers to common questions about Dealbies, how to use coupons, submit deals, and more.",
    type: "website",
    url: "https://dealbies.com/faq",
    siteName: "Dealbies",
  },
  twitter: {
    card: "summary_large_image",
    title: "Frequently Asked Questions - Dealbies",
    description:
      "Find answers to common questions about Dealbies, how to use coupons, submit deals, and more.",
  },
  alternates: {
    canonical: "/faq",
  },
};

const faqData = [
  {
    category: "General",
    icon: HelpCircle,
    questions: [
      {
        question: "What is Dealbies?",
        answer:
          "Dealbies is a community-driven platform where users can discover, share, and discuss the best deals, discounts, and coupon codes from various retailers. Our platform helps you save money on your favorite products and services.",
      },
      {
        question: "Is Dealbies free to use?",
        answer:
          "Yes! Dealbies is completely free to use. You can browse deals, use coupon codes, and participate in our community without any cost. We make money through affiliate partnerships with retailers.",
      },
      {
        question: "How do I create an account?",
        answer:
          "Creating an account is easy! Click the 'Sign Up' button in the top right corner, enter your email and create a password, or sign up with Google for faster registration.",
      },
    ],
  },
  {
    category: "Using Coupons",
    icon: ShoppingBag,
    questions: [
      {
        question: "How do I use a coupon code?",
        answer:
          "To use a coupon code: 1) Find a coupon you want to use, 2) Click the 'Copy' button to copy the code, 3) Visit the retailer's website, 4) Add items to your cart, 5) During checkout, paste the coupon code in the designated field, 6) Apply the code and enjoy your savings!",
      },
      {
        question: "Why didn't my coupon code work?",
        answer:
          "Coupon codes may not work for several reasons: they may have expired, reached usage limits, don't apply to your specific items, or have specific terms and conditions. Always check the coupon details and retailer's terms.",
      },
      {
        question: "Are all coupon codes verified?",
        answer:
          "We do our best to verify coupon codes, but we cannot guarantee 100% accuracy. Codes may expire or become invalid without notice. Always check with the retailer if a code doesn't work.",
      },
    ],
  },
  {
    category: "Submitting Deals",
    icon: Users,
    questions: [
      {
        question: "How do I submit a deal?",
        answer:
          "To submit a deal: 1) Click 'Submit Deal' in the navigation, 2) Choose between 'Discount Code' or 'Offer', 3) Fill in the deal details including title, description, and URL, 4) Add any relevant images, 5) Submit for review. Our team will verify and publish valid deals.",
      },
      {
        question: "How long does it take for my deal to be published?",
        answer:
          "We typically review and publish deals within 24-48 hours during business days. Complex deals or those requiring verification may take longer. You'll receive an email notification once your deal is published.",
      },
      {
        question: "Can I edit or delete my submitted deal?",
        answer:
          "Yes, you can edit or delete your deals from your profile page. Go to 'My Deals' section to manage your submissions. Note that published deals may take a few minutes to update across the site.",
      },
    ],
  },
  {
    category: "Account & Security",
    icon: Shield,
    questions: [
      {
        question: "How do I reset my password?",
        answer:
          "Click 'Forgot Password' on the login page, enter your email address, and we'll send you a password reset link. Check your spam folder if you don't receive the email within a few minutes.",
      },
      {
        question: "Is my personal information safe?",
        answer:
          "Yes, we take your privacy seriously. We use industry-standard encryption and security measures to protect your data. We never sell your personal information to third parties. See our Privacy Policy for more details.",
      },
      {
        question: "How do I delete my account?",
        answer:
          "To delete your account, go to Settings > Account Settings and click 'Delete Account'. This action is irreversible and will remove all your data, including submitted deals and comments.",
      },
    ],
  },
];

export default function FAQPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 dark:from-gray-900 dark:to-gray-800">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <HelpCircle className="h-16 w-16 mx-auto mb-6" />
          <h1 className="text-4xl font-bold mb-4">
            Frequently Asked Questions
          </h1>
          <p className="text-xl opacity-90 mb-4">
            Find answers to common questions about Dealbies
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Badge variant="secondary" className="px-4 py-2 text-lg">
              <CheckCircle className="mr-2 h-5 w-5" />
              Quick Answers
            </Badge>
            <Badge variant="secondary" className="px-4 py-2 text-lg">
              <Users className="mr-2 h-5 w-5" />
              Community Help
            </Badge>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-16">
        {/* FAQ Categories */}
        <div className="space-y-8">
          {faqData.map((category, categoryIndex) => {
            const IconComponent = category.icon;
            return (
              <Card key={categoryIndex}>
                <CardHeader>
                  <CardTitle className="flex items-center text-2xl">
                    <div className="bg-orange-100 dark:bg-orange-900/30 rounded-full p-3 mr-4">
                      <IconComponent className="h-6 w-6 text-orange-500" />
                    </div>
                    {category.category}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Accordion type="single" collapsible className="w-full">
                    {category.questions.map((faq, faqIndex) => (
                      <AccordionItem
                        key={faqIndex}
                        value={`item-${categoryIndex}-${faqIndex}`}
                      >
                        <AccordionTrigger className="text-left font-semibold">
                          {faq.question}
                        </AccordionTrigger>
                        <AccordionContent className="text-gray-600 dark:text-gray-300 pt-2">
                          {faq.answer}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Quick Links */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="text-center hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <Search className="h-12 w-12 text-orange-500 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                Search Deals
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Can't find what you're looking for? Use our search feature to
                find specific deals.
              </p>
              <Button asChild variant="outline" className="w-full">
                <Link href="/search">Search Now</Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="text-center hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <Mail className="h-12 w-12 text-orange-500 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                Contact Support
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Still have questions? Our support team is here to help you.
              </p>
              <Button asChild variant="outline" className="w-full">
                <Link href="/contact">Contact Us</Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="text-center hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <Users className="h-12 w-12 text-orange-500 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                Join Community
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Connect with other deal hunters and get help from the community.
              </p>
              <Button asChild variant="outline" className="w-full">
                <Link href="/discussion">Join Discussion</Link>
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Additional Help */}
        <Card className="mt-16 bg-gradient-to-r from-orange-50 to-red-50 dark:from-gray-800 dark:to-gray-700">
          <CardContent className="p-8 text-center">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Still Need Help?
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              If you can't find the answer you're looking for, we're here to
              help!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                asChild
                size="lg"
                className="bg-orange-500 hover:bg-orange-600 text-white"
              >
                <Link href="/contact">
                  <Mail className="mr-2 h-5 w-5" />
                  Contact Support
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href="/discussion">
                  <Users className="mr-2 h-5 w-5" />
                  Ask Community
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
