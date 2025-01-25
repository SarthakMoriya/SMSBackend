import { addExamToDb, getStudentExamsDB } from "../db/dbQueries.js";

export const addExam = async (req, res) => {
  try {
    // const examsPromises = data.map((exam) => addExamToDb(req.body));
    // const examsRes = await Promise.all(examsPromises);
    // Promise.all(examsRes)
    //   .then((_) => {
    //     res.status(200).json({
    //       status: "success",
    //       code: 200,
    //       message: "Exams data inserted successfully",
    //     });
    //   })
    //   .catch((err) => {
    //     console.log(err);
    //     console.log("ERR--ES-AA");
    //     throw new Error("Failed to insert data");
    //   });
    const data = req.body;
    let { status, code, message, body } = await addExamToDb(data.course_name, {
      ...data,
    });
    return res.status(code).json({ status, code, message, body });
  } catch (error) {
    console.log(error)
    res.status(500).json({
      status: "fail",
      code: 500,
      message: "Faield to insert data ",
    });
  }
};

export const getStudentExams = async (req, res) => {
  try {
    const studentId = req.params.id;
    const courseDB = req.params.course;
    // console.log(id, course);
    if (!studentId)
      throw new Error({
        message: "No stundet id provided",
        status: "fail",
        code: 404,
      });

    //If id is provided
    const exams = await getStudentExamsDB(studentId, courseDB);
    res.status(200).json({
      status: "success",
      code: 200,
      message: "Exams data fetched successfully",
      body: exams,
    });
  } catch (error) {
    console.log(error);
    let code = error.code || 500;
    let message = error.message || "Internal server error";
    let status = error.status || "fail";
    res.status(code).json({ message, code, status });
  } finally {
  }
};

// export const deleteExam = async(res, res);
