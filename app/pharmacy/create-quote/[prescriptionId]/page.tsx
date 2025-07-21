"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Plus, X, Send, FileText } from "lucide-react";
import Link from "next/link";
import { createClient } from "@/utils/supabase/client";
import type { Tables } from "@/utils/supabase/types";

type Prescription = Tables<"prescriptions">;

// Helper to format Sri Lankan phone numbers (e.g., +94713768901 -> +94 71 376 8901)
function formatPhoneNumber(phone: string) {
  const match = phone.match(/^\+94(\d{2})(\d{3})(\d{4})$/);
  if (match) {
    return `+94 ${match[1]} ${match[2]} ${match[3]}`;
  }
  return phone;
}

export default function CreateQuotePage() {
  const router = useRouter();
  const params = useParams();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [prescription, setPrescription] = useState<Prescription | null>(null);
  const [fetching, setFetching] = useState(true);

  const [quotationItems, setQuotationItems] = useState([
    { drug: "", quantity: "", price: "", notes: "" },
  ]);
  const [deliveryFee, setDeliveryFee] = useState("5.00");
  const [estimatedDelivery, setEstimatedDelivery] = useState("2-3 hours");
  const [quotationNotes, setQuotationNotes] = useState("");

  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [selectedImage, setSelectedImage] = useState(0);
  const [loadingImages, setLoadingImages] = useState(false);
  const [patientName, setPatientName] = useState<string | null>(null);
  const [loadingProfile, setLoadingProfile] = useState(false);
  const [patientEmail, setPatientEmail] = useState<string | null>(null);

  useEffect(() => {
    const fetchPrescription = async () => {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("prescriptions")
        .select("*")
        .eq("id", String(params.prescriptionId))
        .single();
      if (data) setPrescription(data as Prescription);
      setFetching(false);
    };
    fetchPrescription();
  }, [String(params.prescriptionId)]);

  // Fetch patient profile when prescription is loaded
  useEffect(() => {
    if (prescription?.user_id) {
      setLoadingProfile(true);
      const fetchProfile = async () => {
        const supabase = createClient();
        const { data } = await supabase
          .from("profiles")
          .select("name, email")
          .eq("id", prescription.user_id)
          .single();
        setPatientName(data?.name || null);
        setPatientEmail(data?.email || null);
        setLoadingProfile(false);
      };
      fetchProfile();
    }
  }, [prescription?.user_id]);

  // Fetch prescription images when prescription is loaded
  useEffect(() => {
    if (prescription?.files) {
      setLoadingImages(true);
      let files: { path?: string; filename?: string }[] = [];
      if (Array.isArray(prescription.files)) {
        files = prescription.files as { path?: string; filename?: string }[];
      }
      files = files.filter((f) => f.path);
      const supabase = createClient();
      Promise.all(
        files.map(async (file) => {
          try {
            const { data } = await supabase.storage
              .from("prescriptions")
              .createSignedUrl(file.path!, 60 * 60);
            return data?.signedUrl || "";
          } catch {
            return "";
          }
        })
      ).then((urls) => {
        setImageUrls(urls);
        setSelectedImage(0);
        setLoadingImages(false);
      });
    } else {
      setImageUrls([]);
      setSelectedImage(0);
      setLoadingImages(false);
    }
  }, [prescription?.files]);

  const addQuotationItem = () => {
    setQuotationItems([
      ...quotationItems,
      { drug: "", quantity: "", price: "", notes: "" },
    ]);
  };

  const updateQuotationItem = (index: number, field: string, value: string) => {
    const updated = quotationItems.map((item, i) =>
      i === index ? { ...item, [field]: value } : item
    );
    setQuotationItems(updated);
  };

  const removeQuotationItem = (index: number) => {
    if (quotationItems.length > 1) {
      setQuotationItems(quotationItems.filter((_, i) => i !== index));
    }
  };

  const calculateSubtotal = () => {
    return quotationItems.reduce((total, item) => {
      const price = Number.parseFloat(item.price) || 0;
      return total + price;
    }, 0);
  };

  const calculateTotal = () => {
    return calculateSubtotal() + Number.parseFloat(deliveryFee);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate that at least one item has all required fields
    const validItems = quotationItems.filter(
      (item) => item.drug.trim() && item.quantity.trim() && item.price.trim()
    );

    if (validItems.length === 0) {
      toast({
        title: "Invalid quotation",
        description:
          "Please add at least one complete item with drug name, quantity, and price.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    // Get current user (pharmacy)
    const supabase = createClient();
    const { data: userData, error: userError } = await supabase.auth.getUser();
    if (userError || !userData?.user) {
      toast({
        title: "Not authenticated",
        description: "You must be logged in as a pharmacy to submit a quote.",
        variant: "destructive",
      });
      setLoading(false);
      return;
    }
    const pharmacy_id = userData.user.id;

    // Ensure prescription id is present
    if (!prescription?.id) {
      toast({
        title: "Prescription not loaded",
        description: "Cannot submit quote: prescription not found.",
        variant: "destructive",
      });
      setLoading(false);
      return;
    }

    // Insert quote into Supabase
    const { error: quoteError } = await supabase.from("quotes").insert([
      {
        prescription_id: prescription.id,
        pharmacy_id,
        items: validItems as any, // cast to Json
        delivery_fee: Number.parseFloat(deliveryFee),
        estimated_delivery: estimatedDelivery,
        notes: quotationNotes,
        status: "pending",
      },
    ]);
    setLoading(false);
    if (quoteError) {
      toast({
        title: "Failed to submit quotation",
        description: quoteError.message,
        variant: "destructive",
      });
      return;
    }

    // Call API route to send email with PDF
    try {
      const origin =
        typeof window !== "undefined" ? window.location.origin : "";
      const res = await fetch("/api/send-quotation-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          patientName,
          patientEmail,
          prescription,
          items: validItems,
          deliveryFee,
          estimatedDelivery,
          notes: quotationNotes,
          origin,
        }),
      });
      if (!res.ok) {
        toast({
          title: "Failed to send quotation email",
          description: (await res.json()).error || "Unknown error",
          variant: "destructive",
        });
      }
    } catch (err: any) {
      toast({
        title: "Failed to send quotation email",
        description: err.message,
        variant: "destructive",
      });
    }

    toast({
      title: "Quotation sent successfully!",
      description: `Quotation for ${
        patientName || prescription.user_id
      } has been sent. The patient will be notified via email.`,
    });
    router.push("/pharmacy/quotations");
  };

  if (fetching) {
    return (
      <Card>
        <CardContent className="p-12 text-center">
          <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            Loading prescription...
          </h3>
        </CardContent>
      </Card>
    );
  }

  if (!prescription) {
    return (
      <>
        <header className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Prescription not found
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            The prescription you're looking for doesn't exist.
          </p>
        </header>
        <Card>
          <CardContent className="p-12 text-center">
            <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <Link href="/pharmacy/prescriptions">
              <Button>Back to Prescriptions</Button>
            </Link>
          </CardContent>
        </Card>
      </>
    );
  }

  return (
    <>
      <header className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Create Quotation
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Create quotation for{" "}
          {loadingProfile ? "Loading..." : patientName || "Unknown"}
        </p>
      </header>
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Prescription Details */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Prescription Details</CardTitle>
                <CardDescription>
                  Review the prescription information
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Prescription Images */}
                  <div>
                    <h4 className="font-medium mb-2">Prescription Images</h4>
                    <div className="space-y-2">
                      {/* Main image view */}
                      {loadingImages ? (
                        <div className="aspect-[4/3] bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                          <div className="flex flex-col items-center justify-center">
                            <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-400 border-t-transparent mb-2"></div>
                            <p className="text-sm text-gray-500">
                              Loading images...
                            </p>
                          </div>
                        </div>
                      ) : imageUrls.length > 0 && imageUrls[selectedImage] ? (
                        <div className="aspect-[4/3] bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center overflow-hidden">
                          <img
                            src={imageUrls[selectedImage]}
                            alt={`Prescription image ${selectedImage + 1}`}
                            className="object-contain max-h-[350px] w-full h-full"
                          />
                        </div>
                      ) : (
                        <div className="aspect-[4/3] bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                          <div className="text-center">
                            <FileText className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                            <p className="text-sm text-gray-500">No Images</p>
                          </div>
                        </div>
                      )}
                      {/* Thumbnails */}
                      {imageUrls.length > 1 && (
                        <div className="flex gap-2 mt-2 justify-center">
                          {imageUrls.map((url, idx) => (
                            <button
                              key={idx}
                              type="button"
                              className={`border rounded-lg overflow-hidden w-16 h-16 flex items-center justify-center ${
                                selectedImage === idx
                                  ? "ring-2 ring-blue-500"
                                  : "border-gray-300 dark:border-gray-700"
                              }`}
                              onClick={() => setSelectedImage(idx)}
                            >
                              {url ? (
                                <img
                                  src={url}
                                  alt={`Thumbnail ${idx + 1}`}
                                  className="object-cover w-full h-full"
                                />
                              ) : (
                                <FileText className="w-6 h-6 text-gray-400" />
                              )}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Patient Information */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Patient Name</p>
                      <p className="font-medium">
                        {loadingProfile
                          ? "Loading..."
                          : patientName || "Unknown"}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Email</p>
                      <p className="font-medium">
                        {loadingProfile
                          ? "Loading..."
                          : patientEmail || "Unknown"}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Phone</p>
                      <p className="font-medium">
                        {formatPhoneNumber(prescription.phone)}
                      </p>
                    </div>
                    <div className="col-span-2">
                      <p className="text-sm text-gray-500">Delivery Address</p>
                      <p className="font-medium">{prescription.address}</p>
                    </div>
                    <div className="col-span-2">
                      <p className="text-sm text-gray-500">
                        Preferred Delivery Time
                      </p>
                      <p className="font-medium">
                        {prescription.preferred_time_slot}
                      </p>
                    </div>
                  </div>

                  {/* Patient Notes */}
                  <div>
                    <p className="text-sm text-gray-500">Patient Notes</p>
                    <p className="font-medium p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      {prescription.note}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quotation Form */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Create Quotation</CardTitle>
                <CardDescription>
                  Add medications and pricing details
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Quotation Items */}
                  <div>
                    <Label className="text-base font-medium">Medications</Label>
                    <div className="space-y-4 mt-2">
                      {quotationItems.map((item, index) => (
                        <div
                          key={index}
                          className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg"
                        >
                          <div className="flex justify-between items-start mb-3">
                            <h4 className="font-medium">Item {index + 1}</h4>
                            {quotationItems.length > 1 && (
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => removeQuotationItem(index)}
                              >
                                <X className="w-4 h-4" />
                              </Button>
                            )}
                          </div>

                          <div className="grid grid-cols-1 gap-3">
                            <div>
                              <Label htmlFor={`drug-${index}`}>
                                Medicine Name *
                              </Label>
                              <Input
                                id={`drug-${index}`}
                                placeholder="e.g., Amoxicillin 500mg"
                                value={item.drug}
                                onChange={(e) =>
                                  updateQuotationItem(
                                    index,
                                    "drug",
                                    e.target.value
                                  )
                                }
                              />
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                              <div>
                                <Label htmlFor={`quantity-${index}`}>
                                  Quantity *
                                </Label>
                                <Input
                                  id={`quantity-${index}`}
                                  placeholder="e.g., 30 tablets"
                                  value={item.quantity}
                                  onChange={(e) =>
                                    updateQuotationItem(
                                      index,
                                      "quantity",
                                      e.target.value
                                    )
                                  }
                                />
                              </div>
                              <div>
                                <Label htmlFor={`price-${index}`}>
                                  Amount ($) *
                                </Label>
                                <Input
                                  id={`price-${index}`}
                                  type="number"
                                  step="0.01"
                                  placeholder="0.00"
                                  value={item.price}
                                  onChange={(e) =>
                                    updateQuotationItem(
                                      index,
                                      "price",
                                      e.target.value
                                    )
                                  }
                                />
                              </div>
                            </div>

                            <div>
                              <Label htmlFor={`notes-${index}`}>
                                Notes (Optional)
                              </Label>
                              <Input
                                id={`notes-${index}`}
                                placeholder="Additional notes for this item"
                                value={item.notes}
                                onChange={(e) =>
                                  updateQuotationItem(
                                    index,
                                    "notes",
                                    e.target.value
                                  )
                                }
                              />
                            </div>
                          </div>
                        </div>
                      ))}

                      <Button
                        type="button"
                        variant="outline"
                        onClick={addQuotationItem}
                        className="w-full"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Add Another Item
                      </Button>
                    </div>
                  </div>

                  {/* Delivery Information */}
                  <div className="space-y-4">
                    <Label className="text-base font-medium">
                      Delivery Information
                    </Label>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="deliveryFee">Delivery Fee ($)</Label>
                        <Input
                          id="deliveryFee"
                          type="number"
                          step="0.01"
                          value={deliveryFee}
                          onChange={(e) => setDeliveryFee(e.target.value)}
                        />
                      </div>
                      <div>
                        <Label htmlFor="estimatedDelivery">
                          Estimated Delivery
                        </Label>
                        <Input
                          id="estimatedDelivery"
                          placeholder="e.g., 2-3 hours"
                          value={estimatedDelivery}
                          onChange={(e) => setEstimatedDelivery(e.target.value)}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Additional Notes */}
                  <div>
                    <Label htmlFor="quotationNotes">
                      Additional Notes (Optional)
                    </Label>
                    <Textarea
                      id="quotationNotes"
                      placeholder="Any additional information or special instructions..."
                      value={quotationNotes}
                      onChange={(e) => setQuotationNotes(e.target.value)}
                      rows={3}
                    />
                  </div>

                  {/* Total Summary */}
                  <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Subtotal:</span>
                        <span>${calculateSubtotal().toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Delivery Fee:</span>
                        <span>
                          ${Number.parseFloat(deliveryFee).toFixed(2)}
                        </span>
                      </div>
                      <div className="flex justify-between font-semibold text-lg pt-2 border-t border-gray-200 dark:border-gray-700">
                        <span>Total:</span>
                        <span>${calculateTotal().toFixed(2)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div className="flex space-x-3">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => router.back()}
                      className="flex-1"
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      disabled={loading}
                      className="flex-1 bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700"
                    >
                      {loading ? (
                        "Sending..."
                      ) : (
                        <>
                          <Send className="w-4 h-4 mr-2" />
                          Send Quotation
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
}
