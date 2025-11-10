// Simple camelCase transform: lower-case first letter, keep the rest
export function toCamelCaseKey(key: string): string {
  if (!key) return key;
  return key.charAt(0).toLowerCase() + key.slice(1);
}

// Recursively convert object keys from PascalCase to camelCase
export function camelizeKeys<T = any>(input: any): T {
  if (Array.isArray(input)) {
    return input.map((item) => camelizeKeys(item)) as any;
  }
  if (input && typeof input === 'object' && input.constructor === Object) {
    const result: Record<string, any> = {};
    Object.keys(input).forEach((k) => {
      const camelKey = toCamelCaseKey(k);
      result[camelKey] = camelizeKeys((input as any)[k]);
    });
    return result as T;
  }
  return input as T;
}


