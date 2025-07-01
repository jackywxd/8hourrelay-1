import GallerySection from './gallery';
import HeroSection from './hero';
import MarkCalendarSection from './markCalendar';
import MessageForm from './message';
import MissionSection from './mission';
import RulesSection from './rules';
import VolunteeringSection from './volunteering';

import '@/styles/form.css';
import './landing.css';

export default async function Web() {
  return (
    <div className="landing">
      <HeroSection />
      {/* <SponsorSection /> */}
      <MarkCalendarSection />
      <MissionSection />
      <RulesSection />
      {/*<VolunteeringSection />*/}
      <GallerySection />
      <div className="keep-in-touch">
        <div className="landing-section-title">Keep in touch</div>
        <MessageForm />
      </div>
    </div>
  );
}
