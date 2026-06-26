import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CheckCircle, User, MapPin, Package, ChevronRight, ChevronLeft, Store } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const CATEGORIES = [
  { value: "pickle",     label: "🫙 Pickle" },
  { value: "spices",     label: "🌶️ Spices" },
  { value: "clothes",    label: "👗 Clothes" },
  { value: "handicraft", label: "🧶 Handicraft" },
  { value: "jewelry",    label: "💍 Jewelry" },
  { value: "pottery",    label: "🏺 Pottery" },
  { value: "textiles",   label: "🧵 Textiles" },
  { value: "beauty",     label: "💄 Beauty" },
  { value: "sweets",     label: "🍬 Sweets" },
  { value: "bags",       label: "👜 Bags" },
  { value: "art",        label: "🎨 Art" },
  { value: "other",      label: "📦 Other" },
];

const STEPS = [
  { label: "Account",  icon: User },
  { label: "Address",  icon: MapPin },
  { label: "Product",  icon: Package },
];

const JoinAsSeller = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [step, setStep] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  // Step 1 — Account
  const [account, setAccount] = useState({
    name: "", email: "", password: "", confirmPassword: "",
  });

  // Step 2 — Address
  const [address, setAddress] = useState({
    address1: "", address2: "", city: "", state: "", pincode: "", phone: "",
  });

  // Step 3 — Product
  const [product, setProduct] = useState({
    name: "", description: "", price: "", category: "pickle", image_url: "",
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState("");

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const validateStep = () => {
    if (step === 0) {
      if (!account.name || !account.email || !account.password || !account.confirmPassword)
        return "Please fill all fields";
      if (account.password.length < 6)
        return "Password must be at least 6 characters";
      if (account.password !== account.confirmPassword)
        return "Passwords do not match";
    }
    if (step === 1) {
      if (!address.address1 || !address.city || !address.state || !address.pincode || !address.phone)
        return "Please fill all required fields";
      if (!/^\d{6}$/.test(address.pincode)) return "Pincode must be 6 digits";
    }
    if (step === 2) {
      if (!product.name || !product.price) return "Product name and price are required";
      if (isNaN(Number(product.price)) || Number(product.price) <= 0) return "Enter a valid price";
    }
    return null;
  };

  const next = () => {
    const err = validateStep();
    if (err) { toast({ title: err, variant: "destructive" }); return; }
    setStep((s) => s + 1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const err = validateStep();
    if (err) { toast({ title: err, variant: "destructive" }); return; }
    setSubmitting(true);

    try {
      // 1. Sign up user
      const { data: authData, error: authErr } = await supabase.auth.signUp({
        email: account.email,
        password: account.password,
        options: {
          data: {
            full_name: account.name,
            address_line1: address.address1,
            address_line2: address.address2,
            city: address.city,
            state: address.state,
            pincode: address.pincode,
            phone: address.phone,
          },
        },
      });
      if (authErr) throw authErr;

      const userId = authData.user?.id;
      if (!userId) throw new Error("User creation failed");

      // 2. Assign seller role
      await supabase.from("user_roles").insert({ user_id: userId, role: "seller" });

      // 3. Upload product image if provided
      let imageUrl = product.image_url;
      if (imageFile) {
        const ext = imageFile.name.split(".").pop();
        const path = `${userId}/${Date.now()}.${ext}`;
        const { error: uploadErr } = await supabase.storage
          .from("product-images").upload(path, imageFile);
        if (!uploadErr) {
          const { data: { publicUrl } } = supabase.storage
            .from("product-images").getPublicUrl(path);
          imageUrl = publicUrl;
        }
      }

      // 4. Add first product
      if (product.name && product.price) {
        await supabase.from("products").insert({
          seller_id: userId,
          title: product.name,
          description: product.description,
          price: parseFloat(product.price),
          category: product.category,
          image_url: imageUrl || null,
          is_active: true,
        });
      }

      setDone(true);
    } catch (err: any) {
      toast({ title: "Registration failed", description: err.message, variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  if (done) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center max-w-md"
        >
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", delay: 0.2 }}>
            <CheckCircle className="h-24 w-24 mx-auto text-green-500 mb-6" />
          </motion.div>
          <h1 className="text-3xl font-heading font-extrabold mb-3">Welcome to Smart Sakhi! 🪷</h1>
          <p className="text-muted-foreground mb-2">Your seller account has been created successfully.</p>
          <p className="text-muted-foreground text-sm mb-8">Please check your email to verify your account, then login to manage your products.</p>
          <div className="flex gap-3 justify-center">
            <Button onClick={() => navigate("/auth")} className="rounded-xl font-bold">Login Now</Button>
            <Button variant="outline" onClick={() => navigate("/marketplace")} className="rounded-xl">Browse Marketplace</Button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-[80vh] py-10 px-4">
      <div className="max-w-xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center h-14 w-14 rounded-2xl bg-primary/10 mb-4">
            <Store className="h-7 w-7 text-primary" />
          </div>
          <h1 className="text-3xl font-heading font-extrabold">Join as Seller 🏪</h1>
          <p className="text-muted-foreground mt-2">Start selling your handmade products to thousands of buyers</p>
        </div>

        {/* Step indicators */}
        <div className="flex items-center justify-center gap-2 mb-8">
          {STEPS.map((s, i) => (
            <React.Fragment key={s.label}>
              <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-semibold transition-all ${
                i === step ? "bg-primary text-white" :
                i < step  ? "bg-green-500 text-white" :
                "bg-muted text-muted-foreground"
              }`}>
                {i < step ? <CheckCircle className="h-4 w-4" /> : <s.icon className="h-4 w-4" />}
                {s.label}
              </div>
              {i < STEPS.length - 1 && (
                <div className={`h-0.5 w-8 rounded ${i < step ? "bg-green-500" : "bg-muted"}`} />
              )}
            </React.Fragment>
          ))}
        </div>

        <Card className="shadow-lg border-border/50">
          <CardContent className="p-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={step}
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -30 }}
                transition={{ duration: 0.2 }}
              >
                {/* STEP 1 — Account */}
                {step === 0 && (
                  <div className="space-y-4">
                    <h2 className="text-lg font-heading font-bold flex items-center gap-2">
                      <User className="h-5 w-5 text-primary" /> Account Details
                    </h2>
                    <div>
                      <Label>Full Name *</Label>
                      <Input className="mt-1" placeholder="e.g. Priya Sharma" value={account.name}
                        onChange={(e) => setAccount((a) => ({ ...a, name: e.target.value }))} />
                    </div>
                    <div>
                      <Label>Email Address *</Label>
                      <Input className="mt-1" type="email" placeholder="priya@example.com" value={account.email}
                        onChange={(e) => setAccount((a) => ({ ...a, email: e.target.value }))} />
                    </div>
                    <div>
                      <Label>Password *</Label>
                      <Input className="mt-1" type="password" placeholder="Min. 6 characters" value={account.password}
                        onChange={(e) => setAccount((a) => ({ ...a, password: e.target.value }))} />
                    </div>
                    <div>
                      <Label>Confirm Password *</Label>
                      <Input className="mt-1" type="password" placeholder="Re-enter password" value={account.confirmPassword}
                        onChange={(e) => setAccount((a) => ({ ...a, confirmPassword: e.target.value }))} />
                    </div>
                  </div>
                )}

                {/* STEP 2 — Address */}
                {step === 1 && (
                  <div className="space-y-4">
                    <h2 className="text-lg font-heading font-bold flex items-center gap-2">
                      <MapPin className="h-5 w-5 text-primary" /> Your Address
                    </h2>
                    <div>
                      <Label>Address Line 1 *</Label>
                      <Input className="mt-1" placeholder="House No., Street, Area" value={address.address1}
                        onChange={(e) => setAddress((a) => ({ ...a, address1: e.target.value }))} />
                    </div>
                    <div>
                      <Label>Address Line 2 <span className="text-muted-foreground text-xs">(optional)</span></Label>
                      <Input className="mt-1" placeholder="Landmark, Colony" value={address.address2}
                        onChange={(e) => setAddress((a) => ({ ...a, address2: e.target.value }))} />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Label>City *</Label>
                        <Input className="mt-1" placeholder="e.g. Jaipur" value={address.city}
                          onChange={(e) => setAddress((a) => ({ ...a, city: e.target.value }))} />
                      </div>
                      <div>
                        <Label>State *</Label>
                        <Input className="mt-1" placeholder="e.g. Rajasthan" value={address.state}
                          onChange={(e) => setAddress((a) => ({ ...a, state: e.target.value }))} />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Label>Pincode *</Label>
                        <Input className="mt-1" placeholder="6-digit pincode" maxLength={6} value={address.pincode}
                          onChange={(e) => setAddress((a) => ({ ...a, pincode: e.target.value.replace(/\D/g, "") }))} />
                      </div>
                      <div>
                        <Label>Phone Number *</Label>
                        <Input className="mt-1" placeholder="10-digit mobile" value={address.phone}
                          onChange={(e) => setAddress((a) => ({ ...a, phone: e.target.value }))} />
                      </div>
                    </div>
                  </div>
                )}

                {/* STEP 3 — Product */}
                {step === 2 && (
                  <form onSubmit={handleSubmit}>
                    <div className="space-y-4">
                      <h2 className="text-lg font-heading font-bold flex items-center gap-2">
                        <Package className="h-5 w-5 text-primary" /> Your First Product
                      </h2>
                      <div>
                        <Label>Product Name *</Label>
                        <Input className="mt-1" placeholder="e.g. Homemade Mango Pickle" value={product.name}
                          onChange={(e) => setProduct((p) => ({ ...p, name: e.target.value }))} />
                      </div>
                      <div>
                        <Label>Description</Label>
                        <Textarea className="mt-1" rows={3} placeholder="Describe your product — ingredients, size, weight, etc."
                          value={product.description}
                          onChange={(e) => setProduct((p) => ({ ...p, description: e.target.value }))} />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <Label>Price (₹) *</Label>
                          <Input className="mt-1" type="number" min="1" placeholder="e.g. 150" value={product.price}
                            onChange={(e) => setProduct((p) => ({ ...p, price: e.target.value }))} />
                        </div>
                        <div>
                          <Label>Category *</Label>
                          <Select value={product.category} onValueChange={(v) => setProduct((p) => ({ ...p, category: v }))}>
                            <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                            <SelectContent>
                              {CATEGORIES.map((c) => (
                                <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div>
                        <Label>Product Image</Label>
                        <Input className="mt-1" type="file" accept="image/*" onChange={handleImageChange} />
                        {imagePreview && (
                          <img src={imagePreview} alt="Preview" className="mt-2 h-32 w-32 rounded-xl object-cover border" />
                        )}
                        {!imagePreview && (
                          <>
                            <p className="text-xs text-muted-foreground mt-1">Or paste an image URL</p>
                            <Input className="mt-1" placeholder="https://..." value={product.image_url}
                              onChange={(e) => setProduct((p) => ({ ...p, image_url: e.target.value }))} />
                          </>
                        )}
                      </div>
                      <Button type="submit" size="lg" className="w-full rounded-xl font-bold mt-2" disabled={submitting}>
                        {submitting ? "Creating your account..." : "🚀 Register & Start Selling"}
                      </Button>
                    </div>
                  </form>
                )}
              </motion.div>
            </AnimatePresence>

            {/* Navigation buttons (steps 0 & 1) */}
            {step < 2 && (
              <div className="flex gap-3 mt-6">
                {step > 0 && (
                  <Button variant="outline" className="flex-1 rounded-xl" onClick={() => setStep((s) => s - 1)}>
                    <ChevronLeft className="h-4 w-4 mr-1" /> Back
                  </Button>
                )}
                <Button className="flex-1 rounded-xl font-bold" onClick={next}>
                  Next <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
            )}
            {step === 2 && (
              <Button variant="outline" className="w-full mt-3 rounded-xl" onClick={() => setStep(1)}>
                <ChevronLeft className="h-4 w-4 mr-1" /> Back
              </Button>
            )}
          </CardContent>
        </Card>

        <p className="text-center text-sm text-muted-foreground mt-4">
          Already have an account?{" "}
          <button className="text-primary font-semibold underline" onClick={() => navigate("/auth")}>
            Login here
          </button>
        </p>
      </div>
    </div>
  );
};

export default JoinAsSeller;
