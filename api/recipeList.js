import { mainDb } from "../lib/firebase.js";

export default async function handler(req, res) {
    try {
        const snapshot = await mainDb.collection("recipes").get();
        const results = [];
        snapshot.forEach(doc => {
            results.push({
                id: doc.id,
                ...doc.data()
            });
        });
        
        return res.status(200).json(results);
    } catch(e){
        console.error('Error:', e);
        res.status(500).json({ error: 'Failed to get recipe list' });
    }
}