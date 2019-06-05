import axios from 'axios';

class API {
  constructor() {
    this.baseUrl = 'http://http://35.246.245.185:8000';
    this.timeout = 1000;
    this.token = null;

    axios.interceptors.request.use(config => {
      if (this.token) {
        config.headers = {...config.headers, Authorization: this.token};
      }
      return config;
    });
  }

  authorize = async pass => {
    try {
      const { data } = await axios({
        url: `${this.baseUrl}/login`,
        method: 'post',
        auth: {
          username: 'root',
          password: pass,
        },
      });
      if (data && data.token) {
        this.token = data.token;
        return true;
      }
      return false;
    } catch (error) {
      return false;
    }
  };

  logout = () => {
    this.token = null;
  };

  getBots = async () => {
    try {
      const { data } = await axios.get(`${this.baseUrl}/bots`);
      return data;
    } catch (err) {
      return [];
    }
  };

  activateBots = async ids => {
    try {
      await axios.post(`${this.baseUrl}/bots/activate`, { ids });
    } catch (err) {
      return [];
    }
  };

  pauseBots = async ids => {
    try {
      await axios.post(`${this.baseUrl}/bots/pause`, { ids });
    } catch (err) {
      return [];
    }
  };

  changeLimit = async (id, newLimit) => {
    try {
      await axios.post(`${this.baseUrl}/bots/limit`, { id, newLimit });
    } catch (err) {
      return [];
    }
  };
}

export default new API();
