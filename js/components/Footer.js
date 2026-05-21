function Footer() {
  return (
    <footer className="fc-footer">
      <div className="container">
        <div className="fc-footer-grid">
          <div className="fc-footer-col">
            <div className="fc-footer-brand-row">
              <img src="assets/img/classfc-logo.png" alt="CLASS FC" className="fc-footer-logo" />
              <div className="fc-footer-brand">CLASS FC</div>
            </div>
            <div className="fc-footer-tag">
              Building the digital home of our football family.
            </div>
            <div className="fc-footer-est">EST. 2013 · DEPT. OF SOFTWARE</div>
          </div>

          <div className="fc-footer-col">
            <div className="fc-footer-heading">CLUB</div>
            <div className="fc-footer-line">CLASS FC</div>
            <div className="fc-footer-line">Department of Software</div>
            <div className="fc-footer-line">Established 2013</div>
          </div>

          <div className="fc-footer-col">
            <div className="fc-footer-heading">CONTACT</div>
            <div className="fc-footer-line">classfc@university.ac.kr</div>
            <div className="fc-footer-line">매주 목요일 20:00</div>
            <div className="fc-footer-line">공학관 5층 세미나실</div>
          </div>

          <div className="fc-footer-col">
            <div className="fc-footer-heading">FOLLOW</div>
            <div className="fc-sns-row">
              <a className="fc-sns" href="#">IG</a>
              <a className="fc-sns" href="#">YT</a>
              <a className="fc-sns" href="#">GH</a>
            </div>
          </div>
        </div>

        <div className="fc-footer-bottom">
          <div>© 2026 CLASS FC. All rights reserved.</div>
          <div className="fc-footer-small">
            Made for our club by team CLASS · 차형창 · 이성준 · 김태효
          </div>
        </div>
      </div>
    </footer>
  );
}
