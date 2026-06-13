// src/features/Admin/F11_BadgeMaster/constants.ts
import { Award, MessageSquare, ThumbsUp, Shield, Gem } from 'lucide-react';

export const TIER_CONFIG: Record<string, { label: string; border: string; text: string; bg: string; icon: typeof Award }> = {
  bronze:   { label: 'BRONZE',   border: 'border-orange-700/50', text: 'text-orange-400',   bg: 'bg-orange-700/10',  icon: ThumbsUp },
  silver:   { label: 'SILVER',   border: 'border-slate-500/50',  text: 'text-slate-300',    bg: 'bg-slate-500/10',   icon: MessageSquare },
  gold:     { label: 'GOLD',     border: 'border-amber-500/50',  text: 'text-amber-400',    bg: 'bg-amber-500/10',   icon: Award },
  platinum: { label: 'PLATINUM', border: 'border-indigo-500/50', text: 'text-indigo-400',   bg: 'bg-indigo-950/30',  icon: Shield },
  diamond:  { label: 'DIAMOND',  border: 'border-cyan-500/50',   text: 'text-cyan-400',     bg: 'bg-cyan-950/20',    icon: Gem },
};

export function getTierConfig(tier: string | null) {
  return TIER_CONFIG[tier || 'bronze'] || TIER_CONFIG.bronze;
}
