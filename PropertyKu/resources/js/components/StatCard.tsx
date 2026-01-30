type StatVariant = "success" | "warning" | "info" | "neutral";

interface StatCardProps {
  title: string;
  value: string | number;
  variant?: StatVariant;
}

const variantStyle: Record<StatVariant, string> = {
  success: "bg-green-50 text-green-700",
  warning: "bg-yellow-50 text-yellow-700",
  info: "bg-blue-50 text-blue-700",
  neutral: "bg-gray-50 text-gray-700",
};

export default function StatCard({
  title,
  value,
  variant = "neutral",
}: StatCardProps) {
  return (
    <div
      className={`rounded-xl p-5 shadow-sm transition hover:shadow-md ${variantStyle[variant]}`}
    >
      <p className="text-sm text-gray-500">{title}</p>
      <h2 className="text-2xl font-bold mt-1">{value}</h2>
    </div>
  );
}
