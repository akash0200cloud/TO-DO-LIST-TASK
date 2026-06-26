import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";
import { useCart } from "@/contexts/CartContext";
import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react";

const Cart = () => {
  const { t } = useLanguage();
  const { items, updateQty, removeItem, total } = useCart();

  if (!items.length) {
    return (
      <div className="container py-12 text-center">
        <ShoppingBag className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
        <p className="text-muted-foreground mb-4">{t.cart.emptyCart}</p>
        <Link to="/marketplace"><Button>{t.cart.browseProducts}</Button></Link>
      </div>
    );
  }

  return (
    <div className="container py-8 max-w-2xl">
      <h1 className="text-3xl font-heading font-bold mb-6">{t.cart.title}</h1>

      <div className="space-y-3">
        {items.map((item) => (
          <Card key={item.id}>
            <CardContent className="p-4 flex items-center gap-4">
              <div className="h-16 w-16 bg-muted rounded-xl flex-shrink-0 overflow-hidden">
                <img
                  src={item.image_url}
                  alt={item.title}
                  className="w-full h-full object-cover"
                  onError={(e) => { (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=64&h=64&fit=crop"; }}
                />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-heading font-bold text-sm truncate">{item.title}</h3>
                <p className="text-primary font-bold text-sm">₹{item.price}</p>
              </div>
              <div className="flex items-center gap-1">
                <Button size="icon" variant="outline" className="h-8 w-8 rounded-lg"
                  onClick={() => updateQty(item.id, item.quantity - 1)}>
                  <Minus className="h-3 w-3" />
                </Button>
                <span className="w-8 text-center font-bold text-sm">{item.quantity}</span>
                <Button size="icon" variant="outline" className="h-8 w-8 rounded-lg"
                  onClick={() => updateQty(item.id, item.quantity + 1)}>
                  <Plus className="h-3 w-3" />
                </Button>
              </div>
              <Button size="icon" variant="ghost" className="text-destructive"
                onClick={() => removeItem(item.id)}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="mt-6 border-2 border-primary/20">
        <CardContent className="p-4 flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">{t.cart.total}</p>
            <p className="text-2xl font-heading font-extrabold text-primary">₹{total.toFixed(2)}</p>
          </div>
          <Link to="/checkout">
            <Button size="lg" className="font-bold rounded-xl">{t.cart.proceedCheckout}</Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
};

export default Cart;
