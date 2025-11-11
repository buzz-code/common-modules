/**
 * Date utility functions for timezone-independent date handling.
 * Dates are transmitted as YYYY-MM-DD strings, converted to Date objects only for UI display.
 */

const DATE_REGEX = /^\d{4}-\d{2}-\d{2}$/;

export function isDateOnlyString(value) {
    return typeof value === 'string' && DATE_REGEX.test(value);
}

export function formatDateOnly(date) {
    if (!date) return null;
    
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    
    return `${year}-${month}-${day}`;
}

export function parseDateOnly(dateString) {
    if (!dateString) return null;
    
    if (!isDateOnlyString(dateString)) {
        console.warn(`Invalid date format: ${dateString}`);
        return null;
    }
    
    const [year, month, day] = dateString.split('-').map(Number);
    return new Date(year, month - 1, day);
}

export function toDateOnlyString(value) {
    if (!value) return null;
    if (isDateOnlyString(value)) return value;
    if (value instanceof Date) return formatDateOnly(value);
    
    try {
        const date = new Date(value);
        if (!isNaN(date.getTime())) {
            return formatDateOnly(date);
        }
    } catch (e) {
        console.warn(`Cannot convert to date: ${value}`);
    }
    
    return null;
}
