interface MessageDisplayProps {
  message: string;
}

export default function MessageDisplay({ message }: MessageDisplayProps) {
  return (
    <div className="border-t border-gray-700 pt-6">
      <p className="text-xl md:text-2xl">{message}</p>
      <div className="mt-2 h-4 w-3 bg-[hsl(var(--terminal-accent))] inline-block animate-pulse"></div>
    </div>
  );
}
