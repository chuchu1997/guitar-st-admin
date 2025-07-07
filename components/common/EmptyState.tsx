import { MessageSquare, Plus } from "lucide-react";




interface Props  { 
    onCreateNew: () => void;
    title:string;
    description: string;
    icon?: React.ReactNode;
    action:string;

}

// Empty State Component
const EmptyState: React.FC<Props> = ({ onCreateNew,title,description,icon,action }) => {
  return (
    <div className="p-16 text-center">
      <div className="mb-6">
        <div className="w-24 h-24 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-4">
          
          {icon ??<MessageSquare className="w-12 h-12 text-gray-400" /> }
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
        <p className="text-gray-500 max-w-md mx-auto">
            {description }
        </p>
      </div>
      <button
        onClick={onCreateNew}
        className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 flex items-center gap-2 mx-auto shadow-lg hover:shadow-xl"
      >
        <Plus className="w-5 h-5" />
       {action}
      </button>
    </div>
  );
};


export default EmptyState;