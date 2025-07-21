"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Upload, FileText, Clock, CheckCircle, Plus, Eye } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { createClient } from "@/utils/supabase/client";
import type { Tables } from "@/utils/supabase/types";

type Prescription = Tables<"prescriptions"> & {
  quotes: Tables<"quotes">[];
};

export default function UserDashboard() {
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  // Modal and gallery state
  const [modalOpen, setModalOpen] = useState(false);
  const [modalPrescription, setModalPrescription] =
    useState<Prescription | null>(null);
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
        setLoading(false);
        return;
      }
      const userId = userData.user.id;
      const { data, error } = await supabase
        .from("prescriptions")
        .select("*, quotes(*)")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });
      if (error || !data) {
        setPrescriptions([]);
        setLoading(false);
        return;
      }
      setPrescriptions(data as Prescription[]);
      setLoading(false);
    };
    fetchPrescriptions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Stats
  const totalUploads = prescriptions.length;
  const totalQuotations = prescriptions.reduce(
    (sum, p) => sum + (p.quotes?.length || 0),
    0
  );
  const pendingCount = prescriptions.filter(
    (p) => p.quotes?.length === 0
  ).length;
  const completedCount = prescriptions.filter((p) =>
    p.quotes?.some((q) => q.status === "accepted")
  ).length;

  // Recent prescriptions (show 5 most recent)
  const recentPrescriptions = prescriptions.slice(0, 5);

  // Modal image gallery logic (same as /user/prescriptions)
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
    setImageUrls(urls);
    setSelectedImage(0);
    setLoadingImages(false);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setModalPrescription(null);
    setImageUrls([]);
    setSelectedImage(0);
    setLoadingImages(false);
  };

  const getStatusColor = (status: string | null) => {
    switch (status) {
      case "pending":
      case null:
        return "bg-yellow-100 text-yellow-800";
      case "completed":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: string | null) => {
    switch (status) {
      case "pending":
      case null:
        return <Clock className="w-4 h-4 mr-1" />;
      case "completed":
        return <CheckCircle className="w-4 h-4 mr-1" />;
      default:
        return null;
    }
  };

  return (
    <>
      <header className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Dashboard
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Manage your prescriptions and quotations
        </p>
      </header>
      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-6 md:mb-8">
        <Card>
          <CardContent className="p-4 md:p-6">
            <div className="flex items-center">
              <Upload className="w-6 h-6 md:w-8 md:h-8 text-blue-600" />
              <div className="ml-3 md:ml-4">
                <p className="text-xs md:text-sm font-medium text-gray-600 dark:text-gray-400">
                  Total Uploads
                </p>
                <p className="text-lg md:text-2xl font-bold text-gray-900 dark:text-white">
                  {totalUploads}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 md:p-6">
            <div className="flex items-center">
              <FileText className="w-6 h-6 md:w-8 md:h-8 text-green-600" />
              <div className="ml-3 md:ml-4">
                <p className="text-xs md:text-sm font-medium text-gray-600 dark:text-gray-400">
                  Quotations
                </p>
                <p className="text-lg md:text-2xl font-bold text-gray-900 dark:text-white">
                  {totalQuotations}
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
                  Pending
                </p>
                <p className="text-lg md:text-2xl font-bold text-gray-900 dark:text-white">
                  {pendingCount}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 md:p-6">
            <div className="flex items-center">
              <CheckCircle className="w-6 h-6 md:w-8 md:h-8 text-purple-600" />
              <div className="ml-3 md:ml-4">
                <p className="text-xs md:text-sm font-medium text-gray-600 dark:text-gray-400">
                  Completed
                </p>
                <p className="text-lg md:text-2xl font-bold text-gray-900 dark:text-white">
                  {completedCount}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="mb-6 md:mb-8">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Quick Actions
        </h2>
        <div className="flex flex-col sm:flex-row gap-3 md:gap-4">
          <Link href="/user/upload" className="flex-1 sm:flex-none">
            <Button className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 w-full sm:w-auto">
              <Plus className="w-4 h-4 mr-2" />
              Upload Prescription
            </Button>
          </Link>
          <Link href="/user/quotations" className="flex-1 sm:flex-none">
            <Button variant="outline" className="w-full sm:w-auto">
              <FileText className="w-4 h-4 mr-2" />
              View Quotations
            </Button>
          </Link>
        </div>
      </div>

      {/* Recent Prescriptions */}
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Recent Prescriptions
          </h2>
          <Link href="/user/prescriptions">
            <Button variant="outline" size="sm" className="w-full sm:w-auto">
              <Eye className="w-4 h-4 mr-2" />
              View All
            </Button>
          </Link>
        </div>
        <div className="grid gap-4">
          {loading ? (
            <Card>
              <CardContent className="p-8 md:p-12 text-center">
                <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  Loading prescriptions...
                </h3>
              </CardContent>
            </Card>
          ) : recentPrescriptions.length === 0 ? (
            <Card>
              <CardContent className="p-8 md:p-12 text-center">
                <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  No prescriptions found
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Upload a prescription to get started.
                </p>
              </CardContent>
            </Card>
          ) : (
            recentPrescriptions.map((prescription) => (
              <Card
                key={prescription.id}
                className="hover:shadow-md transition-shadow"
              >
                <CardContent className="p-4 md:p-6">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mb-2">
                        <Badge className={getStatusColor(prescription.status)}>
                          <div className="flex items-center">
                            {getStatusIcon(prescription.status ?? null)}
                            <span>
                              {(prescription.status ?? "pending")
                                .charAt(0)
                                .toUpperCase() +
                                (prescription.status ?? "pending").slice(1)}
                            </span>
                          </div>
                        </Badge>
                        <span className="text-sm text-gray-500">
                          Uploaded on{" "}
                          {new Date(
                            prescription.created_at ?? ""
                          ).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-gray-900 dark:text-white font-medium mb-1 truncate">
                        {prescription.note}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                        {Array.isArray(prescription.files)
                          ? prescription.files.length
                          : 0}{" "}
                        images • Delivery:{" "}
                        {prescription.preferred_time_slot ?? "-"}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                        {prescription.address}
                      </p>
                      {prescription.quotes?.length > 0 && (
                        <p className="text-sm text-blue-600 mt-2">
                          {prescription.quotes.length} quotation(s) received
                        </p>
                      )}
                    </div>
                    <div className="flex flex-col sm:flex-row gap-2 lg:flex-shrink-0">
                      <Dialog
                        open={
                          modalOpen && modalPrescription?.id === prescription.id
                        }
                        onOpenChange={(open) => {
                          if (!open) handleCloseModal();
                        }}
                      >
                        <DialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            className="w-full sm:w-auto"
                            onClick={() => handleOpenModal(prescription)}
                          >
                            View Details
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-3xl max-h-[90vh] overflow-auto">
                          <DialogHeader>
                            <DialogTitle>Prescription Details</DialogTitle>
                            <DialogDescription>
                              Uploaded on{" "}
                              {new Date(
                                prescription.created_at ?? ""
                              ).toLocaleDateString()}
                            </DialogDescription>
                          </DialogHeader>
                          <div className="space-y-6">
                            {/* Prescription Images */}
                            <div>
                              <h3 className="font-semibold mb-4">
                                Prescription Images
                              </h3>
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
                                ) : imageUrls.length > 0 &&
                                  imageUrls[selectedImage] ? (
                                  <div className="aspect-[4/3] bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center overflow-hidden">
                                    <img
                                      src={imageUrls[selectedImage]}
                                      alt={`Prescription image ${
                                        selectedImage + 1
                                      }`}
                                      className="object-contain max-h-[350px] w-full h-full"
                                    />
                                  </div>
                                ) : (
                                  <div className="aspect-[4/3] bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                                    <div className="text-center">
                                      <FileText className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                                      <p className="text-sm text-gray-500">
                                        No Images
                                      </p>
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
                            {/* Prescription Details */}
                            <div>
                              <h3 className="font-semibold mb-4">Details</h3>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                  <p className="text-sm text-gray-500">
                                    Status
                                  </p>
                                  <Badge
                                    className={getStatusColor(
                                      prescription.status
                                    )}
                                  >
                                    {(prescription.status ?? "pending")
                                      .charAt(0)
                                      .toUpperCase() +
                                      (prescription.status ?? "pending").slice(
                                        1
                                      )}
                                  </Badge>
                                </div>
                                <div>
                                  <p className="text-sm text-gray-500">
                                    Upload Date
                                  </p>
                                  <p className="font-medium">
                                    {new Date(
                                      prescription.created_at ?? ""
                                    ).toLocaleDateString()}
                                  </p>
                                </div>
                                <div>
                                  <p className="text-sm text-gray-500">
                                    Delivery Address
                                  </p>
                                  <p className="font-medium">
                                    {prescription.address}
                                  </p>
                                </div>
                                <div>
                                  <p className="text-sm text-gray-500">
                                    Delivery Time
                                  </p>
                                  <p className="font-medium">
                                    {prescription.preferred_time_slot ?? "-"}
                                  </p>
                                </div>
                              </div>
                            </div>
                            {/* Notes */}
                            <div>
                              <h3 className="font-semibold mb-2">Notes</h3>
                              <p className="text-gray-600 dark:text-gray-400 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                                {prescription.note}
                              </p>
                            </div>
                            {/* Quotations */}
                            {prescription.quotes?.length > 0 && (
                              <div>
                                <h3 className="font-semibold mb-4">
                                  Quotations
                                </h3>
                                <div className="space-y-4">
                                  {prescription.quotes.map((quotation) => {
                                    // Calculate total for quote
                                    let total = 0;
                                    if (Array.isArray(quotation.items)) {
                                      total = quotation.items.reduce(
                                        (sum: number, item: any) =>
                                          sum +
                                          (parseFloat(
                                            item.price || item.amount
                                          ) || 0),
                                        0
                                      );
                                    }
                                    total += quotation.delivery_fee || 0;
                                    return (
                                      <Card key={quotation.id}>
                                        <CardContent className="p-4">
                                          <div className="flex justify-between items-center mb-2">
                                            <h4 className="font-medium">
                                              Quotation from pharmacy
                                            </h4>
                                            <p className="font-bold">
                                              ${total.toFixed(2)}
                                            </p>
                                          </div>
                                          <div className="space-y-2">
                                            {Array.isArray(quotation.items) &&
                                              quotation.items.map(
                                                (item: any, index: number) => (
                                                  <div
                                                    key={index}
                                                    className="flex justify-between text-sm text-gray-600 dark:text-gray-400"
                                                  >
                                                    <span>
                                                      {item.drug} (
                                                      {item.quantity})
                                                    </span>
                                                    <span>
                                                      $
                                                      {parseFloat(
                                                        item.price ||
                                                          item.amount
                                                      ).toFixed(2)}
                                                    </span>
                                                  </div>
                                                )
                                              )}
                                          </div>
                                          <div className="mt-4 flex justify-end space-x-2">
                                            <Link href={`/user/quotations`}>
                                              <Button size="sm">
                                                View Full Quotation
                                              </Button>
                                            </Link>
                                          </div>
                                        </CardContent>
                                      </Card>
                                    );
                                  })}
                                </div>
                              </div>
                            )}
                          </div>
                        </DialogContent>
                      </Dialog>
                      {prescription.quotes?.length > 0 && (
                        <Link
                          href="/user/quotations"
                          className="w-full sm:w-auto"
                        >
                          <Button size="sm" className="w-full">
                            View Quotations
                          </Button>
                        </Link>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </>
  );
}
