"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Mail, Phone, MapPin, Clock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function ContactPage() {
  const { toast } = useToast();

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
            Contact Us
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent mb-6">
            Get in Touch
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Have questions about MediScript? We're here to help. Reach out to
            our team and we'll get back to you as soon as possible.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <Card>
            <CardHeader>
              <CardTitle>Send us a Message</CardTitle>
              <CardDescription>
                Fill out the form below and we'll respond within 24 hours.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input id="firstName" placeholder="John" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input id="lastName" placeholder="Doe" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="john@example.com" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number (Optional)</Label>
                <Input id="phone" type="tel" placeholder="+1 (555) 123-4567" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="subject">Subject</Label>
                <Input id="subject" placeholder="How can we help you?" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="message">Message</Label>
                <Textarea
                  id="message"
                  placeholder="Tell us more about your inquiry..."
                  className="min-h-[120px]"
                />
              </div>

              <Button
                className="w-full"
                onClick={() => {
                  toast({
                    title: "Message sent!",
                    description:
                      "Thank you for reaching out. We'll get back to you soon.",
                  });
                }}
              >
                Send Message
              </Button>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <div className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
                <CardDescription>
                  Multiple ways to reach our support team.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-start gap-4">
                  <Mail className="h-5 w-5 text-blue-600 mt-1" />
                  <div>
                    <h4 className="font-semibold">Email Support</h4>
                    <p className="text-muted-foreground">
                      support@mediscript.com
                    </p>
                    <p className="text-sm text-muted-foreground">
                      For general inquiries and support
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <Phone className="h-5 w-5 text-green-600 mt-1" />
                  <div>
                    <h4 className="font-semibold">Phone Support</h4>
                    <p className="text-muted-foreground">+1 (555) 123-4567</p>
                    <p className="text-sm text-muted-foreground">
                      Monday - Friday, 9 AM - 6 PM EST
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <MapPin className="h-5 w-5 text-purple-600 mt-1" />
                  <div>
                    <h4 className="font-semibold">Office Address</h4>
                    <p className="text-muted-foreground">
                      123 Healthcare Blvd
                      <br />
                      Suite 456
                      <br />
                      Medical City, MC 12345
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <Clock className="h-5 w-5 text-orange-600 mt-1" />
                  <div>
                    <h4 className="font-semibold">Business Hours</h4>
                    <p className="text-muted-foreground">
                      Monday - Friday: 9:00 AM - 6:00 PM EST
                      <br />
                      Saturday: 10:00 AM - 4:00 PM EST
                      <br />
                      Sunday: Closed
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* FAQ Quick Links */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Help</CardTitle>
                <CardDescription>
                  Looking for immediate answers? Check out these resources.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  asChild
                >
                  <Link href="/help">
                    <Mail className="h-4 w-4 mr-2" />
                    Help Center & FAQ
                  </Link>
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  asChild
                >
                  <Link href="/how-it-works">
                    <Clock className="h-4 w-4 mr-2" />
                    How MediScript Works
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
