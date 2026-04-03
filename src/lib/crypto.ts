/**
 * Web Crypto API utility functions for authentication and session security.
 * Uses browser-native SubtleCrypto — no external dependencies.
 */

function bufferToHex(buffer: ArrayBuffer): string {
  return Array.from(new Uint8Array(buffer))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('')
}

export async function hashSHA256(input: string): Promise<string> {
  const encoded = new TextEncoder().encode(input)
  const hash = await crypto.subtle.digest('SHA-256', encoded)
  return bufferToHex(hash)
}

async function getHMACKey(secret: string): Promise<CryptoKey> {
  const encoded = new TextEncoder().encode(secret)
  return crypto.subtle.importKey(
    'raw',
    encoded,
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign', 'verify']
  )
}

export async function computeHMAC(message: string, secret: string): Promise<string> {
  const key = await getHMACKey(secret)
  const encoded = new TextEncoder().encode(message)
  const sig = await crypto.subtle.sign('HMAC', key, encoded)
  return bufferToHex(sig)
}

export async function verifyHMAC(message: string, signature: string, secret: string): Promise<boolean> {
  const expected = await computeHMAC(message, secret)
  if (expected.length !== signature.length) return false
  // Constant-length comparison (not truly constant-time in JS, but avoids short-circuit)
  let result = 0
  for (let i = 0; i < expected.length; i++) {
    result |= expected.charCodeAt(i) ^ signature.charCodeAt(i)
  }
  return result === 0
}
