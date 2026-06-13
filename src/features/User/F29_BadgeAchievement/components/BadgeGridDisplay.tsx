// src/features/User/F29_BadgeAchievement/components/BadgeGridDisplay.tsx
import { Lock, Award, MessageSquare, ThumbsUp, Gem, Flame } from 'lucide-react';
import type { BadgeItem } from '../types';

// ─── Tier visual config (matches My Badges design) ─────────────────────────────
const TIER_VISUAL: Record<string, {
  ribbon: string;      // ribbon background + text classes
  ribbonText: string;
  icon: typeof Award;
  iconBg: string;      // icon circle bg
  iconColor: string;
}> = {
  bronze: {
    ribbon: 'bg-orange-700',
    ribbonText: 'text-white',
    icon: ThumbsUp,
    iconBg: 'bg-orange-900/30 border-orange-700/50',
    iconColor: 'text-orange-400',
  },
  silver: {
    ribbon: 'bg-slate-400',
    ribbonText: 'text-black',
    icon: MessageSquare,
    iconBg: 'bg-slate-800/40 border-slate-500/50',
    iconColor: 'text-slate-300',
  },
  gold: {
    ribbon: 'bg-amber-400',
    ribbonText: 'text-black',
    icon: Award,
    iconBg: 'bg-amber-900/30 border-amber-500/50',
    iconColor: 'text-amber-400',
  },
  platinum: {
    ribbon: 'bg-slate-600',
    ribbonText: 'text-white',
    icon: Flame,
    iconBg: 'bg-indigo-900/30 border-indigo-500/50',
    iconColor: 'text-indigo-400',
  },
  diamond: {
    ribbon: 'bg-cyan-500',
    ribbonText: 'text-black',
    icon: Gem,
    iconBg: 'bg-cyan-900/30 border-cyan-500/50',
    iconColor: 'text-cyan-400',
  },
};

function getTierVisual(tier: string | null) {
  return TIER_VISUAL[tier || 'bronze'] || TIER_VISUAL.bronze;
}

interface BadgeGridDisplayProps {
  badges: BadgeItem[];
}

function BadgeCard({ badge }: { badge: BadgeItem }) {
  const isUnlocked = !!badge.earned_at;
  const tv = getTierVisual(badge.tier);
  const Icon = tv.icon;
  const tierLabel = (badge.tier || 'bronze').toUpperCase();

  return (
    <div
      className={`relative flex flex-col items-center rounded-xl border overflow-hidden transition-all ${
        isUnlocked
          ? 'border-zinc-800 bg-[#161618] hover:border-zinc-700'
          : 'border-zinc-800/50 bg-[#0F0F11] opacity-60'
      }`}
    >
      {/* Lock icon overlay for locked badges */}
      {!isUnlocked && (
        <div className="absolute top-2.5 right-2.5 z-10">
          <Lock className="w-3.5 h-3.5 text-zinc-600" />
        </div>
      )}

      {/* Icon */}
      <div className="pt-5 pb-3">
        <div
          className={`w-14 h-14 rounded-full border flex items-center justify-center ${tv.iconBg}`}
        >
          <Icon className={`w-7 h-7 ${isUnlocked ? tv.iconColor : 'text-zinc-600'}`} />
        </div>
      </div>

      {/* Name + Description */}
      <div className="flex-1 text-center px-4 pb-4">
        <h3
          className={`text-sm font-bold mb-1.5 ${
            isUnlocked ? 'text-white' : 'text-zinc-600'
          }`}
        >
          {badge.name}
        </h3>
        <p className="text-[11px] leading-relaxed text-zinc-500 line-clamp-2">
          {badge.description || 'No description.'}
        </p>
      </div>

      {/* Tier ribbon at bottom */}
      <div
        className={`w-full py-1.5 text-center text-[10px] font-extrabold tracking-widest uppercase ${
          isUnlocked
            ? `${tv.ribbon} ${tv.ribbonText}`
            : 'bg-zinc-800 text-zinc-600'
        }`}
      >
        {tierLabel}
      </div>
    </div>
  );
}

export default function BadgeGridDisplay({ badges }: BadgeGridDisplayProps) {
  if (badges.length === 0) {
    return (
      <div className="text-center py-16 border border-dashed border-zinc-800 rounded-xl">
        <Award className="w-10 h-10 text-zinc-700 mx-auto mb-3" />
        <p className="text-zinc-500 text-sm">No badges available yet.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-4">
      {badges.map((badge) => (
        <BadgeCard key={badge.id} badge={badge} />
      ))}
    </div>
  );
}
