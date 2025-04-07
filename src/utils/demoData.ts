
import { generatePassword } from "./passwordGenerator";

export interface PasswordEntry {
  id: string;
  title: string;
  username: string;
  password: string;
  url: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

// Generate some demo passwords for preview
export const generateDemoPasswords = (): PasswordEntry[] => {
  return [
    {
      id: "1",
      title: "Gmail",
      username: "user@gmail.com",
      password: generatePassword(14, true, true, true),
      url: "https://gmail.com",
      notes: "Personal Gmail account",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: "2",
      title: "Twitter",
      username: "userhandle",
      password: generatePassword(16, true, true, true),
      url: "https://twitter.com",
      createdAt: new Date(Date.now() - 10000000).toISOString(),
      updatedAt: new Date(Date.now() - 10000000).toISOString(),
    },
    {
      id: "3",
      title: "Amazon",
      username: "username123",
      password: generatePassword(18, true, true, true),
      url: "https://amazon.com",
      notes: "Prime account",
      createdAt: new Date(Date.now() - 20000000).toISOString(),
      updatedAt: new Date(Date.now() - 5000000).toISOString(),
    },
    {
      id: "4", 
      title: "Netflix",
      username: "user@example.com",
      password: generatePassword(12, true, true, false),
      url: "https://netflix.com",
      createdAt: new Date(Date.now() - 30000000).toISOString(),
      updatedAt: new Date(Date.now() - 30000000).toISOString(),
    },
    {
      id: "5",
      title: "GitHub",
      username: "developer",
      password: generatePassword(20, true, true, true),
      url: "https://github.com",
      notes: "Work account",
      createdAt: new Date(Date.now() - 40000000).toISOString(),
      updatedAt: new Date(Date.now() - 1000000).toISOString(),
    }
  ];
};
