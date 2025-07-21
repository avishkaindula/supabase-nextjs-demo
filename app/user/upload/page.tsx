"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import ImageUploader from "@/components/ui/image-dropzone";
import { PhoneInput } from "@/components/ui/phone-input";
import { createClient } from "@/utils/supabase/client";
import { parsePhoneNumber } from "react-phone-number-input";

export default function UploadPrescription() {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<
    { path?: string; filename?: string; previewUrl?: string }[]
  >([]);
  const [isUploading, setIsUploading] = useState(false);
  const [note, setNote] = useState("");
  const [address, setAddress] = useState("");
  const [preferredDate, setPreferredDate] = useState("");
  const [preferredTimeSlot, setPreferredTimeSlot] = useState("");
  const [phone, setPhone] = useState("");
  const supabase = createClient();

  const timeSlotMap: Record<string, string> = {
    "8-10": "8:00 AM - 10:00 AM",
    "10-12": "10:00 AM - 12:00 PM",
    "12-14": "12:00 PM - 2:00 PM",
    "14-16": "2:00 PM - 4:00 PM",
    "16-18": "4:00 PM - 6:00 PM",
    "18-20": "6:00 PM - 8:00 PM",
  };

  useEffect(() => {
    const fetchProfile = async () => {
      const { data: userData, error: userError } = await supabase.auth.getUser();
      if (userError || !userData?.user) return;
      const userId = userData.user.id;
      const { data, error } = await supabase
        .from("profiles")
        .select("address, phone")
        .eq("id", userId)
        .single();
      if (error || !data) return;
      setAddress(data.address || "");
      // Normalize phone to E.164 (no spaces)
      let phoneValue = data.phone || "";
      if (phoneValue && phoneValue.startsWith("+")) {
        const parsed = parsePhoneNumber(phoneValue);
        phoneValue = parsed ? parsed.number : phoneValue.replace(/\s+/g, "");
      }
      setPhone(phoneValue);
    };
    fetchProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (uploadedFiles.length === 0) {
      toast({
        title: "No images uploaded",
        description: "Please upload at least one prescription image.",
        variant: "destructive",
      });
      return;
    }
    setLoading(true);
    try {
      const files = uploadedFiles.map((f) => ({
        filename: f.filename,
        path: f.path,
      }));
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        toast({ title: "Not authenticated", variant: "destructive" });
        setLoading(false);
        return;
      }
      // Normalize phone to E.164 (no spaces)
      let phoneToSave = phone;
      if (phoneToSave && phoneToSave.startsWith("+")) {
        const parsed = parsePhoneNumber(phoneToSave);
        phoneToSave = parsed ? parsed.number : phoneToSave.replace(/\s+/g, "");
      }
      const { error } = await supabase.from("prescriptions").insert([
        {
          user_id: user.id,
          note,
          address,
          preferred_date: preferredDate,
          preferred_time_slot:
            timeSlotMap[preferredTimeSlot] || preferredTimeSlot,
          phone: phoneToSave,
          files,
        },
      ]);
      setLoading(false);
      if (error) {
        toast({
          title: "Upload failed",
          description: error.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Prescription uploaded successfully!",
          description:
            "Pharmacies will review your prescription and send quotations soon.",
        });
        // Reset form
        setNote("");
        setAddress("");
        setPreferredDate("");
        setPreferredTimeSlot("");
        setPhone("");
        setUploadedFiles([]);
        router.push("/user/dashboard");
      }
    } catch (err: any) {
      setLoading(false);
      toast({
        title: "Upload failed",
        description: err.message,
        variant: "destructive",
      });
    }
  };

  return (
    <>
      <header className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Upload Prescription
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Upload your prescription images and delivery details
        </p>
      </header>
      <div className="max-w-2xl mx-auto space-y-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Image Upload */}
          <div className="rounded-2xl shadow-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 mb-2">
            <div className="mb-2">
              <h2 className="text-lg font-bold">Prescription Images</h2>
              <p className="text-sm text-gray-500">
                Upload up to 5 clear images of your prescription (JPG, PNG)
              </p>
            </div>
            <ImageUploader
              maxImages={5}
              onImagesChange={setUploadedFiles}
              onUploadStateChange={setIsUploading}
              isUploading={isUploading}
            />
          </div>
          {/* Prescription Details */}
          <div className="rounded-2xl shadow-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 mb-2">
            <div className="mb-2">
              <h2 className="text-lg font-bold">Prescription Details</h2>
              <p className="text-sm text-gray-500">
                Add any additional notes or special instructions
              </p>
            </div>
            <div>
              <Label htmlFor="note">Notes (Optional)</Label>
              <Textarea
                id="note"
                name="note"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Any special instructions, urgency, or additional information..."
                className="mt-1"
              />
            </div>
          </div>

          {/* Delivery Information */}
          <div className="rounded-2xl shadow-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 mb-2">
            <div className="mb-2">
              <h2 className="text-lg font-bold">Delivery Information</h2>
              <p className="text-sm text-gray-500">
                Specify where and when you'd like your medications delivered
              </p>
            </div>
            <div className="space-y-4">
              <div>
                <Label htmlFor="address">Delivery Address</Label>
                <Textarea
                  id="address"
                  name="address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Enter your complete delivery address..."
                  required
                  className="mt-1"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="date">Preferred Date</Label>
                  <Input
                    id="date"
                    name="preferred_date"
                    type="date"
                    value={preferredDate}
                    onChange={(e) => setPreferredDate(e.target.value)}
                    required
                    min={new Date().toISOString().split("T")[0]}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="time">Preferred Time Slot</Label>
                  <select
                    id="time"
                    name="preferred_time_slot"
                    value={preferredTimeSlot}
                    onChange={(e) => setPreferredTimeSlot(e.target.value)}
                    required
                    className="mt-1 w-full rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2"
                  >
                    <option value="">Select time slot</option>
                    <option value="8-10">8:00 AM - 10:00 AM</option>
                    <option value="10-12">10:00 AM - 12:00 PM</option>
                    <option value="12-14">12:00 PM - 2:00 PM</option>
                    <option value="14-16">2:00 PM - 4:00 PM</option>
                    <option value="16-18">4:00 PM - 6:00 PM</option>
                    <option value="18-20">6:00 PM - 8:00 PM</option>
                  </select>
                </div>
              </div>
              <div>
                <Label htmlFor="phone">Contact Number</Label>
                <PhoneInput
                  id="phone"
                  name="phone"
                  value={phone}
                  onChange={setPhone}
                  defaultCountry="LK"
                  international
                  required
                  className="mt-1"
                  placeholder="Your phone number for delivery coordination"
                />
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end space-x-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading || isUploading}
              className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700"
            >
              {loading ? "Uploading..." : "Upload Prescription"}
            </Button>
          </div>
        </form>
      </div>
    </>
  );
}
