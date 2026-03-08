export default async function handler(req, res) {
    try {
        const { region, params } = req.query;
        // params = [action, itemId, uid, pass, version]
        const fullPath = Array.isArray(params) ? params.join('/') : params;
        const url = `https://macxwish.vercel.app/api/wishlist/${region}/${fullPath}`;

        const response = await fetch(url);
        const data = await response.json();
        res.status(200).json(data);
    } catch (err) {
        res.status(500).json({ status: 'error', message: 'Server error' });
    }
}
