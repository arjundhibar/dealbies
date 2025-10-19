import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Shield, Eye, Lock, Database, Users, Mail } from "lucide-react";

export default function PrivacyPolicy() {
  const lastUpdated = "January 1, 2024";

  const sections = [
    {
      title: "Information We Collect",
      icon: Database,
      content: [
        "Personal information you provide (name, email, username)",
        "Deal and coupon interaction data",
        "Device and browser information",
        "Usage analytics and preferences",
        "Payment information (processed securely by third parties)",
      ],
    },
    {
      title: "How We Use Your Information",
      icon: Eye,
      content: [
        "Provide personalized deal recommendations",
        "Improve our services and user experience",
        "Send relevant notifications and updates",
        "Process transactions and manage accounts",
        "Comply with legal obligations",
      ],
    },
    {
      title: "Information Sharing",
      icon: Users,
      content: [
        "We never sell your personal data to third parties",
        "Share data with trusted service providers only",
        "Disclose information when required by law",
        "Share aggregated, anonymized data for analytics",
        "Partner with retailers for deal verification",
      ],
    },
    {
      title: "Data Security",
      icon: Lock,
      content: [
        "Industry-standard encryption for data transmission",
        "Secure servers with regular security updates",
        "Limited access to personal information",
        "Regular security audits and monitoring",
        "Secure payment processing through trusted partners",
      ],
    },
  ];

  const rights = [
    "Access your personal data",
    "Correct inaccurate information",
    "Delete your account and data",
    "Export your data",
    "Opt-out of marketing communications",
    "Withdraw consent for data processing",
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 dark:from-gray-900 dark:to-gray-800">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <Shield className="h-16 w-16 mx-auto mb-6" />
          <h1 className="text-4xl font-bold mb-4">Privacy Policy</h1>
          <p className="text-xl opacity-90 mb-4">
            Your privacy is important to us. This policy explains how we
            collect, use, and protect your information.
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
              At Dealbies, we are committed to protecting your privacy and
              ensuring the security of your personal information. This Privacy
              Policy explains how we collect, use, disclose, and safeguard your
              information when you use our website and services.
            </p>
            <p className="text-gray-600 dark:text-gray-300">
              By using our services, you agree to the collection and use of
              information in accordance with this policy. If you do not agree
              with our policies and practices, please do not use our services.
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

        {/* Your Rights */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="text-2xl">Your Privacy Rights</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Under applicable data protection laws, you have the following
              rights regarding your personal information:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {rights.map((right, index) => (
                <div
                  key={index}
                  className="flex items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
                >
                  <div className="w-2 h-2 bg-orange-500 rounded-full mr-3" />
                  <span className="text-gray-700 dark:text-gray-300">
                    {right}
                  </span>
                </div>
              ))}
            </div>
            <div className="mt-6 p-4 bg-orange-50 dark:bg-orange-900/30 rounded-lg">
              <p className="text-gray-700 dark:text-gray-300">
                <strong>To exercise these rights:</strong> Contact us at{" "}
                <a
                  href="mailto:privacy@dealbies.com"
                  className="text-orange-500 hover:text-orange-600"
                >
                  privacy@dealbies.com
                </a>{" "}
                or use the contact form on our website.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Cookies */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="text-2xl">Cookies and Tracking</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              We use cookies and similar tracking technologies to enhance your
              experience on our website:
            </p>
            <ul className="space-y-2 mb-6">
              <li className="flex items-start">
                <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 mr-3 flex-shrink-0" />
                <span className="text-gray-600 dark:text-gray-300">
                  <strong>Essential Cookies:</strong> Required for basic website
                  functionality
                </span>
              </li>
              <li className="flex items-start">
                <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 mr-3 flex-shrink-0" />
                <span className="text-gray-600 dark:text-gray-300">
                  <strong>Analytics Cookies:</strong> Help us understand how you
                  use our website
                </span>
              </li>
              <li className="flex items-start">
                <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 mr-3 flex-shrink-0" />
                <span className="text-gray-600 dark:text-gray-300">
                  <strong>Preference Cookies:</strong> Remember your settings
                  and preferences
                </span>
              </li>
            </ul>
            <p className="text-gray-600 dark:text-gray-300">
              You can control cookie settings through your browser preferences.
              Note that disabling certain cookies may affect website
              functionality.
            </p>
          </CardContent>
        </Card>

        {/* Third-Party Services */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="text-2xl">Third-Party Services</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              We may use third-party services that have their own privacy
              policies:
            </p>
            <ul className="space-y-2 mb-6">
              <li className="flex items-start">
                <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 mr-3 flex-shrink-0" />
                <span className="text-gray-600 dark:text-gray-300">
                  <strong>Payment Processors:</strong> For secure transaction
                  processing
                </span>
              </li>
              <li className="flex items-start">
                <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 mr-3 flex-shrink-0" />
                <span className="text-gray-600 dark:text-gray-300">
                  <strong>Analytics Providers:</strong> For website usage
                  analysis
                </span>
              </li>
              <li className="flex items-start">
                <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 mr-3 flex-shrink-0" />
                <span className="text-gray-600 dark:text-gray-300">
                  <strong>Email Services:</strong> For communication and
                  notifications
                </span>
              </li>
            </ul>
            <p className="text-gray-600 dark:text-gray-300">
              We ensure all third-party services comply with applicable privacy
              laws and maintain appropriate security measures.
            </p>
          </CardContent>
        </Card>

        {/* Contact Information */}
        <Card className="mt-8 bg-gradient-to-r from-orange-50 to-red-50 dark:from-gray-800 dark:to-gray-700">
          <CardContent className="p-8">
            <div className="text-center">
              <Mail className="h-12 w-12 text-orange-500 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                Questions About Privacy?
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                If you have any questions about this Privacy Policy or our data
                practices, please don't hesitate to contact us.
              </p>
              <div className="space-y-2">
                <p className="text-gray-700 dark:text-gray-300">
                  <strong>Email:</strong>{" "}
                  <a
                    href="mailto:privacy@dealbies.com"
                    className="text-orange-500 hover:text-orange-600"
                  >
                    privacy@dealbies.com
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

        {/* Policy Updates */}
        <Card className="mt-8">
          <CardContent className="p-6">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
              Policy Updates
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              We may update this Privacy Policy from time to time. We will
              notify you of any changes by posting the new Privacy Policy on
              this page and updating the "Last Updated" date. You are advised to
              review this Privacy Policy periodically for any changes.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
