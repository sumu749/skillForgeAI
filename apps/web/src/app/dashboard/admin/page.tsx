"use client";

import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { api } from "@/lib/api";

export default function AdminOverviewPage() {
  const { data: stats } = useQuery({
    queryKey: ["admin-stats"],
    queryFn: async () => {
      const res = await api.get("/courses/stats");
      return res.data;
    },
  });

  return (
    <div>
      <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
      <p className="text-muted-foreground mb-8">Platform management overview</p>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Total Courses", value: stats?.totalCourses },
          { label: "Total Reviews", value: stats?.totalReviews },
          { label: "Active Students", value: stats?.totalStudents?.toLocaleString() },
          { label: "Avg Rating", value: stats?.avgRating?.toFixed(1) },
        ].map((item) => (
          <Card key={item.label}>
            <CardContent className="p-6">
              <p className="text-sm text-muted-foreground">{item.label}</p>
              <p className="text-2xl font-bold">{item.value ?? "—"}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-2">Event</th>
                  <th className="text-left py-3 px-2">User</th>
                  <th className="text-left py-3 px-2">Date</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { event: "New enrollment", user: "Jordan Lee", date: "Jun 20, 2026" },
                  { event: "Course review submitted", user: "Priya Sharma", date: "Jun 19, 2026" },
                  { event: "AI chat session", user: "Michael Torres", date: "Jun 18, 2026" },
                  { event: "Certificate earned", user: "Emily Watson", date: "Jun 17, 2026" },
                ].map((row) => (
                  <tr key={row.date + row.user} className="border-b last:border-0">
                    <td className="py-3 px-2">{row.event}</td>
                    <td className="py-3 px-2">{row.user}</td>
                    <td className="py-3 px-2 text-muted-foreground">{row.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
