import { Router } from "express";
import { createStudent, deleteRecord, getCourseRecords, getRecord } from "../controller/controller.js";

export const router = Router();

router.route("/create").post(createStudent);
router.route("/courserecords/:course").get(getCourseRecords);
router.route('/record/:id').get(getRecord).delete(deleteRecord)
