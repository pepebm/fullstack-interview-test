import axios from 'axios';

const base_url = process.env.BACKEND_URL || 'http://localhost:8001';

const getRepo = async () => {
  const res = await axios({
    method: 'get',
    url: base_url + "/repo"
  });
  return res.data;
};

const listBranches = async () => {
  const res = await axios({
    method: 'get',
    url: base_url + "/branches"
  });
  return res.data;
};

const getBranch = async branch => {
  const res = await axios({
    method: 'get',
    url: `${base_url}/branches/get/${branch}"`
  });
  return res.data;
};

const listPr = async branch => {
  const res = await axios({
    method: 'post',
    data: {
      branch: branch
    },
    url: base_url + "/pr"
  });
  return res.data;
};

const getPr = async prNumber => {
  const res = await axios({
    method: 'get',
    url: `${base_url}/pr/get/${prNumber}"`
  });
  return res.data;
};

const createPr = async (title, body, base, head) => {
  const res = await axios({
    method: 'post',
    data: {
      title: title,
      body: body,
      base: base,
      head: head
    },
    url: `${base_url}/pr/create"`
  });
  return res.data;
};

const makePr = async (message, title, pr_id) => {
  const res = await axios({
    method: 'post',
    data: {
      title: title,
      message: message,
      id: pr_id
    },
    url: `${base_url}/pr/make"`
  });
  return res.data;
};

export default {
  getRepo,
  listBranches,
  getBranch,
  listPr,
  getPr,
  createPr,
  makePr
};