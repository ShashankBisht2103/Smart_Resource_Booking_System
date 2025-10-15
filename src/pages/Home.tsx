import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Calendar, CheckCircle, Bell, Shield, ArrowRight } from "lucide-react";
import heroImage from "@/assets/hero-booking.jpg";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const Home = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-background to-accent/5">
        <div className="container mx-auto px-4 py-20 md:py-32">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8 animate-fade-in">
              <h1 className="text-5xl md:text-7xl font-bold tracking-tight">
                SMART RESOURCE
                <br />
                <span className="text-primary">BOOKING SYSTEM</span>
              </h1>
              <p className="text-xl text-muted-foreground max-w-lg">
                Reserve labs, classrooms, and equipment easily and efficiently.
              </p>
              <Link to="/auth">
                <Button size="lg" className="font-semibold group">
                  Get Started
                  <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
            </div>
            
            <div className="relative animate-slide-up">
              <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-accent/20 rounded-3xl blur-3xl" />
              <img
                src={heroImage}
                alt="Students booking resources on campus"
                className="relative rounded-3xl shadow-2xl w-full object-cover aspect-video"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Key Features</h2>
            <p className="text-xl text-muted-foreground">
              Everything you need for efficient resource management
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: Calendar,
                title: "Easy Booking",
                description: "Quick and simple reservation process with intuitive calendar interface",
              },
              {
                icon: Shield,
                title: "No Double Booking",
                description: "Automatic conflict resolution ensures resources are never overbooked",
              },
              {
                icon: CheckCircle,
                title: "Smart Cancellations",
                description: "Auto-cancel unconfirmed bookings to keep schedules optimized",
              },
              {
                icon: Bell,
                title: "Real-Time Notifications",
                description: "Always stay updated on your bookings and important changes",
              },
            ].map((feature, index) => (
              <Card
                key={index}
                className="p-6 hover-lift cursor-pointer group animate-scale-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <feature.icon className="h-12 w-12 text-primary mb-4 transition-transform group-hover:scale-110" />
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <Card className="p-12 text-center max-w-4xl mx-auto card-shadow-lg animate-fade-in">
            <h2 className="text-4xl font-bold mb-6">About the System</h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              The Smart Resource Booking System simplifies resource management for students and faculty,
              prevents booking conflicts, and improves campus efficiency. Our platform ensures seamless
              coordination of labs, classrooms, and equipment, making your campus operations smoother
              than ever before.
            </p>
          </Card>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Home;
