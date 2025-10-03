// app/faq/page.tsx - FAQ page with schema markup

import { Metadata } from "next";
import { Card } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { HelpCircle } from "lucide-react";

export const metadata: Metadata = {
  title: "Frequently Asked Questions - DealHunter",
  description:
    "Find answers to common questions about DealHunter, how to use coupons, submit deals, and more.",
  keywords: "FAQ, help, support, deals, coupons, how to use",
  openGraph: {
    title: "Frequently Asked Questions - DealHunter",
    description:
      "Find answers to common questions about DealHunter, how to use coupons, submit deals, and more.",
    type: "website",
    url: "https://dealbies.com/faq",
    siteName: "DealHunter",
  },
  twitter: {
    card: "summary_large_image",
    title: "Frequently Asked Questions - DealHunter",
    description:
      "Find answers to common questions about DealHunter, how to use coupons, submit deals, and more.",
  },
  alternates: {
    canonical: "/faq",
  },
};

const faqData = [
  {
    question: "What is DealHunter?",
    answer:
      "DealHunter is a community-driven platform where users can discover, share, and discuss the best deals, discounts, and coupon codes from various retailers. Our platform helps you save money on your favorite products and services.",
  },
  {
    question: "How do I use a coupon code?",
    answer:
      "To use a coupon code: 1) Find a coupon you want to use, 2) Click the 'Copy' button to copy the code, 3) Visit the retailer's website, 4) Add items to your cart, 5) During checkout, paste the coupon code in the designated field, 6) Apply the code and enjoy your savings!",
  },
  {
    question: "How do I submit a deal?",
    answer:
      "To submit a deal: 1) Click on 'Submit Deal' in the navigation, 2) Fill out the deal form with title, description, price, original price, merchant, and category, 3) Upload product images, 4) Add the deal URL, 5) Submit for review. Our team will verify the deal before publishing.",
  },
  {
    question: "Are the deals verified?",
    answer:
      "Yes, we verify deals before publishing them. Our team checks deal URLs, prices, and availability to ensure accuracy. However, deals can expire or change, so we recommend checking the retailer's website before making a purchase.",
  },
  {
    question: "How do I create an account?",
    answer:
      "Creating an account is easy: 1) Click 'Sign Up' in the top navigation, 2) Choose to sign up with Google or create an account with email, 3) Complete your profile, 4) Start discovering and sharing deals!",
  },
  {
    question: "Can I earn points or rewards?",
    answer:
      "Yes! You can earn points by submitting deals, commenting, voting, and participating in discussions. Points can be redeemed for rewards and help you gain recognition in the community.",
  },
  {
    question: "How do I report an expired deal?",
    answer:
      "If you find an expired deal, you can report it by clicking the 'Report' button on the deal page or by contacting our support team. We'll review and update the deal status accordingly.",
  },
  {
    question: "Is DealHunter free to use?",
    answer:
      "Yes, DealHunter is completely free to use. You can browse deals, use coupon codes, submit deals, and participate in the community without any cost.",
  },
  {
    question: "How do I search for specific deals?",
    answer:
      "Use our search feature to find specific deals: 1) Click the search icon in the navigation, 2) Type keywords related to the product or brand you're looking for, 3) Filter results by category, price range, or merchant, 4) Browse the results to find the perfect deal.",
  },
  {
    question: "Can I follow specific users?",
    answer:
      "Yes, you can follow users whose deals you find valuable. Visit their profile page and click the 'Follow' button to stay updated with their latest submissions.",
  },
];

export default function FAQPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-12">
        <div className="flex items-center justify-center mb-4">
          <HelpCircle className="h-12 w-12 text-blue-600 dark:text-blue-400" />
        </div>
        <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
          Frequently Asked Questions
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400">
          Find answers to common questions about DealHunter
        </p>
      </div>

      {/* FAQ Accordion */}
      <Card className="p-6">
        <Accordion type="single" collapsible className="w-full">
          {faqData.map((faq, index) => (
            <AccordionItem key={index} value={`item-${index}`}>
              <AccordionTrigger className="text-left">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-gray-600 dark:text-gray-400">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </Card>

      {/* Schema Markup */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: faqData.map((faq) => ({
              "@type": "Question",
              name: faq.question,
              acceptedAnswer: {
                "@type": "Answer",
                text: faq.answer,
              },
            })),
          }),
        }}
      />
    </div>
  );
}
