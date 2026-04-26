const REGIONS_BMKG = [
  { id:1,  name:"Riau",        kode:"14.71.04.1001" },
  { id:2,  name:"Kalteng",     kode:"62.71.01.1001" },
  { id:3,  name:"Kalbar",      kode:"61.71.02.1001" },
  { id:4,  name:"Papua Barat", kode:"91.71.01.1001" },
  { id:5,  name:"Jambi",       kode:"15.71.01.1001" },
  { id:6,  name:"Sumsel",      kode:"16.71.01.1001" },
  { id:7,  name:"Kalsel",      kode:"63.71.01.1001" },
  { id:8,  name:"Kaltim",      kode:"64.71.01.1001" },
  { id:9,  name:"Aceh",        kode:"11.71.01.2001" },
  { id:10, name:"Papua Tgh",   kode:"94.01.01.1001" },
  { id:11, name:"Sumut",       kode:"12.71.01.1001" },
  { id:12, name:"Bengkulu",    kode:"17.71.01.1001" },
];

export default async function handler(req, res) {
  try {
    const results = await Promise.all(
      REGIONS_BMKG.map(async r => {
        try {
          const url = `https://api.bmkg.go.id/publik/prakiraan-cuaca?adm4=${r.kode}`;
          const response = await fetch(url);
          const data = await response.json();
          const cuacaData = data.data?.[0]?.cuaca ?? [];
          const item = cuacaData?.[0]?.[0];
          // ambil semua data per jam dari 3 hari
          const forecast = cuacaData.flat().map(d => ({
            time: d.local_datetime,
            suhu: d.t,
            kelembapan: d.hu,
            hujan: d.tp ?? 0,
          }));
          return {
            id: r.id,
            name: r.name,
            suhu: item?.t ?? null,
            kelembapan: item?.hu ?? null,
            cuaca: item?.weather_desc ?? null,
            angin: item?.ws ?? null,
            hujan: item?.tp ?? 0,
            forecast,
          };
        } catch {
          return { id: r.id, name: r.name, suhu: null, kelembapan: null, cuaca: null };
        }
      })
    );
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.status(200).json(results);
  } catch(e) {
    res.status(500).json({ error: e.message });
  }
}