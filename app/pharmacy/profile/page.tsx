"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { createClient } from "@/utils/supabase/client";
import { PhoneInput } from "@/components/ui/phone-input";
import type { Tables } from "@/utils/supabase/types";
import { Save } from "lucide-react";
import { parsePhoneNumber } from "react-phone-number-input";

export default function PharmacyProfile() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState<Tables<"profiles"> | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [license, setLicense] = useState("");
  const [registration, setRegistration] = useState("");
  const supabase = createClient();

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      const { data: userData, error: userError } = await supabase.auth.getUser();
      if (userError || !userData?.user) {
        setProfile(null);
        setLoading(false);
        return;
      }
      const userId = userData.user.id;
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();
      if (error || !data) {
        setProfile(null);
        setLoading(false);
        return;
      }
      setProfile(data);
      setName(data.name || "");
      setEmail(data.email || "");
      // Normalize phone to E.164 (no spaces)
      let phoneValue = data.phone || "";
      if (phoneValue && phoneValue.startsWith("+")) {
        const parsed = parsePhoneNumber(phoneValue);
        phoneValue = parsed ? parsed.number : phoneValue.replace(/\s+/g, "");
      }
      setPhone(phoneValue);
      setAddress(data.address || "");
      setLicense(data.license || "");
      setRegistration(data.registration || "");
      setLoading(false);
    };
    fetchProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) return;
    setLoading(true);
    // Always save phone in E.164 format (no spaces)
    let phoneToSave = phone;
    if (phoneToSave && phoneToSave.startsWith("+")) {
      const parsed = parsePhoneNumber(phoneToSave);
      phoneToSave = parsed ? parsed.number : phoneToSave.replace(/\s+/g, "");
    }
    const { error } = await supabase
      .from("profiles")
      .update({ name, email, phone: phoneToSave, address, license, registration })
      .eq("id", profile.id);
    setLoading(false);
    if (error) {
      toast({
        title: "Profile update failed",
        description: error.message,
        variant: "destructive",
      });
      return;
    }
    toast({
      title: "Profile updated successfully!",
      description: "Your profile information has been saved.",
    });
  };

  return (
    <>
      <header className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Pharmacy Profile</h1>
        <p className="text-gray-600 dark:text-gray-400">Manage your pharmacy information</p>
      </header>
      <div className="max-w-2xl mx-auto space-y-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Pharmacy Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <Label htmlFor="phone">Contact Number</Label>
            <PhoneInput
              id="phone"
              value={phone}
              onChange={setPhone}
              defaultCountry="LK"
              international
              required
            />
          </div>
          <div>
            <Label htmlFor="address">Pharmacy Address</Label>
            <Textarea
              id="address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              rows={3}
              required
            />
          </div>
          <div>
            <Label htmlFor="license">License Number</Label>
            <Input
              id="license"
              value={license}
              onChange={(e) => setLicense(e.target.value)}
              required
            />
          </div>
          <div>
            <Label htmlFor="registration">Registration Number</Label>
            <Input
              id="registration"
              value={registration}
              onChange={(e) => setRegistration(e.target.value)}
              required
            />
          </div>
          <Button type="submit" disabled={loading} className="w-full">
            <Save className="w-4 h-4 mr-2" />
            {loading ? "Saving..." : "Save Changes"}
          </Button>
        </form>
      </div>
    </>
  );
} 