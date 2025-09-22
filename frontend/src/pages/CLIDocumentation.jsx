import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { AuthHeader } from "@/components/ui/auth-header";
import { 
  Terminal, 
  Download, 
  Code, 
  GitBranch, 
  Plus, 
  Upload, 
  RotateCcw,
  History,
  Activity,
  Diff,
  CheckCircle,
  ArrowRight,
  Copy
} from "lucide-react";
import { toast } from "sonner";

export default function CLIDocumentation() {
  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard!");
  };

  const commands = [
    {
      command: "init",
      description: "Initialize a new BitBranch repository",
      usage: "node cli.js init",
      example: "node cli.js init",
      icon: Plus,
      category: "Setup"
    },
    {
      command: "add",
      description: "Add files to the staging area",
      usage: "node cli.js add <file>",
      example: "node cli.js add index.js",
      icon: Plus,
      category: "Staging"
    },
    {
      command: "commit",
      description: "Commit staged files with a message",
      usage: "node cli.js commit [message] [--ai]",
      example: "node cli.js commit \"Initial commit\" --ai",
      icon: CheckCircle,
      category: "Committing",
      options: [
        { flag: "--ai", description: "Generate commit message using AI" }
      ]
    },
    {
      command: "push",
      description: "Push commits to remote repository",
      usage: "node cli.js push",
      example: "node cli.js push",
      icon: Upload,
      category: "Remote"
    },
    {
      command: "pull",
      description: "Pull changes from remote repository",
      usage: "node cli.js pull",
      example: "node cli.js pull",
      icon: Download,
      category: "Remote"
    },
    {
      command: "revert",
      description: "Revert changes to a previous state",
      usage: "node cli.js revert <commit-id>",
      example: "node cli.js revert abc123",
      icon: RotateCcw,
      category: "History"
    },
    {
      command: "log",
      description: "Show commit history",
      usage: "node cli.js log [--limit <n>]",
      example: "node cli.js log --limit 10",
      icon: History,
      category: "History",
      options: [
        { flag: "--limit <n>", description: "Limit number of commits shown" }
      ]
    },
    {
      command: "status",
      description: "Show repository status",
      usage: "node cli.js status",
      example: "node cli.js status",
      icon: Activity,
      category: "Information"
    },
    {
      command: "diff",
      description: "Show differences between files",
      usage: "node cli.js diff [file]",
      example: "node cli.js diff index.js",
      icon: Diff,
      category: "Information"
    },
    {
      command: "branch",
      description: "List, create, or delete branches",
      usage: "node cli.js branch [branch-name] [--delete]",
      example: "node cli.js branch feature-auth",
      icon: GitBranch,
      category: "Branching",
      options: [
        { flag: "--delete", description: "Delete the specified branch" }
      ]
    },
    {
      command: "checkout",
      description: "Switch to a different branch",
      usage: "node cli.js checkout <branch-name>",
      example: "node cli.js checkout main",
      icon: GitBranch,
      category: "Branching"
    }
  ];

  const categories = [...new Set(commands.map(cmd => cmd.category))];

  const installationSteps = [
    {
      step: 1,
      title: "Clone the Repository",
      description: "Clone the BitBranch repository to your local machine",
      code: "git clone https://github.com/your-username/bitbranch.git"
    },
    {
      step: 2,
      title: "Navigate to Backend",
      description: "Change to the backend directory",
      code: "cd bitbranch/backend"
    },
    {
      step: 3,
      title: "Install Dependencies",
      description: "Install required Node.js dependencies",
      code: "npm install"
    },
    {
      step: 4,
      title: "Set Up Environment",
      description: "Copy and configure environment variables",
      code: "cp .env.example .env"
    },
    {
      step: 5,
      title: "Test CLI",
      description: "Test the CLI installation",
      code: "node cli.js --help"
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      <AuthHeader />
      
      <main className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Terminal className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold">BitBranch CLI</h1>
          </div>
          <p className="text-lg text-muted-foreground">
            A powerful command-line interface for Git-like operations with BitBranch repositories
          </p>
        </div>

        {/* Features */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Key Features</CardTitle>
            <CardDescription>
              What makes BitBranch CLI special
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="flex items-start gap-3">
                <Code className="h-5 w-5 text-primary mt-1" />
                <div>
                  <h4 className="font-medium">Git-like Commands</h4>
                  <p className="text-sm text-muted-foreground">
                    Familiar Git commands for easy adoption
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <Terminal className="h-5 w-5 text-primary mt-1" />
                <div>
                  <h4 className="font-medium">AI-Powered Commits</h4>
                  <p className="text-sm text-muted-foreground">
                    Generate commit messages using Google Gemini AI
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <Activity className="h-5 w-5 text-primary mt-1" />
                <div>
                  <h4 className="font-medium">Code Quality Scoring</h4>
                  <p className="text-sm text-muted-foreground">
                    Integrated ESLint for code quality analysis
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Installation */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Download className="h-5 w-5" />
              Installation
            </CardTitle>
            <CardDescription>
              Get started with BitBranch CLI in a few simple steps
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {installationSteps.map((step) => (
                <div key={step.step} className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-medium">
                      {step.step}
                    </div>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium mb-1">{step.title}</h4>
                    <p className="text-sm text-muted-foreground mb-3">
                      {step.description}
                    </p>
                    <div className="bg-muted rounded-lg p-3 font-mono text-sm relative group">
                      <code>{step.code}</code>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => copyToClipboard(step.code)}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Commands */}
        <div className="space-y-8">
          <div>
            <h2 className="text-2xl font-bold mb-4">Available Commands</h2>
            <p className="text-muted-foreground mb-6">
              Complete reference for all BitBranch CLI commands
            </p>
          </div>

          {categories.map((category) => (
            <Card key={category}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Badge variant="outline">{category}</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {commands
                    .filter(cmd => cmd.category === category)
                    .map((cmd) => {
                      const Icon = cmd.icon;
                      return (
                        <div key={cmd.command} className="space-y-3">
                          <div className="flex items-start gap-3">
                            <Icon className="h-5 w-5 text-primary mt-1" />
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <code className="bg-muted px-2 py-1 rounded text-sm font-mono">
                                  {cmd.command}
                                </code>
                              </div>
                              <p className="text-sm text-muted-foreground mb-3">
                                {cmd.description}
                              </p>
                              
                              <div className="space-y-2">
                                <div>
                                  <p className="text-xs font-medium text-muted-foreground mb-1">
                                    USAGE
                                  </p>
                                  <div className="bg-muted rounded p-2 font-mono text-sm relative group">
                                    <code>{cmd.usage}</code>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className="absolute right-1 top-1 opacity-0 group-hover:opacity-100 transition-opacity h-6 w-6 p-0"
                                      onClick={() => copyToClipboard(cmd.usage)}
                                    >
                                      <Copy className="h-3 w-3" />
                                    </Button>
                                  </div>
                                </div>
                                
                                <div>
                                  <p className="text-xs font-medium text-muted-foreground mb-1">
                                    EXAMPLE
                                  </p>
                                  <div className="bg-muted rounded p-2 font-mono text-sm relative group">
                                    <code>{cmd.example}</code>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className="absolute right-1 top-1 opacity-0 group-hover:opacity-100 transition-opacity h-6 w-6 p-0"
                                      onClick={() => copyToClipboard(cmd.example)}
                                    >
                                      <Copy className="h-3 w-3" />
                                    </Button>
                                  </div>
                                </div>

                                {cmd.options && (
                                  <div>
                                    <p className="text-xs font-medium text-muted-foreground mb-1">
                                      OPTIONS
                                    </p>
                                    <div className="space-y-1">
                                      {cmd.options.map((option, idx) => (
                                        <div key={idx} className="flex gap-3 text-sm">
                                          <code className="bg-muted px-1 rounded text-xs">
                                            {option.flag}
                                          </code>
                                          <span className="text-muted-foreground">
                                            {option.description}
                                          </span>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                          
                          {commands.filter(c => c.category === category).indexOf(cmd) < 
                           commands.filter(c => c.category === category).length - 1 && (
                            <Separator />
                          )}
                        </div>
                      );
                    })}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Start */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ArrowRight className="h-5 w-5" />
              Quick Start Guide
            </CardTitle>
            <CardDescription>
              Get up and running with your first BitBranch repository
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <h4 className="font-medium">1. Initialize Repository</h4>
                  <div className="bg-muted rounded p-3 font-mono text-sm">
                    <code>node cli.js init</code>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <h4 className="font-medium">2. Add Files</h4>
                  <div className="bg-muted rounded p-3 font-mono text-sm">
                    <code>node cli.js add .</code>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <h4 className="font-medium">3. Commit with AI</h4>
                  <div className="bg-muted rounded p-3 font-mono text-sm">
                    <code>node cli.js commit --ai</code>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <h4 className="font-medium">4. Push to Remote</h4>
                  <div className="bg-muted rounded p-3 font-mono text-sm">
                    <code>node cli.js push</code>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
