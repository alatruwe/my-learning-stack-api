const bcrypt = require("bcryptjs");
const { expect } = require("chai");
const jwt = require("jsonwebtoken");

function makeUsersArray() {
  return [
    {
      id: 1,
      first_name: "ted",
      last_name: "ted",
      email: "ted@email.com",
      user_password: "ted-password",
    },
    {
      id: 2,
      first_name: "bill",
      last_name: "bill",
      email: "bill@email.com",
      user_password: "bill-password",
    },
    {
      id: 3,
      first_name: "mark",
      last_name: "mark",
      email: "mark@email.com",
      user_password: "mark-password",
    },
    {
      id: 4,
      first_name: "luke",
      last_name: "luke",
      email: "luke@email.com",
      user_password: "luke-password",
    },
    {
      id: 5,
      first_name: "john",
      last_name: "john",
      email: "john@email.com",
      user_password: "john-password",
    },
  ];
}

function makeEntriesArray() {
  return [
    {
      id: 1,
      user_id: 1,
      date: "2029-01-22T16:28:32.615Z",
      current_mood: "smile",
      tech_id: 1,
      learning_notes: "bla bla bla",
      struggling_notes: "ble ble ble",
    },
    {
      id: 2,
      user_id: 1,
      date: "2029-01-22T16:28:32.615Z",
      current_mood: "smile",
      tech_id: 1,
      learning_notes: "bla bla bla",
      struggling_notes: "ble ble ble",
    },
    {
      id: 3,
      user_id: 1,
      date: "2029-01-22T16:28:32.615Z",
      current_mood: "smile",
      tech_id: 1,
      learning_notes: "bla bla bla",
      struggling_notes: "ble ble ble",
    },
    {
      id: 4,
      user_id: 1,
      date: "2029-01-22T16:28:32.615Z",
      current_mood: "smile",
      tech_id: 1,
      learning_notes: "bla bla bla",
      struggling_notes: "ble ble ble",
    },
  ];
}

function makeProfilesArray() {
  return [
    {
      id: 1,
      tech_id: 1,
      user_id: 1,
    },
    {
      id: 2,
      tech_id: 1,
      user_id: 1,
    },
    {
      id: 3,
      tech_id: 1,
      user_id: 2,
    },
  ];
}

function makeTechListArray() {
  return [
    {
      id: 1,
      name: "react",
      icon: "",
    },
    {
      id: 2,
      name: "javascript",
      icon: "",
    },
    {
      id: 3,
      name: "node.js",
      icon: "",
    },
  ];
}

function seedUsers(db, users) {
  const preppedUsers = users.map((user) => ({
    ...user,
    user_password: bcrypt.hashSync(user.user_password, 1),
  }));
  return db
    .into("users")
    .insert(preppedUsers)
    .then(() =>
      // update the auto sequence to stay in sync
      db.raw(`SELECT setval('users_id_seq', ?)`, [users[users.length - 1].id])
    );
}

function seedTechList(db, techlist) {
  return db.insert(techlist).into("tech_list").returning("*");
}

function seedProfiles(db, profiles) {
  return db.insert(profiles).into("profiles").returning("*");
}

function seedEntriesTables(db, users, profiles = [], entries, techlist = []) {
  // use a transaction to group the queries and auto rollback on any failure
  return db.transaction(async (trx) => {
    await seedUsers(trx, users);
    await seedTechList(trx, techlist);
    await seedProfiles(trx, profiles);
    await trx.into("entries").insert(entries);
    // update the auto sequence to match the forced id values
    await trx.raw(`SELECT setval('entries_id_seq', ?)`, [
      entries[entries.length - 1].id,
    ]);
  });
}

function makeLibraryFixtures() {
  const testUsers = makeUsersArray();
  const testEntries = makeEntriesArray();
  const testProfiles = makeProfilesArray();
  const testTechList = makeTechListArray();
  return { testUsers, testEntries, testProfiles, testTechList };
}

function makeExpectedEntries(user, entries) {
  const expectedEntries = entries.filter((entry) => {
    return entry.user_id === user.id; // user.user_id
  });
  return expectedEntries.map((entry) => {
    return {
      tech_id: entry.tech_id,
      date: entry.date,
      current_mood: entry.current_mood,
      learning_notes: entry.learning_notes,
      struggling_notes: entry.struggling_notes,
    };
  });
}

function makeAuthHeader(user, secret = process.env.JWT_SECRET) {
  const token = jwt.sign({ user_id: user.id }, secret, {
    subject: user.email,
    algorithm: "HS256",
  });
  return `Bearer ${token}`;
}

module.exports = {
  makeUsersArray,
  makeEntriesArray,
  makeTechListArray,
  makeProfilesArray,
  makeLibraryFixtures,
  makeAuthHeader,
  makeExpectedEntries,
  seedUsers,
  seedEntriesTables,
};
