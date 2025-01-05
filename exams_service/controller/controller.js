import { addExamToDb } from "../db/dbQueries.js";

export const addExam = async (req, res) => {
  try {
    const { db, data } = req.body;
    const examsPromises = data.map((exam) => addExamToDb(db, exam));
    const examsRes = await Promise.all(examsPromises);
    Promise.all(examsRes)
      .then((_) => {
        res.status(200).json({
          status: "success",
          code: 200,
          message: "Exams data inserted successfully",
        });
      })
      .catch((err) => {
        console.log(err);
        console.log("ERR--ES-AA");
        throw new Error("Failed to insert data");
      });
  } catch (error) {
    res.status(500).json({
      status: "fail",
      code: 500,
      message: "Faield to insert data ",
    });
  }
};
