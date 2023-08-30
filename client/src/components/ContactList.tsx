import React, { useEffect, useState } from "react";
import Contact from "./Contact";
import ContactModal from "./ContactModal";

import type { Contact as ContactItem } from "../lib/types";

const ContactsList: React.FC = () => {
  const [contacts, setContacts] = useState<ContactItem[]>([]);
  const [editingContact, setEditingContact] = useState<ContactItem | null>(
    null
  );
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const fetchContacts = async () => {
      const res = await fetch("http://localhost:8000/all");
      const data = (await res.json()) as ContactItem[];
      setContacts(data);
    };
    /* eslint-disable-next-line */
    fetchContacts();
  }, []);

  const saveContact = (contact: ContactItem) => {
    if (editingContact) {
      // Update existing contact
      const updatedContacts = contacts.map((c) =>
        c.id === contact.id ? contact : c
      );
      setContacts(updatedContacts);
      setEditingContact(null);
    } else {
      // Create new contact
      const newContact = { ...contact, id: contacts.length + 1 };
      setContacts([...contacts, newContact]);
    }
  };

  const deleteContact = async (contactId: ContactItem["id"]) => {
    const confirm = window.confirm("Are you sure you want to delete this?");
    if (!confirm) return;

    const res = await fetch(`http://localhost:8000/${contactId}`, {
      method: "DELETE",
    });

    if (res.status !== 200) {
      alert("Error deleting contact");
      return;
    } else {
      const updatedContacts = contacts.filter((c) => c.id !== contactId);
      setContacts(updatedContacts);
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-center text-3xl font-semibold mb-4 text-slate-700">
        Contact List
      </h1>

      <button
        className="px-4 py-2 mb-4 text-sm text-white bg-blue-500 rounded hover:bg-blue-600"
        onClick={() => {
          setEditingContact(null);
          setTimeout(() => setIsOpen(true), 100);
        }}
      >
        Create Contact
      </button>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {contacts.map((contact) => (
          <Contact
            key={contact.id}
            {...contact}
            onEditClick={() => {
              setEditingContact(contact);
              setTimeout(() => setIsOpen(true), 100);
            }}
            /* eslint-disable-next-line */
            onDeleteClick={() => deleteContact(contact.id)}
          />
        ))}
      </div>
      <ContactModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        contactToEdit={editingContact}
        onSave={saveContact}
      />
    </div>
  );
};

export default ContactsList;
