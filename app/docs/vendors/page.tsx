import { DocHead, Section, Step, Callout, Kbd, PageNav } from "../_ui";

export default function VendorGuide() {
  return (
    <article>
      <DocHead
        eyebrow="Vendor Guide"
        title="Partnering with Vidyouth as a vendor"
        lead="How to onboard as a vendor, manage your profile and dashboard, and keep your documents up to date."
      />

      <Section id="start" title="Become a vendor">
        <p>Vendors partner with Vidyouth to supply services and content. Getting set up works just like any account, with a vendor-specific sign-up.</p>
        <div className="my-1 flex flex-col gap-4">
          <Step n={1} title="Sign up as a vendor">Go to <Kbd>lms.vidyouthintelligence.com/vendor/signup</Kbd> and register with your business email.</Step>
          <Step n={2} title="Verify &amp; sign in">Confirm your email with the 6-digit code, then sign in with 2FA.</Step>
          <Step n={3} title="Complete your profile">Fill in your organisation details so your account can be reviewed and approved.</Step>
        </div>
        <Callout type="note">New vendor accounts are reviewed by the Vidyouth team before full access is granted — you&apos;ll be notified once approved.</Callout>
      </Section>

      <Section id="dashboard" title="Your vendor dashboard">
        <p>
          After signing in you get a dedicated vendor workspace. From here you manage your profile, see your
          status, and access the tools available to your account.
        </p>
      </Section>

      <Section id="documents" title="Documents &amp; compliance">
        <p>
          Keep your business documents current in your vendor profile. Uploading and maintaining the right
          paperwork keeps your account in good standing and speeds up approvals.
        </p>
      </Section>

      <PageNav prev={{ href: "/docs/learners/", label: "Learner Guide" }} next={{ href: "/docs/mentors/", label: "Mentor Guide" }} />
    </article>
  );
}
