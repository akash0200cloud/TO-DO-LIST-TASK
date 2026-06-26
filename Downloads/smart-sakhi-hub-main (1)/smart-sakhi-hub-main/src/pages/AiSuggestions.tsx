import React, { useState, useRef, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sparkles, Send, User, Bot, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

type Message = {
  id: number;
  role: "user" | "assistant";
  text: string;
};

const SUGGESTIONS = [
  "How do I start selling pickles online?",
  "What skills can I learn to earn from home?",
  "How to price my handmade products?",
  "Tips to grow my small business?",
  "How to take good product photos?",
];

const getLocalReply = (text: string): string => {
  const q = text.toLowerCase();

  if (q.includes("pickle") || q.includes("achar"))
    return "🫙 To sell pickles online:\n1. Start with 2-3 varieties like mango, lemon, mixed veg\n2. Pack in clean glass jars with labels\n3. List on Smart Sakhi marketplace with good photos\n4. Share on WhatsApp groups — word of mouth works great!\n5. Price: ₹80-150 per jar is ideal to start";

  if (q.includes("skill") || q.includes("learn") || q.includes("earn from home"))
    return "📚 Best skills to earn from home:\n1. Tailoring & stitching — ₹5,000-15,000/month\n2. Mehndi design — great for weddings & festivals\n3. Homemade food (pickles, sweets, masala)\n4. Crochet & knitting — bags, toys, decor\n5. Beauty services — threading, waxing at home\n6. Tuition for kids in your area";

  if (q.includes("price") || q.includes("pricing") || q.includes("cost"))
    return "💰 How to price your products:\n1. Calculate: Material cost × 3 = selling price\n2. Add delivery charges separately\n3. Check what others charge on marketplace\n4. Never price too low — it reduces trust\n5. Offer combo deals to increase order value\nExample: If material costs ₹40, sell at ₹120";

  if (q.includes("photo") || q.includes("image") || q.includes("picture"))
    return "📸 Tips for great product photos:\n1. Use natural daylight — near a window\n2. Use a plain white or wooden background\n3. Clean your product before shooting\n4. Take 3-4 angles: front, top, close-up\n5. Use your phone camera — it's enough!\n6. Good photos increase sales by 40%!";

  if (q.includes("whatsapp") || q.includes("market") || q.includes("promote") || q.includes("sell more"))
    return "📱 How to market your products:\n1. Create a WhatsApp Business account\n2. Make a catalogue of your products\n3. Share in local WhatsApp groups\n4. Post on Facebook Marketplace\n5. Ask happy customers for reviews\n6. Offer ₹10-20 discount for referrals";

  if (q.includes("business") || q.includes("start") || q.includes("grow"))
    return "🚀 Tips to grow your business:\n1. Start with 1 product, perfect it first\n2. Get feedback from first 5 customers\n3. Reinvest profits to buy more materials\n4. Keep a simple notebook for income & expenses\n5. Join local women entrepreneur groups\n6. List all products on Smart Sakhi for free!";

  if (q.includes("packaging") || q.includes("pack"))
    return "📦 Packaging tips:\n1. Use clean, airtight containers for food\n2. Add a handwritten thank you note\n3. Label with: product name, weight, date made\n4. Use eco-friendly jute or cloth bags\n5. Good packaging = repeat customers!";

  if (q.includes("delivery") || q.includes("ship") || q.includes("courier"))
    return "🚚 Delivery tips:\n1. Offer free delivery within 2-3 km\n2. Use Dunzo, Porter or Swiggy Genie for local delivery\n3. For far orders, use India Post or Delhivery\n4. Pack items securely to avoid damage\n5. Always confirm delivery with a photo";

  if (q.includes("masala") || q.includes("spice"))
    return "🌶️ Selling masala & spices:\n1. Grind fresh at home for best quality\n2. Pack in 100g, 200g, 500g sizes\n3. Popular items: garam masala, chilli powder, turmeric\n4. Label with ingredients & weight\n5. Price: ₹50-150 depending on quantity\n6. Sell combo packs for better value";

  if (q.includes("jewel") || q.includes("necklace") || q.includes("earring") || q.includes("bangle"))
    return "💍 Selling handmade jewelry:\n1. Beaded jewelry is trending & low cost\n2. Buy materials from local wholesale market\n3. Make sets: necklace + earrings together\n4. Festival season = highest sales!\n5. Price: ₹150-500 per set\n6. Instagram & WhatsApp work great for jewelry";

  if (q.includes("saree") || q.includes("kurti") || q.includes("cloth") || q.includes("stitch"))
    return "👗 Selling clothes & stitching:\n1. Start with alterations & repairs\n2. School uniform stitching = steady income\n3. Blouse stitching is always in demand\n4. Charge ₹150-500 per piece depending on work\n5. Build a regular customer base in your area\n6. Share your work photos on WhatsApp";

  if (q.includes("sweet") || q.includes("ladoo") || q.includes("barfi") || q.includes("mithai"))
    return "🍬 Selling homemade sweets:\n1. Festival season (Diwali, Holi, Eid) = 3x sales!\n2. Start with ladoo, barfi, chakli\n3. Use pure ghee — customers pay more for quality\n4. Pack in gift boxes for festivals\n5. Price: ₹300-600 per kg\n6. Take advance orders for festivals";

  if (q.includes("hello") || q.includes("hi") || q.includes("namaste") || q.includes("helo"))
    return "Namaste! 🪷 I'm Smart Sakhi AI. I'm here to help you:\n• Start or grow your business\n• Learn new skills to earn from home\n• Price and sell your products\n• Market on WhatsApp & online\n\nWhat would you like help with today?";

  if (q.includes("thank") || q.includes("shukriya") || q.includes("dhanyawad"))
    return "You're welcome! 🙏 Best of luck with your business. You can do it! 💪\n\nFeel free to ask me anything else about selling, skills, or growing your business on Smart Sakhi! 🪷";

  return `💡 Here are some tips for "${text}":\n\n1. Start small and test what works\n2. Talk to your customers to understand their needs\n3. Keep quality high — it builds trust\n4. Use WhatsApp to reach local customers\n5. List your products on Smart Sakhi marketplace for free!\n\nWant more specific advice? Try asking about:\n• Pricing, packaging, delivery\n• Specific products like pickles, jewelry, clothes\n• Marketing on WhatsApp or social media`;
};

const AiSuggestions = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 0,
      role: "assistant",
      text: "Namaste! 🪷 I'm Smart Sakhi AI. I'm here to help you grow your business, learn new skills, and earn more. What would you like to know today?",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const sendMessage = async (text: string) => {
    if (!text.trim() || loading) return;

    const userMsg: Message = { id: Date.now(), role: "user", text: text.trim() };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    // Simulate thinking delay
    await new Promise((res) => setTimeout(res, 800));

    const reply = getLocalReply(text.trim());
    setMessages((prev) => [...prev, { id: Date.now() + 1, role: "assistant", text: reply }]);
    setLoading(false);
  };

  return (
    <div className="container py-8 max-w-2xl flex flex-col" style={{ height: "calc(100vh - 120px)" }}>
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
          <Sparkles className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-heading font-bold">Smart Sakhi AI ✨</h1>
          <p className="text-xs text-muted-foreground">Your personal business assistant</p>
        </div>
      </div>

      {/* Chat area */}
      <Card className="flex-1 overflow-hidden flex flex-col border-primary/20">
        <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
          <AnimatePresence initial={false}>
            {messages.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
                className={`flex gap-2 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                {msg.role === "assistant" && (
                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-1">
                    <Bot className="h-4 w-4 text-primary" />
                  </div>
                )}
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed whitespace-pre-wrap ${
                    msg.role === "user"
                      ? "bg-primary text-white rounded-tr-sm"
                      : "bg-muted text-foreground rounded-tl-sm"
                  }`}
                >
                  {msg.text}
                </div>
                {msg.role === "user" && (
                  <div className="h-8 w-8 rounded-full bg-secondary/10 flex items-center justify-center flex-shrink-0 mt-1">
                    <User className="h-4 w-4 text-secondary" />
                  </div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>

          {loading && (
            <div className="flex gap-2 justify-start">
              <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Bot className="h-4 w-4 text-primary" />
              </div>
              <div className="bg-muted rounded-2xl rounded-tl-sm px-4 py-3 flex items-center gap-1">
                <Loader2 className="h-4 w-4 animate-spin text-primary" />
                <span className="text-sm text-muted-foreground">Thinking...</span>
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </CardContent>

        {/* Quick suggestions */}
        {messages.length === 1 && (
          <div className="px-4 pb-2 flex gap-2 flex-wrap">
            {SUGGESTIONS.map((s) => (
              <button
                key={s}
                onClick={() => sendMessage(s)}
                className="text-xs px-3 py-1.5 rounded-full border border-primary/30 text-primary hover:bg-primary/10 transition-colors"
              >
                {s}
              </button>
            ))}
          </div>
        )}

        {/* Input */}
        <div className="p-3 border-t border-border/50 flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage(input)}
            placeholder="Ask me anything about your business..."
            className="rounded-xl"
            disabled={loading}
          />
          <Button
            onClick={() => sendMessage(input)}
            disabled={!input.trim() || loading}
            className="rounded-xl px-4"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default AiSuggestions;
