exports.healthz = async (_req, res) => {
  return res.status(200).send({ status: 'ok' });
};

exports.readyz = async (_req, res) => {
  return res.status(200).send({ status: 'ready' });
};


