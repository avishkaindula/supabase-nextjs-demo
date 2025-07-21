"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { FileText, Search, Eye, Send } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import Link from "next/link";
import { createClient } from "@/utils/supabase/client";
import type { Tables } from "@/utils/supabase/types";

// Types

type Prescription = Tables<"prescriptions"> & {
  quotes: Tables<"quotes">[];
};

// Helper to format Sri Lankan phone numbers (e.g., +94713768901 -> +94 71 376 8901)
function formatPhoneNumber(phone: string) {
  // Only format if it matches +94XXXXXXXXX
  const match = phone.match(/^\+94(\d{2})(\d{3})(\d{4})$/);
  if (match) {
    return `+94 ${match[1]} ${match[2]} ${match[3]}`;
  }
  return phone;
}

export default function PrescriptionsPage() {
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const supabase = createClient();
  // Modal and gallery state (single modal for all prescriptions)
  const [modalOpen, setModalOpen] = useState(false);
  const [modalPrescription, setModalPrescription] =
    useState<Prescription | null>(null);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [selectedImage, setSelectedImage] = useState(0);
  const [loadingImages, setLoadingImages] = useState(false);

  useEffect(() => {
    const fetchPendingPrescriptions = async () => {
      const { data } = await supabase
        .from("prescriptions")
        .select("*, quotes(*)")
        .eq("status", "pending")
        .order("created_at", { ascending: false });
      if (data) setPrescriptions(data as Prescription[]);
      setLoading(false);
    };
    fetchPendingPrescriptions();
  }, []);

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

  // Only filter by search (all prescriptions are pending)
  const filteredPrescriptions = prescriptions.filter((prescription) => {
    return (
      prescription.address?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prescription.note?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prescription.phone?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

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
          Prescriptions
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          View and manage all patient prescriptions
        </p>
      </header>
      {/* Search Only */}
      <div className="mb-6 flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            size={18}
          />
          <Input
            placeholder="Search prescriptions..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Prescriptions List */}
      <div className="grid gap-4">
        {loading ? (
          <Card>
            <CardContent className="p-12 text-center">
              <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                Loading prescriptions...
              </h3>
            </CardContent>
          </Card>
        ) : filteredPrescriptions.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                No prescriptions found
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Try adjusting your search or filter criteria.
              </p>
            </CardContent>
          </Card>
        ) : (
          filteredPrescriptions.map((prescription) => {
            // Determine status for badge
            let badgeStatus = "pending";
            if (prescription.quotes.some((q) => q.status === "accepted"))
              badgeStatus = "accepted";
            else if (prescription.quotes.some((q) => q.status === "rejected"))
              badgeStatus = "rejected";
            else if (prescription.quotes.length > 0) badgeStatus = "quoted";
            return (
              <Card
                key={prescription.id}
                className="hover:shadow-md transition-shadow"
              >
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-4 mb-2">
                        <h3 className="font-semibold text-gray-900 dark:text-white">
                          {prescription.address}
                        </h3>
                        <Badge className={getStatusColor(badgeStatus)}>
                          {badgeStatus.charAt(0).toUpperCase() +
                            badgeStatus.slice(1)}
                        </Badge>
                        <span className="text-sm text-gray-500">
                          {new Date(
                            prescription.created_at
                          ).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-gray-900 dark:text-white mb-1">
                        {prescription.note}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Delivery: {prescription.preferred_time_slot}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {prescription.address} • {prescription.phone}
                      </p>
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleOpenModal(prescription)}
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        View
                      </Button>

                      {prescription.quotes.length === 0 && (
                        <Link
                          href={`/pharmacy/create-quote/${prescription.id}`}
                        >
                          <Button
                            size="sm"
                            className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700"
                          >
                            <Send className="w-4 h-4 mr-2" />
                            Quote
                          </Button>
                        </Link>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>
      {/* Single Modal for all prescriptions */}
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
                    <p className="text-sm text-gray-500">Phone</p>
                    <p className="font-medium">
                      {formatPhoneNumber(modalPrescription.phone)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Delivery Address</p>
                    <p className="font-medium">{modalPrescription.address}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Delivery Time</p>
                    <p className="font-medium">
                      {modalPrescription.preferred_time_slot}
                    </p>
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
