import { useState } from "react";
import { TokenLogin } from "@/components/client-portal/TokenLogin";
import { ClientDashboard } from "@/components/client-portal/ClientDashboard";

export default function ClientPortal() {
  const [authenticated, setAuthenticated] = useState(() => {
    return sessionStorage.getItem("client_auth") === "true";
  });

  const handleLogout = () => {
    sessionStorage.removeItem("client_auth");
    sessionStorage.removeItem("nexus_client_token_id");
    sessionStorage.removeItem("nexus_client_name");
    setAuthenticated(false);
  };

  if (!authenticated) {
    return <TokenLogin onAuth={() => setAuthenticated(true)} />;
  }

  return <ClientDashboard onLogout={handleLogout} />;
}
