import React from "react";
import type { Contact } from "@/lib/types";

interface ContactProps extends Contact {
  onEditClick: () => void;
  onDeleteClick: () => void;
}

const Contact: React.FC<ContactProps> = ({
  name,
  email,
  phone,
  age,
  onEditClick,
  onDeleteClick,
}) => {
  return (
    <div className="flex justify-between items-center p-4 border-b shadow-lg rounded-md">
      <div>
        <h3 className="text-lg font-semibold">{name}</h3>
        <p className="text-gray-500">{email}</p>
        <p className="text-gray-500">{phone}</p>
        <p className="text-gray-500">Age: {age}</p>
      </div>
      <div className="space-x-2">
        <button
          className="px-2 py-1 text-sm text-blue-600 border border-blue-600 rounded hover:bg-blue-600 hover:text-white"
          onClick={onEditClick}
        >
          Edit
        </button>
        <button
          className="px-2 py-1 text-sm text-red-600 border border-red-600 rounded hover:bg-red-600 hover:text-white"
          onClick={onDeleteClick}
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default Contact;
