import { navigateTo } from "../../utils/navTo.js";


const userDetailUrl = "http://127.0.0.1:8000/user/details";
const updateUserUrl = "http://127.0.0.1:8000/user/update";



export async function fetchEdit() {
    const access_token = localStorage.getItem("access_token");
    if (!access_token) {
        navigateTo("/login");
        return;
    }
    try {
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
        document.querySelector("input[name='first-name']").value = user.first_name;
        document.querySelector("input[name='last-name']").value = user.last_name;
        document.querySelector("input[name='phone']").value = user.phone;
        document.getElementById("save-button").addEventListener("click", async () => {
            const access_token = localStorage.getItem("access_token");
            if (!access_token) {
                navigateTo("/login");
                return;
            }
            const firstName = document.querySelector("input[name='first-name']").value;
            const lastName = document.querySelector("input[name='last-name']").value;
            const phone = document.querySelector("input[name='phone']").value;
            const avatar = document.querySelector("input[name='avatar']").files[0]; // Added to get the file

            const formData = new FormData();
            formData.append("first_name", firstName);
            formData.append("last_name", lastName);
            formData.append("phone", phone);
            if (avatar) {
                formData.append("avatar", avatar); // Added to include the file
            }
            try {
                const response = await fetch(updateUserUrl, {
                    method: "POST",
                    headers: {
                        "Authorization": `Bearer ${access_token}`,
                    },
                    body: formData // Use FormData object
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.error);
                }
                navigateTo("/profile");
            } catch (err) {
                console.log(err);
            }
        });
    } catch (err) {
        console.log(err);
    }
}
