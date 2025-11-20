import { VeranstaltungDto } from '../types/veranstaltung';

/**
 * Recurring event utility functions
 */

export interface RecurringOccurrence {
  date: Date;
  startdatum: string;
  enddatum?: string;
}

/**
 * Calculate next occurrences of a recurring event
 */
export const calculateNextOccurrences = (
  event: VeranstaltungDto,
  count: number = 10
): RecurringOccurrence[] => {
  if (!event.istWiederholend || !event.wiederholungTyp) {
    return [];
  }

  const occurrences: RecurringOccurrence[] = [];
  const startDate = new Date(event.startdatum);
  const endDate = event.enddatum ? new Date(event.enddatum) : null;
  const recurrenceEnd = event.wiederholungEnde ? new Date(event.wiederholungEnde) : null;
  const interval = event.wiederholungInterval || 1;
  
  // Calculate duration
  const duration = endDate ? endDate.getTime() - startDate.getTime() : 0;

  let currentDate = new Date(startDate);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Skip past occurrences
  while (currentDate < today) {
    currentDate = getNextOccurrence(currentDate, event.wiederholungTyp, interval, event);
  }

  // Generate future occurrences
  while (occurrences.length < count) {
    if (recurrenceEnd && currentDate > recurrenceEnd) {
      break;
    }

    const occurrenceStart = new Date(currentDate);
    const occurrenceEnd = duration > 0 ? new Date(occurrenceStart.getTime() + duration) : undefined;

    occurrences.push({
      date: occurrenceStart,
      startdatum: occurrenceStart.toISOString(),
      enddatum: occurrenceEnd?.toISOString()
    });

    currentDate = getNextOccurrence(currentDate, event.wiederholungTyp, interval, event);
  }

  return occurrences;
};

/**
 * Get next occurrence date based on recurrence type
 */
const getNextOccurrence = (
  currentDate: Date,
  type: string,
  interval: number,
  event: VeranstaltungDto
): Date => {
  const next = new Date(currentDate);

  switch (type) {
    case 'daily':
      next.setDate(next.getDate() + interval);
      break;

    case 'weekly':
      if (event.wiederholungTage) {
        // Weekly with specific days
        const weekdays = event.wiederholungTage.split(',');
        const dayMap: { [key: string]: number } = {
          'Sun': 0, 'Mon': 1, 'Tue': 2, 'Wed': 3, 'Thu': 4, 'Fri': 5, 'Sat': 6
        };
        
        const currentDay = next.getDay();
        const targetDays = weekdays.map(d => dayMap[d.trim()]).sort((a, b) => a - b);
        
        // Find next day in the week
        let foundNextDay = false;
        for (const targetDay of targetDays) {
          if (targetDay > currentDay) {
            next.setDate(next.getDate() + (targetDay - currentDay));
            foundNextDay = true;
            break;
          }
        }
        
        // If no day found this week, go to first day of next week(s)
        if (!foundNextDay) {
          const daysUntilNextWeek = 7 - currentDay + targetDays[0];
          next.setDate(next.getDate() + daysUntilNextWeek + (interval - 1) * 7);
        }
      } else {
        // Simple weekly
        next.setDate(next.getDate() + (7 * interval));
      }
      break;

    case 'monthly':
      if (event.wiederholungMonatTag) {
        // Specific day of month
        next.setMonth(next.getMonth() + interval);
        next.setDate(Math.min(event.wiederholungMonatTag, getDaysInMonth(next)));
      } else {
        // Same day of month
        const originalDay = currentDate.getDate();
        next.setMonth(next.getMonth() + interval);
        next.setDate(Math.min(originalDay, getDaysInMonth(next)));
      }
      break;

    case 'yearly':
      next.setFullYear(next.getFullYear() + interval);
      break;

    default:
      next.setDate(next.getDate() + 1);
  }

  return next;
};

/**
 * Get number of days in a month
 */
const getDaysInMonth = (date: Date): number => {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
};

/**
 * Format recurrence description for display
 */
export const getRecurrenceDescription = (event: VeranstaltungDto, t: (key: string) => string): string => {
  if (!event.istWiederholend || !event.wiederholungTyp) {
    return '';
  }

  const interval = event.wiederholungInterval || 1;
  let description = '';

  switch (event.wiederholungTyp) {
    case 'daily':
      description = interval === 1 ? t('recurrence.daily') : t('recurrence.everyNDays').replace('{n}', interval.toString());
      break;
    case 'weekly':
      if (event.wiederholungTage) {
        description = t('recurrence.weeklyOn').replace('{days}', event.wiederholungTage);
      } else {
        description = interval === 1 ? t('recurrence.weekly') : t('recurrence.everyNWeeks').replace('{n}', interval.toString());
      }
      break;
    case 'monthly':
      description = interval === 1 ? t('recurrence.monthly') : t('recurrence.everyNMonths').replace('{n}', interval.toString());
      break;
    case 'yearly':
      description = interval === 1 ? t('recurrence.yearly') : t('recurrence.everyNYears').replace('{n}', interval.toString());
      break;
  }

  if (event.wiederholungEnde) {
    const endDate = new Date(event.wiederholungEnde).toLocaleDateString();
    description += ` ${t('recurrence.until')} ${endDate}`;
  }

  return description;
};

