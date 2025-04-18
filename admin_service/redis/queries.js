import { redis as client } from "../admin.js";

// GETS ALL THE COURSES  STORED IN CACHE
export const getCoursesCache = async () => {
  try {
    const courses = await client.SMEMBERS("courses");
    return courses.length ? courses.map((course) => JSON.parse(course)) : [];
  } catch (error) {
    console.log("ERRO AT getCourseCache()");
    return [];
  }
};

// SET COURSES CACHE ie ALL THE COURSES
export const insertAllCourseCache = async (courses) => {
  try {
    for (let course of courses) {
      await client.SADD("courses", JSON.stringify(course));
    }
    await client.expire("courses", 3600);
  } catch (error) {
    console.log("Error setting course names cache ");
  }
};

// UPDATE THE COURSES CACHE ON ADDING A NEW COURSE
export const insertCourseCache = async (course) => {
  try {
    await client.SADD("courses", JSON.stringify(course));
    await client.expire("courses", 3600);
  } catch (error) {
    console.log("Error setting course names cache ");
  }
};

//SET EACH COURSE EXAMS CACHE SEMESTER WISE IN A HASHMAP
export const setCourseExamsCache = async (exams) => {
  try {
    for (let exam of exams) {
      await client.HSET(
        `course:${exam.course_id}:semester:${exam.semester}`,
        `exam_code:${exam.exam_code}`,
        JSON.stringify({
          name: exam.name,
          min_marks: exam.min_marks,
          max_marks: exam.max_marks,
        })
      );
    }
    await client.expire(
      `course:${exams[0].course_id}:semester:${exams[0].semester}`,
      3600
    );
  } catch (error) {
    console.log("Error setting course names cache ");
  }
};
//GET EACH COURSE EXAMS CACHE AS PER SEMESTER PASSED IN A HASHMAP
export const getCourseExamsCache = async (course_id, semester) => {
  try {
    const exams = await client.HGETALL(
      `course:${course_id}:semester:${semester}`
    );
    let parsedExams = [];
    for (let exam of Object.keys(exams)) {
      parsedExams.push(JSON.parse(exams[exam]));
    }
    return parsedExams.length ? parsedExams : null;
  } catch (error) {
    console.log("Error setting course names cache ");
    return [];
  }
};
export const updateCourseExamsCache = async (
  course_id,
  name,
  max_marks,
  min_marks,
  semester_no,
  exam_code
) => {
  try {
    const exams = await client.HSET(
      `course:${course_id}:semester:${semester_no}`,
      `exam_code:${exam_code}`,
      JSON.stringify({
        name,
        min_marks,
        max_marks,
      })
    );
    await client.expire(`course:${course_id}:semester:${semester_no}`, 3600);
  } catch (error) {
    console.log("Error setting course exam cache ");
    return [];
  }
};
