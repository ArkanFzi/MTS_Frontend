
interface PostBodyProps {
  body: string;
}

/** Render body with code block support (``` blocks → styled <pre>) */
export default function PostBody({ body }: PostBodyProps) {
  const parts = body.split(/(```[\s\S]*?```)/g);
  return (
    <div className="text-[15px] text-gray-200 leading-[1.8] space-y-4">
      {parts.map((part, i) => {
        if (part.startsWith('```') && part.endsWith('```')) {
          const code = part.slice(3, -3);
          // Strip optional language identifier on first line
          const firstNewline = code.indexOf('\n');
          const content = firstNewline > 0 && firstNewline < 30 ? code.slice(firstNewline + 1) : code;
          return (
            <pre
              key={i}
              className="bg-[#1A1A1C] border border-[#2A2A2C] rounded-lg p-4 overflow-x-auto text-sm font-mono text-gray-300 leading-relaxed"
            >
              <code>{content.trim()}</code>
            </pre>
          );
        }
        return part ? (
          <p key={i} className="whitespace-pre-wrap">{part}</p>
        ) : null;
      })}
    </div>
  );
}
