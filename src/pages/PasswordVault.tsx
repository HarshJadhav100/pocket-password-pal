
import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/components/ui/use-toast";
import { LogOut, PlusCircle, Search, Shield } from "lucide-react";
import PasswordCard from "@/components/passwords/PasswordCard";
import PasswordForm, { PasswordData } from "@/components/passwords/PasswordForm";
import { generateDemoPasswords, PasswordEntry } from "@/utils/demoData";
import { motion } from "framer-motion";

interface PasswordVaultProps {
  onLogout: () => void;
}

const PasswordVault = ({ onLogout }: PasswordVaultProps) => {
  const [passwords, setPasswords] = useState<PasswordEntry[]>([]);
  const [filteredPasswords, setFilteredPasswords] = useState<PasswordEntry[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedPasswordId, setSelectedPasswordId] = useState<string | null>(null);
  const [currentPassword, setCurrentPassword] = useState<PasswordEntry | undefined>(undefined);
  const [isEditing, setIsEditing] = useState(false);
  const { toast } = useToast();

  // Load demo passwords
  useEffect(() => {
    const demoPasswords = generateDemoPasswords();
    setPasswords(demoPasswords);
    setFilteredPasswords(demoPasswords);
  }, []);

  // Filter passwords when search query changes
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredPasswords(passwords);
      return;
    }

    const query = searchQuery.toLowerCase();
    const filtered = passwords.filter(
      (pw) =>
        pw.title.toLowerCase().includes(query) ||
        pw.username.toLowerCase().includes(query) ||
        (pw.url && pw.url.toLowerCase().includes(query))
    );
    setFilteredPasswords(filtered);
  }, [searchQuery, passwords]);

  const handleAddPassword = () => {
    setCurrentPassword(undefined);
    setIsEditing(false);
    setIsFormOpen(true);
  };

  const handleEditPassword = (id: string) => {
    const passwordToEdit = passwords.find((pw) => pw.id === id);
    if (passwordToEdit) {
      setCurrentPassword(passwordToEdit);
      setIsEditing(true);
      setIsFormOpen(true);
    }
  };

  const handleDeletePassword = (id: string) => {
    setSelectedPasswordId(id);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (selectedPasswordId) {
      setPasswords((prev) => prev.filter((pw) => pw.id !== selectedPasswordId));
      toast({
        title: "Password deleted",
        description: "The password entry has been removed.",
      });
      setIsDeleteDialogOpen(false);
      setSelectedPasswordId(null);
    }
  };

  const handleSavePassword = (data: PasswordData) => {
    const now = new Date().toISOString();
    
    if (isEditing && currentPassword) {
      // Update existing password
      setPasswords((prev) =>
        prev.map((pw) =>
          pw.id === currentPassword.id
            ? {
                ...pw,
                title: data.title,
                username: data.username,
                password: data.password,
                url: data.url,
                notes: data.notes,
                updatedAt: now,
              }
            : pw
        )
      );
      
      toast({
        title: "Password updated",
        description: "Your password entry has been updated successfully.",
      });
    } else {
      // Add new password
      const newPassword: PasswordEntry = {
        id: `pw_${Date.now()}`,
        title: data.title,
        username: data.username,
        password: data.password,
        url: data.url,
        notes: data.notes,
        createdAt: now,
        updatedAt: now,
      };
      
      setPasswords((prev) => [newPassword, ...prev]);
      
      toast({
        title: "Password added",
        description: "Your new password has been saved securely.",
      });
    }
    
    setIsFormOpen(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-brand-50/30">
      <header className="bg-white shadow-sm border-b sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Shield className="h-8 w-8 text-brand-600" />
            <h1 className="text-2xl font-bold text-brand-800">
              Password Vault
            </h1>
          </div>
          
          <div className="flex flex-1 max-w-md relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search passwords..."
              className="pl-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              onClick={handleAddPassword}
              variant="default"
              className="bg-brand-600 hover:bg-brand-700"
            >
              <PlusCircle className="h-4 w-4 mr-2" />
              Add New
            </Button>
            <Button variant="ghost" size="icon" onClick={onLogout}>
              <LogOut className="h-5 w-5" />
              <span className="sr-only">Log out</span>
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {filteredPasswords.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredPasswords.map((password, index) => (
              <motion.div
                key={password.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05, duration: 0.3 }}
              >
                <PasswordCard
                  id={password.id}
                  title={password.title}
                  username={password.username}
                  password={password.password}
                  url={password.url}
                  onEdit={handleEditPassword}
                  onDelete={handleDeletePassword}
                />
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="mb-4 p-4 rounded-full bg-brand-100">
              <Shield className="h-12 w-12 text-brand-600" />
            </div>
            {searchQuery ? (
              <>
                <h2 className="text-xl font-semibold mb-2">No matches found</h2>
                <p className="text-muted-foreground max-w-md">
                  We couldn't find any passwords matching "{searchQuery}".
                  Try a different search term.
                </p>
              </>
            ) : (
              <>
                <h2 className="text-xl font-semibold mb-2">No passwords yet</h2>
                <p className="text-muted-foreground max-w-md mb-4">
                  Your password vault is empty. Add your first password to get started.
                </p>
                <Button 
                  onClick={handleAddPassword}
                  className="bg-brand-600 hover:bg-brand-700"
                >
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Add Your First Password
                </Button>
              </>
            )}
          </div>
        )}
      </main>

      <PasswordForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSave={handleSavePassword}
        initialData={currentPassword}
        isEditing={isEditing}
      />

      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this password entry. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-red-600 hover:bg-red-700">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default PasswordVault;
