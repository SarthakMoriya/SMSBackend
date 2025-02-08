import { client } from "./redis.js";

export const setStudentSemesterExamsCache = async (studId, sem_num, exams) => {
  try {
    const cacheKey = `student:${studId}:semester:${sem_num}`;

    // Store each exam as a field in the hash
    for (const exam of exams) {
      await client.hSet(cacheKey, `exam:${exam.exam_id}`, JSON.stringify(exam));
    }

    console.log(`Exams cached for student ${studId}, semester ${sem_num}`);
  } catch (error) {
    console.error("Failed to cache exams:", error);
  }
};
export const setStudentSemesterExamsTotalCache = async (studId, semesters) => {
  try {
    const cacheKey = `student:${studId}:total`;

    // Store each semester ttoal as a field in the hash
    for (const semester of semesters) {
      console.log(semester)
      await client.hSet(
        cacheKey,
        `semester:${semester.semester_number}`,
        JSON.stringify(semester)
      );
    }

    console.log(`Exams total cached for student ${studId}`);
  } catch (error) {
    console.error("Failed to cache exams:", error);
  }
};
