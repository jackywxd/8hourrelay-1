import { siteConfig } from '@/config/site';

export default function MarkCalendarSection() {
  return (
    <section className="mark-calendar">
      <div className="landing-section-title">Mark Your Calendar</div>
      <section className="content-container large container">
        <div className="event-info-item entry-fee">
          <div className="label">Entry Fee</div>
          <div className="fee-container">
            <div className="fee1">
              <div className="fee">$35</div>
              <div className="category">OPEN/MASTER</div>
            </div>
            <div className="fee2">
              <div className="fee">$20</div>
              <div className="category">YOUTH</div>
            </div>
          </div>
        </div>
        <div className="event-info-item">
          <div className="label">When</div>

          <div className="value">
            8:00am – 4:00pm
            <br />
            {siteConfig.event.time}
          </div>
        </div>
        <div className="event-info-item">
          <div className="label">Where</div>
          <div className="value">
            {siteConfig.event.location}
            <br />
            British Columbia
          </div>
          <div className="notes"></div>
        </div>
        <div className="event-info-item">
          <div className="label">Entry Deadline</div>
          <div className="value">{siteConfig.event.registerDeadline}</div>
        </div>
      </section>
    </section>
  );
}
