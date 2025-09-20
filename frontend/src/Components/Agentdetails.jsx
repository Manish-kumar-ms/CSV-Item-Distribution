import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { UserDataContext } from "../context/UserContext";

const AgentDetails = () => {
  const { id } = useParams(); // get agent id from URL
  const { serverUrl } = useContext(UserDataContext);
  const [agent, setAgent] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAgent = async () => {
      try {
        const res = await axios.get(`${serverUrl}/api/agent/${id}`, { withCredentials: true });
        if (res.data.success) {
          setAgent(res.data.agent);
        } else {
          alert(res.data.message);
          navigate("/home");
        }
      } catch (err) {
        console.error(err);
        alert("Error fetching agent details");
        navigate("/home");
      }
    };
    fetchAgent();
  }, [id, serverUrl, navigate]);

  if (!agent) return <div className="p-6">Loading agent details...</div>;

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-4">{agent.name}'s Details</h1>
      <p><strong>Email:</strong> {agent.email}</p>
      <p><strong>Mobile:</strong> {agent.mobile}</p>
      <p className="mt-4 font-semibold text-lg">Items ({agent.Items.length})</p>

      <div className="mt-2 bg-white shadow rounded p-4">
        {agent.Items.length === 0 ? (
          <p>No items assigned</p>
        ) : (
          <ul className="divide-y divide-gray-200">
            {agent.Items.map((item, index) => (
              <li key={index} className="py-2">
                <p><strong>First Name:</strong> {item.FirstName}</p>
                <p><strong>Phone:</strong> {item.Phone}</p>
                <p><strong>Notes:</strong> {item.Notes || "-"}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default AgentDetails;