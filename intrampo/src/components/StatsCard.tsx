interface StatsCardProps {
  icon: string;
  label: string;
  value: string | number;
  trend?: { value: string; direction: 'up' | 'down' };
  color?: 'gold' | 'purple' | 'green' | 'blue';
}

export default function StatsCard({ icon, label, value, trend, color = 'gold' }: StatsCardProps) {
  const colorMap = {
    gold: 'bg-amber-500/10 text-amber-500',
    purple: 'bg-purple-500/10 text-purple-500',
    green: 'bg-green-500/10 text-green-500',
    blue: 'bg-blue-500/10 text-blue-500'
  };

  return (
    <div className="bg-[#1a1c25] border border-white/10 rounded-2xl p-6 flex items-start gap-4 transition-all duration-300 relative overflow-hidden group hover:border-white/20 hover:shadow-lg hover:-translate-y-0.5">
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-amber-400 to-amber-600 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 text-xl ${colorMap[color]}`}>
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-xs text-gray-400 font-medium uppercase tracking-wider mb-1">{label}</div>
        <div className="font-display text-3xl font-bold text-gray-100 leading-tight">{value}</div>
        {trend && (
          <div className={`text-xs font-semibold mt-1 flex items-center gap-1 ${trend.direction === 'up' ? 'text-green-500' : 'text-red-500'}`}>
            {trend.direction === 'up' ? '↑' : '↓'} {trend.value}
          </div>
        )}
      </div>
    </div>
  );
}
