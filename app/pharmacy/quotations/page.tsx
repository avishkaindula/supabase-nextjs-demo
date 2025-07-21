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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import { createClient } from "@/utils/supabase/client";
import type { Tables } from "@/utils/supabase/types";

type Quote = Tables<"quotes"> & {
  prescription: Tables<"prescriptions">;
  patientName?: string | null;
};

export default function QuotationsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [activeTab, setActiveTab] = useState("all");
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    const fetchQuotes = async () => {
      setLoading(true);
      const { data: userData, error: userError } =
        await supabase.auth.getUser();
      if (userError || !userData?.user) {
        setQuotes([]);
        setLoading(false);
        return;
      }
      const userId = userData.user.id;
      const { data, error } = await supabase
        .from("quotes")
        .select("*, prescription:prescription_id(*)")
        .eq("pharmacy_id", userId)
        .order("created_at", { ascending: false });
      if (error || !data) {
        setQuotes([]);
        setLoading(false);
        return;
      }
      // Fetch patient names for all unique prescription.user_id
      const prescriptionUserIds = Array.from(
        new Set((data as Quote[]).map((q) => q.prescription.user_id))
      );
      let profileMap: Record<string, string | null> = {};
      if (prescriptionUserIds.length > 0) {
        const { data: profiles } = await supabase
          .from("profiles")
          .select("id, name")
          .in("id", prescriptionUserIds);
        if (profiles) {
          profiles.forEach((profile) => {
            profileMap[profile.id] = profile.name;
          });
        }
      }
      // Attach patientName to each quote
      const withNames = (data as Quote[]).map((q) => ({
        ...q,
        patientName: profileMap[q.prescription.user_id] || null,
      }));
      setQuotes(withNames);
      setLoading(false);
    };
    fetchQuotes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filteredQuotations = quotes.filter((quotation) => {
    const matchesSearch = (quotation.patientName || "")
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesStatus =
      selectedStatus === "all" || quotation.status === selectedStatus;
    const matchesTab = activeTab === "all" || quotation.status === activeTab;
    return matchesSearch && matchesStatus && matchesTab;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "accepted":
        return "bg-green-100 text-green-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      case "completed":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="w-4 h-4 mr-1" />;
      case "accepted":
        return <CheckCircle className="w-4 h-4 mr-1" />;
      case "rejected":
        return <XCircle className="w-4 h-4 mr-1" />;
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
          Quotations
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Track and manage all quotations sent to patients
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
            placeholder="Search by patient name..."
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
              <SelectItem value="accepted">Accepted</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="all" className="mb-6" onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="pending">Pending</TabsTrigger>
          <TabsTrigger value="accepted">Accepted</TabsTrigger>
          <TabsTrigger value="rejected">Rejected</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Quotations List */}
      <div className="grid gap-4">
        {filteredQuotations.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                No quotations found
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Try adjusting your search or filter criteria.
              </p>
            </CardContent>
          </Card>
        ) : (
          filteredQuotations.map((quotation) => {
            // Parse items safely
            type ItemType = {
              drug?: string;
              quantity?: string;
              price?: string;
              amount?: number;
            };
            function isItemType(item: any): item is ItemType {
              return (
                item &&
                typeof item === "object" &&
                (typeof item.drug === "string" ||
                  typeof item.amount === "number" ||
                  typeof item.price === "string")
              );
            }
            let items: ItemType[] = [];
            if (Array.isArray(quotation.items)) {
              items = quotation.items.filter(isItemType);
            }
            const subtotal = items.reduce((sum, item) => {
              // Prefer price (string), else amount (number), fallback to 0
              let value = 0;
              if (typeof item.price === "string") {
                value = parseFloat(item.price || "0");
              } else if (typeof item.amount === "number") {
                value = item.amount;
              }
              return sum + value;
            }, 0);
            const total = subtotal + (quotation.delivery_fee || 0);
            return (
              <Card
                key={quotation.id}
                className="hover:shadow-md transition-shadow"
              >
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-4 mb-2">
                        <h3 className="font-semibold text-gray-900 dark:text-white">
                          {quotation.patientName || "Unknown Patient"}
                        </h3>
                        <Badge
                          className={getStatusColor(
                            quotation.status ?? "pending"
                          )}
                        >
                          <div className="flex items-center">
                            {getStatusIcon(quotation.status ?? "pending")}
                            <span>
                              {(quotation.status ?? "pending")
                                .charAt(0)
                                .toUpperCase() +
                                (quotation.status ?? "pending").slice(1)}
                            </span>
                          </div>
                        </Badge>
                        <span className="text-sm text-gray-500">
                          Created:{" "}
                          {new Date(quotation.created_at).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex items-center space-x-4">
                        <p className="text-gray-900 dark:text-white font-medium">
                          ${total.toFixed(2)}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {items.length} items
                        </p>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm">
                            <Eye className="w-4 h-4 mr-2" />
                            View Details
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                          <DialogHeader>
                            <DialogTitle>Quotation Details</DialogTitle>
                            <DialogDescription>
                              Quotation #{quotation.id} for{" "}
                              {quotation.patientName || "Unknown Patient"}
                            </DialogDescription>
                          </DialogHeader>

                          <div className="space-y-6">
                            {/* Status and Dates */}
                            <div className="flex justify-between items-center">
                              <Badge
                                className={getStatusColor(
                                  quotation.status ?? "pending"
                                )}
                              >
                                <div className="flex items-center">
                                  {getStatusIcon(quotation.status ?? "pending")}
                                  <span>
                                    {(quotation.status ?? "pending")
                                      .charAt(0)
                                      .toUpperCase() +
                                      (quotation.status ?? "pending").slice(1)}
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

                            {/* Items */}
                            <div>
                              <h3 className="font-medium text-gray-900 dark:text-white mb-2">
                                Items
                              </h3>
                              <div className="space-y-2">
                                {items.map((item, index) => (
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
                                      {typeof item.price === "string"
                                        ? `$${parseFloat(
                                            item.price || "0"
                                          ).toFixed(2)}`
                                        : typeof item.amount === "number"
                                        ? `$${item.amount.toFixed(2)}`
                                        : "$0.00"}
                                    </p>
                                  </div>
                                ))}
                              </div>
                            </div>

                            {/* Summary */}
                            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                              <div className="flex justify-between items-center mb-2">
                                <span className="text-gray-600 dark:text-gray-400">
                                  Subtotal
                                </span>
                                <span className="font-medium">
                                  ${subtotal.toFixed(2)}
                                </span>
                              </div>
                              <div className="flex justify-between items-center mb-2">
                                <span className="text-gray-600 dark:text-gray-400">
                                  Delivery Fee
                                </span>
                                <span className="font-medium">
                                  ${(quotation.delivery_fee || 0).toFixed(2)}
                                </span>
                              </div>
                              <div className="flex justify-between items-center pt-2 border-t border-gray-200 dark:border-gray-700">
                                <span className="font-semibold text-gray-900 dark:text-white">
                                  Total
                                </span>
                                <span className="font-semibold text-gray-900 dark:text-white">
                                  ${total.toFixed(2)}
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
                                  ✓ Quotation accepted by patient
                                </p>
                                <p className="text-sm text-green-600 dark:text-green-400 mt-1">
                                  Prepare the order for delivery.
                                </p>
                              </div>
                            )}

                            {quotation.status === "rejected" && (
                              <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg">
                                <p className="text-red-800 dark:text-red-300 font-medium">
                                  ✗ Quotation rejected by patient
                                </p>
                              </div>
                            )}

                            {quotation.status === "completed" && (
                              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                                <p className="text-blue-800 dark:text-blue-300 font-medium">
                                  ✓ Order completed and delivered
                                </p>
                              </div>
                            )}
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>
    </>
  );
}
