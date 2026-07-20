import { NavLink } from "react-router-dom";
import { Seo } from "@/components/seo/Seo";

export default function NotFound() {
  return (
    <>
      <Seo title="Page Not Found" description="The page you're looking for doesn't exist." path="/404" noIndex />

      <section className="container-page flex min-h-[60vh] flex-col items-center justify-center py-16 text-center">
        <p className="text-6xl font-extrabold text-brand-600">404</p>
        <h1 className="mt-4 text-2xl font-bold text-ink">Page not found</h1>
        <p className="mt-2 max-w-sm text-ink-soft">
          The page you're looking for doesn't exist or may have moved.
        </p>
        <NavLink to="/" className="btn-primary mt-6">
          Back to Home
        </NavLink>
      </section>
    </>
  );
}
