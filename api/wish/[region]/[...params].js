export default async function handler(req, res) {
    try {
        const { region, params } = req.query;
        // Vercel strips '=' so if url was uid=123, params is ['uid=123'] but sometimes splits it.
        // The safest way is to rebuild it using req.url which preserves the exact path.
        const exactPath = req.url.split(`/api/wish/${region}/`)[1];
        const url = `https://macxwishlist.vercel.app/api/wish/${region}/${exactPath}`;

        const response = await fetch(url);
        const data = await response.json();
        res.status(200).json(data);
    } catch (err) {
        res.status(500).json({ status: 'error', message: 'Server error' });
    }
}
