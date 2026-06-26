import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTheme } from "@/contexts/ThemeContext";
import { useCart } from "@/contexts/CartContext";
import { useWishlist } from "@/contexts/WishlistContext";
import { Button } from "@/components/ui/button";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { ShoppingCart, Menu, X, User, LogOut, Store, BookOpen, Phone, Home, Sparkles, Sun, Moon, Heart } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const navIcons = {
  "/": Home,
  "/marketplace": Store,
  "/learn": BookOpen,
  "/ai-suggestions": Sparkles,
  "/help": Phone,
};

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, role, signOut } = useAuth();
  const { t } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const { items } = useCart();
  const cartCount = items.reduce((sum, i) => sum + i.quantity, 0);
  const { items: wishlistItems } = useWishlist();
  const wishlistCount = wishlistItems.length;
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const protectedHref = (path: string) => user ? path : `/auth`;
  const protectedState = (path: string) => user ? undefined : { state: { from: path } };

  const navItems = [
    ...(!user ? [{ path: "/", label: t.nav.home, icon: navIcons["/"] }] : []),
    { path: "/marketplace", label: t.nav.shop, icon: navIcons["/marketplace"] },
    { path: "/learn", label: t.nav.learn, icon: navIcons["/learn"] },
    { path: "/ai-suggestions", label: t.nav.aiTips, icon: navIcons["/ai-suggestions"] },
    { path: "/help", label: t.nav.help, icon: navIcons["/help"] },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-card/70 backdrop-blur-xl border-b border-border/50 shadow-sm">
        <div className="container flex items-center justify-between h-16">
          {/* Logo */}
          <Link to={user ? "/marketplace" : "/"} className="flex items-center gap-2 group">
            <span className="text-2xl">🪷</span>
            <span className="text-xl font-heading font-extrabold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Smart Sakhi
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const active = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`relative px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 flex items-center gap-1.5 ${
                    active
                      ? "text-primary"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
                  }`}
                >
                  {active && (
                    <motion.span
                      layoutId="nav-pill"
                      className="absolute inset-0 rounded-xl bg-primary/10"
                      transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    />
                  )}
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* Right actions */}
          <div className="flex items-center gap-1">
            {/* Theme toggle */}
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="rounded-xl hover:bg-muted/60"
              aria-label="Toggle theme"
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={theme}
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  {theme === "dark" ? (
                    <Sun className="h-5 w-5 text-yellow-400" />
                  ) : (
                    <Moon className="h-5 w-5 text-primary" />
                  )}
                </motion.div>
              </AnimatePresence>
            </Button>

            <LanguageSwitcher />

            <Link to={protectedHref("/wishlist")} {...protectedState("/wishlist")}>
                <Button variant="ghost" size="icon" className="rounded-xl hover:bg-muted/60 relative">
                  <Heart className="h-5 w-5" />
                  {wishlistCount > 0 && (
                    <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-red-500 text-white text-xs font-bold flex items-center justify-center">
                      {wishlistCount > 9 ? "9+" : wishlistCount}
                    </span>
                  )}
                </Button>
              </Link>

            <Link to={protectedHref("/cart")} {...protectedState("/cart")}>
                <Button variant="ghost" size="icon" className="rounded-xl hover:bg-muted/60 relative">
                  <ShoppingCart className="h-5 w-5" />
                  {cartCount > 0 && (
                    <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-primary text-white text-xs font-bold flex items-center justify-center">
                      {cartCount > 9 ? "9+" : cartCount}
                    </span>
                  )}
                </Button>
              </Link>

            {user && (
              <Link to="/seller">
                <Button variant="ghost" size="sm" className="hidden md:flex rounded-xl gap-1 hover:bg-muted/60">
                  <Store className="h-4 w-4" /> {t.nav.sellerDashboard}
                </Button>
              </Link>
            )}

            {user ? (
              <Button
                variant="ghost"
                size="icon"
                onClick={signOut}
                className="rounded-xl hover:bg-destructive/10 hover:text-destructive"
              >
                <LogOut className="h-5 w-5" />
              </Button>
            ) : (
              <Link to="/auth">
                <Button size="sm" className="font-semibold rounded-xl gradient-primary text-white border-0 shadow-md hover:opacity-90">
                  <User className="h-4 w-4 mr-1" /> {t.nav.login}
                </Button>
              </Link>
            )}

            <Button
              variant="ghost"
              size="icon"
              className="md:hidden rounded-xl"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? <X /> : <Menu />}
            </Button>
          </div>
        </div>

        {/* Mobile nav */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.nav
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="md:hidden overflow-hidden bg-card/95 backdrop-blur-xl border-b border-border/50"
            >
              <div className="container py-3 flex flex-col gap-1">
                {navItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setMobileOpen(false)}
                    className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                      location.pathname === item.path
                        ? "bg-primary/10 text-primary"
                        : "text-muted-foreground hover:bg-muted/60 hover:text-foreground"
                    }`}
                  >
                    <item.icon className="h-4 w-4" />
                    {item.label}
                  </Link>
                ))}
                {user && role === "seller" && (
                  <Link
                    to="/seller"
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold text-muted-foreground hover:bg-muted/60"
                  >
                    <Store className="h-4 w-4" /> {t.nav.sellerDashboard}
                  </Link>
                )}
              </div>
            </motion.nav>
          )}
        </AnimatePresence>
      </header>

      <main className="flex-1">{children}</main>

      {/* Footer */}
      <footer className="border-t border-border/50 py-8 bg-card/50 backdrop-blur-sm">
        <div className="container text-center">
          <div className="text-2xl mb-2">🪷</div>
          <p className="text-sm font-semibold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Smart Sakhi
          </p>
          <p className="text-xs text-muted-foreground mt-1">{t.footer.text}</p>
        </div>
      </footer>
    </div>
  );
};
