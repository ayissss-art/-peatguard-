export default async function handler(req, res) {
  const url = 'https://raw.githubusercontent.com/datasets/geo-countries/master/data/countries.geojson';
  const response = await fetch(url);
  const data = await response.json();
  // filter hanya Indonesia
  const indonesia = data.features.find(f => f.properties['ISO3166-1-Alpha-2'] === 'ID');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.status(200).json(indonesia);
}