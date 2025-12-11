const token = localStorage.getItem("authToken");

export const fetchProjects = async () => {
  const req = await fetch( "/projects", {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    method: "GET",
    credentials: "include",
  });
  const data = await req.json();

  // Simple temporary log to verify the API result — remove this line later
  console.log("fetchProjects result:", { status: req.status, payload: data.payload, msg: data.msg });

  return {
    status: req.status,
    payload: data.payload,
    msg: data.msg,
  };
};
