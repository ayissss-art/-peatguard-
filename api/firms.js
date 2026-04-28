export default async function handler(req, res) {
  const key = process.env.VITE_FIRMS_KEY;
  const url = `https://firms.modaps.eosdis.nasa.gov/api/area/csv/${key}/VIIRS_SNPP_NRT/94,-11,142,6/1`;
  const response = await fetch(url);
  const text = await response.text();
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.status(200).send(text);
}