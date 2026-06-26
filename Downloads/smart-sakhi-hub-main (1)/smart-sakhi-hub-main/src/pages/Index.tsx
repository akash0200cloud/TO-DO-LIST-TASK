import { Link, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import { ShoppingBag, BookOpen, Sparkles, ArrowRight } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";

const Index = () => {
  const { t } = useLanguage();
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && user) navigate("/marketplace", { replace: true });
  }, [user, loading, navigate]);

  const features = [
    {
      icon: ShoppingBag,
      title: t.home.featureBuyTitle,
      desc: t.home.featureBuyDesc,
      link: "/marketplace",
      gradient: "from-violet-500 to-purple-600",
      bg: "bg-violet-500/10",
    },
    {
      icon: BookOpen,
      title: t.home.featureLearnTitle,
      desc: t.home.featureLearnDesc,
      link: "/learn",
      gradient: "from-pink-500 to-rose-500",
      bg: "bg-pink-500/10",
    },
    {
      icon: Sparkles,
      title: t.home.featureAiTitle,
      desc: t.home.featureAiDesc,
      link: "/ai-suggestions",
      gradient: "from-cyan-500 to-teal-500",
      bg: "bg-cyan-500/10",
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative overflow-hidden py-20 md:py-32">
        {/* Background blobs */}
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-primary/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-secondary/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-accent/10 rounded-full blur-3xl pointer-events-none" />

        <div className="container relative text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
            <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-semibold mb-6 border border-primary/20">
              🇮🇳 Made for Indian Women Entrepreneurs
            </span>
            <h1 className="text-5xl md:text-7xl font-heading font-extrabold leading-tight mb-6">
              <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                {t.home.heroTitleBrand}
              </span>{" "}
              {t.home.heroTitle} 🪷
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
              {t.home.heroSubtitle}
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link to="/marketplace">
                <Button size="lg" className="font-bold text-base rounded-2xl gradient-primary text-white border-0 shadow-lg hover:opacity-90 hover:scale-105 transition-all px-8">
                  {t.home.startShopping} <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link to="/join-seller">
                <Button size="lg" variant="outline" className="font-bold text-base rounded-2xl border-2 hover:bg-muted/60 hover:scale-105 transition-all px-8">
                  {t.home.joinAsSeller}
                </Button>
              </Link>
            </div>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="flex flex-wrap justify-center gap-8 mt-16"
          >
            {[
              { value: "10,000+", label: "Women Sellers" },
              { value: "50,000+", label: "Products Listed" },
              { value: "Free", label: "Always Free" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-3xl font-heading font-extrabold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  {stat.value}
                </p>
                <p className="text-sm text-muted-foreground mt-1">{stat.label}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="container py-16">
        <motion.h2
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-3xl md:text-4xl font-heading font-extrabold text-center mb-12"
        >
          {t.home.featuresTitle}
        </motion.h2>
        <div className="grid md:grid-cols-3 gap-6">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
            >
              <Link to={f.link}>
                <Card className="hover:shadow-2xl transition-all duration-300 cursor-pointer h-full border-border/50 hover:-translate-y-1 group overflow-hidden">
                  <CardContent className="p-8 text-center relative">
                    <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-br ${f.gradient} opacity-5`} />
                    <div className={`h-16 w-16 rounded-2xl ${f.bg} flex items-center justify-center mx-auto mb-5 group-hover:scale-110 transition-transform duration-300`}>
                      <f.icon className={`h-8 w-8`} style={{ stroke: `url(#grad-${i})` }} />
                      <svg width="0" height="0">
                        <defs>
                          <linearGradient id={`grad-${i}`} x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor={i === 0 ? "#8b5cf6" : i === 1 ? "#ec4899" : "#06b6d4"} />
                            <stop offset="100%" stopColor={i === 0 ? "#7c3aed" : i === 1 ? "#f43f5e" : "#14b8a6"} />
                          </linearGradient>
                        </defs>
                      </svg>
                    </div>
                    <h3 className="text-xl font-heading font-bold mb-3">{f.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
                    <div className={`mt-5 inline-flex items-center gap-1 text-sm font-semibold bg-gradient-to-r ${f.gradient} bg-clip-text text-transparent`}>
                      Explore <ArrowRight className="h-4 w-4" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 gradient-primary opacity-10 pointer-events-none" />
        <div className="container text-center relative">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-heading font-extrabold mb-4">{t.home.ctaTitle}</h2>
            <p className="text-muted-foreground mb-8 text-lg max-w-xl mx-auto">{t.home.ctaSubtitle}</p>
            <Link to="/join-seller">
              <Button size="lg" className="font-bold text-base rounded-2xl gradient-primary text-white border-0 shadow-xl hover:opacity-90 hover:scale-105 transition-all px-10">
                {t.home.ctaButton} 🚀
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Index;
