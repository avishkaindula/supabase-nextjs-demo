"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  FileText,
  Search,
  Filter,
  Eye,
  Clock,
  CheckCircle,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import Link from "next/link";
import { createClient } from "@/utils/supabase/client";
import type { Tables } from "@/utils/supabase/types";

// Types

type Prescription = Tables<"prescriptions"> & {
  quotes: Tables<"quotes">[];
};

export default function PrescriptionsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
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

  // Filtering logic: only use selectedStatus
  const filteredPrescriptions = prescriptions.filter((prescription) => {
    const matchesSearch =
      (prescription.note || "")
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      (prescription.address || "")
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      (prescription.phone || "")
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
    let statusMatch = false;
    if (selectedStatus === "all") {
      statusMatch = true;
    } else if (selectedStatus === "pending") {
      statusMatch = prescription.quotes?.length === 0;
    } else if (selectedStatus === "completed") {
      statusMatch = prescription.quotes?.some((q) => q.status === "accepted");
    }
    return matchesSearch && statusMatch;
  });

  // Modal image gallery logic (copied from pharmacy/prescriptions/page.tsx)
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
          My Prescriptions
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          View and manage all your prescription uploads
        </p>
      </header>
      {/* Filters and Search */}
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
        <div className="flex gap-4">
          <Select value={selectedStatus} onValueChange={setSelectedStatus}>
            <SelectTrigger className="w-[180px]">
              <div className="flex items-center gap-2">
                <Filter size={16} />
                <span>Filter by Status</span>
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Tabs */}
      <Tabs
        defaultValue="all"
        className="mb-6"
        value={selectedStatus}
        onValueChange={setSelectedStatus}
      >
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="pending">Pending</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Quick Action */}
      <div className="mb-6">
        <Link href="/user/upload">
          <Button className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 w-full sm:w-auto">
            Upload New Prescription
          </Button>
        </Link>
      </div>

      {/* Prescriptions List */}
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
        ) : filteredPrescriptions.length === 0 ? (
          <Card>
            <CardContent className="p-8 md:p-12 text-center">
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
          filteredPrescriptions.map((prescription) => (
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
                      {/* Show number of images if files is an array */}
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
                          <Eye className="w-4 h-4 mr-2" />
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
                                <p className="text-sm text-gray-500">Status</p>
                                <Badge
                                  className={getStatusColor(
                                    prescription.status
                                  )}
                                >
                                  {(prescription.status ?? "pending")
                                    .charAt(0)
                                    .toUpperCase() +
                                    (prescription.status ?? "pending").slice(1)}
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
                              <h3 className="font-semibold mb-4">Quotations</h3>
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
                                                    {item.drug} ({item.quantity}
                                                    )
                                                  </span>
                                                  <span>
                                                    $
                                                    {parseFloat(
                                                      item.price || item.amount
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
    </>
  );
}
