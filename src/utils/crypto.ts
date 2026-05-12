/**
 * Web Crypto API wrapper for the Encrypted Vault.
 * Uses PBKDF2 for key derivation and AES-GCM for symmetric encryption.
 */

const ITERATIONS = 100000;
const HASH_ALGO = "SHA-256";
const ENCRYPT_ALGO = "AES-GCM";
const KEY_LENGTH = 256;

// Convert string to ArrayBuffer
const enc = new TextEncoder();
const dec = new TextDecoder();

/**
 * Derives an AES-GCM key from a master password.
 */
async function deriveKey(password: string, salt: Uint8Array): Promise<CryptoKey> {
  const keyMaterial = await window.crypto.subtle.importKey(
    "raw",
    enc.encode(password),
    { name: "PBKDF2" },
    false,
    ["deriveBits", "deriveKey"]
  );

  return window.crypto.subtle.deriveKey(
    {
      name: "PBKDF2",
      salt: salt,
      iterations: ITERATIONS,
      hash: HASH_ALGO,
    },
    keyMaterial,
    { name: ENCRYPT_ALGO, length: KEY_LENGTH },
    true,
    ["encrypt", "decrypt"]
  );
}

/**
 * Encrypts a JSON-serializable object into a Base64 string.
 * Returns the ciphertext and the salt/iv used.
 */
export async function encryptVaultData(
  data: any,
  password: string
): Promise<{ cipherBase64: string; ivBase64: string; saltBase64: string }> {
  const salt = window.crypto.getRandomValues(new Uint8Array(16));
  const iv = window.crypto.getRandomValues(new Uint8Array(12));
  const key = await deriveKey(password, salt);

  const encodedData = enc.encode(JSON.stringify(data));

  const encryptedBuf = await window.crypto.subtle.encrypt(
    { name: ENCRYPT_ALGO, iv },
    key,
    encodedData
  );

  return {
    cipherBase64: btoa(String.fromCharCode(...new Uint8Array(encryptedBuf))),
    ivBase64: btoa(String.fromCharCode(...iv)),
    saltBase64: btoa(String.fromCharCode(...salt)),
  };
}

/**
 * Decrypts a Base64 ciphertext back into a JSON object using the master password.
 * Throws an error if the password is wrong or data is corrupted.
 */
export async function decryptVaultData(
  cipherBase64: string,
  ivBase64: string,
  saltBase64: string,
  password: string
): Promise<any> {
  const salt = new Uint8Array(atob(saltBase64).split("").map((c) => c.charCodeAt(0)));
  const iv = new Uint8Array(atob(ivBase64).split("").map((c) => c.charCodeAt(0)));
  const encryptedBytes = new Uint8Array(atob(cipherBase64).split("").map((c) => c.charCodeAt(0)));

  const key = await deriveKey(password, salt);

  try {
    const decryptedBuf = await window.crypto.subtle.decrypt(
      { name: ENCRYPT_ALGO, iv },
      key,
      encryptedBytes
    );

    const decryptedText = dec.decode(decryptedBuf);
    return JSON.parse(decryptedText);
  } catch (error) {
    throw new Error("Decryption failed. Incorrect password or corrupted data.");
  }
}
