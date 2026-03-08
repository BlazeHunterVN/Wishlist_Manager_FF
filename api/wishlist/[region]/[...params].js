export default async function handler(req, res) {
    try {
        const { region } = req.query;
        const exactPath = req.url.split(`/api/wishlist/${region}/`)[1];
        const url = `https://macxwish.vercel.app/api/wishlist/${region}/${exactPath}`;

        const response = await fetch(url);
        const data = await response.json();
        res.status(200).json(data);
    } catch (err) {
        res.status(500).json({ status: 'error', message: 'Server error' });
    }
}
