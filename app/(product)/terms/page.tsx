import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  FileText,
  Scale,
  AlertTriangle,
  CheckCircle,
} from "lucide-react";

export default function TermsPage() {
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
            Terms of Service
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent mb-6">
            Terms of Service
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Please read these terms carefully before using MediScript. By using
            our service, you agree to these terms and conditions.
          </p>
          <p className="text-sm text-muted-foreground mt-4">
            Last updated: January 1, 2025
          </p>
        </div>

        {/* Key Points */}
        <div className="grid md:grid-cols-4 gap-6 mb-16">
          <Card>
            <CardContent className="p-6 text-center">
              <FileText className="h-8 w-8 text-blue-600 mx-auto mb-3" />
              <h3 className="font-semibold mb-2">Clear Terms</h3>
              <p className="text-sm text-muted-foreground">
                Straightforward terms written in plain language
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 text-center">
              <Scale className="h-8 w-8 text-green-600 mx-auto mb-3" />
              <h3 className="font-semibold mb-2">Fair Usage</h3>
              <p className="text-sm text-muted-foreground">
                Reasonable terms that protect both users and service
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 text-center">
              <AlertTriangle className="h-8 w-8 text-orange-600 mx-auto mb-3" />
              <h3 className="font-semibold mb-2">Your Responsibilities</h3>
              <p className="text-sm text-muted-foreground">
                What we expect from users of our platform
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 text-center">
              <CheckCircle className="h-8 w-8 text-purple-600 mx-auto mb-3" />
              <h3 className="font-semibold mb-2">Your Rights</h3>
              <p className="text-sm text-muted-foreground">
                What you can expect from our service
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Terms Content */}
        <div className="max-w-4xl mx-auto space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>1. Acceptance of Terms</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                By accessing or using MediScript, you agree to be bound by these
                Terms of Service and all applicable laws and regulations. If you
                do not agree with any of these terms, you are prohibited from
                using or accessing this service.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>2. Description of Service</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                MediScript is a digital platform that connects patients with
                pharmacies to:
              </p>
              <ul className="space-y-2 text-muted-foreground ml-4">
                <li>• Upload and manage prescription images</li>
                <li>• Receive quotations from multiple pharmacies</li>
                <li>• Compare prices and services</li>
                <li>• Communicate with pharmacy partners</li>
                <li>• Track prescription status and history</li>
              </ul>
              <p className="text-muted-foreground">
                MediScript is a technology platform and does not provide medical
                advice, diagnosis, or treatment.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>3. User Accounts and Responsibilities</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Account Creation</h4>
                <p className="text-muted-foreground">
                  You must provide accurate, current, and complete information
                  when creating your account and keep this information updated.
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Account Security</h4>
                <p className="text-muted-foreground">
                  You are responsible for maintaining the confidentiality of
                  your account credentials and for all activities that occur
                  under your account.
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Prohibited Uses</h4>
                <ul className="space-y-1 text-muted-foreground ml-4">
                  <li>• Uploading false or fraudulent prescriptions</li>
                  <li>• Using the service for illegal activities</li>
                  <li>• Attempting to circumvent security measures</li>
                  <li>• Harassing other users or pharmacy partners</li>
                  <li>• Violating any applicable laws or regulations</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>4. Medical Disclaimers</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg border border-yellow-200 dark:border-yellow-800">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-yellow-800 dark:text-yellow-200 mb-2">
                      Important Medical Disclaimer
                    </h4>
                    <p className="text-yellow-700 dark:text-yellow-300 text-sm">
                      MediScript does not provide medical advice, diagnosis, or
                      treatment. Always consult with qualified healthcare
                      professionals for medical decisions.
                    </p>
                  </div>
                </div>
              </div>
              <ul className="space-y-2 text-muted-foreground">
                <li>
                  • We do not verify prescription validity or appropriateness
                </li>
                <li>
                  • Pharmacy partners are responsible for prescription
                  verification
                </li>
                <li>• Users must ensure prescriptions are current and valid</li>
                <li>
                  • Emergency medical situations require immediate professional
                  care
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>5. Privacy and Data Protection</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Your privacy is important to us. Our collection, use, and
                protection of your personal and medical information is governed
                by our Privacy Policy, which is incorporated into these terms by
                reference.
              </p>
              <Button variant="outline" className="mt-4" asChild>
                <Link href="/privacy">Read Privacy Policy</Link>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>6. Limitation of Liability</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                MediScript shall not be liable for any indirect, incidental,
                special, consequential, or punitive damages, including without
                limitation, loss of profits, data, use, goodwill, or other
                intangible losses, resulting from your use of the service.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>7. Termination</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                We may terminate or suspend your account and access to the
                service immediately, without prior notice, for conduct that we
                believe violates these Terms of Service or is harmful to other
                users, us, or third parties.
              </p>
              <p className="text-muted-foreground">
                You may terminate your account at any time by contacting our
                support team.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>8. Changes to Terms</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                We reserve the right to modify these terms at any time. We will
                notify users of significant changes via email or through the
                platform. Continued use of the service after changes constitutes
                acceptance of the new terms.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>9. Contact Information</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                If you have questions about these Terms of Service, please
                contact us:
              </p>
              <div className="space-y-2 text-muted-foreground">
                <p>Email: legal@mediscript.com</p>
                <p>Phone: +1 (555) 123-4567</p>
                <p>
                  Address: 123 Healthcare Blvd, Suite 456, Medical City, MC
                  12345
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
