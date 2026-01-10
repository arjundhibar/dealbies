import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  AlertTriangle,
  FileText,
  Shield,
  ExternalLink,
  Info,
  Scale,
  ShoppingBag,
  Mail,
  Users,
} from "lucide-react";

export default function Disclaimer() {
  const lastUpdated = "January 1, 2025";

  const sections = [
    {
      title: "General Disclaimer",
      icon: FileText,
      content: [
        "The information on this website is provided on an 'as is' basis. To the fullest extent permitted by law, Dealbies excludes all representations, warranties, obligations, and liabilities arising out of or in connection with this website.",
        "Dealbies does not warrant, endorse, guarantee, or assume responsibility for any product or service advertised or offered by a third party through the website or any hyperlinked website.",
        "We reserve the right to make additions, deletions, or modifications to the contents of this website at any time without prior notice.",
      ],
    },
    {
      title: "Deal and Coupon Accuracy",
      icon: ShoppingBag,
      content: [
        "All deals, discounts, coupon codes, and offers displayed on Dealbies are provided for informational purposes only.",
        "We do not guarantee the accuracy, availability, validity, or effectiveness of any deals, coupons, or offers.",
        "Deals may expire, become unavailable, or have their terms changed without notice.",
        "Coupon codes may have usage limits, expiration dates, or specific terms and conditions that we may not be aware of.",
        "Always verify deal details, coupon codes, and terms directly with the retailer before making a purchase.",
        "We are not responsible if a deal or coupon code does not work, has expired, or does not meet your expectations.",
      ],
    },
    {
      title: "Third-Party Content and Links",
      icon: ExternalLink,
      content: [
        "Our website contains links to external websites that are not provided or maintained by or in any way affiliated with Dealbies.",
        "We do not guarantee the accuracy, relevance, timeliness, or completeness of any information on these external websites.",
        "The inclusion of any links does not necessarily imply a recommendation or endorse the views expressed within them.",
        "We have no control over the nature, content, and availability of those sites.",
        "We are not responsible for any loss or damage that may arise from your use of external websites.",
        "When you click on external links, you will be subject to the terms and conditions and privacy policies of those websites.",
      ],
    },
    {
      title: "Affiliate Disclosure",
      icon: Info,
      content: [
        "Dealbies participates in various affiliate marketing programs, which means we may earn commissions on purchases made through our links to retailer websites.",
        "This does not affect the price you pay for products or services.",
        "We only recommend products and services that we believe may be of value to our users.",
        "Our editorial content and deal recommendations are not influenced by affiliate relationships.",
        "All affiliate links are clearly marked where appropriate.",
        "We are committed to transparency and will always disclose our affiliate relationships.",
      ],
    },
    {
      title: "Limitation of Liability",
      icon: Scale,
      content: [
        "In no event shall Dealbies, its directors, employees, partners, agents, suppliers, or affiliates be liable for any indirect, incidental, special, consequential, or punitive damages.",
        "This includes, without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your use of the website or services.",
        "We are not liable for any damages arising from the use or inability to use deals, coupons, or offers found on our website.",
        "We are not responsible for any issues, disputes, or problems that arise between you and third-party retailers.",
        "Some jurisdictions do not allow the exclusion or limitation of liability for consequential or incidental damages, so the above limitation may not apply to you.",
      ],
    },
    {
      title: "No Warranty",
      icon: Shield,
      content: [
        "Dealbies makes no warranties, expressed or implied, regarding the website, its content, or the services provided.",
        "We do not warrant that the website will be available at all times, be uninterrupted, secure, or error-free.",
        "We do not warrant that the information on this website is accurate, complete, or up-to-date.",
        "We do not warrant that any defects or errors will be corrected.",
        "We do not warrant that the website or servers are free of viruses or other harmful components.",
        "All warranties, whether express or implied, are disclaimed to the fullest extent permitted by law.",
      ],
    },
  ];

  const userResponsibilities = [
    "Verify all deal details and coupon codes directly with retailers before making purchases",
    "Read and understand the terms and conditions of any deal or offer before using it",
    "Use deals and coupons at your own risk and discretion",
    "Report expired or invalid deals to help improve our service",
    "Exercise caution when clicking on external links",
    "Protect your personal information when making purchases on third-party websites",
  ];

  const importantNotes = [
    "Deal availability and prices are subject to change without notice",
    "Retailers may modify or cancel deals at any time",
    "Some deals may have geographic restrictions or other limitations",
    "We are not responsible for inventory availability or stock levels",
    "Shipping costs, taxes, and fees are determined by retailers, not Dealbies",
    "Return and refund policies are set by individual retailers",
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-black ">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <AlertTriangle className="h-16 w-16 mx-auto mb-6" />
          <h1 className="text-4xl font-bold mb-4">Disclaimer</h1>
          <p className="text-xl opacity-90 mb-4">
            Important information about the use of our website and services
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
              Please read this disclaimer carefully before using Dealbies.com
              ("the website", "our service", "we", "us", or "our"). By accessing
              or using our website, you acknowledge that you have read,
              understood, and agree to be bound by this disclaimer.
            </p>
            <p className="text-gray-600 dark:text-gray-300">
              If you do not agree with any part of this disclaimer, you must not
              use our website or services. This disclaimer applies to all
              visitors, users, and others who access or use the service.
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
                  <ul className="space-y-3">
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

        {/* Important Notes */}
        <Card className="mt-8 bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20">
          <CardHeader>
            <CardTitle className="flex items-center text-xl text-yellow-800 dark:text-yellow-200">
              <AlertTriangle className="h-6 w-6 text-yellow-600 mr-3" />
              Important Notes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-yellow-800 dark:text-yellow-200 mb-4">
              <strong>Please be aware:</strong> The following important points
              should be considered when using deals and coupons from our
              website:
            </p>
            <ul className="space-y-2">
              {importantNotes.map((note, index) => (
                <li key={index} className="flex items-start">
                  <div className="w-2 h-2 bg-yellow-600 rounded-full mt-2 mr-3 flex-shrink-0" />
                  <span className="text-yellow-800 dark:text-yellow-200">
                    {note}
                  </span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* User Responsibilities */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="flex items-center text-xl">
              <Users className="h-6 w-6 text-orange-500 mr-3" />
              Your Responsibilities
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              When using deals and coupons from our website, you are responsible
              for:
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

        {/* Accuracy of Information */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="text-2xl">Accuracy of Information</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              While we strive to provide accurate and up-to-date information, we
              cannot guarantee that all information on our website is complete,
              current, or error-free. Information may be changed or updated
              without notice.
            </p>
            <p className="text-gray-600 dark:text-gray-300">
              We are not responsible for any errors or omissions in the content
              of this website, or for any damages resulting from the use of
              information contained herein. Always verify important information
              directly with the relevant retailer or service provider.
            </p>
          </CardContent>
        </Card>

        {/* Changes to Disclaimer */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="text-2xl">
              Changes to This Disclaimer
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              We reserve the right to update, change, or replace any part of
              this disclaimer at any time without prior notice. It is your
              responsibility to check this page periodically for changes.
            </p>
            <p className="text-gray-600 dark:text-gray-300">
              Your continued use of or access to the website following the
              posting of any changes constitutes acceptance of those changes. If
              you do not agree to the updated disclaimer, you must stop using
              the website immediately.
            </p>
          </CardContent>
        </Card>

        {/* Contact Information */}
        <Card className="mt-8 bg-gradient-to-r from-orange-50 to-red-50 dark:from-gray-800 dark:to-gray-700">
          <CardContent className="p-8">
            <div className="text-center">
              <Mail className="h-12 w-12 text-orange-500 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                Questions About This Disclaimer?
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                If you have any questions about this disclaimer or need
                clarification on any point, please don't hesitate to contact us.
              </p>
              <div className="space-y-2">
                <p className="text-gray-700 dark:text-gray-300">
                  <strong>Email:</strong>{" "}
                  <a
                    href="mailto:legal@dealbies.com"
                    className="text-orange-500 hover:text-orange-600"
                  >
                    contact@dealbies.com
                  </a>
                </p>
                <p className="text-gray-700 dark:text-gray-300">
                  <strong>Address:</strong> Delhi, India
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Governing Law */}
        <Card className="mt-8">
          <CardContent className="p-6">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
              Governing Law
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              This disclaimer shall be governed by and construed in accordance
              with the laws of the Netherlands, without regard to its conflict
              of law provisions. Any disputes arising from or related to this
              disclaimer or your use of the website shall be subject to the
              exclusive jurisdiction of the courts of the Netherlands.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
