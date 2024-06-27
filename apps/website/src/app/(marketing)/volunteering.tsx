import Image from 'next/image';
import Link from 'next/link';

export default function VolunteeringSection() {
  return (
    <div className="marathon-bg relative">
      <Image
        className="h-full w-full object-cover"
        src="/img/marathon_ppl.jpg"
        alt="marathon image"
        fill
        quality={70}
      />
      <section className="volunteering relative z-10" id="volunteering">
        <div className="content-container">
          <div className="landing-section-title">Volunteering</div>
          <h3 className="tight">
            Experience the power of community and wellness at the Vancouver 8
            Hour Relay!
          </h3>
          <p className="deck mb-20">
            By becoming a sponsor, you’re not just supporting a race; you’re
            actively contributing to a shared passion for running and the
            promotion of physical and mental health. Contact us at
            8hourrelay@gmail.com for more details on sponsorship packages and
            opportunities. Join us in creating an unforgettable event together!
          </p>
          <Link href="https://volunteersignup.org/AA4L4">
            <button className="btn-primary btn-large">
              <div className="small">I want to</div>
              <div className="big">Volunteer</div>
            </button>
          </Link>
        </div>
      </section>
      <section className="sponsorship relative z-10" id="sponsorship">
        <div className="content-container large">
          <div className="landing-section-title">Sponsorship</div>
          <h3 className="tight">
            Support the Vancouver 8 Hour Relay - Unite for health and unity!
          </h3>
          <p className="deck">
            Align your brand with our values and reach a diverse audience of
            athletes and spectators. Choose from Title, King, Diamond, or
            In-Kind sponsorship levels. Join us in promoting physical and mental
            well-being through running and community!
          </p>

          <section className="mb-20 grid">
            <div className="grid-item">
              <h4>Why Sponsor</h4>
              <div className="group">
                <h5>
                  <b>Brand Visibility</b>
                </h5>
                Sponsorship of the Vancouver 8 Hour Relay offers extensive brand
                exposure, reaching a diverse audience as participants come from
                various cities.
              </div>
              <div className="group">
                <h5>
                  <b>Community Engagement</b>
                </h5>
                Demonstrate your support for the local community by sponsoring
                this event, showcasing your dedication to promoting health,
                wellness and fostering a sense of community.
              </div>
              <div className="group">
                <h5>
                  <b>Networking Opportunities</b>
                </h5>
                The relay goes beyond a race; it brings together individuals who
                share a passion for running and community. As a sponsor, you’ll
                have the chance to network with participants, fellow sponsors,
                and community leaders.
              </div>
            </div>

            <div className="grid-item">
              <h4>Sponsorship Levels</h4>
              <div className="group">
                <h5>
                  <b>Gold Sponsor</b>
                </h5>
                Maximum brand exposure
                <br />
                Athletes number plate (with investor logo attached)
                <br />
                Logo on participant t-shirts, banners, and website
                <br />
                Opportunity to set up a promotional booth at the event
              </div>
              <div className="group">
                <h5>
                  <b>Silver Sponsor</b>
                </h5>
                Logo displayed on the website
                <br />
                Opportunity to distribute promotional materials during the event
                <br />
              </div>
              <div className="group">
                <h5>
                  <b>Bronze Sponsor</b>
                </h5>
                Company’s logo featured on the website
                <br />
              </div>
              <div className="group">
                <h5>
                  <b>In-Kind Sponsor</b>
                </h5>
                Welcome contributions of food, beverages, or services
                <br />
                Acknowledgment of contribution on website and during the event
                <br />
              </div>
            </div>

            <div className="grid-item">
              <h4>Join Us</h4>
              <div>
                Join the Vancouver 8 Hour Relay, where we unite people with a
                shared passion for running and the promotion of physical and
                mental well-being. By becoming a sponsor, you’re not only
                supporting a race, but also a vibrant community. For more
                information on sponsorship packages and opportunities, please
                reach out to us at 8hourrelay@gmail.com. We eagerly anticipate
                partnering with you to create a successful event!
              </div>
            </div>
          </section>

          {/* <button className="btn-primary btn-large">
            <div className="small">I want to</div>
            <div className="big">Sponsor</div>
          </button> */}
        </div>
      </section>
    </div>
  );
}
