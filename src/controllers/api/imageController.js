const show = async (req, res, next) => {
  try {
    console.log(req);
    return res.status(200).json({ message: 'show', imagePath: req.url });
  } catch (err) {
    return next(err);
  }
};

export default {
  show,
};
