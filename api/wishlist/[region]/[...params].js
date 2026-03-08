export default async function handler(req, res) {
    try {
        const { region } = req.query;
        const requestUrl = req.url || '';
        const exactPathMatch = requestUrl.match(new RegExp(`/api/wishlist/${region}/(.+)`));
        const exactPath = exactPathMatch ? exactPathMatch[1] : Array.isArray(req.query.params) ? req.query.params.join('/') : req.query.params;
        const url = `https://macxwish.vercel.app/api/wishlist/${region}/${exactPath}`;

        const response = await fetch(url);
        const data = await response.json();
        res.status(200).json(data);
    } catch (err) {
        res.status(500).json({ status: 'error', message: 'Server error' });
    }
}
