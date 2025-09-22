import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AuthHeader } from "@/components/ui/auth-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { GitBranch, Save, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function EditRepository() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();

  // Mock repository data - replace with actual API call
  const [formData, setFormData] = useState({
    name: "awesome-project",
    description: "A comprehensive project management tool built with React and TypeScript",
    isPrivate: false,
    hasIssues: true,
    hasWiki: true,
    hasPages: false,
    license: "mit",
    defaultBranch: "main"
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      // Mock API call - replace with actual repository update
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Repository updated successfully!",
        description: `${formData.name} has been updated.`,
      });

      navigate(`/repos/${id}`);
    } catch (error) {
      toast({
        title: "Error updating repository",
        description: error.message || "Failed to update repository",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this repository? This action cannot be undone.")) {
      return;
    }

    try {
      // Mock API call - replace with actual repository deletion
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Repository deleted",
        description: "The repository has been permanently deleted.",
      });

      navigate("/repos/my");
    } catch (error) {
      toast({
        title: "Error deleting repository",
        description: error.message || "Failed to delete repository",
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
              Edit Repository
            </h1>
            <p className="text-lg text-muted-foreground">
              Update your repository settings and configuration
            </p>
          </div>

          <div className="space-y-6">
            {/* General Settings */}
            <Card className="glass-card border-glass-border/50">
              <CardHeader>
                <CardTitle>General</CardTitle>
                <CardDescription>
                  Basic repository information and settings
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Repository Name */}
                  <div className="space-y-2">
                    <Label htmlFor="name">Repository Name</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      className="glass-button border-glass-border/30"
                      required
                    />
                  </div>

                  {/* Description */}
                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => handleInputChange('description', e.target.value)}
                      className="glass-button border-glass-border/30"
                      rows={3}
                    />
                  </div>

                  {/* Visibility */}
                  <div className="flex items-center justify-between p-4 rounded-lg border border-glass-border/30">
                    <div>
                      <div className="font-medium">Private Repository</div>
                      <div className="text-sm text-muted-foreground">
                        Make this repository private
                      </div>
                    </div>
                    <Switch
                      checked={formData.isPrivate}
                      onCheckedChange={(checked) => handleInputChange('isPrivate', checked)}
                    />
                  </div>

                  {/* Default Branch */}
                  <div className="space-y-2">
                    <Label htmlFor="defaultBranch">Default Branch</Label>
                    <Select value={formData.defaultBranch} onValueChange={(value) => handleInputChange('defaultBranch', value)}>
                      <SelectTrigger className="glass-button border-glass-border/30">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="main">main</SelectItem>
                        <SelectItem value="master">master</SelectItem>
                        <SelectItem value="develop">develop</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Button type="submit" className="bg-gradient-primary">
                    <Save className="h-4 w-4 mr-2" />
                    Save Changes
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Features */}
            <Card className="glass-card border-glass-border/50">
              <CardHeader>
                <CardTitle>Features</CardTitle>
                <CardDescription>
                  Enable or disable repository features
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-4 rounded-lg border border-glass-border/30">
                  <div>
                    <div className="font-medium">Issues</div>
                    <div className="text-sm text-muted-foreground">
                      Track bugs and feature requests
                    </div>
                  </div>
                  <Switch
                    checked={formData.hasIssues}
                    onCheckedChange={(checked) => handleInputChange('hasIssues', checked)}
                  />
                </div>

                <div className="flex items-center justify-between p-4 rounded-lg border border-glass-border/30">
                  <div>
                    <div className="font-medium">Wiki</div>
                    <div className="text-sm text-muted-foreground">
                      Document your project
                    </div>
                  </div>
                  <Switch
                    checked={formData.hasWiki}
                    onCheckedChange={(checked) => handleInputChange('hasWiki', checked)}
                  />
                </div>

                <div className="flex items-center justify-between p-4 rounded-lg border border-glass-border/30">
                  <div>
                    <div className="font-medium">Pages</div>
                    <div className="text-sm text-muted-foreground">
                      Host a website from this repository
                    </div>
                  </div>
                  <Switch
                    checked={formData.hasPages}
                    onCheckedChange={(checked) => handleInputChange('hasPages', checked)}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Danger Zone */}
            <Card className="glass-card border-red-200 bg-red-50/50">
              <CardHeader>
                <CardTitle className="text-red-600">Danger Zone</CardTitle>
                <CardDescription>
                  Irreversible and destructive actions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between p-4 rounded-lg border border-red-200">
                  <div>
                    <div className="font-medium text-red-600">Delete Repository</div>
                    <div className="text-sm text-red-500">
                      Once deleted, this repository cannot be recovered
                    </div>
                  </div>
                  <Button 
                    variant="destructive" 
                    onClick={handleDelete}
                    className="bg-red-600 hover:bg-red-700"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
