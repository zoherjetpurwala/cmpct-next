import { Baumans } from "next/font/google";

const baumans = Baumans({ weight: "400", subsets: ["latin"] });

const Footer = () => (
  <footer className="bg-gradient-to-br from-themeColor-text to-themeColor-dark rounded-t-3xl text-white py-12">
    <div className="container mx-auto px-4">
      <div className="grid md:grid-cols-4 gap-8">
        <div>
          <h4 className={`${baumans.className} text-2xl font-bold mb-4 text-white`}>
            cmpct.
          </h4>
          <p className="text-themeColor-light/80">Shrink your links, expand your reach</p>
        </div>
        <FooterColumn title="Product" links={["Features", "Pricing", "API"]} />
        <FooterColumn
          title="Company"
          links={["About Us", "Careers", "Contact"]}
        />
        <FooterColumn
          title="Legal"
          links={["Privacy Policy", "Terms of Service"]}
        />
      </div>
      <div className="mt-8 pt-8 border-t border-themeColor-light/30 text-center text-themeColor-light/70">
        <p>&copy; {new Date().getFullYear()} cmpct. All rights reserved.</p>
      </div>
    </div>
  </footer>
);

const FooterColumn = ({ title, links }) => (
  <div>
    <h5 className="font-semibold mb-4 text-white">{title}</h5>
    <ul className="space-y-2">
      {links.map((link, index) => (
        <li key={index}>
          <a href="#" className="text-themeColor-light/70 hover:text-white transition-colors duration-300">
            {link}
          </a>
        </li>
      ))}
    </ul>
  </div>
);

export default Footer;