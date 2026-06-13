// src/features/User/F32_PublicProfile/types/index.ts

export function getRoleBadge(roles: string[]) {
  if (roles.includes('admin')) return { label: 'Admin', color: 'bg-red-950/50 text-red-400 border-red-900' };
  if (roles.includes('moderator')) return { label: 'Moderator', color: 'bg-blue-950/50 text-blue-400 border-blue-900' };
  return { label: 'Member', color: 'bg-[#1A1A1C] text-gray-400 border-[#2A2A2C]' };
}

export function getReputationTier(points: number) {
  if (points >= 10000) return { label: 'Legendary', color: 'text-[#D4AF37]' };
  if (points >= 5000) return { label: 'Expert', color: 'text-purple-400' };
  if (points >= 1000) return { label: 'Advanced', color: 'text-blue-400' };
  if (points >= 100) return { label: 'Intermediate', color: 'text-green-400' };
  return { label: 'Beginner', color: 'text-gray-400' };
}
