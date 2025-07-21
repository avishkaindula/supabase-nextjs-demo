"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { CheckCircle, XCircle, Clock, Eye, FileText } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { createClient } from "@/utils/supabase/client";
import type { Tables } from "@/utils/supabase/types";

// Types
interface PharmacyProfile {
  id: string;
  name: string | null;
  email: string | null;
  address: string | null;
  phone: string | null;
}

type Prescription = Tables<"prescriptions"> & {
  quotes: Tables<"quotes">[];
};

type QuoteWithPrescription = Tables<"quotes"> & {
  prescription: Prescription;
  pharmacyProfile?: PharmacyProfile;
};

export default function QuotationsPage() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [quotes, setQuotes] = useState<QuoteWithPrescription[]>([]);
  const [pharmacyProfiles, setPharmacyProfiles] = useState<
    Record<string, PharmacyProfile>
  >({});
  const [processing, setProcessing] = useState<string | null>(null); // quote id
  const [patientName, setPatientName] = useState<string | null>(null);

  // Fetch all prescriptions for the current user and flatten all quotes
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const supabase = createClient();
        const { data: userData, error: userError } =
          await supabase.auth.getUser();
        if (userError || !userData?.user) {
          setError("Not authenticated");
          setLoading(false);
          return;
        }
        const userId = userData.user.id;
        // Fetch patient name
        const { data: profile } = await supabase
          .from("profiles")
          .select("name")
          .eq("id", userId)
          .single();
        setPatientName(profile?.name || null);
        const { data: prescriptions, error: prescError } = await supabase
          .from("prescriptions")
          .select("*, quotes(*)")
          .eq("user_id", userId)
          .order("created_at", { ascending: false });
        if (prescError) {
          setError(prescError.message);
          setLoading(false);
          return;
        }
        // Flatten all quotes, attach prescription
        const allQuotes: QuoteWithPrescription[] = [];
        const prescriptionsArr: Prescription[] = Array.isArray(prescriptions)
          ? (prescriptions as Prescription[])
          : [];
        prescriptionsArr.forEach((prescription: Prescription) => {
          (prescription.quotes || []).forEach((quote: Tables<"quotes">) => {
            allQuotes.push({ ...quote, prescription });
          });
        });
        // Fetch all unique pharmacy profiles
        const pharmacyIds = Array.from(
          new Set(allQuotes.map((q) => q.pharmacy_id))
        );
        let profilesMap: Record<string, PharmacyProfile> = {};
        if (pharmacyIds.length > 0) {
          const { data: profiles, error: profilesError } = await supabase
            .from("profiles")
            .select("id, name, email, address, phone")
            .in("id", pharmacyIds);
          if (!profilesError && profiles) {
            profiles.forEach((profile) => {
              profilesMap[profile.id] = profile;
            });
          }
        }
        // Attach pharmacy profile to each quote
        const quotesWithProfiles = allQuotes.map((q) => ({
          ...q,
          pharmacyProfile: profilesMap[q.pharmacy_id],
        }));
        setQuotes(quotesWithProfiles);
        setPharmacyProfiles(profilesMap);
        setLoading(false);
      } catch (err: any) {
        setError(err.message || "Failed to load quotations");
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Status color and icon helpers
  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "accepted":
        return "bg-green-100 text-green-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="w-4 h-4" />;
      case "accepted":
        return <CheckCircle className="w-4 h-4" />;
      case "rejected":
        return <XCircle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  // Accept/Reject logic
  const handleStatusChange = async (
    quote: QuoteWithPrescription,
    newStatus: "accepted" | "rejected"
  ) => {
    setProcessing(quote.id);
    const supabase = createClient();
    try {
      // Update quote status
      const updateFields: any = { status: newStatus };
      if (newStatus === "accepted")
        updateFields.accepted_at = new Date().toISOString();
      if (newStatus === "rejected")
        updateFields.rejected_at = new Date().toISOString();
      const { error: quoteError } = await supabase
        .from("quotes")
        .update(updateFields)
        .eq("id", quote.id);
      if (quoteError) throw new Error(quoteError.message);
      // If accepted, update prescription status to completed
      if (newStatus === "accepted") {
        const { error: prescError } = await supabase
          .from("prescriptions")
          .update({ status: "completed" })
          .eq("id", quote.prescription_id);
        if (prescError) throw new Error(prescError.message);
      }
      // Send email to pharmacy
      const pharmacy = quote.pharmacyProfile;
      if (pharmacy?.email) {
        const origin =
          typeof window !== "undefined" ? window.location.origin : "";
        await fetch("/api/send-quotation-status-email", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            pharmacyEmail: pharmacy.email,
            pharmacyName: pharmacy.name,
            patientName: patientName,
            prescription: quote.prescription,
            quote,
            status: newStatus,
            origin,
          }),
        });
      }
      toast({
        title: `Quotation ${
          newStatus === "accepted" ? "accepted" : "rejected"
        }!`,
        description:
          newStatus === "accepted"
            ? "The pharmacy has been notified and will prepare your order."
            : "The pharmacy has been notified of your decision.",
      });
      // Refresh data
      setQuotes((prev) =>
        prev.map((q) =>
          q.id === quote.id
            ? {
                ...q,
                status: newStatus,
                accepted_at:
                  newStatus === "accepted"
                    ? new Date().toISOString()
                    : q.accepted_at,
                rejected_at:
                  newStatus === "rejected"
                    ? new Date().toISOString()
                    : q.rejected_at,
              }
            : q
        )
      );
    } catch (err: any) {
      toast({
        title: `Failed to ${newStatus} quotation`,
        description: err.message,
        variant: "destructive",
      });
    } finally {
      setProcessing(null);
    }
  };

  return (
    <>
      <header className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Quotations
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Review and manage quotations from pharmacies
        </p>
      </header>
      {loading ? (
        <Card>
          <CardContent className="p-8 md:p-12 text-center">
            <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              Loading quotations...
            </h3>
          </CardContent>
        </Card>
      ) : error ? (
        <Card>
          <CardContent className="p-8 md:p-12 text-center">
            <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-red-700 dark:text-red-400 mb-2">
              {error}
            </h3>
          </CardContent>
        </Card>
      ) : quotes.length === 0 ? (
        <Card>
          <CardContent className="p-8 md:p-12 text-center">
            <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No quotations yet
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Upload a prescription to start receiving quotations from
              pharmacies.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4 md:space-y-6">
          {quotes.map((quotation) => (
            <Card
              key={quotation.id}
              className="hover:shadow-md transition-shadow"
            >
              <CardHeader className="pb-4">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex-1">
                    <CardTitle className="flex flex-col md:flex-row md:items-center gap-2 mb-2">
                      <span className="text-lg md:text-xl">
                        {quotation.pharmacyProfile?.name || "Pharmacy"}
                      </span>
                      <Badge className={getStatusColor(quotation.status)}>
                        {getStatusIcon(quotation.status)}
                        <span className="ml-1">
                          {quotation.status.charAt(0).toUpperCase() +
                            quotation.status.slice(1)}
                        </span>
                      </Badge>
                    </CardTitle>
                    <CardDescription className="text-sm">
                      {quotation.pharmacyProfile?.address || ""} •{" "}
                      {quotation.pharmacyProfile?.phone || ""}
                    </CardDescription>
                  </div>
                  <div className="text-left md:text-right">
                    <p className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">
                      $
                      {Array.isArray(quotation.items)
                        ? quotation.items.reduce(
                            (sum: number, item: any) =>
                              sum +
                              (parseFloat(item.price || item.amount) || 0),
                            0
                          ) + (quotation.delivery_fee || 0)
                        : 0}
                      .00
                    </p>
                    <p className="text-sm text-gray-500">
                      + ${quotation.delivery_fee?.toFixed(2) || "0.00"} delivery
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Items */}
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                      Items
                    </h4>
                    <div className="space-y-2">
                      {Array.isArray(quotation.items) &&
                        quotation.items.map((item: any, index: number) => (
                          <div
                            key={index}
                            className="flex justify-between items-center py-2 border-b border-gray-100 dark:border-gray-700 last:border-0"
                          >
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-gray-900 dark:text-white truncate">
                                {item.drug}
                              </p>
                              <p className="text-sm text-gray-600 dark:text-gray-400">
                                {item.quantity}
                              </p>
                            </div>
                            <p className="font-medium text-gray-900 dark:text-white ml-4">
                              $
                              {parseFloat(item.price || item.amount).toFixed(2)}
                            </p>
                          </div>
                        ))}
                    </div>
                  </div>

                  {/* Details */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <p className="text-gray-600 dark:text-gray-400">
                        Created
                      </p>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {new Date(quotation.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-600 dark:text-gray-400">
                        Estimated Delivery
                      </p>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {quotation.estimated_delivery}
                      </p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col md:flex-row gap-3 pt-4">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" className="w-full md:w-auto">
                          <Eye className="w-4 h-4 mr-2" />
                          View Details
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl max-h-[90vh] overflow-auto">
                        <DialogHeader>
                          <DialogTitle>Quotation Details</DialogTitle>
                          <DialogDescription>
                            Quotation #{quotation.id} from{" "}
                            {quotation.pharmacyProfile?.name || "Pharmacy"}
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-6">
                          {/* Status and Dates */}
                          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                            <Badge className={getStatusColor(quotation.status)}>
                              <div className="flex items-center">
                                {getStatusIcon(quotation.status)}
                                <span className="ml-1">
                                  {quotation.status.charAt(0).toUpperCase() +
                                    quotation.status.slice(1)}
                                </span>
                              </div>
                            </Badge>
                            <div className="text-sm text-gray-500">
                              Created:{" "}
                              {new Date(
                                quotation.created_at
                              ).toLocaleDateString()}
                            </div>
                          </div>
                          {/* Pharmacy Information */}
                          <div>
                            <h3 className="font-medium text-gray-900 dark:text-white mb-2">
                              Pharmacy Information
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                              <div>
                                <p className="text-gray-600 dark:text-gray-400">
                                  Name
                                </p>
                                <p className="font-medium">
                                  {quotation.pharmacyProfile?.name}
                                </p>
                              </div>
                              <div>
                                <p className="text-gray-600 dark:text-gray-400">
                                  Phone
                                </p>
                                <p className="font-medium">
                                  {quotation.pharmacyProfile?.phone}
                                </p>
                              </div>
                              <div className="md:col-span-2">
                                <p className="text-gray-600 dark:text-gray-400">
                                  Address
                                </p>
                                <p className="font-medium">
                                  {quotation.pharmacyProfile?.address}
                                </p>
                              </div>
                            </div>
                          </div>
                          {/* Items */}
                          <div>
                            <h3 className="font-medium text-gray-900 dark:text-white mb-2">
                              Items
                            </h3>
                            <div className="space-y-2">
                              {Array.isArray(quotation.items) &&
                                quotation.items.map(
                                  (item: any, index: number) => (
                                    <div
                                      key={index}
                                      className="flex justify-between items-center py-2 border-b border-gray-100 dark:border-gray-700 last:border-0"
                                    >
                                      <div>
                                        <p className="font-medium text-gray-900 dark:text-white">
                                          {item.drug}
                                        </p>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">
                                          {item.quantity}
                                        </p>
                                      </div>
                                      <p className="font-medium text-gray-900 dark:text-white">
                                        $
                                        {parseFloat(
                                          item.price || item.amount
                                        ).toFixed(2)}
                                      </p>
                                    </div>
                                  )
                                )}
                            </div>
                          </div>
                          {/* Summary */}
                          <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                            <div className="flex justify-between items-center mb-2">
                              <span className="text-gray-600 dark:text-gray-400">
                                Subtotal
                              </span>
                              <span className="font-medium">
                                $
                                {Array.isArray(quotation.items)
                                  ? quotation.items.reduce(
                                      (sum: number, item: any) =>
                                        sum +
                                        (parseFloat(
                                          item.price || item.amount
                                        ) || 0),
                                      0
                                    )
                                  : 0}
                                .00
                              </span>
                            </div>
                            <div className="flex justify-between items-center mb-2">
                              <span className="text-gray-600 dark:text-gray-400">
                                Delivery Fee
                              </span>
                              <span className="font-medium">
                                ${quotation.delivery_fee?.toFixed(2) || "0.00"}
                              </span>
                            </div>
                            <div className="flex justify-between items-center pt-2 border-t border-gray-200 dark:border-gray-700">
                              <span className="font-semibold text-gray-900 dark:text-white">
                                Total
                              </span>
                              <span className="font-semibold text-gray-900 dark:text-white">
                                $
                                {Array.isArray(quotation.items)
                                  ? quotation.items.reduce(
                                      (sum: number, item: any) =>
                                        sum +
                                        (parseFloat(
                                          item.price || item.amount
                                        ) || 0),
                                      0
                                    ) + (quotation.delivery_fee || 0)
                                  : 0}
                                .00
                              </span>
                            </div>
                          </div>
                          {/* Delivery Info */}
                          <div>
                            <h3 className="font-medium text-gray-900 dark:text-white mb-2">
                              Delivery Information
                            </h3>
                            <p className="text-gray-600 dark:text-gray-400">
                              Estimated delivery time:{" "}
                              {quotation.estimated_delivery}
                            </p>
                          </div>
                          {/* Status-specific information */}
                          {quotation.status === "accepted" && (
                            <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                              <p className="text-green-800 dark:text-green-300 font-medium">
                                ✓ Quotation accepted and being prepared
                              </p>
                              <p className="text-sm text-green-600 dark:text-green-400 mt-1">
                                You will receive a confirmation call shortly.
                              </p>
                            </div>
                          )}
                          {quotation.status === "rejected" && (
                            <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg">
                              <p className="text-red-800 dark:text-red-300 font-medium">
                                ✗ Quotation rejected
                              </p>
                              <p className="text-sm text-red-600 dark:text-red-400 mt-1">
                                The pharmacy has been notified of your decision.
                              </p>
                            </div>
                          )}
                        </div>
                      </DialogContent>
                    </Dialog>
                    {quotation.status === "pending" && (
                      <>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              className="bg-green-600 hover:bg-green-700 w-full md:w-auto"
                              disabled={processing === quotation.id}
                            >
                              <CheckCircle className="w-4 h-4 mr-2" />
                              Accept
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>
                                Accept Quotation
                              </AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to accept this quotation
                                from {quotation.pharmacyProfile?.name} for $
                                {Array.isArray(quotation.items)
                                  ? quotation.items.reduce(
                                      (sum: number, item: any) =>
                                        sum +
                                        (parseFloat(
                                          item.price || item.amount
                                        ) || 0),
                                      0
                                    ) + (quotation.delivery_fee || 0)
                                  : 0}
                                ? The pharmacy will be notified and will prepare
                                your order.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() =>
                                  handleStatusChange(quotation, "accepted")
                                }
                                className="bg-green-600 hover:bg-green-700"
                                disabled={processing === quotation.id}
                              >
                                Accept Quotation
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="outline"
                              className="text-red-600 border-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 w-full md:w-auto"
                              disabled={processing === quotation.id}
                            >
                              <XCircle className="w-4 h-4 mr-2" />
                              Reject
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>
                                Reject Quotation
                              </AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to reject this quotation
                                from {quotation.pharmacyProfile?.name}? This
                                action cannot be undone and the pharmacy will be
                                notified.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() =>
                                  handleStatusChange(quotation, "rejected")
                                }
                                className="bg-red-600 hover:bg-red-700"
                                disabled={processing === quotation.id}
                              >
                                Reject Quotation
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </>
                    )}
                  </div>
                  {quotation.status === "accepted" && (
                    <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                      <p className="text-green-800 dark:text-green-300 font-medium">
                        ✓ Order accepted and being prepared
                      </p>
                      <p className="text-sm text-green-600 dark:text-green-400 mt-1">
                        You will receive a confirmation call shortly.
                      </p>
                    </div>
                  )}
                  {quotation.status === "rejected" && (
                    <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg">
                      <p className="text-red-800 dark:text-red-300 font-medium">
                        ✗ Quotation rejected
                      </p>
                      <p className="text-sm text-red-600 dark:text-red-400 mt-1">
                        The pharmacy has been notified of your decision.
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </>
  );
}
