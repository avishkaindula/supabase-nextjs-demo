"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  FileText,
  Clock,
  CheckCircle,
  Plus,
  Eye,
  Send,
  XCircle,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";
import { createClient } from "@/utils/supabase/client";
import type { Tables } from "@/utils/supabase/types";
import { useRef } from "react";

type Prescription = Tables<"prescriptions"> & {
  quotes: Tables<"quotes">[];
  patientProfile?: { name: string | null };
};

export default function PharmacyDashboard() {
  const { toast } = useToast();
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();
  const [selectedPrescription, setSelectedPrescription] = useState(null);
  const [quotationItems, setQuotationItems] = useState([
    { drug: "", quantity: "", price: "" },
  ]);
  const [quotes, setQuotes] = useState<Tables<"quotes">[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalPrescription, setModalPrescription] = useState<Prescription | null>(null);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [selectedImage, setSelectedImage] = useState(0);
  const [loadingImages, setLoadingImages] = useState(false);

  useEffect(() => {
    const fetchPrescriptions = async () => {
      setLoading(true);
      const { data: userData, error: userError } =
        await supabase.auth.getUser();
      if (userError || !userData?.user) {
        setPrescriptions([]);
        setQuotes([]);
        setLoading(false);
        return;
      }
      const userId = userData.user.id;
      // Fetch prescriptions and quotes
      const { data: prescData, error: prescError } = await supabase
        .from("prescriptions")
        .select("*, quotes(*)")
        .order("created_at", { ascending: false });
      const { data: quotesData, error: quotesError } = await supabase
        .from("quotes")
        .select("*")
        .eq("pharmacy_id", userId);
      if (prescError || !prescData || quotesError || !quotesData) {
        setPrescriptions([]);
        setQuotes([]);
        setLoading(false);
        return;
      }
      // Filter prescriptions where this pharmacy has a quote or is eligible to quote
      const filtered = (prescData as Prescription[]).filter(
        (p) =>
          p.quotes.some((q) => q.pharmacy_id === userId) ||
          p.quotes.length === 0
      );
      // Fetch patient names for all unique user_ids
      const userIds = Array.from(new Set(filtered.map((p) => p.user_id)));
      let profileMap: Record<string, { name: string | null }> = {};
      if (userIds.length > 0) {
        const { data: profiles } = await supabase
          .from("profiles")
          .select("id, name")
          .in("id", userIds);
        if (profiles) {
          profiles.forEach((profile) => {
            profileMap[profile.id] = { name: profile.name };
          });
        }
      }
      // Attach patientProfile to each prescription
      const withNames = filtered.map((p) => ({
        ...p,
        patientProfile: profileMap[p.user_id] || { name: null },
      }));
      setPrescriptions(withNames);
      setQuotes(quotesData as Tables<"quotes">[]);
      setLoading(false);
    };
    fetchPrescriptions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const addQuotationItem = () => {
    setQuotationItems([
      ...quotationItems,
      { drug: "", quantity: "", price: "" },
    ]);
  };

  const updateQuotationItem = (index: number, field: string, value: string) => {
    const updated = quotationItems.map((item, i) =>
      i === index ? { ...item, [field]: value } : item
    );
    setQuotationItems(updated);
  };

  const removeQuotationItem = (index: number) => {
    setQuotationItems(quotationItems.filter((_, i) => i !== index));
  };

  const calculateTotal = () => {
    return quotationItems
      .reduce((total, item) => {
        const price = Number.parseFloat(item.price) || 0;
        return total + price;
      }, 0)
      .toFixed(2);
  };

  const sendQuotation = () => {
    toast({
      title: "Quotation sent successfully!",
      description:
        "The patient will be notified via email and can view the quotation in their dashboard.",
    });
    setSelectedPrescription(null);
    setQuotationItems([{ drug: "", quantity: "", price: "" }]);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "quoted":
        return "bg-blue-100 text-blue-800";
      case "accepted":
        return "bg-green-100 text-green-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Stats
  const newPrescriptions = prescriptions.filter(
    (p) => (p.status ?? "pending") === "pending"
  ).length;
  const pendingQuotes = quotes.filter((q) => q.status === "pending").length;
  const completedQuotes = quotes.filter((q) => q.status === "accepted").length;
  const rejectedQuotes = quotes.filter((q) => q.status === "rejected").length;

  // Helper to format Sri Lankan phone numbers (e.g., +94713768901 -> +94 71 376 8901)
  function formatPhoneNumber(phone: string) {
    const match = phone.match(/^[+]?94(\d{2})(\d{3})(\d{4})$/);
    if (match) {
      return `+94 ${match[1]} ${match[2]} ${match[3]}`;
    }
    return phone;
  }

  // Open modal for a prescription and load its images
  const handleOpenModal = async (prescription: Prescription) => {
    setModalPrescription(prescription);
    setModalOpen(true);
    setImageUrls([]);
    setSelectedImage(0);
    setLoadingImages(true);
    let files: { path?: string; filename?: string }[] = [];
    if (Array.isArray(prescription.files)) {
      files = prescription.files as { path?: string; filename?: string }[];
    }
    files = files.filter((f) => f.path);
    const urls: string[] = [];
    for (const file of files) {
      try {
        // If you want logs, keep this:
        console.log(file.path);
        const { data } = await supabase.storage
          .from("prescriptions")
          .createSignedUrl(file.path!, 60 * 60);
        if (data?.signedUrl) {
          urls.push(data.signedUrl);
        } else {
          urls.push("");
        }
      } catch (e) {
        urls.push("");
      }
    }
    console.log(urls);
    setImageUrls(urls);
    setSelectedImage(0);
    setLoadingImages(false);
  };

  // Close modal and reset state
  const handleCloseModal = () => {
    setModalOpen(false);
    setModalPrescription(null);
    setImageUrls([]);
    setSelectedImage(0);
    setLoadingImages(false);
  };

  return (
    <>
      <header className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Pharmacy Dashboard
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Manage prescriptions and create quotations
        </p>
      </header>
      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-6 md:mb-8">
        <Card>
          <CardContent className="p-4 md:p-6">
            <div className="flex items-center">
              <FileText className="w-6 h-6 md:w-8 md:h-8 text-blue-600" />
              <div className="ml-3 md:ml-4">
                <p className="text-xs md:text-sm font-medium text-gray-600 dark:text-gray-400">
                  New Prescriptions
                </p>
                <p className="text-lg md:text-2xl font-bold text-gray-900 dark:text-white">
                  {newPrescriptions}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 md:p-6">
            <div className="flex items-center">
              <Clock className="w-6 h-6 md:w-8 md:h-8 text-yellow-600" />
              <div className="ml-3 md:ml-4">
                <p className="text-xs md:text-sm font-medium text-gray-600 dark:text-gray-400">
                  Pending Quotes
                </p>
                <p className="text-lg md:text-2xl font-bold text-gray-900 dark:text-white">
                  {pendingQuotes}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 md:p-6">
            <div className="flex items-center">
              <CheckCircle className="w-6 h-6 md:w-8 md:h-8 text-green-600" />
              <div className="ml-3 md:ml-4">
                <p className="text-xs md:text-sm font-medium text-gray-600 dark:text-gray-400">
                  Accepted Quotes
                </p>
                <p className="text-lg md:text-2xl font-bold text-gray-900 dark:text-white">
                  {completedQuotes}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 md:p-6">
            <div className="flex items-center">
              <XCircle className="w-6 h-6 md:w-8 md:h-8 text-red-600" />
              <div className="ml-3 md:ml-4">
                <p className="text-xs md:text-sm font-medium text-gray-600 dark:text-gray-400">
                  Rejected Quotes
                </p>
                <p className="text-lg md:text-2xl font-bold text-gray-900 dark:text-white">
                  {rejectedQuotes}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      {/* Prescriptions List */}
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Recent Prescriptions
          </h2>
          <Link href="/pharmacy/prescriptions">
            <Button variant="outline" className="w-full sm:w-auto">
              <FileText className="w-4 h-4 mr-2" />
              View All
            </Button>
          </Link>
        </div>
        {loading ? (
          <div className="grid gap-4">
            {/* Loading state can be handled here if needed */}
          </div>
        ) : prescriptions.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                No prescriptions yet
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                New prescriptions will appear here as soon as they are uploaded by users.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {prescriptions.map((prescription) => (
              <Card
                key={prescription.id}
                className="hover:shadow-md transition-shadow"
              >
                <CardContent className="p-4 md:p-6">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mb-2">
                        <h3 className="font-semibold text-gray-900 dark:text-white truncate">
                          {prescription.patientProfile?.name || "Unknown Patient"}
                        </h3>
                        <Badge
                          className={getStatusColor(
                            prescription.status ?? "pending"
                          )}
                        >
                          {(prescription.status ?? "pending")
                            .charAt(0)
                            .toUpperCase() +
                            (prescription.status ?? "pending").slice(1)}
                        </Badge>
                        <span className="text-sm text-gray-500">
                          {new Date(prescription.created_at).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-gray-900 dark:text-white mb-1 truncate">
                        {prescription.note}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                        {Array.isArray(prescription.files) &&
                        prescription.files.every((f) => typeof f === "object")
                          ? prescription.files.length
                          : 0}{" "}
                        images • Delivery: {prescription.preferred_time_slot}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                        {prescription.address} • {prescription.phone}
                      </p>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-2 lg:flex-shrink-0">
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full sm:w-auto"
                        onClick={() => handleOpenModal(prescription)}
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        View
                      </Button>
                      {prescription.quotes.length === 0 &&
                        (prescription.status ?? "pending") === "pending" && (
                          <Link
                            href={`/pharmacy/create-quote/${prescription.id}`}
                            className="w-full sm:w-auto"
                          >
                            <Button
                              size="sm"
                              className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 w-full"
                            >
                              Create Quote
                            </Button>
                          </Link>
                        )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
      {/* Modal for prescription details (copied/adapted from prescriptions page) */}
      <Dialog
        open={modalOpen}
        onOpenChange={(open) => {
          if (!open) handleCloseModal();
        }}
      >
        <DialogContent
          className="max-w-4xl max-h-[80vh] overflow-auto"
          onInteractOutside={handleCloseModal}
          onEscapeKeyDown={handleCloseModal}
        >
          <DialogHeader>
            <DialogTitle>Prescription Details</DialogTitle>
            <DialogDescription>Review prescription details</DialogDescription>
          </DialogHeader>
          {modalPrescription && (
            <div className="space-y-6">
              {/* Prescription Images */}
              <div>
                <h3 className="font-semibold mb-4">Prescription Images</h3>
                <div className="space-y-4">
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
              <div>
                <h3 className="font-semibold mb-4">Patient Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Name</p>
                    <p className="font-medium">{modalPrescription.patientProfile?.name || "Unknown Patient"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Phone</p>
                    <p className="font-medium">{formatPhoneNumber(modalPrescription.phone)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Delivery Address</p>
                    <p className="font-medium">{modalPrescription.address}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Delivery Time</p>
                    <p className="font-medium">{modalPrescription.preferred_time_slot}</p>
                  </div>
                </div>
              </div>
              {/* Notes */}
              <div>
                <h3 className="font-semibold mb-2">Patient Notes</h3>
                <p className="text-gray-600 dark:text-gray-400 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  {modalPrescription.note}
                </p>
              </div>
              {/* Actions */}
              <div className="flex justify-end space-x-3">
                {modalPrescription.quotes.length === 0 && (
                  <Link href={`/pharmacy/create-quote/${modalPrescription.id}`}>
                    <Button className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700">
                      <Send className="w-4 h-4 mr-2" />
                      Create Quotation
                    </Button>
                  </Link>
                )}
                {modalPrescription.quotes.length > 0 && (
                  <Button variant="outline">View Quotation</Button>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
