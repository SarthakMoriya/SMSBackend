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
      console.log(semester);
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

// UPDATE CACHE ON EXAM UPDATE
export const updateStudentSemesterExamCache = async (studId, sem_num, exam) => {
  try {
    const cacheKey = `student:${studId}:semester:${sem_num}`;
    // Store each exam as a field in the hash
    await client.hSet(cacheKey, `exam:${exam.exam_id}`, JSON.stringify(exam));
    await client.expire(cacheKey, 3600);
    await client.del(`student:${studId}:total`);
    console.log(`Exams cached for student ${studId}, semester ${sem_num}`);
  } catch (error) {
    console.error("Failed to cache exams:", error);
  }
};

// REDIS CACHE FUNCTION TO MAKE A SET DS
export const setCache = async (key, values) => {
  try {
    if (client.isOpen) {
      const stringValues = values.map(String);
      stringValues.forEach(async (value) => await client.SADD(key, value));
      await client.expire(key, 60 * 60 * 24); // Set expiration time to 24 hours
    } else {
      console.log("redis client is not open");
    }
  } catch (error) {
    console.log("[REDIS] Error setting ", key);
  }
};

export const checkCourseCode = async (key, code) => {
  try {
    if (client.isOpen) {
      const allCodes = await client.SMEMBERS(key);
      if (allCodes.length) {
        const codes = await client.SISMEMBER(key, `${code}`);
        if (codes) {
          return true;
        } else {
          return false;
        }
      } else {
        return null;
      }
    } else {
      console.log("redis client is not open");
    }
  } catch (error) {
    console.log("[REDIS] Error setting ", key);
  }
};
