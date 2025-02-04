import { Router } from "express";
import { createStudent, getCourseRecords, getRecordInfo } from "../controller/controller.js";

export const router = Router();

router.route("/create").post(createStudent);
router.route("/courserecords/:course").get(getCourseRecords);

router.get('/userinfo/:record_id',getRecordInfo)
