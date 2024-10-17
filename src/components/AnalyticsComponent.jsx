import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const AnalyticsComponent = () => {
  const analyticsData = [
    { name: "Mon", clicks: 120 },
    { name: "Tue", clicks: 150 },
    { name: "Wed", clicks: 180 },
    { name: "Thu", clicks: 190 },
    { name: "Fri", clicks: 210 },
    { name: "Sat", clicks: 170 },
    { name: "Sun", clicks: 140 },
  ];

  // Sample data for unique visitors and device types
  const uniqueVisitorsData = [
    { name: "Desktop", value: 400 },
    { name: "Mobile", value: 300 },
    { name: "Tablet", value: 200 },
  ];

  const COLORS = ["#3b82f6", "#6ee7b7", "#fbbf24"];

  return (
    <>
      <Card className="rounded-2xl border border-blue-800/25 mb-6">
        <CardHeader>
          <CardTitle>Click Analytics</CardTitle>
          <CardDescription>
            Click performance over the last 7 days
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={analyticsData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="clicks"
                  stroke="#3b82f6"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card className="rounded-2xl border border-blue-800/25 mb-6">
        <CardHeader>
          <CardTitle>Device Type Analytics</CardTitle>
          <CardDescription>
            Distribution of visits by device type
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={uniqueVisitorsData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                  outerRadius={80}
                  fill="#8884d8"
                >
                  {uniqueVisitorsData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Add more analytics components as needed, like referrer analytics, etc. */}
    </>
  );
};

export default AnalyticsComponent;
