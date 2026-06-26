import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { Play, BookOpen } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const categories = ["all", "stitching", "cooking", "business", "handicraft", "beauty", "pottery", "jewelry", "other"];

const categoryEmoji: Record<string, string> = {
  all: "📚", stitching: "🧵", cooking: "🍳", business: "💼",
  handicraft: "🧶", beauty: "💄", pottery: "🏺", jewelry: "💍", other: "🎓",
};

// Real YouTube video IDs with proper thumbnails
const sampleContent = [
  {
    id: "v1", category: "stitching",
    title: "Basic Stitching for Beginners",
    description: "Learn to stitch kurti, blouse and simple dresses from scratch",
    video_url: "https://youtu.be/pKo6iDd5vD8?list=PLPjgcNTdPe3Lum4AqKwSPSmE4VEcSekx5",
    thumbnail_url: "https://www.wikihow.com/images/thumb/b/b7/Sew-Step-1-Version-4.jpg/550px-nowatermark-Sew-Step-1-Version-4.jpg",
  },
  {
    id: "v2", category: "stitching",
    title: "Hand Embroidery for Beginners",
    description: "Beautiful hand embroidery stitches you can learn at home",
    video_url: "https://www.youtube.com/shorts/Wysn7ud5MRU?feature=share",
    thumbnail_url: "https://sewguide.com/wp-content/uploads/2023/09/embroider-tips-for-beginner.jpg",
  },
  {
    id: "v3", category: "stitching",
    title: "Blouse Cutting & Stitching",
    description: "Step-by-step blouse cutting and stitching tutorial",
    video_url: "https://www.youtube.com/shorts/gQqXRBJEa5M?feature=share",
    thumbnail_url: "https://www.kurtiblouse.com/wp-content/uploads/2018/08/simple-designer-blouse-cutting-and-stitching-featured.jpg",
  },
  {
    id: "v4", category: "cooking",
    title: "Homemade Mango Pickle Recipe",
    description: "Traditional aam ka aachar recipe to sell from home",
    video_url: "https://youtu.be/nOKKZLFoUso",
    thumbnail_url: "https://elephantsandthecoconuttrees.com/wp-content/uploads/2021/09/Instant-mango-pickle-from-Kerala-2.png",
  },
  {
    id: "v5", category: "cooking",
    title: "Besan Ladoo Business Recipe",
    description: "Make perfect besan ladoos to sell during festivals",
    video_url: "https://youtu.be/5OpXp1FynZg",
    thumbnail_url: "https://i.ytimg.com/vi/5OpXp1FynZg/sddefault.jpg?v=6139b081",
  },
  {
    id: "v6", category: "cooking",
    title: "Homemade Masala Powder",
    description: "Grind and package your own masala blends to sell",
    video_url: "https://youtu.be/-1s_wp6EMu8",
    thumbnail_url: "https://i.ytimg.com/vi/-1s_wp6EMu8/maxresdefault.jpg",
  },
  {
    id: "v7", category: "business",
    title: "Start a Home Business in India",
    description: "How to start and grow a small business from home",
    video_url: "https://youtu.be/2fG9EX6dzp0",
    thumbnail_url: "https://i.ytimg.com/vi/2fG9EX6dzp0/maxresdefault.jpg",
  },
  {
    id: "v8", category: "business",
    title: "WhatsApp Business for Sellers",
    description: "Use WhatsApp Business to grow your customer base",
    video_url: "https://www.youtube.com/shorts/_jNtiLmp7PI?feature=share",
    thumbnail_url: "https://prod.superblogcdn.com/site_cuid_cl9pmahic552151jpq6mko9ans/images/29-1732184130152-compressed.jpg",
  },
  {
    id: "v9", category: "business",
    title: "Product Photography at Home",
    description: "Take great product photos with just your phone",
    video_url: "https://youtu.be/a9rJB3VKA74",
    thumbnail_url: "https://i.ytimg.com/vi/a9rJB3VKA74/hq720.jpg?sqp=-oaymwEhCK4FEIIDSFryq4qpAxMIARUAAAAAGAElAADIQj0AgKJD&rs=AOn4CLD4s5mHajtAmtBI6M_k1rpaomcJOQ",
  },
  {
    id: "v10", category: "handicraft",
    title: "Macramé Wall Hanging Tutorial",
    description: "Make beautiful macramé wall hangings to sell",
    video_url: "https://www.youtube.com/watch?v=Ld8A0je5k6Q",
    thumbnail_url: "https://i.ytimg.com/vi/4T7ekKKVbKU/maxresdefault.jpg",
  },
  {
    id: "v11", category: "handicraft",
    title: "Crochet Bag for Beginners",
    description: "Crochet a trendy bag step by step",
    video_url: "https://youtu.be/9NYck-uqD2E",
    thumbnail_url: "https://i.ytimg.com/vi/9NYck-uqD2E/maxresdefault.jpg",
  },
  {
    id: "v12", category: "handicraft",
    title: "Jute Craft Ideas to Sell",
    description: "Creative jute craft products you can make and sell",
    video_url: "https://youtu.be/HKoAufTREGo",
    thumbnail_url: "https://i.ytimg.com/vi/HKoAufTREGo/hq720.jpg?sqp=-oaymwEhCK4FEIIDSFryq4qpAxMIARUAAAAAGAElAADIQj0AgKJD&rs=AOn4CLDC5Tku_4U6lDZOZdtu_IKDGkmm2g",
  },
  {
    id: "v13", category: "beauty",
    title: "Homemade Herbal Face Pack",
    description: "Natural face pack recipes using kitchen ingredients",
    video_url: "https://youtu.be/b3h50U0Zyto",
    thumbnail_url: "https://i.ytimg.com/vi/b3h50U0Zyto/maxresdefault.jpg",
  },
  {
    id: "v14", category: "beauty",
    title: "Handmade Soap Making",
    description: "Make natural neem & turmeric soaps to sell",
    video_url: "https://youtu.be/Kc7duzDEa6Y",
    thumbnail_url: "https://i.ytimg.com/vi/Kc7duzDEa6Y/hq720.jpg?sqp=-oaymwEhCK4FEIIDSFryq4qpAxMIARUAAAAAGAElAADIQj0AgKJD&rs=AOn4CLBFLDuDwAMu9hf9ZVt-1TgCNMcU7w",
  },
  {
    id: "v15", category: "pottery",
    title: "Clay Diya Making at Home",
    description: "Make and paint beautiful diyas for Diwali sales",
    video_url: "https://youtu.be/ElmkLvXnX0s",
    thumbnail_url: "https://i.ytimg.com/vi/ElmkLvXnX0s/maxresdefault.jpg",
  },
  {
    id: "v16", category: "pottery",
    title: "Terracotta Jewellery Making",
    description: "Create and sell terracotta earrings and pendants",
    video_url: "https://youtu.be/Ngr9oVOjAHM",
    thumbnail_url: "https://i.ytimg.com/vi/Ngr9oVOjAHM/hq720.jpg?sqp=-oaymwEhCK4FEIIDSFryq4qpAxMIARUAAAAAGAElAADIQj0AgKJD&rs=AOn4CLAJ67BaoybIzBHpTHuKsSwZTG4tcA",
  },
  {
    id: "v17", category: "jewelry",
    title: "Beaded Jewellery for Beginners",
    description: "Make and sell beaded necklaces and earrings",
    video_url: "https://youtu.be/f1tf8mpzv9w",
    thumbnail_url: "https://i.ytimg.com/vi/f1tf8mpzv9w/maxresdefault.jpg",
  },
  {
    id: "v18", category: "jewelry",
    title: "Thread Jewellery Making",
    description: "Colorful thread jewellery that sells fast",
    video_url: "https://youtu.be/_QfsfbCWkk4",
    thumbnail_url: "https://i.ytimg.com/vi/_QfsfbCWkk4/maxresdefault.jpg",
  },
];

