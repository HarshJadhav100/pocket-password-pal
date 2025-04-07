
// Function to generate secure random passwords
export function generatePassword(
  length: number = 12,
  includeUppercase: boolean = true,
  includeNumbers: boolean = true,
  includeSymbols: boolean = true
): string {
  // Define character sets
  const lowercaseChars = 'abcdefghijklmnopqrstuvwxyz';
  const uppercaseChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const numberChars = '0123456789';
  const symbolChars = '!@#$%^&*()-_=+[{]}|;:,<.>/?';
  
  let chars = lowercaseChars;
  if (includeUppercase) chars += uppercaseChars;
  if (includeNumbers) chars += numberChars;
  if (includeSymbols) chars += symbolChars;
  
  // Generate password
  let password = '';
  
  // Ensure at least one character from each included set
  if (includeUppercase) password += getRandomChar(uppercaseChars);
  if (includeNumbers) password += getRandomChar(numberChars);
  if (includeSymbols) password += getRandomChar(symbolChars);
  password += getRandomChar(lowercaseChars); // Always include at least one lowercase
  
  // Fill the rest of the password length
  const remainingLength = length - password.length;
  for (let i = 0; i < remainingLength; i++) {
    const randomIndex = Math.floor(Math.random() * chars.length);
    password += chars[randomIndex];
  }
  
  // Shuffle the password characters
  return shuffleString(password);
}

// Helper function to get a random character from a string
function getRandomChar(chars: string): string {
  return chars.charAt(Math.floor(Math.random() * chars.length));
}

// Helper function to shuffle a string
function shuffleString(str: string): string {
  const array = str.split('');
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]]; // Swap elements
  }
  return array.join('');
}

// Function to check password strength
export function checkPasswordStrength(password: string): {
  score: number;
  feedback: string;
} {
  let score = 0;
  
  // Check length
  if (password.length >= 8) score += 1;
  if (password.length >= 12) score += 1;
  if (password.length >= 16) score += 1;
  
  // Check character types
  if (/[A-Z]/.test(password)) score += 1;
  if (/[a-z]/.test(password)) score += 1;
  if (/[0-9]/.test(password)) score += 1;
  if (/[^A-Za-z0-9]/.test(password)) score += 1;
  
  // Check for common patterns and sequences
  if (/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[^A-Za-z0-9]).{10,}$/.test(password)) {
    score += 1;
  }
  
  // Provide feedback based on score
  let feedback;
  if (score <= 2) feedback = "Weak";
  else if (score <= 4) feedback = "Fair";
  else if (score <= 6) feedback = "Good";
  else if (score <= 8) feedback = "Strong";
  else feedback = "Very Strong";
  
  return { score, feedback };
}
