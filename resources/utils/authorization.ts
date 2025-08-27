export const hasRole = (role: string, userRoles: string[] = []) => 
    userRoles.includes(role);
