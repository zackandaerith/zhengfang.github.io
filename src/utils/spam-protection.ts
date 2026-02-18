/**
 * Spam protection utilities for contact forms
 * Implements requirement 5.3: Spam protection measures
 */

// Rate limiting storage (in-memory for demo, use Redis in production)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

/**
 * Rate limiting configuration
 */
export const RATE_LIMIT_CONFIG = {
  maxAttempts: 5,
  windowMs: 15 * 60 * 1000, // 15 minutes
  blockDurationMs: 60 * 60 * 1000, // 1 hour
};

/**
 * Check if IP/identifier is rate limited
 */
export function checkRateLimit(identifier: string): {
  allowed: boolean;
  remaining: number;
  resetTime: number;
} {
  const now = Date.now();
  const record = rateLimitStore.get(identifier);

  // No record or expired window
  if (!record || now > record.resetTime) {
    rateLimitStore.set(identifier, {
      count: 1,
      resetTime: now + RATE_LIMIT_CONFIG.windowMs,
    });
    return {
      allowed: true,
      remaining: RATE_LIMIT_CONFIG.maxAttempts - 1,
      resetTime: now + RATE_LIMIT_CONFIG.windowMs,
    };
  }

  // Within window
  if (record.count >= RATE_LIMIT_CONFIG.maxAttempts) {
    return {
      allowed: false,
      remaining: 0,
      resetTime: record.resetTime,
    };
  }

  // Increment count
  record.count++;
  rateLimitStore.set(identifier, record);

  return {
    allowed: true,
    remaining: RATE_LIMIT_CONFIG.maxAttempts - record.count,
    resetTime: record.resetTime,
  };
}

/**
 * Honeypot field validation
 * Hidden field that should remain empty (bots often fill all fields)
 */
export function validateHoneypot(honeypotValue: string | undefined): boolean {
  return !honeypotValue || honeypotValue.trim() === '';
}

/**
 * Time-based validation
 * Form should take reasonable time to fill (too fast = bot)
 */
export function validateSubmissionTime(
  formLoadTime: number,
  submitTime: number,
  minSeconds: number = 3
): boolean {
  const elapsedSeconds = (submitTime - formLoadTime) / 1000;
  return elapsedSeconds >= minSeconds;
}

/**
 * Content spam detection
 * Check for common spam patterns
 */
export function detectSpamContent(content: string): {
  isSpam: boolean;
  reasons: string[];
} {
  const reasons: string[] = [];
  const lowerContent = content.toLowerCase();

  // Check for excessive URLs
  const urlCount = (content.match(/https?:\/\//g) || []).length;
  if (urlCount > 3) {
    reasons.push('Excessive URLs detected');
  }

  // Check for common spam keywords
  const spamKeywords = [
    'viagra',
    'cialis',
    'casino',
    'lottery',
    'winner',
    'congratulations you won',
    'click here now',
    'limited time offer',
    'act now',
    'buy now',
  ];

  spamKeywords.forEach(keyword => {
    if (lowerContent.includes(keyword)) {
      reasons.push(`Spam keyword detected: ${keyword}`);
    }
  });

  // Check for excessive capitalization
  const capsRatio = (content.match(/[A-Z]/g) || []).length / content.length;
  if (capsRatio > 0.5 && content.length > 20) {
    reasons.push('Excessive capitalization');
  }

  // Check for repeated characters
  if (/(.)\1{10,}/.test(content)) {
    reasons.push('Repeated characters detected');
  }

  return {
    isSpam: reasons.length > 0,
    reasons,
  };
}

/**
 * Validate email domain
 * Check against known disposable email providers
 */
export function validateEmailDomain(email: string): {
  valid: boolean;
  reason?: string;
} {
  const disposableDomains = [
    'tempmail.com',
    'throwaway.email',
    'guerrillamail.com',
    '10minutemail.com',
    'mailinator.com',
  ];

  const domain = email.split('@')[1]?.toLowerCase();

  if (!domain) {
    return { valid: false, reason: 'Invalid email format' };
  }

  if (disposableDomains.includes(domain)) {
    return { valid: false, reason: 'Disposable email not allowed' };
  }

  return { valid: true };
}

/**
 * Comprehensive spam check
 */
export function performSpamCheck(data: {
  email: string;
  message: string;
  honeypot?: string;
  formLoadTime?: number;
  submitTime?: number;
  identifier: string;
}): {
  passed: boolean;
  blocked: boolean;
  reasons: string[];
} {
  const reasons: string[] = [];
  let blocked = false;

  // Rate limit check
  const rateLimit = checkRateLimit(data.identifier);
  if (!rateLimit.allowed) {
    reasons.push('Rate limit exceeded');
    blocked = true;
  }

  // Honeypot check
  if (data.honeypot && !validateHoneypot(data.honeypot)) {
    reasons.push('Honeypot field filled');
    blocked = true;
  }

  // Timing check
  if (data.formLoadTime && data.submitTime) {
    if (!validateSubmissionTime(data.formLoadTime, data.submitTime)) {
      reasons.push('Form submitted too quickly');
      blocked = true;
    }
  }

  // Content spam check
  const contentCheck = detectSpamContent(data.message);
  if (contentCheck.isSpam) {
    reasons.push(...contentCheck.reasons);
  }

  // Email domain check
  const emailCheck = validateEmailDomain(data.email);
  if (!emailCheck.valid) {
    reasons.push(emailCheck.reason || 'Invalid email');
  }

  return {
    passed: reasons.length === 0,
    blocked,
    reasons,
  };
}

/**
 * Clear rate limit for identifier (for testing or admin override)
 */
export function clearRateLimit(identifier: string): void {
  rateLimitStore.delete(identifier);
}

/**
 * Get client identifier from request
 * In production, use IP address or session ID
 */
export function getClientIdentifier(request?: {
  ip?: string;
  headers?: Record<string, string>;
}): string {
  if (request?.ip) {
    return request.ip;
  }

  if (request?.headers?.['x-forwarded-for']) {
    return request.headers['x-forwarded-for'].split(',')[0].trim();
  }

  // Fallback for client-side (use session storage)
  if (typeof window !== 'undefined') {
    let clientId = sessionStorage.getItem('clientId');
    if (!clientId) {
      clientId = `client_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      sessionStorage.setItem('clientId', clientId);
    }
    return clientId;
  }

  return 'unknown';
}
