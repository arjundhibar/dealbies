import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  FileText,
  AlertTriangle,
  Shield,
  Scale,
  Users,
  ExternalLink,
} from "lucide-react";

export default function Terms() {
  const lastUpdated = "January 1, 2025";

  const sections = [
    {
      title: "Acceptance of Terms",
      icon: FileText,
      content: [
        "By accessing and using Dealbies.com, you accept and agree to be bound by the terms and provision of this agreement.",
        "If you do not agree to abide by the above, please do not use this service.",
        "These terms apply to all visitors, users, and others who access or use the service.",
      ],
    },
    {
      title: "Use License",
      icon: Shield,
      content: [
        "Permission is granted to temporarily download one copy of Dealbies materials for personal, non-commercial transitory viewing only.",
        "This is the grant of a license, not a transfer of title, and under this license you may not modify or copy the materials.",
        "Use the materials for any commercial purpose or for any public display (commercial or non-commercial).",
        "Attempt to decompile or reverse engineer any software contained on Dealbies website.",
      ],
    },
    {
      title: "Disclaimer",
      icon: AlertTriangle,
      content: [
        "The materials on Dealbies website are provided on an 'as is' basis.",
        "Dealbies makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.",
        "Further, Dealbies does not warrant or make any representations concerning the accuracy, likely results, or reliability of the use of the materials on its website or otherwise relating to such materials or on any sites linked to this site.",
      ],
    },
    {
      title: "Limitations",
      icon: Scale,
      content: [
        "In no event shall Dealbies or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on Dealbies website.",
        "Even if Dealbies or a Dealbies authorized representative has been notified orally or in writing of the possibility of such damage.",
        "Because some jurisdictions do not allow limitations on implied warranties, or limitations of liability for consequential or incidental damages, these limitations may not apply to you.",
      ],
    },
  ];

  const userResponsibilities = [
    "Provide accurate and truthful information when creating an account",
    "Maintain the security of your account credentials",
    "Use the service in compliance with all applicable laws",
    "Respect the intellectual property rights of others",
    "Not engage in fraudulent or deceptive practices",
    "Report any suspicious or inappropriate content",
  ];

  const prohibitedUses = [
    "Violating any applicable laws or regulations",
    "Transmitting harmful or malicious code",
    "Attempting to gain unauthorized access to our systems",
    "Interfering with the proper functioning of the service",
    "Creating multiple accounts to circumvent restrictions",
    "Using automated systems to access the service without permission",
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 dark:from-gray-900 dark:to-gray-800">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <FileText className="h-16 w-16 mx-auto mb-6" />
          <h1 className="text-4xl font-bold mb-4">
            Terms of Service & Disclaimer
          </h1>
          <p className="text-xl opacity-90 mb-4">
            Please read these terms carefully before using our service.
          </p>
          <Badge variant="secondary" className="px-4 py-2 text-lg">
            Last Updated: {lastUpdated}
          </Badge>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-16">
        {/* Introduction */}
        <Card className="mb-8">
          <CardContent className="p-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Introduction
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Welcome to Dealbies.com. These Terms of Service ("Terms") govern
              your use of our website and services. By accessing or using our
              service, you agree to be bound by these Terms.
            </p>
            <p className="text-gray-600 dark:text-gray-300">
              If you disagree with any part of these terms, then you may not
              access the service.
            </p>
          </CardContent>
        </Card>

        {/* Main Sections */}
        <div className="space-y-8">
          {sections.map((section, index) => {
            const IconComponent = section.icon;
            return (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="flex items-center text-xl">
                    <IconComponent className="h-6 w-6 text-orange-500 mr-3" />
                    {section.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {section.content.map((item, itemIndex) => (
                      <li key={itemIndex} className="flex items-start">
                        <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 mr-3 flex-shrink-0" />
                        <span className="text-gray-600 dark:text-gray-300">
                          {item}
                        </span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* User Responsibilities */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="flex items-center text-xl">
              <Users className="h-6 w-6 text-orange-500 mr-3" />
              User Responsibilities
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              As a user of our service, you agree to:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {userResponsibilities.map((responsibility, index) => (
                <div
                  key={index}
                  className="flex items-start p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
                >
                  <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 mr-3 flex-shrink-0" />
                  <span className="text-gray-700 dark:text-gray-300">
                    {responsibility}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Prohibited Uses */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="flex items-center text-xl">
              <AlertTriangle className="h-6 w-6 text-red-500 mr-3" />
              Prohibited Uses
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              You may not use our service:
            </p>
            <ul className="space-y-2">
              {prohibitedUses.map((use, index) => (
                <li key={index} className="flex items-start">
                  <div className="w-2 h-2 bg-red-500 rounded-full mt-2 mr-3 flex-shrink-0" />
                  <span className="text-gray-600 dark:text-gray-300">
                    {use}
                  </span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* Deal Disclaimer */}
        <Card className="mt-8 bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20">
          <CardHeader>
            <CardTitle className="flex items-center text-xl text-yellow-800 dark:text-yellow-200">
              <AlertTriangle className="h-6 w-6 text-yellow-600 mr-3" />
              Deal Disclaimer
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-yellow-800 dark:text-yellow-200">
                <strong>Important:</strong> All deals, coupons, and offers
                displayed on Dealbies are provided for informational purposes
                only. We do not guarantee the accuracy, availability, or
                validity of any deals or offers.
              </p>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-yellow-600 rounded-full mt-2 mr-3 flex-shrink-0" />
                  <span className="text-yellow-800 dark:text-yellow-200">
                    Deals may expire or become unavailable without notice
                  </span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-yellow-600 rounded-full mt-2 mr-3 flex-shrink-0" />
                  <span className="text-yellow-800 dark:text-yellow-200">
                    Terms and conditions may vary by retailer
                  </span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-yellow-600 rounded-full mt-2 mr-3 flex-shrink-0" />
                  <span className="text-yellow-800 dark:text-yellow-200">
                    Always verify deal details directly with the retailer
                  </span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-yellow-600 rounded-full mt-2 mr-3 flex-shrink-0" />
                  <span className="text-yellow-800 dark:text-yellow-200">
                    We are not responsible for any issues with third-party
                    retailers
                  </span>
                </li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Affiliate Disclosure */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="text-2xl">Affiliate Disclosure</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Dealbies participates in various affiliate marketing programs,
              which means we may earn commissions on purchases made through our
              links to retailer websites.
            </p>
            <ul className="space-y-2 mb-6">
              <li className="flex items-start">
                <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 mr-3 flex-shrink-0" />
                <span className="text-gray-600 dark:text-gray-300">
                  This does not affect the price you pay for products
                </span>
              </li>
              <li className="flex items-start">
                <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 mr-3 flex-shrink-0" />
                <span className="text-gray-600 dark:text-gray-300">
                  We only recommend products and services we believe in
                </span>
              </li>
              <li className="flex items-start">
                <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 mr-3 flex-shrink-0" />
                <span className="text-gray-600 dark:text-gray-300">
                  Our editorial content is not influenced by affiliate
                  relationships
                </span>
              </li>
            </ul>
            <div className="p-4 bg-orange-50 dark:bg-orange-900/30 rounded-lg">
              <p className="text-gray-700 dark:text-gray-300">
                <strong>Transparency:</strong> We believe in full transparency.
                All affiliate links are clearly marked, and we disclose our
                affiliate relationships where appropriate.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Termination */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="text-2xl">Termination</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              We may terminate or suspend your account and bar access to the
              service immediately, without prior notice or liability, under our
              sole discretion, for any reason whatsoever and without limitation,
              including but not limited to a breach of the Terms.
            </p>
            <p className="text-gray-600 dark:text-gray-300">
              If you wish to terminate your account, you may simply discontinue
              using the service or contact us to request account deletion.
            </p>
          </CardContent>
        </Card>

        {/* Changes to Terms */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="text-2xl">Changes to Terms</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 dark:text-gray-300">
              We reserve the right, at our sole discretion, to modify or replace
              these Terms at any time. If a revision is material, we will
              provide at least 30 days notice prior to any new terms taking
              effect. What constitutes a material change will be determined at
              our sole discretion.
            </p>
          </CardContent>
        </Card>

        {/* Contact Information */}
        <Card className="mt-8 bg-gradient-to-r from-orange-50 to-red-50 dark:from-gray-800 dark:to-gray-700">
          <CardContent className="p-8">
            <div className="text-center">
              <ExternalLink className="h-12 w-12 text-orange-500 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                Questions About These Terms?
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                If you have any questions about these Terms of Service, please
                contact us.
              </p>
              <div className="space-y-2">
                <p className="text-gray-700 dark:text-gray-300">
                  <strong>Email:</strong>{" "}
                  <a
                    href="mailto:legal@dealbies.com"
                    className="text-orange-500 hover:text-orange-600"
                  >
                    legal@dealbies.com
                  </a>
                </p>
                <p className="text-gray-700 dark:text-gray-300">
                  <strong>Address:</strong> 123 Deal Street, Amsterdam,
                  Netherlands
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
