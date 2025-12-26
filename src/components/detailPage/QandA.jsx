import React, { useState } from "react";
import { useApi } from "../../api/apiClient.js";

export default function QandA({ id }) {
  const api = useApi();

  const [campaignData, setCampaignData] = useState({
    content: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const result = await api(`/projects/${id}/comments`, {
        method: "POST",
        body: campaignData,
      });

      console.log("Backend response:", result);

      setCampaignData({ content: "" });

    } catch (error) {
      console.error("Error submitting question:", error);
      throw error;
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto border rounded-xl p-6 bg-white shadow-sm">
      <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
        <span>💬</span> Questions & Answers
      </h2>

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <textarea
            placeholder="Ask a question..."
            className="w-full border rounded-lg p-3 h-20 focus:outline-none focus:ring focus:ring-purple-300"
            value={campaignData.content}
            onChange={(e) =>
              setCampaignData({ content: e.target.value })
            }
          />
        </div>

        <button
          type="submit"
          className="bg-purple-600 text-white px-5 py-2 rounded-lg hover:bg-purple-700 transition"
        >
          Post Question
        </button>
      </form>

      <div className="mt-6 border-t pt-4">
        <div className="mb-4">
          <p className="font-semibold">Eva</p>
          <p className="text-sm text-gray-500">22/10/2025</p>
          <p className="mt-1">A proc ne redbull?</p>
        </div>
      </div>
    </div>
  );
}
