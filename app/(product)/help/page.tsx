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
import { Input } from "@/components/ui/input";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  ArrowLeft,
  Search,
  HelpCircle,
  Upload,
  DollarSign,
  Shield,
  Phone,
} from "lucide-react";

export default function HelpPage() {
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
            Help Center
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent mb-6">
            How Can We Help?
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            Find answers to common questions about using MediScript, or get in
            touch with our support team.
          </p>

          {/* Search Bar */}
          <div className="max-w-md mx-auto relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input placeholder="Search for help topics..." className="pl-10" />
          </div>
        </div>

        {/* Quick Help Categories */}
        <div className="grid md:grid-cols-4 gap-6 mb-16">
          <Card className="cursor-pointer hover:shadow-lg transition-shadow">
            <CardContent className="p-6 text-center">
              <Upload className="h-8 w-8 text-blue-600 mx-auto mb-3" />
              <h3 className="font-semibold mb-2">Getting Started</h3>
              <p className="text-sm text-muted-foreground">
                Learn how to upload prescriptions and create your account
              </p>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-lg transition-shadow">
            <CardContent className="p-6 text-center">
              <DollarSign className="h-8 w-8 text-green-600 mx-auto mb-3" />
              <h3 className="font-semibold mb-2">Quotations</h3>
              <p className="text-sm text-muted-foreground">
                Understanding how quotations work and comparing prices
              </p>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-lg transition-shadow">
            <CardContent className="p-6 text-center">
              <Shield className="h-8 w-8 text-purple-600 mx-auto mb-3" />
              <h3 className="font-semibold mb-2">Privacy & Security</h3>
              <p className="text-sm text-muted-foreground">
                How we protect your medical information
              </p>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-lg transition-shadow">
            <CardContent className="p-6 text-center">
              <Phone className="h-8 w-8 text-orange-600 mx-auto mb-3" />
              <h3 className="font-semibold mb-2">Contact Support</h3>
              <p className="text-sm text-muted-foreground">
                Get in touch with our support team
              </p>
            </CardContent>
          </Card>
        </div>

        {/* FAQ Section */}
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-8">
            Frequently Asked Questions
          </h2>

          <Accordion type="single" collapsible className="space-y-4">
            <AccordionItem value="item-1">
              <Card>
                <AccordionTrigger className="px-6 py-4 hover:no-underline">
                  <div className="flex items-center gap-3">
                    <HelpCircle className="h-5 w-5 text-blue-600" />
                    <span className="font-semibold text-left">
                      How do I upload a prescription?
                    </span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-4">
                  <p className="text-muted-foreground">
                    To upload a prescription, sign in to your account and click
                    "Upload Prescription" from your dashboard. You can take a
                    photo with your phone or upload an existing image. Make sure
                    the prescription is clear and all text is readable. Our
                    system accepts JPG, PNG, and PDF formats.
                  </p>
                </AccordionContent>
              </Card>
            </AccordionItem>

            <AccordionItem value="item-2">
              <Card>
                <AccordionTrigger className="px-6 py-4 hover:no-underline">
                  <div className="flex items-center gap-3">
                    <HelpCircle className="h-5 w-5 text-green-600" />
                    <span className="font-semibold text-left">
                      How long does it take to receive quotations?
                    </span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-4">
                  <p className="text-muted-foreground">
                    Most pharmacies respond with quotations within 2-4 hours
                    during business hours. You'll receive an email notification
                    when new quotations are available. Some pharmacies may take
                    up to 24 hours, especially for complex prescriptions or
                    during busy periods.
                  </p>
                </AccordionContent>
              </Card>
            </AccordionItem>

            <AccordionItem value="item-3">
              <Card>
                <AccordionTrigger className="px-6 py-4 hover:no-underline">
                  <div className="flex items-center gap-3">
                    <HelpCircle className="h-5 w-5 text-purple-600" />
                    <span className="font-semibold text-left">
                      Is my medical information secure?
                    </span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-4">
                  <p className="text-muted-foreground">
                    Yes, we take your privacy seriously. All medical information
                    is encrypted and stored securely. We're HIPAA compliant and
                    only share your prescription information with pharmacies you
                    choose to request quotations from. We never sell your data
                    to third parties.
                  </p>
                </AccordionContent>
              </Card>
            </AccordionItem>

            <AccordionItem value="item-4">
              <Card>
                <AccordionTrigger className="px-6 py-4 hover:no-underline">
                  <div className="flex items-center gap-3">
                    <HelpCircle className="h-5 w-5 text-orange-600" />
                    <span className="font-semibold text-left">
                      Can I use expired prescriptions?
                    </span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-4">
                  <p className="text-muted-foreground">
                    No, pharmacies cannot fill expired prescriptions. Please
                    ensure your prescription is current and valid before
                    uploading. If your prescription has expired, you'll need to
                    contact your healthcare provider for a new one.
                  </p>
                </AccordionContent>
              </Card>
            </AccordionItem>

            <AccordionItem value="item-5">
              <Card>
                <AccordionTrigger className="px-6 py-4 hover:no-underline">
                  <div className="flex items-center gap-3">
                    <HelpCircle className="h-5 w-5 text-red-600" />
                    <span className="font-semibold text-left">
                      What if I need to cancel or modify a quotation?
                    </span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-4">
                  <p className="text-muted-foreground">
                    You can reject quotations at any time from your dashboard.
                    If you've already accepted a quotation but need to cancel,
                    contact the pharmacy directly using the contact information
                    provided in the quotation details. Each pharmacy has their
                    own cancellation policy.
                  </p>
                </AccordionContent>
              </Card>
            </AccordionItem>

            <AccordionItem value="item-6">
              <Card>
                <AccordionTrigger className="px-6 py-4 hover:no-underline">
                  <div className="flex items-center gap-3">
                    <HelpCircle className="h-5 w-5 text-teal-600" />
                    <span className="font-semibold text-left">
                      Do I need to pay through MediScript?
                    </span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-4">
                  <p className="text-muted-foreground">
                    No, MediScript is a free platform for patients. You pay the
                    pharmacy directly when you pick up your prescription.
                    Payment methods and policies vary by pharmacy, so check the
                    quotation details for specific information.
                  </p>
                </AccordionContent>
              </Card>
            </AccordionItem>
          </Accordion>

          {/* Contact Support */}
          <Card className="mt-12">
            <CardHeader className="text-center">
              <CardTitle>Still Need Help?</CardTitle>
              <CardDescription>
                Our support team is here to help you with any questions or
                issues.
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild>
                  <Link href="/contact">Contact Support</Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link href="/how-it-works">How It Works</Link>
                </Button>
              </div>
              <p className="text-sm text-muted-foreground">
                Email: support@mediscript.com | Phone: +1 (555) 123-4567
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
