export default async function handler(req, res) {
    try {
        const { region } = req.query;
        // Vercel alters req.url in serverless functions (e.g. adding /api/). 
        // Best approach: extract from originalUrl or rely on req.url regex to safely get the tail
        const requestUrl = req.url || '';
        const exactPathMatch = requestUrl.match(new RegExp(`/api/wish/${region}/(.+)`));
        const exactPath = exactPathMatch ? exactPathMatch[1] : Array.isArray(req.query.params) ? req.query.params.join('/') : req.query.params;
        const url = `https://macxwishlist.vercel.app/api/wish/${region}/${exactPath}`;

        const response = await fetch(url);
        const data = await response.json();
        res.status(200).json(data);
    } catch (err) {
        res.status(500).json({ status: 'error', message: 'Server error' });
    }
}
