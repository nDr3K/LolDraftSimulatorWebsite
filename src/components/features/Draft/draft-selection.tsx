import { Role } from "@/types/role";
import {useState} from "react";

export default function DraftSelection({
  onRoleSelect,
  onSearchChange,
}: {
  onRoleSelect: (role: Role | null) => void;
  onSearchChange: (search: string) => void;
}) {
  const roles: Role[] = ['top', 'jungle', 'mid', 'bot', 'support'];
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);

  const handleRoleClick = (role: Role) => {
    const newRole = selectedRole === role ? null : role;
    setSelectedRole(newRole);
    onRoleSelect(newRole);
  };
  
  return (
    <div className="grid grid-cols-[70%_30%] gap-2 m-4">
      <div className="flex gap-2">
        {roles.map((role) => (
          <div
            key={role}
            onClick={() => handleRoleClick(role)}
            className={`w-8 h-8 flex items-center justify-center brightness-75 transition duration-200 hover:cursor-pointer ${
              selectedRole === role
                ? 'brightness-125 drop-shadow-lg'
                : 'hover:brightness-125 hover:drop-shadow-lg'
            }`}
          >
            <img
              src={`src/assets/position-${role}.png`}
              alt={`${role} position`}
            />
          </div>
        ))}
      </div>
      <div className="me-10">
        <input
          type="text"
          placeholder="Search champions..."
          className="w-full bg-zinc-800 text-white rounded px-4 py-1 focus:outline-none focus:ring-1 focus:ring-amber-500"
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
    </div>
  )
}