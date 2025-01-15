"use client";
import { useEffect, useState } from "react";
import {
  getFirestore,
  collection,
  getDocs,
  query,
  where,
  doc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import { app } from "../../../../lib/firebaseConfig";

type User = {
  uid: string;
  email: string;
  name: string | null;
  role: string;
};

const UsersPage = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      const db = getFirestore(app);
      const usersCollection = collection(db, "users");
      const q = query(usersCollection, where("role", "==", "siswa"));

      const querySnapshot = await getDocs(q);
      const fetchedUsers: User[] = [];

      querySnapshot.forEach((doc) => {
        const userData = doc.data();
        fetchedUsers.push({
          uid: doc.id,
          email: userData.email,
          name: userData.name || "-",
          role: userData.role || "siswa",
        });
      });

      setUsers(fetchedUsers);
      setLoading(false);
    };

    fetchUsers();
  }, []);

  const handleDelete = async (uid: string) => {
    const db = getFirestore(app);
    await deleteDoc(doc(db, "users", uid));
    setUsers(users.filter((user) => user.uid !== uid));
  };

  const handleEdit = async () => {
    if (editingUser) {
      const db = getFirestore(app);
      const userRef = doc(db, "users", editingUser.uid);
      await updateDoc(userRef, {
        name: editingUser.name,
        email: editingUser.email,
      });
      setUsers((prev) =>
        prev.map((user) => (user.uid === editingUser.uid ? editingUser : user))
      );
      setEditingUser(null);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="md:pl-[270px] pt-16 p-8 w-full overflow-x-auto">
      <h1 className="text-2xl font-bold mb-4 text-center">
        Daftar Siswa/Siswi
      </h1>
      <div className="overflow-x-auto">
        <table className="w-full table-auto border-collapse text-sm md:text-base">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-2">UID</th>
              <th className="border p-2">Email</th>
              <th className="border p-2">Nama</th>
              <th className="border p-2">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.uid} className="hover:bg-gray-50">
                <td className="border p-2 break-words">{user.uid}</td>
                <td className="border p-2 break-words">
                  {editingUser?.uid === user.uid ? (
                    <input
                      className="w-full border rounded p-1"
                      value={editingUser.email}
                      onChange={(e) =>
                        setEditingUser({
                          ...editingUser,
                          email: e.target.value,
                        })
                      }
                    />
                  ) : (
                    user.email
                  )}
                </td>
                <td className="border p-2 break-words">
                  {editingUser?.uid === user.uid ? (
                    <input
                      className="w-full border rounded p-1"
                      value={editingUser.name ?? ""}
                      onChange={(e) =>
                        setEditingUser({ ...editingUser, name: e.target.value })
                      }
                    />
                  ) : (
                    user.name
                  )}
                </td>

                <td className="border p-2 flex flex-col md:flex-row gap-2">
                  {editingUser?.uid === user.uid ? (
                    <button
                      onClick={handleEdit}
                      className="bg-green-500 text-white px-2 py-1 rounded w-full md:w-auto"
                    >
                      Simpan
                    </button>
                  ) : (
                    <button
                      onClick={() => setEditingUser(user)}
                      className="bg-yellow-500 text-white px-2 py-1 rounded w-full md:w-auto"
                    >
                      Edit
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(user.uid)}
                    className="bg-red-500 text-white px-2 py-1 rounded w-full md:w-auto"
                  >
                    Hapus
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UsersPage;
