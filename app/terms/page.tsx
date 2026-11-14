import type { Metadata } from "next";
import { LegalPage, LegalSection } from "../components/LegalPage";

export const metadata: Metadata = {
  title: "Terms of Service — Vidyouth Intelligence",
  description: "Terms for using vidyouthintelligence.com.",
  alternates: { canonical: "/terms/" },
};

const mail = <a href="mailto:info@vidyouthintelligence.com" className="text-cyan-300 underline underline-offset-4">info@vidyouthintelligence.com</a>;

export default function TermsPage() {
  return (
    <LegalPage title="Terms of Service" updated="14 November 2026">
      <p>
        These terms apply to your use of vidyouthintelligence.com, operated by Vidyouth Intelligence Institute Pvt. Ltd., Hyderabad,
        India. By using the site you agree to them. Enrolment in a programme and use of the Vidyouth learning platform are covered by
        separate terms provided at sign-up.
      </p>

      <LegalSection title="Information on this site">
        <p>
          Programme descriptions, schedules, fees and outcomes on this site are for general information and may change. Contact us to
          confirm current details before enrolling.
        </p>
        <p>
          We provide career support such as resume building, interview preparation and guidance. We do not guarantee placement,
          employment or any particular salary.
        </p>
      </LegalSection>

      <LegalSection title="Company names, logos and programmes">
        <p>
          Company names and logos shown on this site identify organisations that hire VLSI and embedded-systems professionals. They are
          shown for reference only and do not imply a partnership, endorsement or placement agreement unless we state one explicitly.
        </p>
        <p>
          References to the India Semiconductor Mission, Make in India, NSDC and other government initiatives describe the national
          goals our programmes support. Vidyouth is a private organisation and is not part of, or endorsed by, the Government of
          India unless stated otherwise.
        </p>
      </LegalSection>

      <LegalSection title="Chat assistant">
        <p>
          The Vidyouth Assistant gives automated answers that may be incomplete or out of date. Please confirm anything important with
          our team.
        </p>
      </LegalSection>

      <LegalSection title="Acceptable use">
        <p>
          Do not misuse the site: no attempts to disrupt it, access it without authorisation, send spam through the contact form, or
          copy its content for commercial use without permission.
        </p>
      </LegalSection>

      <LegalSection title="Intellectual property">
        <p>
          The Vidyouth name, logo and site content belong to Vidyouth Intelligence Institute Pvt. Ltd. Third-party names and logos
          belong to their owners.
        </p>
      </LegalSection>

      <LegalSection title="Links and liability">
        <p>
          Links to other websites are provided for convenience; we are not responsible for their content. The site is provided
          &ldquo;as is&rdquo;, and to the extent the law allows we are not liable for losses arising from its use.
        </p>
      </LegalSection>

      <LegalSection title="Governing law and contact">
        <p>
          These terms are governed by the laws of India, and the courts at Hyderabad, Telangana have jurisdiction. Questions about
          these terms: {mail}.
        </p>
      </LegalSection>
    </LegalPage>
  );
}
