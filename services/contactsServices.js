import Contact from "../models/contact.js";
import HttpError from "../helpers/HttpError.js";

export const listContacts = async (userId) => {
  const contacts = await Contact.findAll({ where: { owner: userId } });
  return contacts;
};

export const getContactById = async (id, userId) => {
  const contact = await Contact.findOne({ where: { id, owner: userId } });
  if (!contact) {
    throw HttpError(404, "Contact not found");
  }
  return contact;
};

export const addContact = async (data, userId) => {
  const newContact = await Contact.create({ ...data, owner: userId });
  return newContact;
};

export const removeContact = async (id, userId) => {
  const deletedCount = await Contact.destroy({ where: { id, owner: userId } });
  if (deletedCount === 0) {
    throw HttpError(404, "Contact not found");
  }
};

export const updateContact = async (id, data, userId) => {
  const [count, [contact]] = await Contact.update(data, {
    where: { id, owner: userId },
    returning: true,
  });
  if (count === 0) {
    throw HttpError(404, "Contact not found");
  }
  return contact;
};

export const updateStatusContact = async (id, favorite, userId) => {
  const [count, [contact]] = await Contact.update({ favorite }, {
    where: { id, owner: userId },
    returning: true,
  });
  if (count === 0) {
    throw HttpError(404, "Contact not found");
  }
  return contact;
};
