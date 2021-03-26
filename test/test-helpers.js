const bcrypt = require("bcryptjs");
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

function makeLibraryFixtures() {
  const testUsers = makeUsersArray();

  return { testUsers };
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
  makeLibraryFixtures,
  makeAuthHeader,
  seedUsers,
};
