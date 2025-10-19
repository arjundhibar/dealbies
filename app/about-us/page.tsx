import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Users,
  Target,
  Heart,
  Shield,
  TrendingUp,
  Award,
  Globe,
  Zap,
  CheckCircle,
} from "lucide-react";
import Link from "next/link";

export default function AboutUs() {
  const values = [
    {
      icon: Target,
      title: "Deal Discovery",
      description:
        "We tirelessly hunt for the best deals, discounts, and offers across thousands of retailers.",
    },
    {
      icon: Shield,
      title: "Trust & Safety",
      description:
        "Every deal is verified and tested to ensure authenticity and value for our community.",
    },
    {
      icon: Heart,
      title: "Community First",
      description:
        "We're built by deal hunters, for deal hunters. Your success is our success.",
    },
    {
      icon: Zap,
      title: "Real-time Updates",
      description:
        "Get instant notifications about new deals, price drops, and limited-time offers.",
    },
  ];

  const stats = [
    { number: "500K+", label: "Active Users", icon: Users },
    { number: "10M+", label: "Deals Found", icon: TrendingUp },
    { number: "1000+", label: "Partner Stores", icon: Globe },
    { number: "€50M+", label: "Money Saved", icon: Award },
  ];

  const team = [
    {
      name: "Sarah Chen",
      role: "Founder & CEO",
      description: "Former retail analyst with 10+ years in e-commerce",
      image: "/placeholder-user.jpg",
    },
    {
      name: "Marcus Rodriguez",
      role: "Head of Technology",
      description: "Full-stack developer passionate about deal optimization",
      image: "/placeholder-user.jpg",
    },
    {
      name: "Emily Johnson",
      role: "Community Manager",
      description: "Deal hunting expert and community advocate",
      image: "/placeholder-user.jpg",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 dark:from-gray-900 dark:to-gray-800">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white py-20">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-6">About Dealbies</h1>
          <p className="text-xl mb-8 max-w-3xl mx-auto">
            We're on a mission to help you save money and discover amazing
            deals. Founded by deal hunters, for deal hunters.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Badge variant="secondary" className="px-4 py-2 text-lg">
              <CheckCircle className="mr-2 h-5 w-5" />
              Verified Deals
            </Badge>
            <Badge variant="secondary" className="px-4 py-2 text-lg">
              <Users className="mr-2 h-5 w-5" />
              Community Driven
            </Badge>
            <Badge variant="secondary" className="px-4 py-2 text-lg">
              <Shield className="mr-2 h-5 w-5" />
              Safe & Secure
            </Badge>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-16">
        {/* Our Story */}
        <section className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">
              Our Story
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-4xl mx-auto">
              Dealbies was born from a simple frustration: finding great deals
              was too hard, too time-consuming, and often unreliable. We set out
              to change that.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                The Problem We Solved
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Traditional deal hunting meant spending hours browsing multiple
                sites, dealing with expired coupons, and missing out on
                time-sensitive offers. We knew there had to be a better way.
              </p>
              <p className="text-gray-600 dark:text-gray-300">
                Our platform aggregates deals from thousands of retailers,
                verifies their authenticity, and presents them in an
                easy-to-browse format with real-time updates and community
                insights.
              </p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg p-8 shadow-lg">
              <div className="text-center">
                <TrendingUp className="h-16 w-16 text-orange-500 mx-auto mb-4" />
                <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                  Our Impact
                </h4>
                <p className="text-gray-600 dark:text-gray-300">
                  Since our launch, we've helped our community save over €50
                  million through verified deals and exclusive offers.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">
            By the Numbers
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, index) => {
              const IconComponent = stat.icon;
              return (
                <Card key={index} className="text-center">
                  <CardContent className="p-6">
                    <IconComponent className="h-12 w-12 text-orange-500 mx-auto mb-4" />
                    <div className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                      {stat.number}
                    </div>
                    <div className="text-gray-600 dark:text-gray-300">
                      {stat.label}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>

        {/* Our Values */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">
            Our Values
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => {
              const IconComponent = value.icon;
              return (
                <Card
                  key={index}
                  className="text-center hover:shadow-lg transition-shadow"
                >
                  <CardContent className="p-6">
                    <div className="bg-orange-100 dark:bg-orange-900/30 rounded-full p-4 w-fit mx-auto mb-4">
                      <IconComponent className="h-8 w-8 text-orange-500" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                      {value.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300">
                      {value.description}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>

        {/* Team Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">
            Meet Our Team
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <Card key={index} className="text-center">
                <CardContent className="p-6">
                  <div className="w-24 h-24 bg-gray-200 dark:bg-gray-700 rounded-full mx-auto mb-4 overflow-hidden">
                    <img
                      src={member.image}
                      alt={member.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                    {member.name}
                  </h3>
                  <p className="text-orange-500 font-semibold mb-3">
                    {member.role}
                  </p>
                  <p className="text-gray-600 dark:text-gray-300">
                    {member.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Call to Action */}
        <section className="text-center">
          <Card className="bg-gradient-to-r from-orange-500 to-red-500 text-white">
            <CardContent className="p-12">
              <h2 className="text-3xl font-bold mb-4">Join Our Community</h2>
              <p className="text-xl mb-8 opacity-90">
                Ready to start saving? Join thousands of deal hunters who trust
                Dealbies for the best deals and discounts.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild size="lg" variant="secondary">
                  <Link href="/signup">Get Started Free</Link>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="border-white text-white hover:bg-white hover:text-orange-500"
                >
                  <Link href="/contact">Contact Us</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
}
