import {
  listContacts,
  getContactById,
  addContact,
  removeContact,
  updateContact,
  updateStatusContact,
} from "../services/contactsServices.js";

export const getAllContacts = async (req, res, next) => {
  try {
    const contacts = await listContacts(req.user.id);
    res.json(contacts);
  } catch (err) {
    next(err);
  }
};

export const getOneContact = async (req, res, next) => {
  try {
    const contact = await getContactById(req.params.id, req.user.id);
    res.json(contact);
  } catch (err) {
    next(err);
  }
};

export const createContact = async (req, res, next) => {
  try {
    const newContact = await addContact(req.body, req.user.id);
    res.status(201).json(newContact);
  } catch (err) {
    next(err);
  }
};

export const updateContactController = async (req, res, next) => {
  try {
    const updated = await updateContact(req.params.id, req.body, req.user.id);
    res.json(updated);
  } catch (err) {
    next(err);
  }
};

export const deleteContact = async (req, res, next) => {
  try {
    await removeContact(req.params.id, req.user.id);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
};

export const updateFavoriteController = async (req, res, next) => {
  try {
    const updated = await updateStatusContact(req.params.contactId, req.body.favorite, req.user.id);
    res.json(updated);
  } catch (err) {
    next(err);
  }
};
