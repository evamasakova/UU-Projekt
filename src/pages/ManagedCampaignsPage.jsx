import React, { useState } from "react";
import { Link } from "react-router-dom";

import GoBackButton from "../components/buttons/GoBackButton.jsx";
import PrimaryButton from "../components/buttons/PrimaryButton.jsx";

export default function ManagedCampaignsPage() {
    const [projectId, setProjectId] = useState("666");

    return (
        <div className="mx-auto w-full max-w-7xl px-4 py-10">
            <GoBackButton />
            <h3 className="text-2xl font-semibold mr-6">Managed Campaigns</h3>
            <p className="mb-6">In dev. Coming soon!</p>

            <div className="rounded-md border border-gray-200 bg-white p-6 shadow-sm max-w-xl">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Project ID
                </label>

                <input
                    value={projectId}
                    onChange={(e) => setProjectId(e.target.value)}
                    placeholder="e.g. 690b6710c001cd0566cf85a8"
                    className="mb-4 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
                />

                <Link to={`/campaign-admin/${encodeURIComponent(projectId)}`}>
                    <PrimaryButton>Go to managed campaign</PrimaryButton>
                </Link>

                <p className="mt-3 text-xs text-gray-500">
                    Tip: vlož sem reálné ID projektu z backendu a otevři edit stránku.
                </p>
            </div>
    </div>
  );
}
