import { Seo } from "@/components/seo/Seo";
import { Hero } from "@/components/home/Hero";
import { HereForYouRow } from "@/components/home/HereForYouRow";
import { FeaturedProgrammes } from "@/components/home/FeaturedProgrammes";
import { TodaysSchedule } from "@/components/home/TodaysSchedule";
import { RecentMessages } from "@/components/home/RecentMessages";
import { AboutSection } from "@/components/home/AboutSection";
import { TestimoniesSection } from "@/components/home/TestimoniesSection";
import { PrayerRequestSection } from "@/components/home/PrayerRequestSection";
import { DonationSection } from "@/components/home/DonationSection";
import { NewsletterSection } from "@/components/home/NewsletterSection";
import { radioStationSchema } from "@/lib/structuredData";

export default function Home() {
  return (
    <>
      <Seo
        title="Streaming Faith, Hope & Worship 24/7"
        description="Redemption Radio streams Christian worship music, biblical teaching, prayer and hope 24/7. Listen live from Redemption Hour Ministries."
        path="/"
        structuredData={radioStationSchema()}
      />
      <Hero />
      <HereForYouRow />
      <FeaturedProgrammes />
      <TodaysSchedule />
      <RecentMessages />
      <AboutSection />
      <TestimoniesSection />
      <PrayerRequestSection />
      <DonationSection />
      <NewsletterSection />
    </>
  );
}
