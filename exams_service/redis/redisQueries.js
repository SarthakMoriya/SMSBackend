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
