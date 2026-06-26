import React, { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useToast } from "@/hooks/use-toast";
import { Send, HelpCircle, User, Mail } from "lucide-react";

const teamContacts = [
  { name: "Akanksha", email: "akanksha123@gmail.com", avatar: "A" },
  { name: "Anchal",   email: "anchal@345gmail.com",   avatar: "A" },
  { name: "Nilam",    email: "nilam@678gmail.com",     avatar: "N" },
];

const faqs = [
  { q: "How do I start selling on Smart Sakhi?", a: "Sign up as a seller, go to your Seller Dashboard, and add your first product with a photo, price, and description." },
  { q: "Is there a fee for selling?", a: "No! Smart Sakhi is completely free to use for both buyers and sellers." },
  { q: "How does payment work?", a: "We currently support Cash on Delivery (COD) and a mock online payment option. More payment methods coming soon!" },
  { q: "Can I sell from my home?", a: "Absolutely! Most of our sellers run their business from home. You just need products to sell!" },
  { q: "How do I learn new skills?", a: "Visit the Learn section for free video tutorials on stitching, cooking, and business skills." },
  { q: "How do I contact support?", a: "Fill out the contact form below and we'll get back to you within 24 hours." },
];

const Help = () => {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const { error } = await supabase.from("contact_messages").insert(form);
      if (error) throw error;
      setSent(true);
      toast({ title: "Message sent! 📨", description: "We'll get back to you soon." });
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container py-8 max-w-3xl">
      <h1 className="text-3xl font-heading font-bold mb-2">Help & Support 💬</h1>
      <p className="text-muted-foreground mb-8">Find answers or reach out to us.</p>

      {/* FAQ */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <HelpCircle className="h-5 w-5" /> Frequently Asked Questions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible>
            {faqs.map((faq, i) => (
              <AccordionItem key={i} value={`faq-${i}`}>
                <AccordionTrigger className="text-left">{faq.q}</AccordionTrigger>
                <AccordionContent>{faq.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </CardContent>
      </Card>

      {/* Team Contacts */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" /> Our Support Team
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid sm:grid-cols-3 gap-4">
            {teamContacts.map((member) => (
              <div key={member.email} className="flex items-center gap-3 p-3 rounded-lg border bg-muted/30">
                <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold text-lg shrink-0">
                  {member.avatar}
                </div>
                <div className="min-w-0">
                  <p className="font-semibold text-sm">{member.name}</p>
                  <a href={`mailto:${member.email}`} className="text-xs text-muted-foreground hover:text-primary flex items-center gap-1 truncate">
                    <Mail className="h-3 w-3 shrink-0" />{member.email}
                  </a>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Contact Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Send className="h-5 w-5" /> Contact Us
          </CardTitle>
        </CardHeader>
        <CardContent>
          {sent ? (
            <div className="text-center py-6">
              <p className="text-lg font-heading font-bold text-secondary">Thank you! 🙏</p>
              <p className="text-muted-foreground mt-1">We'll reply to your message soon.</p>
              <Button className="mt-4" variant="outline" onClick={() => { setSent(false); setForm({ name: "", email: "", message: "" }); }}>
                Send Another Message
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div><Label>Name</Label><Input required value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} placeholder="Your name" maxLength={100} /></div>
              <div><Label>Email</Label><Input type="email" required value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} placeholder="your@email.com" maxLength={255} /></div>
              <div><Label>Message</Label><Textarea required value={form.message} onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))} placeholder="How can we help you?" rows={4} maxLength={1000} /></div>
              <Button type="submit" className="w-full font-bold" disabled={submitting}>
                {submitting ? "Sending..." : "Send Message"}
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Help;
