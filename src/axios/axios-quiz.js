//^ создаем  новый инстанс axios
import axios from "axios";

export default axios.create({
  baseURL: "https://react-quiz-f6edc.firebaseio.com"
});
