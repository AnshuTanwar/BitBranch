import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Navigation } from "@/components/ui/navigation";
import { Footer } from "@/components/ui/footer";
import { GitBranch, Users, Star, Code, ArrowRight } from "lucide-react";

export default function Home() {
  const features = [
    {
      icon: GitBranch,
      title: "Repository Management",
      description: "Create, manage, and collaborate on repositories with powerful version control features."
    },
    {
      icon: Users,
      title: "Team Collaboration",
      description: "Work together with your team using issues, pull requests, and project management tools."
    },
    {
      icon: Star,
      title: "Discover Projects",
      description: "Explore and star amazing projects from developers around the world."
    },
    {
      icon: Code,
      title: "Code Review",
      description: "Ensure code quality with comprehensive review tools and automated testing."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-main">
      <Navigation />
      
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 animate-fade-in">
            Welcome to{" "}
            <span className="bg-gradient-primary bg-clip-text text-transparent">
              BitBranch
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 animate-slide-up">
            The modern platform for developers to collaborate, manage repositories, 
            and build amazing software together.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-up">
            <Button asChild size="lg" className="bg-gradient-primary text-lg px-8 py-3">
              <Link to="/signup">
                Get Started
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="glass-button border-glass-border/30 text-lg px-8 py-3">
              <Link to="/login">
                Sign In
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Everything you need to build better software
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            BitBranch provides all the tools and features you need to manage your projects, 
            collaborate with your team, and ship great software.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card key={index} className="glass-card border-glass-border/50 hover:border-glass-border transition-all duration-300 animate-fade-in">
                <CardHeader className="text-center">
                  <div className="mx-auto mb-4 p-3 rounded-full bg-gradient-primary/10">
                    <Icon className="h-8 w-8 text-primary" />
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-center">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20">
        <Card className="glass-card border-glass-border/50 max-w-4xl mx-auto">
          <CardContent className="text-center p-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to get started?
            </h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              Join thousands of developers who are already using BitBranch to build, 
              collaborate, and ship amazing software.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="bg-gradient-primary">
                <Link to="/signup">
                  Create Free Account
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="glass-button border-glass-border/30">
                <Link to="/repositories">
                  Explore Repositories
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </section>

      <Footer />
    </div>
  );
}
