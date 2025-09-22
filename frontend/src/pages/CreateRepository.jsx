import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { repoService } from "@/services/repoService";
import { AuthHeader } from "@/components/ui/auth-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { GitBranch, Lock, Globe } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function CreateRepository() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    isPrivate: false,
    initializeWithReadme: true,
    license: "mit",
    gitignore: "node"
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const repositoryData = {
        name: formData.name,
        description: formData.description,
        visibility: !formData.isPrivate,
        initializeWithReadme: formData.initializeWithReadme,
        license: formData.license,
        gitignore: formData.gitignore
      };

      const response = await repoService.createRepository(repositoryData);
      
      console.log('Repository created:', response); // Debug log
      
      toast({
        title: "Repository created successfully!",
        description: `${formData.name} has been created.`,
      });

      // Navigate to repository details with a small delay to ensure DB consistency
      if (response.repositoryID) {
        console.log('Navigating to:', `/repos/${response.repositoryID}`); // Debug log
        setTimeout(() => {
          navigate(`/repos/${response.repositoryID}`);
        }, 500); // 500ms delay
      } else {
        console.error('No repositoryID in response:', response);
        navigate('/repos/my'); // Fallback to user repositories
      }
    } catch (error) {
      toast({
        title: "Error creating repository",
        description: error.message || "Failed to create repository",
        variant: "destructive",
      });
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-main">
      <AuthHeader />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2 flex items-center">
              <GitBranch className="h-8 w-8 mr-3" />
              Create Repository
            </h1>
            <p className="text-lg text-muted-foreground">
              Create a new repository to store your project
            </p>
          </div>

          <Card className="glass-card border-glass-border/50">
            <CardHeader>
              <CardTitle>Repository Details</CardTitle>
              <CardDescription>
                Fill in the details for your new repository
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Repository Name */}
                <div className="space-y-2">
                  <Label htmlFor="name">Repository Name *</Label>
                  <Input
                    id="name"
                    placeholder="my-awesome-project"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className="glass-button border-glass-border/30"
                    required
                  />
                  <p className="text-sm text-muted-foreground">
                    Choose a short, memorable name for your repository
                  </p>
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="A brief description of your project..."
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    className="glass-button border-glass-border/30"
                    rows={3}
                  />
                  <p className="text-sm text-muted-foreground">
                    Help others understand what your project is about
                  </p>
                </div>

                {/* Visibility */}
                <div className="space-y-4">
                  <Label>Visibility</Label>
                  <div className="space-y-3">
                    <div 
                      className={`p-4 rounded-lg border cursor-pointer transition-colors ${
                        !formData.isPrivate 
                          ? 'border-primary bg-primary/5' 
                          : 'border-glass-border/30 hover:border-glass-border/50'
                      }`}
                      onClick={() => handleInputChange('isPrivate', false)}
                    >
                      <div className="flex items-center space-x-3">
                        <Globe className="h-5 w-5" />
                        <div>
                          <div className="font-medium">Public</div>
                          <div className="text-sm text-muted-foreground">
                            Anyone can see this repository
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div 
                      className={`p-4 rounded-lg border cursor-pointer transition-colors ${
                        formData.isPrivate 
                          ? 'border-primary bg-primary/5' 
                          : 'border-glass-border/30 hover:border-glass-border/50'
                      }`}
                      onClick={() => handleInputChange('isPrivate', true)}
                    >
                      <div className="flex items-center space-x-3">
                        <Lock className="h-5 w-5" />
                        <div>
                          <div className="font-medium">Private</div>
                          <div className="text-sm text-muted-foreground">
                            Only you can see this repository
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Initialize Options */}
                <div className="space-y-4">
                  <Label>Initialize Repository</Label>
                  
                  <div className="flex items-center justify-between p-4 rounded-lg border border-glass-border/30">
                    <div>
                      <div className="font-medium">Add a README file</div>
                      <div className="text-sm text-muted-foreground">
                        This is where you can write a long description for your project
                      </div>
                    </div>
                    <Switch
                      checked={formData.initializeWithReadme}
                      onCheckedChange={(checked) => handleInputChange('initializeWithReadme', checked)}
                    />
                  </div>
                </div>

                {/* License */}
                <div className="space-y-2">
                  <Label htmlFor="license">License</Label>
                  <Select value={formData.license} onValueChange={(value) => handleInputChange('license', value)}>
                    <SelectTrigger className="glass-button border-glass-border/30">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="mit">MIT License</SelectItem>
                      <SelectItem value="apache">Apache License 2.0</SelectItem>
                      <SelectItem value="gpl">GNU General Public License v3.0</SelectItem>
                      <SelectItem value="bsd">BSD 3-Clause License</SelectItem>
                      <SelectItem value="none">No License</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* .gitignore */}
                <div className="space-y-2">
                  <Label htmlFor="gitignore">.gitignore template</Label>
                  <Select value={formData.gitignore} onValueChange={(value) => handleInputChange('gitignore', value)}>
                    <SelectTrigger className="glass-button border-glass-border/30">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="node">Node.js</SelectItem>
                      <SelectItem value="python">Python</SelectItem>
                      <SelectItem value="java">Java</SelectItem>
                      <SelectItem value="react">React</SelectItem>
                      <SelectItem value="vue">Vue.js</SelectItem>
                      <SelectItem value="none">None</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Submit Button */}
                <div className="flex gap-4 pt-4">
                  <Button 
                    type="submit" 
                    className="flex-1 bg-gradient-primary"
                    disabled={!formData.name.trim()}
                  >
                    Create Repository
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => navigate(-1)}
                    className="glass-button border-glass-border/30"
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
