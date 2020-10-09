const fs = require('fs');
const path = require('path');
const contactsPath = path.join(__dirname, './db/contacts.json');
const shortid = require('shortid');

// Get all contacts from contacts.json
function listContacts() {
    fs.readFile(contactsPath, 'utf-8', (err, data) => {
      if (err) throw err;
      console.log(data);
    });
  }
// Find contact by id from contacts.json
function getContactById(contactId) {
  fs.readFile(contactsPath, 'utf-8', (err, data) => {
    if (err) throw err;
    const contact = JSON.parse(data).find(
      (contact) => contact.id === contactId
    );
    console.log(contact);
  });
}

  // Remove contact by id from contacts.json
function removeContact(contactId) {
  fs.readFile(contactsPath, 'utf-8', (err, data) => {
    if (err) throw err;
    const filteredContacts = JSON.parse(data).filter(
      (contact) => contact.id !== contactId
    );
    fs.writeFile(contactsPath, JSON.stringify(filteredContacts), (err) => {
      if (err) throw err;
    });
  });
}

  // Add new contact to contacts.json (id genereted by shortid)
function addContact(name, email, phone) {
  const oldContactList = require(contactsPath);
  const newContactList = [
    ...oldContactList,
    {
      id: shortid.generate(),
      name: name,
      email: email,
      phone: phone,
    },
  ];
  fs.writeFile(contactsPath, JSON.stringify(newContactList), (err) => {
    if (err) throw err;
  });
// console.log(newContactList);
}

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact
};