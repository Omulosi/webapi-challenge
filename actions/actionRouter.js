const express = require('express');

const router = express.Router();

const Action = require('../actions/actionDb');

router.use

router.get('/', (req, res) => {
  Action.get()
    .then(actions => {
      if (actions) {
        res.status(200).json(actions);
      }
    })
    .catch(error => {
      console.log(error);
      res.status(500).json({message: 'Error retrieving actions'})
    });
});

router.get('/:id', validateActionId, (req, res) => {
  res.status(200).json(req.action);
});

router.delete('/:id',validateActionId,  (req, res) => {
  Action.remove(req.action.id)
    .then(() => {
      res.status(200).json({message: "Action has been removed"})
    })
    .catch(error => {
      res.status(500).json({
        message: `Error removing action: ${error.message}`
      })
    })
});

router.put('/:id', validateActionId,  (req, res) => {

  Action.update(req.action.id, req.body)
    .then(action => {
      res.status(200).json(action)
    })
    .catch(error => {
      res.status(500).json({
        message: `Error updating the action: ${error.message}`
      })
    })

});


function validateActionId(req, res, next) {
  const { id } =  req.params;

  Action.get(id)
    .then(action => {
      if (action) {
        req.action = action;
        next();
      } else {
        res.status(400).json({message: 'Invalid action id'});
      }
    })
};

module.exports = router;
