import axios from "axios";

const api = axios.create({
  baseURL: "https://stock-project-seven.vercel.app",
});
  
export { api };

//"http://localhost:3000"
//"https://stock-project-seven.vercel.app"
