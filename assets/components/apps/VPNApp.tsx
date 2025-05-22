import AppBase from './AppBase';

interface VPNAppProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function VPNApp({ isOpen, onClose }: VPNAppProps) {
  return (
    <AppBase
      isOpen={isOpen}
      onClose={onClose}
      title="VPN"
      icon="🔒"
      width={900}
      height={600}
      initialPosition={{ x: 200, y: 70 }}
    >
      <div className="h-full flex flex-col">
        <iframe 
          src="https://ultrastatic.pages.dev/" 
          className="w-full h-full border-0"
          title="VPN Service"
          sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
        />
      </div>
    </AppBase>
  );
}