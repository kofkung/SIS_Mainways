import fs from 'fs';

const APP_JSX = 'c:/Users/SisUser/Desktop/SISMainways/SISMainways/src/App.jsx';
let code = fs.readFileSync(APP_JSX, 'utf-8');

const missingComponents = `
function ContactPage({ formStatus, onSubmit }) {
  const [topic, setTopic] = useState("general");

  return (
    <PageFrame
      kicker="Contact"
      title="Start with the station problem"
      text="Send a short project note and the SIS team can review the station context, system scope, and next step."
    >
      <section className="section contact-layout">
        <div className="contact-note reveal">
          <img src={logo} alt="SIS Siam Infinity Solution logo" />
          <h2>Tell us what needs to move better.</h2>
          <p>
            Share the station, equipment involved, passenger-flow issue, and target timeline. That is
            enough to begin a practical review.
          </p>
          <hr />
          <p><strong>Siam Infinity Solution Co., Ltd.</strong></p>
          <p>111/2 Ramkhamhaeng 94 Alley, Saphan Sung, Bangkok 10240</p>
          <p>Tel: +66 089 924 3843, 02-001-0518</p>
          <div className="contact-map">
            <iframe
              src="https://www.google.com/maps?q=111/2+Ramkhamhaeng+94+Alley+Saphan+Sung+Bangkok+10240&output=embed&z=15"
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="SIS office location"
            />
          </div>
        </div>
        <form className="contact-form reveal" onSubmit={onSubmit}>
          <label>
            Subject
            <select
              className="contact-select"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              required
            >
              <option value="general">Contact Services</option>
              <option value="product">Ask for Products</option>
              <option value="support">Support</option>
              <option value="other">Other</option>
            </select>
          </label>

          {topic === "product" ? (
            <>
              <label>
                Product interested
                <select className="contact-select" name="product" required>
                  <option value="">Select product...</option>
                  <option value="gate">Fare Gate Systems</option>
                  <option value="afc">AFC Integration</option>
                  <option value="field">Field Execution</option>
                </select>
              </label>
              <label>
                Company
                <input name="company" type="text" required />
              </label>
            </>
          ) : topic === "support" ? (
            <>
              <label>
                Station / Location
                <input name="station" type="text" placeholder="e.g. MRT Bang Sue" required />
              </label>
              <label>
                Device
                <input name="device" type="text" placeholder="e.g. Fare gate #12" />
              </label>
            </>
          ) : null}

          <label>
            Name
            <input name="name" type="text" autoComplete="name" required />
          </label>
          <label>
            Email or phone
            <input name="contact" type="text" autoComplete="email" required />
          </label>
          <label>
            Messages
            <textarea
              name="message"
              rows={topic === "general" ? 5 : 3}
              placeholder={
                topic === "product" ? "Describe the product you are interested in..."
                  : topic === "support" ? "Describe the issue at the station..."
                  : "How can we help you?"
              }
              required
            />
          </label>
          <button className="btn btn-primary" type="submit">
            Send project note
            <ArrowIcon />
          </button>
          <p className="form-status" role="status">
            {formStatus}
          </p>
        </form>
      </section>
    </PageFrame>
  );
}

function ProcessSection() {
  return (
    <section className="process-section">
      <div className="process-copy">
        <p className="section-kicker">End-to-end delivery</p>
        <h2>From Design to Daily Operation</h2>
      </div>
      <div className="process-track reveal">
        {processSteps.map((step, index) => (
          <article key={step}>
            <span>{String(index + 1).padStart(2, "0")}</span>
            <strong>{step}</strong>
            <p>
              {
                [
                  "Understand station flow and technical scope.",
                  "Design system logic and integration.",
                  "Install, test, and commission on site.",
                  "Deliver documentation and operation support.",
                ][index]
              }
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}

function PageFrame({ className = "", kicker, title, text, children }) {
  return (
    <section className={\`sub-page \${className}\`}>
      <section className="sub-hero reveal">
        <p className="section-kicker">{kicker}</p>
        <h1>{title}</h1>
        <p>{text}</p>
      </section>
      {children}
    </section>
  );
}

`;

code = code.replace('function AllCategoriesOverview() {', missingComponents + '\nfunction AllCategoriesOverview() {');

fs.writeFileSync(APP_JSX, code);
console.log("Restored missing components");
