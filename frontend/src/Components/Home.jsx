import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { UserDataContext } from "../context/UserContext";
import { ToastContainer, toast } from "react-toastify";

const Home = () => {
  const [agents, setAgents] = useState([]);
  const [file, setFile] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [agentInfo, setAgentInfo] = useState({
    name: "",
    email: "",
    mobile: "",
    password: "",
  });
  const [editAgentId, setEditAgentId] = useState(null);

  const { userData, setUserData, serverUrl } = useContext(UserDataContext);
  const navigate = useNavigate();

  // ✅ Fetch agents
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`${serverUrl}/api/agent/getAgents`, {
          withCredentials: true,
        });
        setAgents(res.data.agents);
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, [serverUrl]);

  // ✅ Logout
  const handleLogout = async () => {
    try {
      await axios.post(`${serverUrl}/api/auth/logout`, {}, { withCredentials: true });
      setUserData(null);
      navigate("/login");
    } catch (err) {
      console.error(err);
    }
  };

  //  Open edit modal with current agent info
  const openEditModal = (agent) => {
    setAgentInfo({
      name: agent.name,
      email: agent.email,
      mobile: agent.mobile,
      
    });
    setEditAgentId(agent._id);
    setIsEditModalOpen(true);
  };

  //  Add new agent
  const handleAddAgent = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${serverUrl}/api/agent/addAgent`, agentInfo, {
        withCredentials: true,
      });
      if (res.data.success) {
        toast.success(res.data.message);
        setIsAddModalOpen(false);
        setAgentInfo({ name: "", email: "", mobile: "", password: "" });
        setAgents((prev) => [...prev, res.data.agent]);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Error adding agent");
    }
  };

  //  Edit agent
  const handleEditAgent = async (e) => {
    e.preventDefault();
    try {
      const { name, email, mobile } = agentInfo;
      const id=editAgentId
      const res = await axios.put(
        `${serverUrl}/api/agent/editAgent/${id}`,
        { name, email, mobile },
        { withCredentials: true }
      );
      if (res.data.success) {
        toast.success(res.data.message);
        setIsEditModalOpen(false);
        setEditAgentId(null);
        setAgents((prev) =>
          prev.map((a) => (a._id === editAgentId ? res.data.agent : a))
        );
      }
    } catch (err) {
        setIsEditModalOpen(false);
      toast.error(err.response?.data?.message || "Error updating agent");
    }
  };

  // ✅ Delete agent
  const handleDeleteAgent = async (id) => {
    if (!window.confirm("Are you sure you want to delete this agent?")) return;
    try {
      const res = await axios.delete(`${serverUrl}/api/agent/deleteAgent/${id}`, {
        withCredentials: true,
      });
      if (res.data.success) {
        toast.success(res.data.message);
        setAgents((prev) => prev.filter((a) => a._id !== id));
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Error deleting agent");
    }
  };

  // CSV Upload
  const handleFileChange = (e) => setFile(e.target.files[0]);
  const handleUpload = async () => {
    if (!file) return toast.error("Please select a CSV file");
    const formData = new FormData();
    formData.append("file", file);
    try {
      const res = await axios.post(`${serverUrl}/api/agent/uploadAndDistribute`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      });
      toast.success(res.data.message);
      setAgents(res.data.agents);
      setFile(null);
    } catch (err) {
      toast.error(err.response?.data?.message || "Upload failed");
      setFile(null);
    }
  };

  const handleChange = (e) =>
    setAgentInfo({ ...agentInfo, [e.target.name]: e.target.value });

  const handleAgentDetails = (agentId) => navigate(`/agent/${agentId}`);

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <h1 className="text-lg font-semibold">Welcome back {userData?.name}</h1>
        <button onClick={handleLogout} className="bg-red-500 text-white px-4 py-2 rounded">
          Logout
        </button>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4 mb-6">
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          onClick={() => setIsAddModalOpen(true)}
        >
          Add Agent
        </button>
        <input
          type="file"
          accept=".csv,.xlsx,.xls"
          onChange={handleFileChange}
          className="border p-1 rounded"
        />
        <button
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          onClick={handleUpload}
        >
          Upload & Distribute Tasks
        </button>
      </div>

      {/* Agents Table */}
      <div className="bg-white rounded shadow overflow-x-auto">
        <table className="min-w-full table-auto border-collapse border border-gray-300">
          <thead className="bg-gray-200">
            <tr>
              <th className="px-4 py-2 border">Name</th>
              <th className="px-4 py-2 border">Email</th>
              <th className="px-4 py-2 border">Mobile</th>
              <th className="px-4 py-2 border">Items</th>
              <th className="px-4 py-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {agents.map((agent) => (
              <tr key={agent._id} className="hover:bg-gray-100">
                <td
                  className="px-4 py-2 border cursor-pointer"
                  onClick={() => handleAgentDetails(agent._id)}
                >
                  {agent.name}
                </td>
                <td className="px-4 py-2 border">{agent.email}</td>
                <td className="px-4 py-2 border">{agent.mobile}</td>
                <td className="px-4 py-2 border">{agent.Items.length}</td>
                <td className="px-4 py-2 border space-x-2">
                  <button
                    onClick={() => openEditModal(agent)}
                    className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteAgent(agent._id)}
                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add Agent Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-96">
            <h2 className="text-xl font-bold mb-4">Add Agent</h2>
            <form onSubmit={handleAddAgent} className="space-y-3">
              <input name="name" placeholder="Name" onChange={handleChange} className="w-full p-2 border rounded" required />
              <input name="email" placeholder="Email" onChange={handleChange} className="w-full p-2 border rounded" required />
              <input name="mobile" placeholder="+91 9876543210" onChange={handleChange} className="w-full p-2 border rounded" required />
              <input name="password" type="password" placeholder="Password" onChange={handleChange} className="w-full p-2 border rounded" required />
              <div className="flex justify-end gap-2">
                <button type="button" onClick={() => setIsAddModalOpen(false)} className="px-4 py-2 bg-gray-300 rounded">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded">Add</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Agent Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-96">
            <h2 className="text-xl font-bold mb-4">Edit Agent</h2>
            <form onSubmit={handleEditAgent} className="space-y-3">
              <input name="name" value={agentInfo.name} onChange={handleChange} className="w-full p-2 border rounded" required />
              <input name="email" value={agentInfo.email} onChange={handleChange} className="w-full p-2 border rounded" required />
              <input name="mobile" value={agentInfo.mobile} onChange={handleChange} className="w-full p-2 border rounded" required />
              <div className="flex justify-end gap-2">
                <button type="button" onClick={() => setIsEditModalOpen(false)} className="px-4 py-2 bg-gray-300 rounded">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-yellow-500 text-white rounded">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ToastContainer />
    </div>
  );
};
export default Home;
