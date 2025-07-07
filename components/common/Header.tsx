import { ArrowLeft } from "lucide-react";



const Header: React.FC<{ 
  title: string; 
  subtitle?: string; 
  actions?: React.ReactNode; 
  showBackButton?: boolean;
  onBack?: () => void;
}> = ({ title, subtitle, actions, showBackButton, onBack }) => {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 mb-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          {showBackButton && (
            <button
              onClick={onBack}
              className="p-3 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-xl transition-all duration-200"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
          )}
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-1">{title}</h1>
            {subtitle && <p className="text-gray-600">{subtitle}</p>}
          </div>
        </div>
        {actions && <div className="flex items-center gap-3">{actions}</div>}
      </div>
    </div>
  );
};
export default Header;
