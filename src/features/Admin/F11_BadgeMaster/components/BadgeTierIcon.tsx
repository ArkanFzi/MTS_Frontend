// src/features/Admin/F11_BadgeMaster/components/BadgeTierIcon.tsx
import { getTierConfig } from '../constants';

export default function BadgeTierIcon({ tier }: { tier: string | null }) {
  const cfg = getTierConfig(tier);
  const Icon = cfg.icon;
  const glowClass = tier === 'platinum' || tier === 'diamond' ? 'animate-pulse' : '';
  return <Icon className={`w-5 h-5 ${cfg.text} ${glowClass}`} />;
}
