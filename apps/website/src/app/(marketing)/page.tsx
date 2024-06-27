import MessageForm from './message';
import HeroSection from './hero';
import SponsorSection from './sponsors';
import MarkCalendarSection from './markCalendar';
import MissionSection from './mission';
import RulesSection from './rules';
import VolunteeringSection from './volunteering';
import GallerySection from './gallery';

import './landing.css';
import '@/styles/form.css';

export default async function Web() {
  return (
    <div className="landing">
      <HeroSection />
      {/* <SponsorSection /> */}
      <MarkCalendarSection />
      <MissionSection />
      <RulesSection />
      <VolunteeringSection />
      <GallerySection />
      <div className="keep-in-touch">
        <div className="landing-section-title">Keep in touch</div>
        <MessageForm />
      </div>
    </div>
  );
}
