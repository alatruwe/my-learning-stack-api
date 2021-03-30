const express = require("express");
const NewEntryService = require("./new-entry-services");
const TechService = require("../tech-list-services/tech-list-services");
const { requireAuth } = require("../middleware/jwt-auth");

const newEntryRouter = express.Router();
const jsonBodyParser = express.json();

newEntryRouter
  .route("/")
  .post(requireAuth, jsonBodyParser, (req, res, next) => {
    // get info from request body
    const {
      current_mood,
      learning_notes,
      struggling_notes,
      tech_id,
    } = req.body;
    const newEntry = { current_mood, learning_notes, struggling_notes };

    // check if anything is missing
    for (const [key, value] of Object.entries(newEntry))
      if (value == null)
        return res.status(400).json({
          error: `Missing '${key}' in request body`,
        });

    // get user_id fron jwt auth token
    newEntry.user_id = req.user.id;

    // get tech_id from tech_list table
    let techId = TechService.getTechId(req.app.get("db"), tech_id);

    // insert entry in entries table
    Promise.all([techId])
      .then((res) => {
        newEntry.tech_id = res[0].id;

        console.log(newEntry);
        return NewEntryService.insertEntry(req.app.get("db"), newEntry);
      })
      .then((entry) => {
        res.status(201).send(entry);
      })
      .catch(next);
  });

module.exports = newEntryRouter;
