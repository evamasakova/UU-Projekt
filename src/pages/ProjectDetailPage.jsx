import React from "react";
import ProjectDetail from "../components/ProjectDetail.jsx";



export default function ProjectDetailPage() {

    const sample = {
        _id: "690b6710c001cd0566cf85a8",
        name: "Název projektu",
        description: "Krátký popis projektu.",
        ownerId: "owner_123",
        creationDate: "2025-11-05T15:02:40.949Z",
        lastUpdatedDate: "2025-11-05T15:02:40.949Z",
        goalAmount: 20,
        deadLine: "2025-12-01T14:51:54.670Z",
        status: "PendingApproval",
        raisedAmount: 7,
    };

    return (
        <div>
            <ProjectDetail project={sample} />
        </div>
    );
}