const Learn = () => {
  const [category, setCategory] = useState("all");
  const { t } = useLanguage();

  const { data: dbContent } = useQuery({
    queryKey: ["learning-content"],
    queryFn: async () => {
      const { data } = await supabase.from("learning_content").select("*").order("created_at", { ascending: false });
      return data ?? [];
    },
  });

  const content = [
    ...(dbContent ?? []),
    ...sampleContent,
  ].filter((c) => category === "all" || c.category === category);

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-heading font-bold mb-2">{t.learn.title}</h1>
      <p className="text-muted-foreground mb-6">{t.learn.subtitle}</p>

      {/* Category filters */}
      <div className="flex gap-2 flex-wrap mb-6">
        {categories.map((c) => (
          <Button
            key={c}
            size="sm"
            variant={category === c ? "default" : "outline"}
            onClick={() => setCategory(c)}
            className="capitalize"
          >
            {categoryEmoji[c]} {c === "all" ? t.learn.all : c}
          </Button>
        ))}
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {content.map((item) => (
          <Card key={item.id} className="overflow-hidden hover:shadow-lg transition-all duration-200 group">
            {/* Video thumbnail */}
            <div className="aspect-video bg-muted relative overflow-hidden">
              {item.thumbnail_url ? (
                <img
                  src={item.thumbnail_url}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <BookOpen className="h-10 w-10 text-muted-foreground" />
                </div>
              )}
              {/* Play button overlay */}
              <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/30 transition-colors">
                <div className="h-12 w-12 rounded-full bg-red-600 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                  <Play className="h-5 w-5 text-white ml-0.5" />
                </div>
              </div>
            </div>

            <CardContent className="p-4">
              <Badge variant="secondary" className="text-xs capitalize mb-2">
                {categoryEmoji[item.category]} {item.category}
              </Badge>
              <h3 className="font-heading font-bold text-sm leading-snug">{item.title}</h3>
              {item.description && (
                <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{item.description}</p>
              )}
              <a href={item.video_url} target="_blank" rel="noopener noreferrer">
                <Button size="sm" className="mt-3 w-full bg-red-600 hover:bg-red-700 text-white">
                  <Play className="h-3 w-3 mr-1" /> {t.learn.watchVideo}
                </Button>
              </a>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Learn;
