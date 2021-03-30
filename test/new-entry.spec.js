const knex = require("knex");
const app = require("../src/app");
const helpers = require("./test-helpers");

describe("New Entry Endpoint", function () {
  let db;

  const {
    testUsers,
    testProfiles,
    testTechList,
  } = helpers.makeLibraryFixtures();

  before("make knex instance", () => {
    db = knex({
      client: "pg",
      connection: process.env.TEST_DATABASE_URL,
    });
    app.set("db", db);
  });

  after("disconnect from db", () => db.destroy());

  before("cleanup", () =>
    db.raw(
      "TRUNCATE tech_list, users, profiles, entries RESTART IDENTITY CASCADE"
    )
  );

  afterEach("cleanup", () =>
    db.raw(
      "TRUNCATE tech_list, users, profiles, entries RESTART IDENTITY CASCADE"
    )
  );

  describe(`POST /api/new-entry`, () => {
    beforeEach("insert new entry", () => {
      return db
        .into("users")
        .insert(testUsers)
        .then(() => {
          return db
            .into("tech_list")
            .insert(testTechList)
            .then(() => {
              return db.into("profiles").insert(testProfiles);
            });
        });
    });

    it(`creates a new entry, responding with 201 and the new entry`, function () {
      const newEntry = {
        current_mood: "smile",
        tech_id: "react",
        learning_notes: "test learning notes",
        struggling_notes: "test struggling notes",
      };
      return supertest(app)
        .post("/api/new-entry")
        .set("Authorization", helpers.makeAuthHeader(testUsers[0]))
        .send(newEntry)
        .expect(201)
        .expect((res) =>
          db
            .from("entries")
            .select("*")
            .where({ id: res.body.id })
            .first()
            .then((row) => {
              expect(row.current_mood).to.eql(newEntry.current_mood);
              expect(row.user_id).to.eql(newEntry.user_id);
              expect(row.tech_id).to.eql(newEntry.tech_id);
              expect(row.learning_notes).to.eql(newEntry.learning_notes);
              expect(row.struggling_notes).to.eql(newEntry.struggling_notes);
            })
        );
    });
  });
});
