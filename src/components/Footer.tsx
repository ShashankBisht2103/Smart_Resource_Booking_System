import { Calendar } from "lucide-react";

const Footer = () => {
  return (
    <footer className="w-full border-t bg-card py-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-primary" />
            <span className="font-semibold">SmartBook</span>
          </div>
          
          <div className="text-sm text-muted-foreground">
            <p>© 2025 Smart Resource Booking System. All rights reserved.</p>
          </div>
          
          <div className="text-sm text-muted-foreground">
            <p>Contact: support@smartbook.edu</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
