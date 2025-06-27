import Contact from "../models/contact.js";

export async function listContacts() {
    return await Contact.findAll();
}

export async function getContactById(contactId) {
    return await Contact.findByPk(contactId);
}

export async function addContact(name, email, phone) {
    return await Contact.create({name, email, phone});
}

export async function updateContact(contactId, updatedData) {
    const [rowsUpdated, [updatedContact]] = await Contact.update(updatedData, {
        where: {id: contactId}, returning: true,
    });
    return rowsUpdated ? updatedContact : null;
}

export async function removeContact(contactId) {
    const contact = await getContactById(contactId);
    if (!contact) return null;
    await contact.destroy();
    return contact;
}

export async function updateStatusContact(contactId, favoriteValue) {
    const [rowsUpdated, [updatedContact]] = await Contact.update({favorite: favoriteValue}, {
        where: {id: contactId}, returning: true
    });
    return rowsUpdated ? updatedContact : null;
}
