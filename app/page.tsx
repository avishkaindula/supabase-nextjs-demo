"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ThemeToggle } from "@/components/theme-toggle";
import {
  Upload,
  FileText,
  Clock,
  Shield,
  Users,
  CheckCircle,
  ArrowRight,
  Pill,
  Search,
  Heart,
  Star,
  DollarSign,
} from "lucide-react";
import Header from "@/components/header";
import Footer from "@/components/footer";

export default function LandingPage() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Navigation */}
      <Header />

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
          <div
            className={`text-center transition-all duration-1000 ${
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-10"
            }`}
          >
            <Badge variant="secondary" className="mb-4">
              🚀 Digital Healthcare Revolution
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
              Upload Prescriptions,
              <br />
              <span className="bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
                Get Instant Quotations
              </span>
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
              Connect with verified pharmacies, upload your prescriptions
              securely, and receive competitive quotations with doorstep
              delivery.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/sign-up/user">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700"
                >
                  Start Your Journey
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
              <Link href="/sign-up/pharmacy">
                <Button size="lg" variant="outline">
                  Join as Pharmacy
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Floating Elements */}
        <div className="absolute top-20 left-10 animate-bounce hidden sm:block">
          <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
            <Heart className="w-8 h-8 text-blue-600" />
          </div>
        </div>
        <div className="absolute top-40 right-10 animate-pulse hidden sm:block">
          <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
            <Pill className="w-6 h-6 text-green-600" />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Why Choose MediScript?
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Experience the future of prescription management
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: Upload,
                title: "Easy Upload",
                description:
                  "Upload up to 5 prescription images with notes and delivery preferences",
                color: "blue",
              },
              {
                icon: FileText,
                title: "Instant Quotations",
                description:
                  "Receive detailed quotations from verified pharmacies within hours",
                color: "green",
              },
              {
                icon: Clock,
                title: "Fast Delivery",
                description:
                  "Choose 2-hour delivery slots that work with your schedule",
                color: "purple",
              },
              {
                icon: Shield,
                title: "Secure & Private",
                description:
                  "Your medical data is encrypted and handled with utmost care",
                color: "red",
              },
              {
                icon: Users,
                title: "Verified Pharmacies",
                description:
                  "Connect with licensed and verified pharmacy partners",
                color: "yellow",
              },
              {
                icon: CheckCircle,
                title: "Accept/Reject",
                description:
                  "Review quotations and accept the best offers for your needs",
                color: "indigo",
              },
            ].map((feature, index) => (
              <Card
                key={index}
                className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
              >
                <CardContent className="p-6">
                  <div
                    className={`w-12 h-12 bg-${feature.color}-100 dark:bg-${feature.color}-900 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}
                  >
                    <feature.icon
                      className={`w-6 h-6 text-${feature.color}-600`}
                    />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              How MediScript Works
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Get started in just 4 simple steps
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Upload className="h-8 w-8 text-blue-600" />
                </div>
                <CardTitle>1. Upload</CardTitle>
                <CardDescription>
                  Take a photo of your prescription or upload an existing image
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="h-8 w-8 text-green-600" />
                </div>
                <CardTitle>2. Review</CardTitle>
                <CardDescription>
                  Local pharmacies review your prescription and prepare quotes
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center mx-auto mb-4">
                  <DollarSign className="h-8 w-8 text-purple-600" />
                </div>
                <CardTitle>3. Compare</CardTitle>
                <CardDescription>
                  Compare prices and services from multiple pharmacies
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-16 h-16 bg-orange-100 dark:bg-orange-900 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="h-8 w-8 text-orange-600" />
                </div>
                <CardTitle>4. Save</CardTitle>
                <CardDescription>
                  Choose the best option and save money on your medication
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              What Our Users Say
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: "Sarah Johnson",
                role: "Patient",
                content:
                  "MediScript made getting my medications so much easier. The quotations were competitive and delivery was fast!",
                rating: 5,
              },
              {
                name: "Dr. Michael Chen",
                role: "Healthcare Provider",
                content:
                  "I recommend MediScript to my patients. It's secure, reliable, and saves them time and money.",
                rating: 5,
              },
              {
                name: "Green Valley Pharmacy",
                role: "Pharmacy Partner",
                content:
                  "Joining MediScript increased our customer base significantly. The platform is user-friendly and efficient.",
                rating: 5,
              },
            ].map((testimonial, index) => (
              <Card key={index} className="p-6">
                <CardContent className="p-0">
                  <div className="flex mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star
                        key={i}
                        className="w-5 h-5 text-yellow-400 fill-current"
                      />
                    ))}
                  </div>
                  <p className="text-gray-600 dark:text-gray-300 mb-4">
                    "{testimonial.content}"
                  </p>
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white">
                      {testimonial.name}
                    </p>
                    <p className="text-sm text-gray-500">{testimonial.role}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-green-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Transform Your Healthcare Experience?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join thousands of users who trust MediScript for their prescription
            needs
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/sign-up/user">
              <Button size="lg" variant="outline">
                Get Started Today
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
            <Link href="/sign-up/pharmacy">
              <Button size="lg" variant="outline">
                Partner With Us
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}
