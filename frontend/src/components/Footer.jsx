import {
  FaFacebookF,
  FaInstagram,
  FaTwitter,
} from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-grid">

        <div>
          <h4>Support</h4>

          <a href="#help">
            Help Centre
          </a>

          <a href="#aircover">
            AirCover
          </a>

          <a href="#accessibility">
            Disability support
          </a>

          <a href="#cancellation">
            Cancellation options
          </a>
        </div>


        <div>
          <h4>Community</h4>

          <a href="#airbnb-org">
            Airbnb.org
          </a>

          <a href="#refugees">
            Support refugees
          </a>

          <a href="#discrimination">
            Combating discrimination
          </a>
        </div>


        <div>
          <h4>Hosting</h4>

          <a href="#host">
            Airbnb your home
          </a>

          <a href="#resources">
            Hosting resources
          </a>

          <a href="#community">
            Community forum
          </a>
        </div>


        <div>
          <h4>Airbnb</h4>

          <a href="#news">
            Newsroom
          </a>

          <a href="#features">
            New features
          </a>

          <a href="#careers">
            Careers
          </a>

          <a href="#investors">
            Investors
          </a>
        </div>

      </div>


      <div className="footer-bottom">

        <span>
          © 2026 Airbnb Inc · Privacy · Terms · Sitemap
        </span>


        <div className="footer-right">

          <span className="language">
            English (ZA) ·ZAR
          </span>


          <div className="social-icons">

            <a
              href="#facebook"
              aria-label="Facebook"
            >
              <FaFacebookF />
            </a>

            <a
              href="#instagram"
              aria-label="Instagram"
            >
              <FaInstagram />
            </a>

            <a
              href="#twitter"
              aria-label="Twitter"
            >
              <FaTwitter />
            </a>

          </div>

        </div>

      </div>
    </footer>
  );
}