import {
    addContact, getContactById, listContacts, removeContact, updateContact, updateStatusContact,
} from "../services/contactsServices.js";
import HttpError from "../helpers/HttpError.js";

export const getAllContacts = async (req, res) => {
  try {
    const userId = req.user.id;
    const contacts = await Contact.findAll({ where: { owner: userId } });
    res.json(contacts);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

export const getOneContact = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const contact = await Contact.findOne({ where: { id, owner: userId } });
    if (!contact) {
      return res.status(404).json({ message: "Contact not found" });
    }

    res.json(contact);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

export const createContact = async (req, res) => {
  try {
    const userId = req.user.id;
    const newContact = await Contact.create({ ...req.body, owner: userId });
    res.status(201).json(newContact);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

export const updateContactController = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const [updatedCount, [updatedContact]] = await Contact.update(
      req.body,
      {
        where: { id, owner: userId },
        returning: true,
      }
    );

    if (updatedCount === 0) {
      return res.status(404).json({ message: "Contact not found" });
    }

    res.json(updatedContact);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

export const deleteContact = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const deletedCount = await Contact.destroy({ where: { id, owner: userId } });
    if (deletedCount === 0) {
      return res.status(404).json({ message: "Contact not found" });
    }

    res.status(204).send();
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

export const updateFavoriteController = async (req, res) => {
  try {
    const { contactId } = req.params;
    const userId = req.user.id;

    const [updatedCount, [updatedContact]] = await Contact.update(
      { favorite: req.body.favorite },
      {
        where: { id: contactId, owner: userId },
        returning: true,
      }
    );

    if (updatedCount === 0) {
      return res.status(404).json({ message: "Contact not found" });
    }

    res.json(updatedContact);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

