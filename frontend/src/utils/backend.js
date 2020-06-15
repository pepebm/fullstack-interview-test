import axios from 'axios';

const base_url = process.env.BACKEND_URL || 'http://localhost:8001';

const listBranches = async () => {
  const res = await axios({
    method: 'get',
    url: base_url + "/branches"
  });
  return res.data;

};

export default {
  listBranches
};