import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Shield, Eye, Lock, Users } from "lucide-react";

export default function PrivacyPage() {
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
            Privacy Policy
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent mb-6">
            Your Privacy Matters
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            We are committed to protecting your personal and medical
            information. Learn how we collect, use, and safeguard your data.
          </p>
          <p className="text-sm text-muted-foreground mt-4">
            Last updated: January 1, 2025
          </p>
        </div>

        {/* Privacy Highlights */}
        <div className="grid md:grid-cols-4 gap-6 mb-16">
          <Card>
            <CardContent className="p-6 text-center">
              <Shield className="h-8 w-8 text-blue-600 mx-auto mb-3" />
              <h3 className="font-semibold mb-2">HIPAA Compliant</h3>
              <p className="text-sm text-muted-foreground">
                Full compliance with healthcare privacy regulations
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 text-center">
              <Lock className="h-8 w-8 text-green-600 mx-auto mb-3" />
              <h3 className="font-semibold mb-2">Encrypted Data</h3>
              <p className="text-sm text-muted-foreground">
                End-to-end encryption for all sensitive information
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 text-center">
              <Eye className="h-8 w-8 text-purple-600 mx-auto mb-3" />
              <h3 className="font-semibold mb-2">No Data Selling</h3>
              <p className="text-sm text-muted-foreground">
                We never sell your personal or medical data
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 text-center">
              <Users className="h-8 w-8 text-orange-600 mx-auto mb-3" />
              <h3 className="font-semibold mb-2">Your Control</h3>
              <p className="text-sm text-muted-foreground">
                You control who sees your information
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Privacy Policy Content */}
        <div className="max-w-4xl mx-auto space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>1. Information We Collect</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Personal Information</h4>
                <p className="text-muted-foreground">
                  We collect information you provide directly, including your
                  name, email address, phone number, and account credentials
                  when you register for MediScript.
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Medical Information</h4>
                <p className="text-muted-foreground">
                  Prescription images and related medical information you upload
                  to our platform for the purpose of obtaining quotations from
                  pharmacies.
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Usage Data</h4>
                <p className="text-muted-foreground">
                  Information about how you use our service, including log data,
                  device information, and interaction patterns to improve our
                  platform.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>2. How We Use Your Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="space-y-2 text-muted-foreground">
                <li>• Provide prescription quotation services</li>
                <li>• Facilitate communication between you and pharmacies</li>
                <li>• Send important updates about your prescriptions</li>
                <li>• Improve our platform and user experience</li>
                <li>• Ensure platform security and prevent fraud</li>
                <li>• Comply with legal and regulatory requirements</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>3. Information Sharing</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">With Pharmacies</h4>
                <p className="text-muted-foreground">
                  We share your prescription information only with pharmacies
                  you choose to request quotations from, and only for the
                  purpose of providing those quotations.
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Service Providers</h4>
                <p className="text-muted-foreground">
                  We may share information with trusted service providers who
                  help us operate our platform, subject to strict
                  confidentiality agreements.
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Legal Requirements</h4>
                <p className="text-muted-foreground">
                  We may disclose information when required by law or to protect
                  the rights, property, or safety of MediScript, our users, or
                  others.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>4. Data Security</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                We implement industry-standard security measures including
                encryption, secure servers, and regular security audits to
                protect your information. However, no method of transmission
                over the internet is 100% secure, and we cannot guarantee
                absolute security.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>5. Your Rights</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="space-y-2 text-muted-foreground">
                <li>• Access and review your personal information</li>
                <li>• Request corrections to inaccurate information</li>
                <li>• Delete your account and associated data</li>
                <li>• Opt out of non-essential communications</li>
                <li>• Request a copy of your data</li>
                <li>• File a complaint with regulatory authorities</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>6. Contact Us</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                If you have questions about this Privacy Policy or our data
                practices, please contact us:
              </p>
              <div className="space-y-2 text-muted-foreground">
                <p>Email: privacy@mediscript.com</p>
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
