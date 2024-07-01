export function hasPermission(permissions: string, permission: number) {
  return (Number.parseInt(permissions) & permission) === permission;
}

export function truncateString(str: string, maxLength: number): string {
  if (str.length > maxLength) return `${str.substring(0, maxLength)}...`;
  return str;
}

export async function wait(ms: number): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, ms));
}
