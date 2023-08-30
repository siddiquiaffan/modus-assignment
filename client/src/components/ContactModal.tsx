import React, { useEffect, useState } from "react";
import type { Contact } from "@/lib/types";

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (contact: Contact) => void;
  contactToEdit?: ContactData | null; // Pass this prop when editing a contact
}

type ContactData = Omit<Contact, "id"> & { id?: Contact["id"] };

const ContactModal: React.FC<ContactModalProps> = ({
  isOpen,
  onClose,
  onSave,
  contactToEdit,
}) => {
  const [contactData, setContactData] = useState<ContactData>(
    contactToEdit || { name: "", email: "", phone: "", age: 1 }
  );
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setContactData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSave = () => {
    const temp: Required<ContactData> = {...contactData, id: (Math.random() * 32).toString()};
    if (onSave) onSave(temp);
    onClose();
  };

  const handleSubmit = async () => {
    setIsLoading(true);

    const res = await fetch(`http://localhost:8000/${contactData?.id ? contactData?.id : 'create'}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(contactData),
    });

    if (res.status === 200) {
      const data = await res.json() as { data: Contact };
      onSave(data.data ?? contactData);
      onClose();
    } else {
      alert("Error creating contact");
    }

    setIsLoading(false);

  };

  useEffect(() => {
    if (contactToEdit) setContactData(contactToEdit);
    else setContactData({ name: "", email: "", phone: "", age: 1 });
  }, [contactToEdit]);

  return (
    <div
      className={`fixed inset-0 z-10 flex items-center justify-center ${
        isOpen ? "" : "hidden"
      }`}
    >
      <div className="fixed inset-0 bg-gray-900 opacity-50"></div>
      <div className="z-10 w-full max-w-md p-6 bg-white rounded-lg">
        <div className="flex justify-between">
          <p className="text-gray-500"> {contactToEdit?.id ? <>ID: {contactToEdit.id}</> : null} </p>
          <button
            className="text-xl px-3.5 py-1 mb-5 hover:bg-gray-200 rounded-full"
            onClick={onClose}
          >
            x
          </button>
        </div>
        <input
          className="w-full px-4 py-2 mb-2 border rounded"
          type="text"
          name="name"
          value={contactData.name}
          onChange={handleInputChange}
          placeholder="Name"
        />
        <input
          className="w-full px-4 py-2 mb-2 border rounded"
          type="email"
          name="email"
          value={contactData.email}
          onChange={handleInputChange}
          placeholder="Email"
        />
        <input
          className="w-full px-4 py-2 mb-2 border rounded"
          type="tel"
          name="phone"
          value={contactData.phone}
          onChange={handleInputChange}
          placeholder="Phone"
        />
        <input
          className="w-full px-4 py-2 mb-2 border rounded"
          type="number"
          name="age"
          value={contactData.age}
          onChange={handleInputChange}
          placeholder="Age"
          min={1}
        />
        <button
          className="w-full px-4 py-2 mt-4 text-sm text-white bg-blue-500 rounded hover:bg-blue-600 disabled:opacity-75"
          /* eslint-disable-next-line */
          onClick={handleSubmit}
          disabled={isLoading}
        >
          {
            isLoading ? 'Saving...' : 'Save'
          }
        </button>
      </div>
    </div>
  );
};

export default ContactModal;
