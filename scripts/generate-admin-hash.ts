import crypto from "crypto";
import readline from "readline";

/**
 * Generate a cryptographically secure PBKDF2-SHA512 hash.
 * Exact format used by Slotly's auth system: `<saltHex>:<hashHex>`
 */
function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto
    .pbkdf2Sync(password, salt, 100_000, 64, "sha512")
    .toString("hex");
  return `${salt}:${hash}`;
}

/**
 * Prompt for standard text input (e.g. email) with an optional default value.
 */
function promptText(query: string, defaultValue = "admin@slotly.atelier"): Promise<string> {
  return new Promise((resolve) => {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });
    rl.question(query, (answer) => {
      rl.close();
      const trimmed = answer.trim();
      resolve(trimmed.length > 0 ? trimmed : defaultValue);
    });
  });
}

/**
 * Prompt for a password with masked terminal characters ('*') so that
 * the plaintext password is never echoed to the screen, console, or shell logs.
 */
function promptPasswordMasked(query: string): Promise<string> {
  return new Promise((resolve) => {
    // If not a TTY (e.g. piped input or CI), use standard line reader
    if (!process.stdin.isTTY) {
      const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
      });
      rl.question(query, (answer) => {
        rl.close();
        resolve(answer.trim());
      });
      return;
    }

    process.stdout.write(query);
    let input = "";

    process.stdin.setRawMode(true);
    process.stdin.resume();

    const onData = (buffer: Buffer) => {
      const str = buffer.toString();

      // Enter key (Carriage return or Line feed)
      if (str === "\r" || str === "\n") {
        process.stdin.setRawMode(false);
        process.stdin.pause();
        process.stdin.removeListener("data", onData);
        process.stdout.write("\n");
        resolve(input);
        return;
      }

      // Ctrl+C (SIGINT)
      if (str === "\u0003") {
        process.stdin.setRawMode(false);
        process.stdin.pause();
        process.stdout.write("\nOperation cancelled by user.\n");
        process.exit(0);
      }

      // Backspace / Delete
      if (str === "\u0008" || str === "\x7f") {
        if (input.length > 0) {
          input = input.slice(0, -1);
          process.stdout.write("\b \b");
        }
        return;
      }

      // Append printable characters and display mask character
      input += str;
      process.stdout.write("*");
    };

    process.stdin.on("data", onData);
  });
}

async function main() {
  console.log("==================================================");
  console.log("Slotly Atelier Admin Credential Generator");
  console.log("==================================================");

  let chosenEmail = "";
  let chosenPassword = "";

  // 1. Check if CLI arguments were provided (useful for automation/CI)
  if (process.argv[2] && process.argv[2].trim().length > 0) {
    chosenPassword = process.argv[2].trim();
    chosenEmail = (process.argv[3] && process.argv[3].trim()) || "admin@slotly.atelier";
  } else {
    // 2. Interactive prompt: ask for administrator email first
    console.log("Configure administrator credentials for the Slotly Atelier dashboard.\n");

    const emailInput = await promptText("Enter administrator email [admin@slotly.atelier]: ", "admin@slotly.atelier");
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailInput)) {
      console.error("\n[Error] Invalid email address format. Generation aborted.");
      process.exit(1);
    }
    chosenEmail = emailInput.toLowerCase();

    // 3. Interactive prompt: ask for password with masked characters
    console.log("");
    const pass1 = await promptPasswordMasked("Enter new admin password: ");

    if (pass1.length < 8) {
      console.error("\n[Error] Password must be at least 8 characters in length for security.");
      process.exit(1);
    }

    const pass2 = await promptPasswordMasked("Confirm admin password:   ");

    if (pass1 !== pass2) {
      console.error("\n[Error] Passwords do not match. Generation aborted.");
      process.exit(1);
    }

    chosenPassword = pass1;
  }

  // 4. Generate salt, hash, and fresh session secret
  const hash = hashPassword(chosenPassword);
  const sessionSecret = crypto.randomBytes(32).toString("hex");

  // 5. Output the configuration values (never prints the plaintext password)
  console.log("\n✓ Credentials generated successfully (plaintext password was not logged).");
  console.log("\nUpdate the following variables in your local .env or .env.local file:");
  console.log("--------------------------------------------------------------------------------");
  console.log(`ADMIN_EMAIL="${chosenEmail}"`);
  console.log(`ADMIN_PASSWORD_HASH="${hash}"`);
  console.log(`ADMIN_SESSION_SECRET="${sessionSecret}"`);
  console.log("--------------------------------------------------------------------------------");
  console.log("Note: After updating .env, restart your dev server ('npm run dev') for changes to take effect.");
}

main().catch((err) => {
  console.error("\nFailed to generate credentials:", err);
  process.exit(1);
});
