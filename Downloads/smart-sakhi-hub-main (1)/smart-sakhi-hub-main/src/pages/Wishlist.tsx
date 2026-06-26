import React from "react";
import { Link } from "react-router-dom";
import { useWishlist } from "@/contexts/WishlistContext";
import { useCart } from "@/contexts/CartContext";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, ShoppingCart, Trash2 } from "lucide-react";

const Wishlist = () => {
  const { items, removeFromWishlist } = useWishlist();
  const { addItem } = useCart();
  const { toast } = useToast();

  const moveToCart = (product: typeof items[0]) => {
    addItem(product);
    removeFromWishlist(product.id);
    toast({ title: "Moved to cart!" });
  };

  if (!items.length) {
    return (
      <div className="container py-12 text-center">
        <Heart className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
        <p className="text-muted-foreground mb-4">Your wishlist is empty</p>
        <Link to="/marketplace"><Button>Browse Products</Button></Link>
      </div>
    );
  }

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-heading font-bold mb-6">My Wishlist ❤️</h1>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {items.map((product) => (
          <Card key={product.id} className="overflow-hidden h-full flex flex-col">
            <div className="aspect-square bg-muted overflow-hidden relative">
              <img
                src={product.image_url}
                alt={product.title}
                className="w-full h-full object-cover"
                onError={(e) => { (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&h=400&fit=crop"; }}
              />
              <button
                onClick={() => removeFromWishlist(product.id)}
                className="absolute top-2 right-2 h-8 w-8 rounded-full bg-white/90 dark:bg-black/70 flex items-center justify-center shadow hover:scale-110 transition-transform"
                title="Remove from wishlist"
              >
                <Trash2 className="h-4 w-4 text-red-500" />
              </button>
            </div>
            <CardContent className="p-3 flex flex-col flex-1">
              <h3 className="font-heading font-bold text-sm line-clamp-2">{product.title}</h3>
              <p className="text-primary font-bold mt-auto pt-2">₹{product.price}</p>
              <Button size="sm" className="mt-2 w-full" onClick={() => moveToCart(product)}>
                <ShoppingCart className="h-4 w-4 mr-1" /> Move to Cart
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Wishlist;
