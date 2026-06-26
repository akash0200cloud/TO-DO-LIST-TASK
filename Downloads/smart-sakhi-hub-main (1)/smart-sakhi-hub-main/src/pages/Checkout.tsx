import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { useCart } from "@/contexts/CartContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, Truck, CreditCard, MapPin, Phone, ShoppingBag } from "lucide-react";
import { motion } from "framer-motion";

const Checkout = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { items, total, clear } = useCart();
  const [address, setAddress] = useState({ address_line: "", city: "", pincode: "", phone: "" });
  const [paymentMethod, setPaymentMethod] = useState<"cod" | "online">("cod");
  const [submitting, setSubmitting] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);

  if (!items.length && !orderPlaced) {
    return (
      <div className="container py-12 text-center">
        <ShoppingBag className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
        <p className="text-muted-foreground mb-4">{t.cart.emptyCart}</p>
        <Link to="/marketplace"><Button>{t.cart.browseProducts}</Button></Link>
      </div>
    );
  }

  const placeOrder = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setTimeout(() => {
      clear();
      setSubmitting(false);
      setOrderPlaced(true);
    }, 1000);
  };

  if (orderPlaced) {
    return (
      <div className="container py-16 text-center max-w-md mx-auto">
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring" }}>
          <CheckCircle className="h-20 w-20 mx-auto text-green-500 mb-4" />
        </motion.div>
        <h1 className="text-2xl font-heading font-bold mb-2">{t.checkout.orderPlaced}</h1>
        <p className="text-muted-foreground mb-6">{t.checkout.orderPlacedMsg}</p>
        <Button onClick={() => navigate("/marketplace")} className="rounded-xl font-bold">
          {t.checkout.continueShopping}
        </Button>
      </div>
    );
  }

  return (
    <div className="container py-8 max-w-lg">
      <h1 className="text-3xl font-heading font-bold mb-6">{t.checkout.title}</h1>
      <form onSubmit={placeOrder} className="space-y-5">

        {/* Order Items */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <ShoppingBag className="h-4 w-4 text-primary" /> Order Summary ({items.length} items)
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {items.map((item) => (
              <div key={item.id} className="flex items-center gap-3">
                <img src={item.image_url} alt={item.title} className="h-10 w-10 rounded-lg object-cover" />
                <span className="flex-1 text-sm truncate">{item.title}</span>
                <span className="text-sm text-muted-foreground">×{item.quantity}</span>
                <span className="text-sm font-bold text-primary">₹{(item.price * item.quantity).toFixed(0)}</span>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Delivery Address */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <MapPin className="h-4 w-4 text-primary" /> {t.checkout.deliveryAddress}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <Label>{t.checkout.address}</Label>
              <Input required value={address.address_line}
                onChange={(e) => setAddress((a) => ({ ...a, address_line: e.target.value }))}
                placeholder={t.checkout.addressPlaceholder} className="mt-1" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>{t.checkout.city}</Label>
                <Input required value={address.city}
                  onChange={(e) => setAddress((a) => ({ ...a, city: e.target.value }))} className="mt-1" />
              </div>
              <div>
                <Label>{t.checkout.pincode}</Label>
                <Input required value={address.pincode}
                  onChange={(e) => setAddress((a) => ({ ...a, pincode: e.target.value }))}
                  pattern="[0-9]{6}" maxLength={6} className="mt-1" />
              </div>
            </div>
            <div>
              <Label className="flex items-center gap-1"><Phone className="h-3 w-3" /> {t.checkout.phone}</Label>
              <Input required value={address.phone}
                onChange={(e) => setAddress((a) => ({ ...a, phone: e.target.value }))}
                placeholder={t.checkout.phonePlaceholder} className="mt-1" />
            </div>
          </CardContent>
        </Card>

        {/* Payment Method */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <CreditCard className="h-4 w-4 text-primary" /> {t.checkout.paymentMethod}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <button type="button" onClick={() => setPaymentMethod("cod")}
              className={`w-full text-left px-4 py-4 rounded-xl border-2 transition-all flex items-center gap-4 ${
                paymentMethod === "cod" ? "border-primary bg-primary/5" : "border-border hover:border-primary/40"
              }`}>
              <div className="h-10 w-10 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center flex-shrink-0">
                <Truck className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="font-semibold text-sm">{t.checkout.cod}</p>
                <p className="text-xs text-muted-foreground">Pay when your order arrives</p>
              </div>
              {paymentMethod === "cod" && <CheckCircle className="h-5 w-5 text-primary ml-auto" />}
            </button>

            <button type="button" onClick={() => setPaymentMethod("online")}
              className={`w-full text-left px-4 py-4 rounded-xl border-2 transition-all flex items-center gap-4 ${
                paymentMethod === "online" ? "border-primary bg-primary/5" : "border-border hover:border-primary/40"
              }`}>
              <div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center flex-shrink-0">
                <CreditCard className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="font-semibold text-sm">{t.checkout.online}</p>
                <p className="text-xs text-muted-foreground">UPI / Card / Net Banking</p>
              </div>
              {paymentMethod === "online" && <CheckCircle className="h-5 w-5 text-primary ml-auto" />}
            </button>
          </CardContent>
        </Card>

        {/* Total & Place Order */}
        <Card className="border-2 border-primary/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-4">
              <span className="text-muted-foreground text-sm">{t.checkout.total}</span>
              <span className="text-2xl font-heading font-extrabold text-primary">₹{total.toFixed(2)}</span>
            </div>
            <Button type="submit" size="lg" className="w-full font-bold rounded-xl" disabled={submitting}>
              {submitting ? t.checkout.placingOrder : t.checkout.placeOrder}
            </Button>
          </CardContent>
        </Card>

      </form>
    </div>
  );
};

export default Checkout;
