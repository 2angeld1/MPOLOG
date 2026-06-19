interface StatsCardProps {
  icon: string;
  label: string;
  value: string | number;
  trend?: { value: string; direction: 'up' | 'down' };
  color?: 'gold' | 'purple' | 'green' | 'blue';
}

export default function StatsCard({ icon, label, value, trend, color = 'gold' }: StatsCardProps) {
  return (
    <div className="stat-card">
      <div className={`stat-icon ${color}`}>{icon}</div>
      <div className="stat-content">
        <div className="stat-label">{label}</div>
        <div className="stat-value">{value}</div>
        {trend && (
          <div className={`stat-trend ${trend.direction}`}>
            {trend.direction === 'up' ? '↑' : '↓'} {trend.value}
          </div>
        )}
      </div>
    </div>
  );
}
