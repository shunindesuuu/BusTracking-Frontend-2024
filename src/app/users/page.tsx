"use client"
import ProtectedComponent from '@/components/ui/ProtectedComponent'
import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import React, { useEffect, useState } from 'react'

const Users = () => {
  // const { data: session, status } = useSession();

  // if (status === 'loading') {
  //   return null;
  // }
  // if (!session) {
  //   redirect('/login');
  // }
  // if (session.user?.role !== 'admin') {
  //   redirect('/');
  // }
  interface User {
    id: string;
    name: string;
    email: string;
    role: string;
  }

  const [users, setUsers] = useState<User[]>([])

  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [newRole, setNewRole] = useState<string>("");

  const handleRoleChange = (user: User, newRole: string) => {
    setSelectedUser(user);
    setNewRole(newRole);
    setModalVisible(true);
  };

  const confirmRoleChange = async () => {
    if (selectedUser) {
      try {
        // Send POST request to update role
        const response = await fetch("http://localhost:4000/users/update-role", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id: selectedUser.id,
            role: newRole,
          }),
        });

        if (response.ok) {
          // Update the local state if the role update was successful
          setUsers((prevUsers) =>
            prevUsers.map((user) =>
              user.id === selectedUser.id ? { ...user, role: newRole } : user
            )
          );
          setModalVisible(false);
        } else {
          console.error("Failed to update user role");
        }
      } catch (error) {
        console.error("Error:", error);
      }
    }
  };

  useEffect(() => {

    const fetchUsers = async () => {
      try {
        const response = await fetch('http://localhost:4000/users/index');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const result: User[] = await response.json();
        setUsers(result);
        console.log(result)

      } catch (error) {

      }

    }

    fetchUsers();
  }, [])

  return (
    <ProtectedComponent restrictedRoles={['user, driver']}>
      <div className="flex flex-col justify-center container mx-auto mt-16 p-4 gap-4">
        <table className="min-w-full divide-y divide-gray-200 mt-3">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {users && (
              users.map((user) => {
                return (
                  <tr key={user.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.email}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <select
                        value={user.role}
                        onChange={(e) => handleRoleChange(user, e.target.value)}
                        className="bg-white border border-gray-300 rounded-md text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="user">user</option>
                        <option value="admin">admin</option>
                        <option value="driver">driver</option>
                      </select>
                    </td>
                  </tr>
                )
              })
            )}
          </tbody>
        </table>

        {/* Modal */}
        {modalVisible && selectedUser && (
          <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h2 className="text-lg font-bold">Confirm Role Change</h2>
              <p>
                Are you sure you want to change {selectedUser.name}'s role to{" "}
                <strong>{newRole}</strong>?
              </p>
              <div className="mt-4 flex justify-end space-x-2">
                <button
                  onClick={() => setModalVisible(false)}
                  className="px-4 py-2 bg-gray-300 rounded"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmRoleChange}
                  className="px-4 py-2 bg-blue-600 text-white rounded"
                >
                  Confirm
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </ProtectedComponent>

  )
}

export default Users