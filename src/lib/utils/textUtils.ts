export function flatten(str: string|undefined): string {
    return (str ?? "").toLowerCase().replaceAll(" ", "-").replaceAll(/[^a-z-]/g, '');
}

export function isEqualFlattened(str1: string, str2: string): boolean {
    return flatten(str1) === flatten(str2);
}
