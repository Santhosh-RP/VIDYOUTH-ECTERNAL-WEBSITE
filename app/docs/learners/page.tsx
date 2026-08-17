import { DocHead, Section, Step, Callout, PageNav } from "../_ui";

export default function LearnerGuide() {
  return (
    <article>
      <DocHead
        eyebrow="Learner Guide"
        title="Learning on Vidyouth"
        lead="From finding the right course to earning your certificate — here's how to get the most out of every feature as a learner."
      />

      <Section id="enroll" title="Enrol in a course">
        <p>Browse the catalogue, open a course to see its curriculum, and enrol in a couple of clicks.</p>
        <div className="my-1 flex flex-col gap-4">
          <Step n={1} title="Open Courses">Use the <strong className="text-white">Courses</strong> menu to browse or search by topic.</Step>
          <Step n={2} title="Review the course">Check the syllabus, what you&apos;ll build, and the requirements.</Step>
          <Step n={3} title="Enrol">Click <strong className="text-white">Enrol</strong>. Free courses start instantly; paid ones take you to secure checkout.</Step>
        </div>
      </Section>

      <Section id="lessons" title="Watch lessons &amp; videos">
        <p>
          Each course is organised into modules and lessons. Video lessons stream in HD, and your progress is
          saved automatically — pick up exactly where you left off, on any device.
        </p>
        <Callout type="tip">Mark a lesson complete to keep your progress bar moving — it&apos;s what unlocks your certificate at the end.</Callout>
      </Section>

      <Section id="assignments" title="Assignments">
        <p>Many courses include assignments so you can apply what you&apos;ve learned and get feedback.</p>
        <div className="my-1 flex flex-col gap-4">
          <Step n={1} title="Open the assignment">Find it inside the course, alongside the related lessons.</Step>
          <Step n={2} title="Submit your work">Upload a file or enter your answer, then submit.</Step>
          <Step n={3} title="Get graded">Your instructor reviews it and you&apos;ll see your grade and feedback in the course.</Step>
        </div>
      </Section>

      <Section id="live" title="Live classes">
        <p>
          Some courses run live sessions — interactive classes with your instructor. You&apos;ll see upcoming
          sessions on your dashboard; join straight from the browser, no extra software needed.
        </p>
        <Callout type="note">Join a couple of minutes early. If a session is recorded, you can rewatch it later from the course.</Callout>
      </Section>

      <Section id="mentors" title="Book a mentor">
        <p>
          Get personalised, 1:1 guidance from an industry mentor. Browse mentors, pick a slot that suits you,
          and book — then meet them live at the scheduled time.
        </p>
      </Section>

      <Section id="certificates" title="Certificates">
        <p>
          Complete a course — finish the lessons and meet its requirements — and Vidyouth issues your
          <strong className="text-white"> Certificate of Completion</strong> automatically. Download it as a PDF
          and share it on LinkedIn or with employers.
        </p>
      </Section>

      <PageNav prev={{ href: "/docs/getting-started/", label: "Getting Started" }} next={{ href: "/docs/vendors/", label: "Vendor Guide" }} />
    </article>
  );
}
