import React from "react";
import { useAdminData } from "../../hooks/useAdminData";
import { useAuth } from "@/context/AuthContext";
import { UserSearchBox } from "../molecules/UserSearchBox";
import { AdminTable } from "./AdminTable";

export const UserManagement: React.FC = () => {
  const { user: currentUser } = useAuth();
  const { admins, isLoadingAdmins, searchUserMutation, toggleRoleMutation } = useAdminData();

  return (
    <div className="grid gap-6">
      <UserSearchBox searchMutation={searchUserMutation} toggleMutation={toggleRoleMutation} />
      <AdminTable
        admins={admins}
        isLoading={isLoadingAdmins}
        currentUserEmail={currentUser?.email}
        toggleMutation={toggleRoleMutation}
      />
    </div>
  );
};
