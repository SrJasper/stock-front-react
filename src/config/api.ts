import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000",
});
  
export { api };

//"http://localhost:3000"
//"https://stock-project-seven.vercel.app"
