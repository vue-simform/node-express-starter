const express = require('express');
const router = express.Router();
const useYourController = require('../controller/useYourController.js')

router.get('/', useYourController.defineYourMethod)
router.get('/another-method', useYourController.anotherMethod)
router.get('/throw-error', useYourController.throwError)


module.exports = router