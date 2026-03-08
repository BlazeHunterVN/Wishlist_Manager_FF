export default async function handler(req, res) {
    try {
        const { region, params } = req.query;
        // params comes as array from [...params] catch-all
        const fullPath = Array.isArray(params) ? params.join('/') : params;
        const url = `https://macxwishlist.vercel.app/api/wish/${region}/${fullPath}`;

        const response = await fetch(url);
        const data = await response.json();
        res.status(200).json(data);
    } catch (err) {
        res.status(500).json({ status: 'error', message: 'Server error' });
    }
}
