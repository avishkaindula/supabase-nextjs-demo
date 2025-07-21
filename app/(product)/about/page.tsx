import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Users, Shield, Clock, Award } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Link>
          </Button>
        </div>

        {/* Hero Section */}
        <div className="text-center mb-16">
          <Badge variant="secondary" className="mb-4">
            About MediScript
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent mb-6">
            Revolutionizing Healthcare
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            MediScript is transforming how patients and pharmacies interact,
            making prescription management more efficient, transparent, and
            accessible for everyone.
          </p>
        </div>

        {/* Mission & Vision */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-blue-600" />
                Our Mission
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                To bridge the gap between patients and pharmacies through
                innovative digital solutions, ensuring everyone has access to
                affordable, transparent, and efficient prescription services.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-5 w-5 text-green-600" />
                Our Vision
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                To become the leading platform for digital prescription
                management, empowering patients with choice and pharmacies with
                efficiency, ultimately improving healthcare outcomes globally.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Key Features */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">
            Why Choose MediScript?
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-blue-600" />
                  Patient-Centric
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Designed with patients in mind, offering easy prescription
                  uploads, transparent pricing, and multiple pharmacy options.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-green-600" />
                  Secure & Compliant
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Built with healthcare compliance in mind, ensuring your
                  medical information is always protected and secure.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-purple-600" />
                  Time-Saving
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Streamline your prescription process with instant uploads,
                  quick quotations, and efficient pharmacy communication.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Team Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">Our Story</h2>
          <Card>
            <CardContent className="p-8">
              <p className="text-lg text-muted-foreground leading-relaxed">
                MediScript was founded in 2025 with a simple yet powerful
                vision: to make healthcare more accessible and transparent. Our
                team of healthcare professionals, technology experts, and
                patient advocates came together to address the common
                frustrations patients face when trying to fill prescriptions -
                from unclear pricing to limited pharmacy options.
              </p>
              <br />
              <p className="text-lg text-muted-foreground leading-relaxed">
                Today, we're proud to serve thousands of patients and partner
                with hundreds of pharmacies, creating a ecosystem where everyone
                benefits from increased transparency, efficiency, and choice.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <Card>
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold mb-4">Ready to Get Started?</h3>
              <p className="text-muted-foreground mb-6">
                Join thousands of patients who have already simplified their
                prescription management.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" asChild>
                  <Link href="/sign-up/user">Sign Up Today</Link>
                </Button>
                <Button variant="outline" size="lg" asChild>
                  <Link href="/contact">Contact Us</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
