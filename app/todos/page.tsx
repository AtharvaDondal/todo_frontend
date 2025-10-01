"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { toast, ToastContainer } from "react-toastify";

import "react-toastify/dist/ReactToastify.css";
import Link from "next/link";

interface Todo {
  _id: string;
  title: string;
  description: string;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function TodosPage() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const [editingId, setEditingId] = useState<string | null>(null);

  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const [loading, setLoading] = useState(true);

  const router = useRouter();

  useEffect(() => {
    const fetchTodos = async () => {
      try {
        const res = await fetch(`${API_URL}/api/v1/todo`, {
          method: "GET",
          credentials: "include",
        });
        const data = await res.json();
        setLoading(false);
        if (Array.isArray(data.todos)) {
          setTodos(data.todos);
        } else {
          console.error("Invalid todos format:", data);
        }
      } catch (error) {
        console.error("Error fetching todos:", error);
      }
    };
    fetchTodos();
  }, []);

  useEffect(() => {
    const verifyAuth = async () => {
      const authStatus = await checkAuth();
      setIsLoggedIn(authStatus);
    };
    verifyAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const res = await fetch(`${API_URL}/api/auth/check-auth`, {
        method: "GET",
        credentials: "include",
      });

      const data = await res.json();
      return res.ok && data.success;
    } catch (error) {
      console.log(error);

      return false;
    }
  };

