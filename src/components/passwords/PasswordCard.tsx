
import { useState } from 'react';
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Copy, Eye, EyeOff, Edit, Trash2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface PasswordCardProps {
  id: string;
  title: string;
  username: string;
  password: string;
  url: string;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

const PasswordCard = ({
  id,
  title,
  username,
  password,
  url,
  onEdit,
  onDelete,
}: PasswordCardProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const { toast } = useToast();

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: `${type} copied`,
      description: `${type} copied to clipboard`,
      duration: 2000,
    });
  };

  // Extract domain for favicon
  const getFaviconUrl = (url: string) => {
    try {
      const domain = new URL(url).hostname;
      return `https://www.google.com/s2/favicons?domain=${domain}&sz=128`;
    } catch (e) {
      return null;
    }
  };

  // Format password for display
  const formatPassword = (pass: string) => {
    return showPassword ? pass : "•".repeat(Math.min(12, pass.length));
  };

  const faviconUrl = getFaviconUrl(url);

  return (
    <Card className="overflow-hidden transition-all duration-300 hover:shadow-md">
      <CardContent className="p-4">
        <div className="flex items-center gap-3">
          {faviconUrl && (
            <img 
              src={faviconUrl} 
              alt={`${title} logo`} 
              className="w-8 h-8 rounded-full border border-gray-200"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = 'none';
              }}
            />
          )}
          <div className="flex-1 min-w-0">
            <h3 className="font-medium text-lg truncate">{title}</h3>
            <p className="text-muted-foreground text-sm truncate">{username}</p>
          </div>
        </div>

        <div className="mt-4 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Password:</span>
            <div className="flex items-center gap-2">
              <span className="text-sm font-mono">{formatPassword(password)}</span>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6"
                onClick={togglePasswordVisibility}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
                <span className="sr-only">
                  {showPassword ? "Hide password" : "Show password"}
                </span>
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6"
                onClick={() => copyToClipboard(password, "Password")}
              >
                <Copy className="h-4 w-4" />
                <span className="sr-only">Copy password</span>
              </Button>
            </div>
          </div>

          {url && (
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Website:</span>
              <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-blue-600 hover:underline truncate max-w-[70%] text-right"
              >
                {url}
              </a>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex justify-end gap-2 p-2 bg-muted/30">
        <Button
          variant="ghost"
          size="sm"
          className="h-8 px-2"
          onClick={() => onEdit(id)}
        >
          <Edit className="h-4 w-4 mr-1" />
          Edit
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="h-8 px-2 text-destructive hover:text-destructive"
          onClick={() => onDelete(id)}
        >
          <Trash2 className="h-4 w-4 mr-1" />
          Delete
        </Button>
      </CardFooter>
    </Card>
  );
};

export default PasswordCard;
