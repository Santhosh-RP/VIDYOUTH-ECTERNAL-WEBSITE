import { DocHead, Section, Step, Callout, Kbd, PageNav } from "../_ui";

export default function GettingStarted() {
  return (
    <article>
      <DocHead
        eyebrow="Getting Started"
        title="Set up your Vidyouth account"
        lead="Create your account, sign in securely with two-factor verification, and get oriented on your dashboard — all in a few minutes."
      />

      <Section id="overview" title="What is Vidyouth?">
        <p>
          Vidyouth is a learning platform for careers in <strong className="text-white">semiconductors, defence,
          aerospace and emerging technologies</strong>. It brings together learners, industry mentors, vendor
          partners and organisations in one place — with hands-on courses, live classes, real projects and
          verifiable certificates.
        </p>
        <p>Depending on who you are, you&apos;ll use a different part of the platform:</p>
        <ul className="ml-1 flex flex-col gap-2">
          <li className="flex gap-2"><span className="text-cyan-400">•</span> <span><strong className="text-white">Learners / students</strong> — take courses, submit assignments, attend live sessions, earn certificates.</span></li>
          <li className="flex gap-2"><span className="text-emerald-400">•</span> <span><strong className="text-white">Vendors</strong> — partner with Vidyouth and manage your profile and documents.</span></li>
          <li className="flex gap-2"><span className="text-violet-400">•</span> <span><strong className="text-white">Mentors</strong> — offer 1:1 guidance, set availability and get paid for sessions.</span></li>
        </ul>
      </Section>

      <Section id="create-account" title="Create your account">
        <p>Signing up takes about a minute and uses a one-time code sent to your email — no long forms.</p>
        <div className="my-1 flex flex-col gap-4">
          <Step n={1} title="Open the sign-up page">Go to <Kbd>lms.vidyouthintelligence.com/signup</Kbd>. Sign up with <strong className="text-white">Email</strong> or <strong className="text-white">Mobile</strong> — or continue with Google.</Step>
          <Step n={2} title="Enter your details">Provide your name, email and a password (8+ characters, with a letter and a number), then accept the terms.</Step>
          <Step n={3} title="Verify your email">We email you a <strong className="text-white">6-digit code</strong>. Enter it to confirm your address.</Step>
          <Step n={4} title="You&apos;re in">Your account is created and you land on your dashboard.</Step>
        </div>
        <Callout type="tip">Use an email you check often — it&apos;s where your verification codes, course updates and certificates are sent.</Callout>
      </Section>

      <Section id="sign-in" title="Sign in &amp; two-factor (2FA)">
        <p>
          For your security, signing in uses your password <em>plus</em> a one-time code — so even if someone
          learns your password, they can&apos;t get in without your inbox.
        </p>
        <div className="my-1 flex flex-col gap-4">
          <Step n={1} title="Enter email &amp; password">On the login page, type your credentials and click <strong className="text-white">Sign in</strong>. You can also use <em>Sign in with an email code</em> or Google.</Step>
          <Step n={2} title="Enter your 2FA code">We email a fresh 6-digit code — enter it to finish signing in. Tick <strong className="text-white">Keep me signed in</strong> to stay logged in for 7 days.</Step>
        </div>
        <Callout type="note">Codes expire after a few minutes. If yours doesn&apos;t arrive, check spam, then request a new one.</Callout>
      </Section>

      <Section id="dashboard" title="Your dashboard">
        <p>
          After signing in you land on your home dashboard — your starting point for everything. From here you can
          jump into your courses, see what&apos;s due, check notifications and open your profile settings.
        </p>
        <p>The exact layout depends on your role, but the top navigation and left menu work the same way everywhere.</p>
      </Section>

      <PageNav next={{ href: "/docs/learners/", label: "Learner Guide" }} />
    </article>
  );
}
