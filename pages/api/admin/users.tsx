// /pages/admin/users.tsx
import { useEffect, useState } from "react";

interface User {
  id: string;
  email: string;
  role: string;
  full_name: string;
}

export default function AdminUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    setLoading(true);
    const res = await fetch("/api/users/roles");
    const data = await res.json();
    setUsers(data);
    setLoading(false);
  };

  const changeRole = async (userId: string, role: string) => {
    const res = await fetch("/api/users/roles", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, role }),
    });
    const data = await res.json();
    if (!res.ok) alert(data.error);
    else fetchUsers();
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Gerenciar Usuários</h1>
      {loading ? (
        <p>Carregando...</p>
      ) : (
        <table className="w-full border">
          <thead>
            <tr>
              <th>Email</th>
              <th>Nome</th>
              <th>Role</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="border-t">
                <td>{user.email}</td>
                <td>{user.full_name}</td>
                <td>{user.role}</td>
                <td>
                  <button
                    className="bg-green-500 text-white px-2 py-1 rounded"
                    onClick={() => changeRole(user.id, "barber")}
                  >
                    Tornar Barbeiro
                  </button>
                  <button
                    className="bg-blue-500 text-white px-2 py-1 rounded ml-2"
                    onClick={() => changeRole(user.id, "admin")}
                  >
                    Tornar Admin
                  </button>
                  <button
                    className="bg-gray-500 text-white px-2 py-1 rounded ml-2"
                    onClick={() => changeRole(user.id, "cliente")}
                  >
                    Tornar Cliente
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
