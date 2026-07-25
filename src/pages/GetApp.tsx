import { Helmet } from "react-helmet-async";
import { CalendarDays, Download, HandHeart, Headphones, Radio, Smartphone } from "lucide-react";
import { env } from "@/lib/env";

const APK_PATH = "/downloads/redemption-hour-radio.apk";
const APK_SIZE_MB = "37";
const APP_VERSION = "1.0.0";

const FEATURES = [
  { icon: Radio, title: "Live Radio", description: "Stream Redemption Radio live, wherever you are." },
  { icon: CalendarDays, title: "Programme Schedule", description: "See what's on now and what's coming up next." },
  { icon: Headphones, title: "Listen Again", description: "Catch up on past programmes on demand." },
  { icon: HandHeart, title: "Prayer Requests", description: "Submit a prayer request straight from the app." },
];

export default function GetApp() {
  return (
    <>
      <Helmet>
        <title>Get the App — Redemption Radio</title>
        <meta
          name="description"
          content="Download the Redemption Radio Android app to stream live, follow the programme schedule, listen again, and submit prayer requests on the go."
        />
      </Helmet>

      <section className="bg-surface-warm">
        <div className="container-page grid gap-10 py-16 lg:grid-cols-2 lg:items-center lg:py-24">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-brand-100 px-3 py-1 text-xs font-bold uppercase tracking-wide text-brand-700">
              <Smartphone className="h-3.5 w-3.5" aria-hidden="true" /> Now available
            </span>
            <h1 className="mt-4 text-4xl font-extrabold text-ink sm:text-5xl">
              Redemption Radio, right in your pocket
            </h1>
            <p className="mt-4 max-w-lg text-lg text-ink-soft">
              Get the official Redemption Radio app for Android — live streaming, the full
              programme schedule, listen-again episodes, and prayer requests, all in one place.
            </p>

            <div className="card mt-8 max-w-md p-6">
              <div className="flex items-center gap-4">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-brand-600 text-white">
                  <Smartphone className="h-7 w-7" aria-hidden="true" />
                </div>
                <div>
                  <p className="font-bold text-ink">Redemption Radio for Android</p>
                  <p className="text-sm text-ink-faint">
                    Version {APP_VERSION} &middot; {APK_SIZE_MB} MB &middot; Android 7.0+
                  </p>
                </div>
              </div>

              <a
                href={APK_PATH}
                download
                className="btn-primary mt-6 w-full justify-center"
              >
                <Download className="h-4 w-4" aria-hidden="true" /> Download APK
              </a>

              <p className="mt-3 text-xs text-ink-faint">
                Not on the Play Store yet — you may need to allow installs from unknown sources in
                your Android settings. iOS version coming soon.
              </p>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {FEATURES.map((feature) => (
              <div key={feature.title} className="card p-5">
                <feature.icon className="h-6 w-6 text-brand-600" aria-hidden="true" />
                <p className="mt-3 font-bold text-ink">{feature.title}</p>
                <p className="mt-1 text-sm text-ink-soft">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="container-page py-14 text-center">
        <p className="text-sm text-ink-faint">
          Questions about the app? Reach us at{" "}
          <a href={`mailto:${env.contactEmail}`} className="text-brand-700 underline">
            {env.contactEmail}
          </a>
          .
        </p>
      </section>
    </>
  );
}
