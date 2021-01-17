import db from '../../../db'

export default async (req, res) => {
  if (req.method !== "POST") {
    res.statusCode = 405;
    res.end();
    return;
  }

  let key = req.body.key;

  if (!key) {
    res.statusCode = 400;
    res.end();
    return;
  }

  let instance = await db.instance.findFirst({
    where: {apiKey: key},
    select: {playerLimit: true}
  });

  if (!instance) {
    res.json({
      valid: false
    });
    return;
  }

  res.json({
    valid: true,
    data: {
      playerLimit: instance.playerLimit
    }
  });
}