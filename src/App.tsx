import { lazy, Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { LoadingState } from "@/components/ui/StateViews";

const Home = lazy(() => import("@/pages/Home"));
const About = lazy(() => import("@/pages/About"));
const Programmes = lazy(() => import("@/pages/Programmes"));
const ProgrammeDetail = lazy(() => import("@/pages/ProgrammeDetail"));
const Schedule = lazy(() => import("@/pages/Schedule"));
const ListenLive = lazy(() => import("@/pages/ListenLive"));
const Messages = lazy(() => import("@/pages/Messages"));
const MessageDetail = lazy(() => import("@/pages/MessageDetail"));
const Testimonies = lazy(() => import("@/pages/Testimonies"));
const PrayerRequest = lazy(() => import("@/pages/PrayerRequest"));
const Donate = lazy(() => import("@/pages/Donate"));
const Contact = lazy(() => import("@/pages/Contact"));
const Privacy = lazy(() => import("@/pages/Privacy"));
const Terms = lazy(() => import("@/pages/Terms"));
const NotFound = lazy(() => import("@/pages/NotFound"));

export default function App() {
  return (
    <Suspense fallback={<LoadingState label="Loading Redemption Radio…" />}>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/programmes" element={<Programmes />} />
          <Route path="/programmes/:slug" element={<ProgrammeDetail />} />
          <Route path="/schedule" element={<Schedule />} />
          <Route path="/listen-live" element={<ListenLive />} />
          <Route path="/messages" element={<Messages />} />
          <Route path="/messages/:slug" element={<MessageDetail />} />
          <Route path="/testimonies" element={<Testimonies />} />
          <Route path="/prayer-request" element={<PrayerRequest />} />
          <Route path="/donate" element={<Donate />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/404" element={<NotFound />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </Suspense>
  );
}
