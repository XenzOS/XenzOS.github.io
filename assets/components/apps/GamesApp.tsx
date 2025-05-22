import AppBase from './AppBase';

interface GamesAppProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function GamesApp({ isOpen, onClose }: GamesAppProps) {
  return (
    <AppBase
      isOpen={isOpen}
      onClose={onClose}
      title="Games"
      icon="🎮"
      width={900}
      height={700}
      initialPosition={{ x: 150, y: 50 }}
    >
      <div className="h-full flex flex-col">
        <iframe 
          src="https://basketballstarsonline.github.io/" 
          className="w-full h-full border-0"
          title="Basketball Stars"
          sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
        />
      </div>
    </AppBase>
  );
}