// The lock screen only ever stores a PBKDF2 digest of the PIN, never the PIN
// itself. A four-digit PIN is still guessable by anyone who reads this file and
// runs the same derivation, so this is a casual-obfuscation gate, not real
// authentication.
const LOCK_SALT = "n-pc-lock-v1";
const LOCK_ITERATIONS = 210000;
const LOCK_HASH =
  "e2f3760e3057b3ed387eb7ef233f73a3a5879ebd2b9a2d65d655425a4a645895";

const toHex = (buffer) =>
  Array.from(new Uint8Array(buffer), (byte) =>
    byte.toString(16).padStart(2, "0"),
  ).join("");

export const verifyPassword = async (password) => {
  if (!globalThis.crypto || !globalThis.crypto.subtle) return false;

  const encoder = new TextEncoder();
  const key = await globalThis.crypto.subtle.importKey(
    "raw",
    encoder.encode(password),
    "PBKDF2",
    false,
    ["deriveBits"],
  );
  const bits = await globalThis.crypto.subtle.deriveBits(
    {
      name: "PBKDF2",
      salt: encoder.encode(LOCK_SALT),
      iterations: LOCK_ITERATIONS,
      hash: "SHA-256",
    },
    key,
    256,
  );

  return toHex(bits) === LOCK_HASH;
};
