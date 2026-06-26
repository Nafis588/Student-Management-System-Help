export interface ValidationResult {
  isValid: boolean;
  error?: string;
  details?: {
    year: number;
    shift: 'Morning' | 'Day';
    serial: string;
  };
}

export function validateStudentId(id: string): ValidationResult {
  if (!id) {
    return { isValid: false, error: 'Student ID is required.' };
  }
  
  if (!/^\d+$/.test(id)) {
    return { isValid: false, error: 'Student ID must contain only digits.' };
  }
  
  if (id.length !== 7) {
    return { isValid: false, error: 'Student ID must be exactly 7 digits.' };
  }
  
  if (!id.startsWith('26')) {
    return { isValid: false, error: 'Student ID must start with 26 (Current Year 2026).' };
  }
  
  const shiftDigit = id[2];
  if (shiftDigit !== '1' && shiftDigit !== '2') {
    return { isValid: false, error: 'Third digit must be 1 (Morning shift) or 2 (Day shift).' };
  }
  
  const serial = id.slice(3);
  
  return {
    isValid: true,
    details: {
      year: 2026,
      shift: shiftDigit === '1' ? 'Morning' : 'Day',
      serial
    }
  };
}
export function getStudentShift(id: string): 'Morning' | 'Day' | 'Unknown' {
  const result = validateStudentId(id);
  return result.isValid && result.details ? result.details.shift : 'Unknown';
}
