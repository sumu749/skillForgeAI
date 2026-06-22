import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const users = [
  { name: "Jordan Lee", email: "jordan@example.com", role: "student", joined: "Jan 2026" },
  { name: "Priya Sharma", email: "priya@example.com", role: "student", joined: "Feb 2026" },
  { name: "Admin User", email: "admin@skillforge.ai", role: "admin", joined: "Dec 2025" },
  { name: "Emily Watson", email: "emily@example.com", role: "student", joined: "Mar 2026" },
  { name: "Chris Anderson", email: "chris@example.com", role: "student", joined: "Apr 2026" },
];

export default function AdminUsersPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-2">Users</h1>
      <p className="text-muted-foreground mb-8">Manage platform users and roles</p>

      <Card>
        <CardHeader>
          <CardTitle>Registered Users</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-2">Name</th>
                  <th className="text-left py-3 px-2">Email</th>
                  <th className="text-left py-3 px-2">Role</th>
                  <th className="text-left py-3 px-2">Joined</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.email} className="border-b last:border-0">
                    <td className="py-3 px-2 font-medium">{user.name}</td>
                    <td className="py-3 px-2">{user.email}</td>
                    <td className="py-3 px-2 capitalize">{user.role}</td>
                    <td className="py-3 px-2 text-muted-foreground">{user.joined}</td>
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
