


// Stats Component
const StatsCard: React.FC<{ 
  icon: React.ReactNode; 
  label: string; 
  value: string | number; 
  color: string;
}> = ({ icon, label, value, color }) => {
  return (
    <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm hover:shadow-md transition-shadow duration-200">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600 mb-1">{label}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
        </div>
        <div className={`p-3 rounded-xl ${color}`}>
          {icon}
        </div>
      </div>
    </div>
  );
};
export default StatsCard;