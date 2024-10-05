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

  return (
    <>
      <Card className="rounded-2xl border border-blue-800/25">
        <CardHeader>
          <CardTitle>Analytics</CardTitle>
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
    </>
  );
};

export default AnalyticsComponent;
