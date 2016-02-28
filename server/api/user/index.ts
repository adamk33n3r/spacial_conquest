'use strict';

import express = require('express');
import controller from './user.controller';
let router = express.Router();

// CRUD
router.get('/', controller.index);
router.get('/:id', controller.show);
router.post('/', controller.create);
router.put('/:id', controller.update);
router.patch('/:id', controller.update);
router.delete('/:id', controller.delete);

// Other
router.post('/auth', controller.auth);


module.exports = router;
