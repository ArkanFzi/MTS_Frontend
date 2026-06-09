import { Label } from "../../../../components/ui/label";

interface TermsCheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
}

export function TermsCheckbox({ checked, onChange }: TermsCheckboxProps) {
  return (
    <div className="flex items-start gap-3 pt-1 w-full mb-6">
      <input
        id="terms"
        type="checkbox"
        className="mt-1 h-4 w-4 shrink-0 rounded border-zinc-700 bg-transparent text-black accent-[#D4AF37] cursor-pointer"
        required
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
      />
      <Label
        htmlFor="terms"
        className="text-xs text-muted-foreground cursor-pointer select-none leading-relaxed flex-1"
      >
        I agree to the{" "}
        <a href="#" className="underline hover:text-[#D4AF37] transition-colors decoration-muted-foreground/50">
          Terms
        </a>{" "}
        and{" "}
        <a href="#" className="underline hover:text-[#D4AF37] transition-colors decoration-muted-foreground/50">
          Privacy Policy
        </a>.
      </Label>
    </div>
  );
}