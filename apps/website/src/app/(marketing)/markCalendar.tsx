import { siteConfig } from '@/config/site';

export default function MarkCalendarSection() {
  return (
    <section className="mark-calendar">
      <div className="landing-section-title">Mark Your Calendar</div>
      <section className="content-container large container">
        <div className="event-info-item entry-fee">
          <div className="label">Team Fee</div>
          <div className="fee-container">
            <div className="fee1">
              <div className="fee">$320</div>
              <div className="category">ULTRA</div>
            </div>
            <div className="fee2">
              <div className="fee">$450/$550</div>
              <div className="category">&lt;= 12 / &gt; 12</div>
              <div className="category">MASTER</div>
            </div>
          </div>
        </div>
        <div className="event-info-item">
          <div className="label">When</div>

          <div className="value">
            8:00am – 4:00pm
            <br />
            September 13, 2025
          </div>
        </div>
        <div className="event-info-item">
          <div className="label">Where</div>
          <div className="value">
            <br />
            Swangard Stadium
            <br />
            Burnaby, British Columbia
          </div>
          <div className="notes"></div>
        </div>
        <div className="event-info-item">
          <div className="label">Entry Deadline</div>
          <div className="value">Sep 07, 2025</div>
        </div>
      </section>
    </section>
  );
}
