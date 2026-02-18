/**
 * Interaction logging utilities
 * Implements requirement 5.5: Interaction logging for contact attempts
 */

export interface ContactInteraction {
  id: string;
  type: 'form_submit' | 'email_click' | 'linkedin_click' | 'phone_click' | 'social_share';
  timestamp: Date;
  metadata: {
    userAgent?: string;
    referrer?: string;
    page?: string;
    formData?: {
      name?: string;
      email?: string;
      subject?: string;
      hasMessage?: boolean;
    };
    success?: boolean;
    error?: string;
  };
}

// In-memory storage (use database in production)
const interactionLog: ContactInteraction[] = [];

/**
 * Log a contact interaction
 */
export function logContactInteraction(
  type: ContactInteraction['type'],
  metadata: ContactInteraction['metadata'] = {}
): ContactInteraction {
  const interaction: ContactInteraction = {
    id: generateInteractionId(),
    type,
    timestamp: new Date(),
    metadata: {
      ...metadata,
      userAgent: metadata.userAgent || (typeof navigator !== 'undefined' ? navigator.userAgent : undefined),
      referrer: metadata.referrer || (typeof document !== 'undefined' ? document.referrer : undefined),
      page: metadata.page || (typeof window !== 'undefined' ? window.location.pathname : undefined),
    },
  };

  interactionLog.push(interaction);

  // In production, send to analytics service
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('event', type, {
      event_category: 'contact',
      event_label: metadata.page,
    });
  }

  return interaction;
}

/**
 * Generate unique interaction ID
 */
function generateInteractionId(): string {
  return `int_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Get interaction logs
 */
export function getInteractionLogs(filters?: {
  type?: ContactInteraction['type'];
  startDate?: Date;
  endDate?: Date;
  limit?: number;
}): ContactInteraction[] {
  let logs = [...interactionLog];

  if (filters?.type) {
    logs = logs.filter(log => log.type === filters.type);
  }

  if (filters?.startDate) {
    logs = logs.filter(log => log.timestamp >= filters.startDate!);
  }

  if (filters?.endDate) {
    logs = logs.filter(log => log.timestamp <= filters.endDate!);
  }

  // Sort by timestamp descending
  logs.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());

  if (filters?.limit) {
    logs = logs.slice(0, filters.limit);
  }

  return logs;
}

/**
 * Get interaction statistics
 */
export function getInteractionStats(period?: {
  startDate: Date;
  endDate: Date;
}): {
  total: number;
  byType: Record<string, number>;
  successRate: number;
  averagePerDay: number;
} {
  let logs = interactionLog;

  if (period) {
    logs = logs.filter(
      log => log.timestamp >= period.startDate && log.timestamp <= period.endDate
    );
  }

  const byType: Record<string, number> = {};
  let successCount = 0;

  logs.forEach(log => {
    byType[log.type] = (byType[log.type] || 0) + 1;
    if (log.metadata.success) {
      successCount++;
    }
  });

  const days = period
    ? Math.ceil((period.endDate.getTime() - period.startDate.getTime()) / (1000 * 60 * 60 * 24))
    : 1;

  return {
    total: logs.length,
    byType,
    successRate: logs.length > 0 ? successCount / logs.length : 0,
    averagePerDay: logs.length / days,
  };
}

/**
 * Clear old interaction logs
 */
export function clearOldLogs(olderThanDays: number = 90): number {
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - olderThanDays);

  const initialLength = interactionLog.length;
  const filtered = interactionLog.filter(log => log.timestamp >= cutoffDate);

  interactionLog.length = 0;
  interactionLog.push(...filtered);

  return initialLength - interactionLog.length;
}

/**
 * Export logs for analysis
 */
export function exportLogs(format: 'json' | 'csv' = 'json'): string {
  if (format === 'csv') {
    const headers = ['ID', 'Type', 'Timestamp', 'Page', 'Success', 'User Agent'];
    const rows = interactionLog.map(log => [
      log.id,
      log.type,
      log.timestamp.toISOString(),
      log.metadata.page || '',
      log.metadata.success ? 'Yes' : 'No',
      log.metadata.userAgent || '',
    ]);

    return [headers, ...rows].map(row => row.join(',')).join('\n');
  }

  return JSON.stringify(interactionLog, null, 2);
}

/**
 * Track form submission attempt
 */
export function trackFormSubmission(data: {
  name: string;
  email: string;
  subject: string;
  success: boolean;
  error?: string;
}): ContactInteraction {
  return logContactInteraction('form_submit', {
    formData: {
      name: data.name,
      email: data.email,
      subject: data.subject,
      hasMessage: true,
    },
    success: data.success,
    error: data.error,
  });
}

/**
 * Track social link click
 */
export function trackSocialClick(platform: 'email' | 'linkedin' | 'phone'): ContactInteraction {
  const typeMap = {
    email: 'email_click' as const,
    linkedin: 'linkedin_click' as const,
    phone: 'phone_click' as const,
  };

  return logContactInteraction(typeMap[platform], {});
}

/**
 * Track social share
 */
export function trackSocialShare(platform: string, url: string): ContactInteraction {
  return logContactInteraction('social_share', {
    formData: {
      subject: `Shared on ${platform}`,
    },
  });
}
