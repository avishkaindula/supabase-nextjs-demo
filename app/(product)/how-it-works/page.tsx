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
import {
  ArrowLeft,
  Upload,
  Search,
  DollarSign,
  CheckCircle,
} from "lucide-react";

export default function HowItWorksPage() {
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
            How It Works
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent mb-6">
            Simple. Fast. Transparent.
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Get the best prices for your prescriptions in just a few simple
            steps. Compare quotes from multiple pharmacies and choose what works
            best for you.
          </p>
        </div>

        {/* How It Works Steps */}
        <div className="max-w-6xl mx-auto mb-16">
          <h2 className="text-3xl font-bold text-center mb-12">
            Get Started in 4 Easy Steps
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Step 1 */}
            <Card className="relative">
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Upload className="h-8 w-8 text-blue-600" />
                </div>
                <Badge variant="outline" className="w-fit mx-auto mb-2">
                  Step 1
                </Badge>
                <CardTitle>Upload Prescription</CardTitle>
                <CardDescription>
                  Take a photo or upload an image of your prescription
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Clear, readable image</li>
                  <li>• JPG, PNG, or PDF format</li>
                  <li>• Valid, unexpired prescription</li>
                </ul>
              </CardContent>
            </Card>

            {/* Step 2 */}
            <Card className="relative">
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="h-8 w-8 text-green-600" />
                </div>
                <Badge variant="outline" className="w-fit mx-auto mb-2">
                  Step 2
                </Badge>
                <CardTitle>Pharmacies Review</CardTitle>
                <CardDescription>
                  Local pharmacies review your prescription and prepare quotes
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Licensed pharmacies only</li>
                  <li>• Professional verification</li>
                  <li>• Usually within 2-4 hours</li>
                </ul>
              </CardContent>
            </Card>

            {/* Step 3 */}
            <Card className="relative">
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center mx-auto mb-4">
                  <DollarSign className="h-8 w-8 text-purple-600" />
                </div>
                <Badge variant="outline" className="w-fit mx-auto mb-2">
                  Step 3
                </Badge>
                <CardTitle>Compare Quotes</CardTitle>
                <CardDescription>
                  Review and compare quotations from multiple pharmacies
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Transparent pricing</li>
                  <li>• Pharmacy details & ratings</li>
                  <li>• Delivery options</li>
                </ul>
              </CardContent>
            </Card>

            {/* Step 4 */}
            <Card>
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-orange-100 dark:bg-orange-900 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="h-8 w-8 text-orange-600" />
                </div>
                <Badge variant="outline" className="w-fit mx-auto mb-2">
                  Step 4
                </Badge>
                <CardTitle>Accept & Collect</CardTitle>
                <CardDescription>
                  Accept your preferred quote and collect your medication
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• One-click acceptance</li>
                  <li>• Direct pharmacy contact</li>
                  <li>• Pick up or delivery</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Benefits Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12">
            Why Choose MediScript?
          </h2>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <Card>
              <CardHeader className="text-center">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-4">
                  <DollarSign className="h-6 w-6 text-blue-600" />
                </div>
                <CardTitle>Save Money</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-center">
                  Compare prices from multiple pharmacies to find the best deal.
                  Users typically save 20-40% on their prescriptions.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="text-center">
                <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
                <CardTitle>Save Time</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-center">
                  No more calling around to different pharmacies. Get multiple
                  quotes delivered to your dashboard in hours, not days.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="text-center">
                <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="h-6 w-6 text-purple-600" />
                </div>
                <CardTitle>Transparency</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-center">
                  See exactly what you'll pay before you commit. No hidden fees,
                  no surprises - just clear, upfront pricing.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* For Pharmacies Section */}
        <div className="mb-16">
          <Card className="max-w-4xl mx-auto">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">Join Our Network</CardTitle>
              <CardDescription>
                Connect with more patients and grow your business through our
                platform
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-2">Reach More Patients</h4>
                  <p className="text-muted-foreground text-sm">
                    Connect with patients actively looking for prescription
                    services in your area.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Streamlined Process</h4>
                  <p className="text-muted-foreground text-sm">
                    Efficient quotation system that integrates with your
                    existing workflow.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Competitive Advantage</h4>
                  <p className="text-muted-foreground text-sm">
                    Showcase your competitive pricing and excellent service to
                    win more business.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Professional Network</h4>
                  <p className="text-muted-foreground text-sm">
                    Join a trusted network of licensed pharmacies committed to
                    patient care.
                  </p>
                </div>
              </div>
              <div className="text-center">
                <Button asChild>
                  <Link href="/contact">Become a Partner Pharmacy</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <Card className="max-w-2xl mx-auto">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold mb-4">Ready to Get Started?</h3>
              <p className="text-muted-foreground mb-6">
                Join thousands of patients who are already saving time and money
                on their prescriptions.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" asChild>
                  <Link href="/sign-up/user">Create Free Account</Link>
                </Button>
                <Button variant="outline" size="lg" asChild>
                  <Link href="/help">Learn More</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
