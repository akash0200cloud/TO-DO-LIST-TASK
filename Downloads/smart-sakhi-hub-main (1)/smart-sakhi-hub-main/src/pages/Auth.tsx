import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import type { Database } from "@/integrations/supabase/types";

type AppRole = Database["public"]["Enums"]["app_role"];

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [selectedRole, setSelectedRole] = useState<AppRole>("buyer");
  const [loading, setLoading] = useState(false);
  const { signIn, signUp } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const from = (location.state as any)?.from || "/";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isLogin) {
        await signIn(email, password);
      } else {
        await signUp(email, password, fullName, selectedRole);
      }
      toast({ title: isLogin ? t.auth.welcomeBackMsg : t.auth.accountCreated, description: isLogin ? t.auth.loggedIn : t.auth.verifyEmail });
      navigate(isLogin ? from : "/", { replace: true });
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-heading">
            {isLogin ? t.auth.welcomeBack : t.auth.joinSakhi}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div>
                <Label>{t.auth.fullName}</Label>
                <Input value={fullName} onChange={(e) => setFullName(e.target.value)} required placeholder={t.auth.namePlaceholder} />
              </div>
            )}
            <div>
              <Label>{t.auth.email}</Label>
              <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder={t.auth.emailPlaceholder} />
            </div>
            <div>
              <Label>{t.auth.password}</Label>
              <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required placeholder="••••••••" minLength={6} />
            </div>
            {!isLogin && (
              <div>
                <Label>{t.auth.iWantTo}</Label>
                <div className="flex gap-3 mt-1">
                  {(["buyer", "seller"] as AppRole[]).map((r) => (
                    <Button
                      key={r}
                      type="button"
                      variant={selectedRole === r ? "default" : "outline"}
                      className="flex-1 capitalize"
                      onClick={() => setSelectedRole(r)}
                    >
                      {r === "buyer" ? t.auth.buyProducts : t.auth.sellProducts}
                    </Button>
                  ))}
                </div>
              </div>
            )}
            <Button type="submit" className="w-full font-bold" disabled={loading}>
              {loading ? t.auth.pleaseWait : isLogin ? t.auth.login : t.auth.createAccount}
            </Button>
          </form>
          <p className="text-center text-sm mt-4 text-muted-foreground">
            {isLogin ? t.auth.noAccount : t.auth.haveAccount}{" "}
            <button className="text-primary font-semibold underline" onClick={() => setIsLogin(!isLogin)}>
              {isLogin ? t.auth.signUp : t.auth.login}
            </button>
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Auth;
