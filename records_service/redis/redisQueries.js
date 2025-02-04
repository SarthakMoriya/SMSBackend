import { client } from "./redis.js";

export const setStudentDetailsCache = async (studId, data) => {
  try {
    console.log(studId);
    const cacheKey = `student:${studId}`;

    for (let key of Object.keys(data)) {
      console.log(key, data[key])
      await client.hSet(cacheKey, key, String(data[key]));
    }
    await client.expire(cacheKey,3*60);

    console.log(`Student Data cached successfully`);
  } catch (error) {
    console.error("Failed to cache exams:", error);
  }
};
