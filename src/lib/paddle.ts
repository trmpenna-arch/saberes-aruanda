/**
 * Utility to initialize and get the Paddle instance
 */
export async function initializePaddle() {
  const environment = getPaddleEnvironment();
  const { initializePaddle: paddleInit } = await import("@paddle/paddle-js");
  
  const paddle = await paddleInit({
    environment,
    token: environment === 'sandbox' 
      ? import.meta.env.VITE_PADDLE_SANDBOX_CLIENT_TOKEN 
      : import.meta.env.VITE_PADDLE_LIVE_CLIENT_TOKEN,
  });
  
  return paddle;
}

/**
 * Returns the correct environment based on the current URL
 */
export function getPaddleEnvironment(): 'sandbox' | 'production' {
  if (typeof window === 'undefined') return 'production';
  const isDev = window.location.hostname === 'localhost' || 
                window.location.hostname.includes('lovable.app');
  return isDev ? 'sandbox' : 'production';
}

/**
 * Resolves a human-readable price ID to a Paddle price ID
 * In a real implementation, you would fetch this from your backend or a config file
 * that maps your product_id/price_id to Paddle's pri_... IDs
 */
export async function getPaddlePriceId(internalPriceId: string): Promise<string> {
  // This is a placeholder. In a real app, you'd use a server function 
  // or a mapping table to get the actual pri_... ID from Paddle
  console.log(`Resolving price ID: ${internalPriceId}`);
  return internalPriceId; 
}