  const handleAddTodo = async () => {
    if (!isLoggedIn) {
      toast.error("Please login to add Todo.");
      setTimeout(() => {
        router.push("/login");
      }, 1600);
      return;
    }

    if (!title.trim() || !description.trim()) {
      toast.error("All fields are required.");
      return;
    }
    try {
      const res = await fetch(`${API_URL}/api/v1/todo`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, description }),
      });

      // if (res.status === 401) {
      //   toast.error("please login");
      //   router.push("/login");
      //   return;
      // }

      const data = await res.json();
      toast.success(data.message);
      setTodos((prev) => [...prev, data.todo]);
      setTitle("");
      setDescription("");
    } catch (err) {
      console.error("Add todo error:", err);
    }
  };

  const handleDelete = async (id: string) => {
    // if (!checkAuth()) return;

    if (!isLoggedIn) {
      toast.error("Please login to delete Todo.");
      setTimeout(() => {
        router.push("/login");
      }, 1600);
      return;
    }

    try {
      const res = await fetch(`${API_URL}/api/v1/todo/${id}`, {
        method: "DELETE",
        credentials: "include",
      });

      // if (res.status === 401) {
      //   toast.error("Please login to delete Todo");
      //   router.push("/login");
      //   return;
      // }
      const data = await res.json();
      toast.success(data.message);

      if (res.ok) {
        setTodos((prev) => prev.filter((todo) => todo._id !== id));
      }
    } catch (err) {
      console.error("Delete todo error:", err);
    }
  };

  const handleEditClick = (id: string, currentTitle: string) => {
    // if (!checkAuth()) return; // Prevent unauthorized actions

    if (!isLoggedIn) {
      toast.error("Please login to edit Todo.");
      setTimeout(() => {
        router.push("/login");
      }, 1600);
      return;
    }

    setEditingId(id);
    setTitle(currentTitle);
  };

  const handleSave = async (id: string) => {
    try {
      const res = await fetch(`${API_URL}/api/v1/todo/${id}`, {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title }),
      });

      const data = await res.json();
      toast.success(data.message);

      // if (res.status === 401) {
      //   toast.error("Please login to Edit Todo.");
      //   router.push("/login");
      //   return;
      // }

      if (res.ok) {
        setTodos((prev) =>
          prev.map((todo) => (todo._id === id ? { ...todo, title } : todo))
        );
        setEditingId(null);
        setTitle("");
      }
    } catch (err) {
      console.error("Edit todo error:", err);
    }
  };

  const handleLogout = async () => {
    try {
      const res = await fetch(`${API_URL}/api/auth/logout`, {
        method: "GET",
        credentials: "include",
      });

      const data = await res.json();

      if (res.ok) {
        toast.success(`✅ ${data.message}`);
        router.push("/login");
      } else {
        toast.error(`⚠️ ${data.message}`);
      }
    } catch (error) {
      console.log(error);

      toast.error("❌ Logout failed. Please try again.");
    }
  };

  return (
    <>
      {/* <ToastContainer position="top-center" autoClose={3000} />
    <Button onClick={() => toast.success("✅ This is a test toast!")}>
      Show Toast
    </Button> */}
      <ToastContainer position="top-center" autoClose={3000} />
      <div className="flex gap-5 bg-gray-100 px-9 py-5">
        {isLoggedIn && (
          <Button
            onClick={handleLogout}
            className="text-white bg-gradient-to-r from-cyan-400 via-cyan-500 to-cyan-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-cyan-300 dark:focus:ring-cyan-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 cursor-pointer"
          >
            Logout
          </Button>
        )}

        {!isLoggedIn && (
          <>
            <Link href={"/login"}>
              <Button className="text-white bg-gradient-to-r from-cyan-400 via-cyan-500 to-cyan-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-cyan-300 dark:focus:ring-cyan-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 cursor-pointer">
                Login
              </Button>
            </Link>
            <Link href={"/register"}>
              <Button className="text-white bg-gradient-to-r from-cyan-400 via-cyan-500 to-cyan-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-cyan-300 dark:focus:ring-cyan-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 cursor-pointer">
                Register
              </Button>
            </Link>
          </>
        )}
      </div>
      <div className="flex flex-col justify-around">
        <div className="flex flex-col items-center bg-gray-100">
          <h1 className="text-5xl font-bold text-center mb-10 text-gray-800">
            📝 Your Todos
          </h1>

          <Card className=" flex flex-col shadow-xl border border-gray-200 bg-white rounded-lg w-full max-w-2xl  items-center py-8 px-6">
            <CardContent className="space-y-6 w-full flex flex-col items-center">
              <Input
                className="text-xl py-6 px-6 w-full border border-gray-300 rounded-md text-center"
                placeholder="Enter title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
              <Textarea
                className="text-xl py-6 px-6 w-full min-h-[200px] border border-gray-300 rounded-md text-center mt-4"
                placeholder="Enter description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
              <Button
                onClick={handleAddTodo}
                className="w-full py-6 text-xl bg-blue-500 text-white rounded-md transition hover:bg-blue-600 mt-6 shadow-md cursor-pointer"
              >
                ➕ Add Todo
              </Button>
            </CardContent>
          </Card>

          {loading ? (
            // Show loader while fetching data
            <div className="flex justify-center items-center h-40">
              <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : todos.length === 0 ? (
            <p className="text-center text-gray-500 text-xl mt-10">
              No todos found
            </p>
          ) : (
            <div className="space-y-6 w-full flex flex-col items-center mt-10">
              {todos.map((todo) => (
                <Card
                  key={todo._id}
                  className="shadow-md border border-gray-100 flex flex-col items-center p-8 bg-gray-50 rounded-lg w-full max-w-2xl"
                >
                  <CardContent className="py-6 px-6 flex flex-col items-center gap-6">
                    <div className="text-center">
                      {editingId === todo._id ? (
                        <Input
                          className="text-xl py-4 px-6 border border-gray-300 rounded-md text-center"
                          value={title}
                          onChange={(e) => setTitle(e.target.value)}
                        />
                      ) : (
                        <h2 className="text-3xl font-semibold text-gray-900">
                          {todo.title}
                        </h2>
                      )}
                      <p className="text-gray-600 mt-2 text-xl">
                        {todo.description}
                      </p>
                    </div>

                    <div className="flex gap-6">
                      {editingId === todo._id ? (
                        <Button
                          className="text-xl px-6 py-4 bg-blue-500 text-white rounded-md hover:bg-blue-600 cursor-pointer"
                          onClick={() => handleSave(todo._id)}
                        >
                          💾 Save
                        </Button>
                      ) : (
                        <Button
                          className="text-xl px-6 py-4 bg-green-500 text-white rounded-md hover:bg-green-600 cursor-pointer"
                          onClick={() => handleEditClick(todo._id, todo.title)}
                        >
                          ✏️ Edit
                        </Button>
                      )}
                      <Button
                        className="text-xl px-6 py-4 bg-red-500 text-white rounded-md hover:bg-red-600 cursor-pointer"
                        onClick={() => handleDelete(todo._id)}
                      >
                        🗑️ Delete
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
