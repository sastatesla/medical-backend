import express from 'express';
const router = express.Router();
import { RoleController } from "../controllers/index.js";
import validate from "../middlewares/validate.js";
import roleVlidation from '../validations/role.vlidation.js';

router.post(
    '/create',
    validate(roleVlidation.role),
    RoleController.createRole
);

router.get(
    '/list',
    validate(roleVlidation.roleQuery),
    RoleController.getRoles
)
router.delete(
    '/delete/:id',
    validate(roleVlidation.deleteRole),
    RoleController.deleteRole
);

export default router;