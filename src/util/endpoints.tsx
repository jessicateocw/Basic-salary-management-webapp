import axios from "axios";

const BASE_URL = "https://finalspaceapi.com/api/v0/character/";
const baseURL = "https://nphc-hr.free.beeceptor.com/";

export const getUsers = async () => {
  try {
    //+ `/emplyees`
    const res = await axios.get(BASE_URL);
    return res.data;
  } catch (err) {
    alert(err);
  }
};
