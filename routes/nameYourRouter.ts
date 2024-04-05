const express = require('express');
const router = express.Router();
const useYourController = require('../controller/useYourController')

router.get('/', useYourController.defineYourMethod)
router.get('/another-method', useYourController.anotherMethod)
router.get('/throw-error', useYourController.throwError)


export default router;