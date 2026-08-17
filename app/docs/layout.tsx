import type { Metadata } from "next";
import DocsSidebar from "./_sidebar";

export const metadata: Metadata = {
  title: "Vidyouth Docs — Guides for learners, vendors & mentors",
  description:
    "Step-by-step documentation for the Vidyouth platform: creating an account, taking courses, assignments, live classes, mentorship, certificates and more.",
};

export default function DocsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#05070f] text-white lg:grid lg:grid-cols-[270px_minmax(0,1fr)]">
      <DocsSidebar />
      <main className="mx-auto w-full max-w-3xl px-5 py-10 lg:px-14 lg:py-14">{children}</main>
    </div>
  );
}
