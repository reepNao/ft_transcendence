import { navigateTo } from "../../utils/navTo.js";
import { toggleHidden } from "../../utils/utils.js";

const userDetailUrl = "http://127.0.0.1:8000/user/details";
const updateUserUrl = "http://127.0.0.1:8000/user/update";

let originalUserData = {};

export async function fetchProfile() {
    const access_token = localStorage.getItem("access_token");
    if (!access_token) {
        navigateTo("/login");
        return;
    }
    try {
        console.log("Fetching user details");
        const response = await fetch(userDetailUrl, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${access_token}`,
            }
        });
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error);
        }
        const data = await response.json();
        const user = data[0].data[0];
        console.log(user);
        document.getElementById("full-name").textContent = `${user.first_name} ${user.last_name}`;
        document.getElementById("user-name").textContent = user.username;
        document.getElementById("profile-first-name").textContent = user.first_name;
        document.getElementById("profile-last-name").textContent = user.last_name;
        document.getElementById("phone").textContent = user.phone;
        document.getElementById("email").textContent = user.email;

        if (localStorage.getItem("status")) {
            document.getElementById("profile-status").textContent = localStorage.getItem("status");
        }

    } catch (err) {
        console.log(err);
    }
}
