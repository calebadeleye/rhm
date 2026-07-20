import { Mail, MapPin, Phone } from "lucide-react";
import { Seo } from "@/components/seo/Seo";
import { ContactForm } from "@/components/forms/ContactForm";
import { ministryInfo } from "@/data/ministry";
import { socialLinks } from "@/data/social";
import { env } from "@/lib/env";

export default function Contact() {
  return (
    <>
      <Seo title="Contact" description="Get in touch with Redemption Radio and Redemption Hour Ministries." path="/contact" />

      <section className="container-page py-16">
        <div className="mb-10 text-center">
          <p className="eyebrow mb-2">Contact Us</p>
          <h1 className="text-3xl font-bold text-ink">We'd Love to Hear From You</h1>
        </div>

        <div className="mx-auto grid max-w-4xl gap-10 lg:grid-cols-[1fr_1.3fr]">
          <div>
            <ul className="space-y-4 text-sm text-ink-soft">
              <li className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-brand-600" aria-hidden="true" />
                <a href={`tel:${env.contactPhone.replace(/[^\d+]/g, "")}`} className="hover:text-brand-700">{env.contactPhone}</a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-brand-600" aria-hidden="true" />
                <a href={`mailto:${env.contactEmail}`} className="hover:text-brand-700">{env.contactEmail}</a>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="mt-0.5 h-5 w-5 text-brand-600" aria-hidden="true" />
                <span>{ministryInfo.address}</span>
              </li>
            </ul>
            <p className="mt-4 text-sm text-ink-faint">{ministryInfo.officeHours}</p>

            {socialLinks.length > 0 && (
              <div className="mt-6">
                <h2 className="mb-2 text-sm font-bold uppercase tracking-wide text-ink">Follow Us</h2>
                <div className="flex gap-2 text-sm">
                  {socialLinks.map((link) => (
                    <a key={link.id} href={link.url} target="_blank" rel="noreferrer" className="text-brand-700 hover:underline">
                      {link.label}
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>

          <ContactForm />
        </div>
      </section>
    </>
  );
}
