import type { Metadata } from "next";
import { LegalPage, LegalSection } from "../components/LegalPage";

export const metadata: Metadata = {
  title: "Privacy Policy — Vidyouth Intelligence",
  description: "How Vidyouth Intelligence collects, uses and protects information on vidyouthintelligence.com.",
  alternates: { canonical: "/privacy/" },
};

const mail = <a href="mailto:info@vidyouthintelligence.com" className="text-cyan-300 underline underline-offset-4">info@vidyouthintelligence.com</a>;

export default function PrivacyPage() {
  return (
    <LegalPage title="Privacy Policy" updated="14 November 2026">
      <p>
        This policy explains how Vidyouth Intelligence Institute Pvt. Ltd. (&ldquo;Vidyouth&rdquo;, &ldquo;we&rdquo;, &ldquo;us&rdquo;),
        Hyderabad, India, handles personal data when you visit vidyouthintelligence.com. It is written with India&rsquo;s
        Digital Personal Data Protection Act, 2023 in mind. The Vidyouth learning platform you sign in to has its own terms and
        privacy notice.
      </p>

      <LegalSection title="What we collect">
        <p>
          <strong className="text-white">Enquiries.</strong> When you use the &ldquo;Get In Touch&rdquo; form we receive the name, email
          address, phone number, programme of interest and message you enter.
        </p>
        <p>
          <strong className="text-white">Chat assistant.</strong> Questions you type into the Vidyouth Assistant are sent to our servers
          so it can answer them.
        </p>
        <p>
          <strong className="text-white">Usage data.</strong> We use Google Analytics to understand how the site is used (pages viewed,
          approximate location, device and browser). Google Analytics sets cookies for this. Our hosting provider also records standard
          server logs such as IP address and request time.
        </p>
      </LegalSection>

      <LegalSection title="How we use it">
        <p>
          We use enquiry details only to reply to you and to tell you about the programme you asked about. We use chat questions to
          answer them and to improve our answers. We use usage data, in aggregate, to improve the site. We do not sell your personal
          data.
        </p>
      </LegalSection>

      <LegalSection title="Who processes it">
        <p>
          Enquiries are delivered to our team by email through our email provider. The site and our servers are hosted on Amazon Web
          Services. Analytics are processed by Google. These providers handle data on our behalf and may store it outside India.
        </p>
      </LegalSection>

      <LegalSection title="How long we keep it">
        <p>
          We keep enquiries for as long as needed to respond and follow up, and then delete them. Analytics data is kept according to
          our Google Analytics retention settings.
        </p>
      </LegalSection>

      <LegalSection title="Your choices and rights">
        <p>
          You can ask us to access, correct or delete the personal data we hold about you, or withdraw consent to further contact, by
          writing to {mail}. You can block or delete analytics cookies in your browser settings, or use Google&rsquo;s opt-out add-on.
        </p>
      </LegalSection>

      <LegalSection title="Children">
        <p>
          The site is meant for students, professionals and institutions. If you are under 18, please use the site and contact us with
          a parent&rsquo;s or guardian&rsquo;s involvement.
        </p>
      </LegalSection>

      <LegalSection title="Changes and contact">
        <p>
          We may update this policy; the date above shows the latest version. For any privacy question or grievance, contact {mail}.
        </p>
      </LegalSection>
    </LegalPage>
  );
}
