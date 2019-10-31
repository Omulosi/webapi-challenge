const express = require('express');

const router = express.Router();

const Project = require('./projectDb');
const Action = require('../actions/actionDb');

router.post('/', validateProject, (req, res) => {
  Project.insert(req.body)
    .then(project => {
      res.status(201).json(project);
    })
    .catch(error => {
      console.log(error);
      res.status(500).json({message: "Error adding project: " + error.message})
    })
});

router.post('/:id/actions', [validateProjectId, validateAction], (req, res) => {
  const completed = "completed" in req.body && req.body.completed || false;
  const action = {...req.body, project_id: req.project.id, completed: completed};

  Action.insert(action)
    .then(action => {
      res.status(201).json(action);
    })
    .catch(error => {
      res.status(500).json({message: `Error adding action: ${error.message}`})
    })
});

router.get('/', (req, res) => {
  Project.get()
    .then(projects => {
      if (projects) {
        res.status(200).json(projects);
      }
    })
    .catch(error => {
      console.log(error);
      res.status(500).json({message: 'Error retrieving projects'})
    });

});

router.get('/:id', validateProjectId, (req, res) => {
  res.status(200).json(req.project);
});

router.get('/:id/actions', validateProjectId, (req, res) => {
  Project.getProjectActions(req.project.id)
    .then(actions => {
      res.status(200).json(actions);
    })
    .catch(error => {
      res.status(500).json({message: "Error getting project actions: " + error.message})
    })
});

router.delete('/:id', validateProjectId, (req, res) => {
  Project.remove(req.project.id)
    .then(() => {
      res.status(200).json({message: "Project has been removed"})
    })
    .catch(error => {
      res.status(500).json({
        message: `Error removing project: ${error.message}`
      })
    })
});

router.put('/:id', [validateProjectId, validateProject], (req, res) => {
  Project.update(req.project.id, req.body)
    .then(project => {
      res.status(200).json(project)
    })
    .catch(error => {
      res.status(500).json({
        message: `Error updating the project: ${error.message}`
      })
    })

});

//custom middleware

function validateProjectId(req, res, next) {
  const { id } =  req.params;

  Project.get(id)
    .then(project => {
      if (project) {
        req.project = project;
        next();
      } else {
        res.status(400).json({message: 'Invalid project id'});
      }
    })

}

function validateProject(req, res, next) {
  if (Object.keys(req.body).length) {
    if ("name" in req.body && "description" in req.body) {
      next()
    } else {
      res.status(400).json({message: "missing or empty required name field"});
    }
  } else {
    res.status(400).json({message: "missing project data"})
  }

}

function validateAction(req, res, next) {
  if (Object.keys(req.body).length) {
    if ("description" in req.body && "notes" in req.body) {
      next()
    } else {
      res.status(400).json({message: "missing required notes and description field"});
    }
  } else {
    res.status(400).json({message: "missing action data"})
  }

}

module.exports = router;
