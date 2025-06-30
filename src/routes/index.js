import express from "express"
import path from "path"
import checkPermission from "../middlewares/permissionChecker.js"
import roleRoute from "./role.routes.js"
const router = express.Router()

const defaultRoutes = [
	
	{
		name: roleRoute,
		path: "/role",
		route: roleRoute,
	}
]



defaultRoutes.forEach(({ name, path, route, isProtected }) => {
	try {
	  if (isProtected) {
		router.use(path, auth,checkPermission(path), route)
	  } else {
		router.use(path, route)
	  }
	} catch (err) {
	  throw new Error(`Failed to mount ${name} at path: ${path}. Error: ${err.message}`)
	}
  })
  

export default router
