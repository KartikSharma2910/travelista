import { Facebook, Instagram, Linkedin, Twitter, Youtube } from "lucide-react";
import { Link } from "react-router-dom";

import { memo } from "react";
const socials = [
  {
    href: "https://instagram.com",
    icon: Instagram,
    label: "Instagram",
  },

  {
    href: "https://facebook.com",
    icon: Facebook,
    label: "Facebook",
  },

  {
    href: "https://twitter.com",
    icon: Twitter,
    label: "Twitter",
  },

  {
    href: "https://youtube.com",
    icon: Youtube,
    label: "YouTube",
  },

  {
    href: "https://linkedin.com",
    icon: Linkedin,
    label: "LinkedIn",
  },
];

const footerSections = [
  {
    title: "Explore",
    links: [
      { to: "/explore", label: "Find Hosts" },
      { to: "/experiences", label: "Experiences" },
      { to: "/destinations", label: "Destinations" },
      { to: "/trips", label: "Published Trips" },
      { to: "/beta-wanderers", label: "Beta Wanderers" },
      { to: "/membership", label: "Membership Plans" },
      { to: "/referrals", label: "Referral Program" },
    ],
  },
  {
    title: "Host",
    links: [
      { to: "/become-host", label: "Become a Host" },
      { to: "/host-trip", label: "Host a Trip" },
      { to: "/dashboard/host", label: "Host Dashboard" },
      { to: "/resources", label: "Host Resources" },
    ],
  },
  {
    title: "Community",
    links: [
      { to: "/community", label: "Traveler Stories" },
      { to: "/community", label: "Host Spotlights" },
      { to: "/community?tab=tips", label: "Travel Tips" },
      { to: "/community?tab=blog", label: "Blog" },
      { to: "/docs", label: "Documentation" },
    ],
  },
  {
    title: "Support",
    links: [
      { to: "/help", label: "Help Center" },
      { to: "/safety", label: "Safety" },
      { to: "/grievances", label: "Grievance Resolution" },
      { to: "/terms", label: "Terms" },
      { to: "/resources", label: "Resources" },
    ],
  },
];

const Footer = memo(() => (
  <footer className="bg-secondary border-t border-border">
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid grid-cols-2 md:grid-cols-6 gap-8">
        <div className="col-span-2">
          <h4 className="text-lg font-bold text-primary mb-4">Travelista</h4>

          <p className="text-sm text-muted-foreground leading-relaxed max-w-xs">
            Book a person, not just a place. Authentic India, one host at a
            time.
          </p>

          <div className="flex gap-3 mt-4">
            {socials.map(({ href, icon: Icon, label }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="w-9 h-9 rounded-full bg-card border border-border flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary transition-colors"
              >
                <Icon className="w-4 h-4" />
              </a>
            ))}
          </div>
        </div>

        {/* Sections */}

        {footerSections.map((section) => (
          <div key={section.title}>
            <h5 className="text-sm font-semibold text-foreground mb-3">
              {section.title}
            </h5>

            <div className="space-y-2">
              {section.links.map((link) => (
                <Link
                  key={link.label}
                  to={link.to}
                  className="block text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
      <div className="mt-10 pt-6 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-3">
        <p className="text-xs text-muted-foreground">
          © 2026 Travelista. All rights reserved.
        </p>

        <div className="flex gap-4 text-xs text-muted-foreground">
          <Link to="/terms" className="hover:text-foreground transition-colors">
            Privacy Policy
          </Link>

          <Link to="/terms" className="hover:text-foreground transition-colors">
            Cookie Policy
          </Link>

          <Link
            to="/safety"
            className="hover:text-foreground transition-colors"
          >
            Trust & Safety
          </Link>
        </div>
      </div>
    </div>
  </footer>
));

Footer.displayName = "Footer";

export default Footer;
