
import Link from "next/link";
import Logo from "./Logo";
import { Github, Twitter, Linkedin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-card border-t">
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <Logo />
            <p className="text-sm text-muted-foreground">
              Empowering MSMEs with seamless financial solutions.
            </p>
            <div className="flex space-x-4">
              <Link href="#" className="text-muted-foreground hover:text-primary">
                <Github size={20} />
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-primary">
                <Twitter size={20} />
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-primary">
                <Linkedin size={20} />
              </Link>
            </div>
          </div>
          <div>
            <h4 className="font-headline font-semibold">Services</h4>
            <ul className="mt-4 space-y-2 text-sm">
              <li><Link href="/loan-application" className="text-muted-foreground hover:text-primary">Business Loans</Link></li>
              <li><Link href="/payments" className="text-muted-foreground hover:text-primary">Online Payments</Link></li>
              <li><Link href="/credit-score" className="text-muted-foreground hover:text-primary">Credit Score</Link></li>
              <li><Link href="#" className="text-muted-foreground hover:text-primary">GST Registration</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-headline font-semibold">Company</h4>
            <ul className="mt-4 space-y-2 text-sm">
              <li><Link href="#" className="text-muted-foreground hover:text-primary">About Us</Link></li>
               <li><Link href="/agents" className="text-muted-foreground hover:text-primary">Become an Agent</Link></li>
              <li><Link href="#" className="text-muted-foreground hover:text-primary">Careers</Link></li>
              <li><Link href="/enquiry" className="text-muted-foreground hover:text-primary">Contact</Link></li>
              <li><Link href="#" className="text-muted-foreground hover:text-primary">Blog</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-headline font-semibold">Legal</h4>
            <ul className="mt-4 space-y-2 text-sm">
              <li><Link href="#" className="text-muted-foreground hover:text-primary">Privacy Policy</Link></li>
              <li><Link href="#" className="text-muted-foreground hover:text-primary">Terms of Service</Link></li>
              <li><Link href="#" className="text-muted-foreground hover:text-primary">Disclaimer</Link></li>
            </ul>
          </div>
        </div>
        <div className="mt-8 border-t pt-8">
          <p className="text-center text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} MSMEConnect. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
