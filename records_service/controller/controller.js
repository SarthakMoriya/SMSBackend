import { insertRecord } from "../db/dbQueries.js";

export const createStudent = async (req, res) => {
  try {
    const { stu_name, date_enrolled, teacher_id, course, rollno } = req.body;

    const insertRecordRes = await insertRecord(
      {stu_name,
      date_enrolled,
      teacher_id,
      course,
      rollno}
    );
    res.status(201).json(insertRecordRes);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};
