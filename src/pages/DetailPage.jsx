import React from "react";
import { useParams } from "react-router-dom";
import GoBackButton from "../components/buttons/GoBackButton.jsx";
import ProjectApprovalPanel from "../components/adminPanel/ProjectApprovalPanel.jsx";

export default function DetailPage() {

  const { id } = useParams();
    // ID projektu z URL /detail/:id


    // MOCK DATA — budou nahrazeny backend voláním, až API poběží
    const mockProject = {
        _id: id,
        name: "Demo projekt",
        description: "Toto je ukázkový projekt, dokud neběží backend API.",
        ownerId: "owner-123",
        creationDate: "2025-11-05T15:02:40.949Z",
        lastUpdatedDate: "2025-11-05T15:02:40.949Z",
        goalAmount: 20,
        deadLine: "2025-11-05T14:51:54.670Z",
        status: "PendingApproval", // TEST: form i approval panel reagují na tento status
    };
  return (
    <div>
      <GoBackButton />
        <ProjectApprovalPanel project={mockProject} />
      <h1>detail of {id}</h1>
    </div>
  );
}
