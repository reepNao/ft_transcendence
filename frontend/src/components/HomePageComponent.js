import { fetchUserDetails } from '../routes/homepage/HomePage.js';

class HomePageComponent {
    constructor(path) {
        this.path = path;
    }

    async render() {
        const res = await fetch(this.path);
        if (!res.ok) {
            throw new Error("couldn't fetch route");
        }
        const html = await res.text();
        // await fetchUserDetails();
        return html;
    }
}

export default HomePageComponent;
