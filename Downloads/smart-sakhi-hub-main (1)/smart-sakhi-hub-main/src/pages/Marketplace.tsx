import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/contexts/LanguageContext";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { ShoppingCart, Search, Package, Star, Heart } from "lucide-react";
import { motion } from "framer-motion";
import { useCart } from "@/contexts/CartContext";
import { useWishlist } from "@/contexts/WishlistContext";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";

const categories = [
  "all","pickle","spices","clothes","handicraft","jewelry",
  "pottery","textiles","beauty","sweets","bags","art","other",
];

const categoryEmoji: Record<string, string> = {
  all:"🛍️", pickle:"🫙", spices:"🌶️", clothes:"👗",
  handicraft:"🧶", jewelry:"💍", pottery:"🏺", textiles:"🧵",
  beauty:"💄", sweets:"🍬", bags:"👜", art:"🎨", other:"📦",
};

type StaticProduct = {
  id: string; title: string; description: string;
  price: number; category: string; image_url: string;
};

const STATIC_PRODUCTS: StaticProduct[] = [
  // Pickle
  { id: "s1",  title: "Mango Pickle (Homemade)",    description: "Traditional spicy mango pickle made with mustard oil", price: 120, category: "pickle",    image_url: "https://www.whiskaffair.com/wp-content/uploads/2020/07/Kerala-Style-Mango-Pickle-2-3.jpg" },
  { id: "s2",  title: "Mixed Vegetable Pickle",      description: "Carrot, turnip & chilli pickle in mustard oil",         price: 100, category: "pickle",    image_url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQmEtOPNdo-EbCCc6KkQh-_uEMSL32a7XFisA&s" },
  { id: "s25", title: "Lemon Pickle",                description: "Tangy homemade lemon pickle with spices",               price: 90,  category: "pickle",    image_url: "https://recipes.timesofindia.com/photo/57645740.cms" },
  // Spices
  { id: "s3",  title: "Garam Masala Blend",          description: "Freshly ground aromatic spice mix, 200g",               price: 80,  category: "spices",    image_url: "https://images.pexels.com/photos/2802527/pexels-photo-2802527.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop" },
  { id: "s4",  title: "Turmeric Powder",             description: "Pure organic turmeric powder, 200g",                    price: 55,  category: "spices",    image_url: "https://info.ehl.edu/hubfs/EHL-Passugg_Blog_Kurkuma_Titelbild_001.jpg" },
  { id: "s26", title: "Red Chilli Powder",           description: "Sun-dried & ground red chilli powder, 200g",            price: 60,  category: "spices",    image_url: "https://www.neonaturalindustries.com/wp-content/uploads/2022/06/red-chillies.jpg  " },
  // Clothes
  { id: "s5",  title: "Hand-Stitched Kurti",         description: "Beautiful cotton kurti with hand embroidery",           price: 450, category: "clothes",   image_url: "https://sukritistore.com/cdn/shop/files/4.jpg?v=1693318055" },
  { id: "s6",  title: "Cotton Salwar Set",           description: "Comfortable daily wear salwar kameez set",              price: 650, category: "clothes",   image_url: "https://www.thebhamini.com/cdn/shop/files/rn-image_picker_lib_temp_5bd76749-3423-438e-960f-e01dac8ebb1c.jpg?v=1753876096" },
  { id: "s27", title: "Embroidered Blouse",          description: "Silk blouse with traditional mirror work embroidery",   price: 380, category: "clothes",   image_url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRNxplfypyi24xM5Fvms4t6h35M1mbyufeiSQ&s" },
  // Handicraft
  { id: "s7",  title: "Macramé Wall Hanging",        description: "Handmade boho macramé wall decor, 24 inch",             price: 350, category: "handicraft", image_url: "https://okhai.org/cdn/shop/products/12_dbd02675-3567-4efe-89bb-f6693c9cd5d8.jpg?v=1754296513" },
  { id: "s8",  title: "Bamboo Basket Set",           description: "Set of 3 handwoven bamboo storage baskets",             price: 480, category: "handicraft", image_url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTDZlOUi_-ccPwHYZ9tf67taN2LXVPybwapPw&s" },
  { id: "s28", title: "Jute Doormat",                description: "Eco-friendly handmade jute doormat",                    price: 180, category: "handicraft", image_url: "https://m.media-amazon.com/images/I/71OZEKOQAbL._AC_UF894,1000_QL80_.jpg" },
  // Jewelry
  { id: "s9",  title: "Beaded Necklace Set",         description: "Handmade colorful bead necklace with earrings",         price: 250, category: "jewelry",   image_url: "https://www.fashionkida.com/cdn/shop/products/Download_18.jpg?v=1546880501" },
  { id: "s10", title: "Oxidised Silver Jhumkas",     description: "Traditional oxidised silver jhumka earrings",          price: 320, category: "jewelry",   image_url: "https://5.imimg.com/data5/ANDROID/Default/2023/3/292599069/NN/UO/HH/155971791/product-jpeg.jpg" },
  { id: "s24", title: "Thread Bangles Set",          description: "Set of 12 colorful thread-wrapped bangles",            price: 150, category: "jewelry",   image_url: "https://www.littlefingersindia.com/wp-content/uploads/2023/10/IMG_20230930_1211161-1.jpg" },
  // Pottery
  { id: "s11", title: "Handmade Clay Diya Set",      description: "Set of 10 hand-painted clay diyas",                    price: 150, category: "pottery",   image_url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS9i9Pvnll5KAHpfLoyjIYmwKS0o-kMIPlMZg&s" },
  { id: "s12", title: "Terracotta Planter",          description: "Hand-painted terracotta flower pot",                   price: 200, category: "pottery",   image_url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ-bSV_ZciuLsJBQ6ZYhrMBNDEJQFc5ixaoOw&s" },
  { id: "s29", title: "Clay Water Pot (Matka)",      description: "Traditional clay matka, keeps water naturally cool",   price: 280, category: "pottery",   image_url: "https://5.imimg.com/data5/SELLER/Default/2023/4/297100694/YX/AV/SI/89569460/mittiwala-red-earthen-water-pot-for-drinking-cool-water-or-clay-red-matka-with-tap-15-liters.png" },
  // Textiles
  { id: "s13", title: "Block Print Dupatta",         description: "Hand block-printed cotton dupatta",                    price: 320, category: "textiles",  image_url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT8HO19tkyTSGAdRXWygoW5wSQ_cwerBh-flA&s" },
  { id: "s14", title: "Tie-Dye Saree",               description: "Handmade tie-dye cotton saree, vibrant colors",        price: 850, category: "textiles",  image_url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT99bqSiHKpKyvf-uxSywNYtUE42jkhdgbEBA&s" },
  { id: "s30", title: "Embroidered Cushion Cover",   description: "Hand-embroidered cushion cover, 16x16 inch",           price: 180, category: "textiles",  image_url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQvRwFCaVxP4oPzPZ65hPv87gCjefdyJ4ky2g&s" },
  // Beauty
  { id: "s15", title: "Herbal Face Pack",            description: "Natural multani mitti & rose face pack, 100g",         price: 90,  category: "beauty",    image_url: "https://5.imimg.com/data5/SELLER/Default/2023/2/TT/ZB/YZ/102744241/fp2-500x500.jpg" },
  { id: "s16", title: "Handmade Neem Soap Bar",      description: "Natural neem & turmeric handmade soap bar",            price: 70,  category: "beauty",    image_url: "https://manaayurvedam.com/cdn/shop/files/38A5A109-82AA-4A18-8511-E5446CB08736.jpg?v=1695390235" },
  { id: "s23", title: "Coconut Hair Oil",            description: "Cold-pressed coconut oil with herbs, 200ml",           price: 130, category: "beauty",    image_url: "https://images.pexels.com/photos/4041392/pexels-photo-4041392.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop" },
  // Sweets
  { id: "s17", title: "Homemade Besan Ladoo",        description: "Besan ladoo made with pure desi ghee, 500g",           price: 200, category: "sweets",    image_url: "https://maayeka.com/wp-content/uploads/2012/08/besan-ke-ladoo-maayeka-blog-1.jpg" },
  { id: "s18", title: "Dry Fruit Barfi",             description: "Mixed dry fruit barfi with kaju & pista, 250g",        price: 280, category: "sweets",    image_url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTaXMArNN40j7xNrV5inep9hT1vCYE4D4mN_A&s" },
  { id: "s31", title: "Homemade Chakli",             description: "Crispy rice flour chakli, perfect tea-time snack",    price: 120, category: "sweets",    image_url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRF-_4myEIzpr8pAbQ-HJo7C1xs3vZbZmqjLA&s" },
  // Bags
  { id: "s19", title: "Jute Tote Bag",               description: "Eco-friendly hand-painted jute tote bag",              price: 220, category: "bags",      image_url: "https://www.zwende.com/cdn/shop/products/Cotton_Crafters_Fashion_Bags_Jute_Style_Src1.jpg?v=1674652791&width=1080" },
  { id: "s20", title: "Crochet Sling Bag",           description: "Handmade crochet boho sling bag",                      price: 380, category: "bags",      image_url: "https://m.media-amazon.com/images/I/71xfjGYp3UL._AC_UY300_.jpg" },
  { id: "s32", title: "Embroidered Clutch Purse",    description: "Hand-embroidered silk clutch purse, festive wear",    price: 450, category: "bags",      image_url: "https://artklim.com/cdn/shop/files/DSC_5823.jpg?v=1707192230&width=1000" },
  // Art
  { id: "s21", title: "Madhubani Painting",          description: "Original hand-painted Madhubani art on paper",         price: 600, category: "art",       image_url: "https://i.pinimg.com/236x/75/6a/bf/756abff7954608345c3c3170796abde6.jpg" },
  { id: "s22", title: "Warli Art Canvas",            description: "Traditional Warli tribal art on canvas, 12x12",        price: 750, category: "art",       image_url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQmDFQmt5mF6b7ac4YRgLOUrAKI8JJnm1nqLw&s" },
  { id: "s33", title: "Rangoli Stencil Set",         description: "Set of 10 reusable rangoli stencils for festivals",   price: 160, category: "art",       image_url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRGwkdTidKI8DjgEMC4GUy8MQFJ54PjEVlg_A&s" },
];

const Marketplace = () => {
  const [category, setCategory] = useState("all");
  const [search, setSearch] = useState("");
  const { t } = useLanguage();
  const { toast } = useToast();
  const { addItem } = useCart();
  const { addToWishlist, isWishlisted } = useWishlist();
  const { user } = useAuth();
  const navigate = useNavigate();

  const { data: dbProducts, isLoading } = useQuery({
    queryKey: ["products", category, search],
    queryFn: async () => {
      let query = supabase
        .from("products")
        .select("*")
        .eq("is_active", true)
        .order("created_at", { ascending: false });
      if (category !== "all") query = query.eq("category", category);
      if (search) query = query.ilike("title", `%${search}%`);
      const { data } = await query;
      return data ?? [];
    },
  });

  // Use DB products if available, otherwise fall back to static products
  const allProducts = (dbProducts && dbProducts.length > 0) ? dbProducts : STATIC_PRODUCTS;
  const products = allProducts.filter((p) => {
    const matchCat = category === "all" || p.category === category;
    const matchSearch = !search || p.title.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  const getCatLabel = (cat: string) => {
    const map: Record<string, string> = {
      pickle: t.marketplace.cat_pickle,
      spices: t.marketplace.cat_spices,
      clothes: t.marketplace.cat_clothes,
      handicraft: t.marketplace.cat_handicraft,
      jewelry: t.marketplace.cat_jewelry,
      pottery: t.marketplace.cat_pottery,
      textiles: t.marketplace.cat_textiles,
      beauty: t.marketplace.cat_beauty,
      sweets: t.marketplace.cat_sweets,
      bags: t.marketplace.cat_bags,
      art: t.marketplace.cat_art,
      other: t.marketplace.cat_other,
    };
    return map[cat] ?? cat;
  };

  const addToCart = (product: { id: string; title: string; price: number; image_url: string; category: string }) => {
    if (!user) { navigate("/auth", { state: { from: "/marketplace" } }); return; }
    addItem(product);
    toast({ title: t.marketplace.addedToCart });
  };

  const handleWishlist = (product: { id: string; title: string; price: number; image_url: string; category: string }) => {
    if (!user) { navigate("/auth", { state: { from: "/marketplace" } }); return; }
    addToWishlist(product);
    toast({ title: "Added to Wishlist ❤️" });
  };

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-heading font-bold mb-1">{t.marketplace.title}</h1>
      <p className="text-muted-foreground mb-6">{t.marketplace.subtitle}</p>

      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder={t.marketplace.searchPlaceholder}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9"
        />
      </div>

      <div className="flex gap-2 flex-wrap mb-6">
        {categories.map((c) => (
          <Button
            key={c}
            size="sm"
            variant={category === c ? "default" : "outline"}
            onClick={() => setCategory(c)}
          >
            {categoryEmoji[c]} {c === "all" ? t.marketplace.all : getCatLabel(c)}
          </Button>
        ))}
      </div>

      {isLoading ? (
        <div className="text-center py-12 text-muted-foreground">{t.marketplace.loadingProducts}</div>
      ) : !products?.length ? (
        <div className="text-center py-12">
          <Package className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
          <p className="text-muted-foreground">{t.marketplace.noProducts}</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {products.map((product, i) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.03 }}
            >
              <Card className="overflow-hidden hover:shadow-lg transition-all duration-200 h-full flex flex-col group">
                <div className="aspect-square bg-muted overflow-hidden relative">
                  <img
                    src={product.image_url || `https://images.pexels.com/photos/4198019/pexels-photo-4198019.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop`}
                    alt={product.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      if (!target.dataset.fallback) {
                        target.dataset.fallback = "1";
                        target.src = `https://images.pexels.com/photos/4198019/pexels-photo-4198019.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop`;
                      }
                    }}
                  />
                  <Badge className="absolute top-2 left-2 text-xs bg-white/90 text-foreground dark:bg-black/70 dark:text-white">
                    {categoryEmoji[product.category] ?? "📦"} {getCatLabel(product.category)}
                  </Badge>
                  <button
                    onClick={() => handleWishlist({ id: product.id, title: product.title, price: product.price, image_url: product.image_url, category: product.category })}
                    className="absolute top-2 right-2 h-8 w-8 rounded-full bg-white/90 dark:bg-black/70 flex items-center justify-center shadow hover:scale-110 transition-transform"
                    title={isWishlisted(product.id) ? "In Wishlist" : "Add to Wishlist"}
                  >
                    <Heart className={`h-4 w-4 transition-colors ${isWishlisted(product.id) ? "fill-red-500 text-red-500" : "text-muted-foreground hover:text-red-400"}`} />
                  </button>
                </div>
                <CardContent className="p-3 flex flex-col flex-1">
                  <h3 className="font-heading font-bold text-sm mt-1 line-clamp-2">
                    {(t.products as any)?.[`${product.id}_name`] || product.title}
                  </h3>
                  {product.description && (
                    <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                      {(t.products as any)?.[`${product.id}_desc`] || product.description}
                    </p>
                  )}
                  <div className="flex items-center gap-1 mt-1">
                    <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                    <span className="text-xs text-muted-foreground">4.8</span>
                  </div>
                  <p className="text-primary font-bold mt-auto pt-2 text-base">₹{product.price}</p>
                  <Button size="sm" className="mt-2 w-full" onClick={() => addToCart({ id: product.id, title: product.title, price: product.price, image_url: product.image_url, category: product.category })}>
                    <ShoppingCart className="h-4 w-4 mr-1" /> {t.marketplace.addToCart}
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Marketplace;
