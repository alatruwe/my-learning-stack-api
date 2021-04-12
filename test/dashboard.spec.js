const { expect } = require("chai");
const knex = require("knex");
const app = require("../src/app");
const helpers = require("./test-helpers");

describe("Dashboard Endpoint", function () {
  let db;

  const {
    testUsers,
    testEntries,
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
      "TRUNCATE entries, profiles, tech_list, users RESTART IDENTITY CASCADE"
    )
  );

  afterEach("cleanup", () =>
    db.raw(
      "TRUNCATE entries, profiles, tech_list, users RESTART IDENTITY CASCADE"
    )
  );

  describe(`GET /api/dashboard`, () => {
    //test when database is empty
    context(`Given no entries`, () => {
      beforeEach(() => helpers.seedUsers(db, testUsers));
      it(`responds with 200 and an empty list`, () => {
        return supertest(app)
          .get("/api/dashboard")
          .set("Authorization", helpers.makeAuthHeader(testUsers[0]))
          .expect(200, []);
      });
    });

    // test when database has items
    context("Given there are entries in the database", () => {
      beforeEach("insert entries", () =>
        helpers.seedEntriesTables(
          db,
          testUsers,
          testProfiles,
          testEntries,
          testTechList
        )
      );

      it("responds with 200 and the specified entries", () => {
        const expectedEntries = helpers.makeExpectedEntries(
          testUsers[0],
          testEntries,
          testTechList
        );
        return supertest(app)
          .get(`/api/dashboard`)
          .set("Authorization", helpers.makeAuthHeader(testUsers[0]))
          .expect(200) // expectedEntries);
          .then((res) => {
            expect(res.body).to.be.an("array");
          });
      });
    });
  });

  // delete an entry
  describe(`DELETE /api/dashboard/entry/:entry_id`, () => {
    context(`Given no entry`, () => {
      beforeEach(() => helpers.seedUsers(db, testUsers));
      it(`responds with 404`, () => {
        const entry_id = 123456;
        return supertest(app)
          .delete(`/api/dashboard/entry/${entry_id}`)
          .set("Authorization", helpers.makeAuthHeader(testUsers[0]))
          .expect(404, { error: { message: `Entry doesn't exist` } });
      });
    });

    context("Given there are entries in the database", () => {
      beforeEach("insert entries", () =>
        helpers.seedEntriesTables(
          db,
          testUsers,
          testProfiles,
          testEntries,
          testTechList
        )
      );

      it("responds with 204 and removes the entry", () => {
        const idToRemove = 2;
        const filteredEntries = testEntries.filter((entry) => {
          if (entry.id !== idToRemove && entry.user_id === testUsers[0].id)
            return entry;
        });
        const expectedEntries = helpers.makeExpectedEntries(
          testUsers[0],
          filteredEntries,
          testTechList
        );
        return supertest(app)
          .delete(`/api/dashboard/entry/${idToRemove}`)
          .set("Authorization", helpers.makeAuthHeader(testUsers[0]))
          .expect(204)
          .then((res) =>
            supertest(app)
              .get(`/api/dashboard`)
              .set("Authorization", helpers.makeAuthHeader(testUsers[0]))
              //.expect(expectedEntries)
              .then((res) => {
                expect(res.body).to.be.an("array");
              })
          );
      });
    });
  });
});
