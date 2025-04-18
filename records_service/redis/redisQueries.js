import { redis } from "../records.js";

export const setRecord = async (data) => {
  try {
    await redis.SET(`record:${data.studId}`, JSON.stringify(data));
    await redis.expire(`record:${data.studId}`, 1800); // Set expiration time to 30 mins
  } catch (error) {
    console.log(error);
  }
};
export const getRecordC = async (id) => {
  try {
    const cache=await redis.GET(`record:${id}`)
    if(cache){
      console.log(cache)
      return JSON.parse(cache)
    }else{
      return null;
    }

  } catch (error) {
    console.log(error);
  }
};
