import React from "react";
import { useParams } from "react-router-dom";
import GoBackButton from "../components/buttons/GoBackButton.jsx";
import ProjectUpdateForm from "../components/adminPanel/ProjectUpdateForm.jsx";

export default function DetailPage() {
    const { id } = useParams();

    const mockProject = {
        _id: id,
        name: "Demo projekt",
        description: "Toto je ukázkový projekt, dokud neběží backend API.",
        ownerId: "owner-123",
        creationDate: "2025-11-05T15:02:40.949Z",
        lastUpdatedDate: "2025-11-05T15:02:40.949Z",
        goalAmount: 20,
        deadLine: "2025-11-05T14:51:54.670Z",
        status: "PendingApproval",
    };

    return (
        <div style={{ padding: 16 }}>
            <GoBackButton />
            <h1>Detail projektu – {id}</h1>
            <ProjectUpdateForm project={mockProject} />
        </div>
    );
}
