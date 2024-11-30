import {Button} from "@/components/ui/button";
import { Role } from "@/types/role";
import { useState } from "react";

export default function DraftSelection({
  onRoleSelect,
  onSearchChange,
  onConfirm,
  state
}: {
  onRoleSelect: (role: Role | null) => void;
  onSearchChange: (search: string) => void;
  onConfirm: () => void;
  state: string;
}) {
  const roles: Role[] = ['top', 'jungle', 'mid', 'bot', 'support'];
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);

  const handleRoleClick = (role: Role) => {
    const newRole = selectedRole === role ? null : role;
    setSelectedRole(newRole);
    onRoleSelect(newRole);
  };
  
  return (
    <div className="grid grid-cols-[25%_50%_25%] m-4">
      <div className="flex gap-2">
        {roles.map((role) => (
          <div
            key={role}
            onClick={() => handleRoleClick(role)}
            className={`w-8 h-8 flex items-center justify-center transition duration-200 hover:cursor-pointer ${
              selectedRole === role
                ? 'brightness-125 drop-shadow-lg'
                : 'brightness-75 hover:brightness-125 hover:drop-shadow-lg'
            }`}
          >
            <img
              src={`src/assets/position-${role}.png`}
              alt={`${role} position`}
            />
          </div>
        ))}
      </div>
      <div className="flex items-center justify-center w-full">
        <Button className="bg-zinc-600 text-zinc-400 hover:text-black w-24" onClick={() => onConfirm()}>
        {{
          pick: 'Lock in',
          ban: 'Ban',
          end: 'Start New',
          ready: 'Ready',
        }[state] || ''}
        </Button>
      </div>
      <div className="me-2">
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