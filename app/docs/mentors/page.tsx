import { DocHead, Section, Step, Callout, Kbd, PageNav } from "../_ui";

export default function MentorGuide() {
  return (
    <article>
      <DocHead
        eyebrow="Mentor Guide"
        title="Mentoring on Vidyouth"
        lead="Share your expertise through 1:1 coaching — set your availability, run sessions with learners, and get paid for your time."
      />

      <Section id="start" title="Become a mentor">
        <div className="my-1 flex flex-col gap-4">
          <Step n={1} title="Sign up as a mentor">Register at <Kbd>lms.vidyouthintelligence.com/mentor/signup</Kbd> with your email.</Step>
          <Step n={2} title="Verify &amp; sign in">Confirm your email and sign in with 2FA.</Step>
          <Step n={3} title="Build your mentor profile">Add your expertise, experience and a short bio so learners know how you can help.</Step>
        </div>
      </Section>

      <Section id="availability" title="Set your availability">
        <p>
          Publish the times you&apos;re open for sessions. Learners can only book slots you&apos;ve made available,
          so you stay fully in control of your schedule.
        </p>
        <Callout type="tip">Keep your availability current — open, up-to-date slots are what let learners find and book you.</Callout>
      </Section>

      <Section id="sessions" title="Run sessions">
        <p>
          When a learner books you, the session appears in your schedule. Meet them live at the scheduled time,
          right from your browser, and help them work through their goals.
        </p>
      </Section>

      <Section id="payouts" title="Payouts">
        <p>
          You earn for the sessions you complete. Your earnings accrue as sessions finish, and payouts are
          processed by the Vidyouth team — you can track your balance and history in your mentor account.
        </p>
      </Section>

      <PageNav prev={{ href: "/docs/vendors/", label: "Vendor Guide" }} next={{ href: "/docs/", label: "Docs home" }} />
    </article>
  );
}
