import { navigateTo } from "../../utils/navTo.js";
import { userStatuses, goPagination, RefreshToken } from "../../utils/utils.js";
import { userGetByIdUrl, matchHistoryUrl, pictureUrl } from "../../contants/contants.js";

let currentPage = 1; // Current page

export async function fetchOtherprofile() {
    if (!localStorage.getItem("access_token")) {
        navigateTo("/login");
        return;
    }

    try {
        console.log("Fetching user details");
        const urlParams = new URLSearchParams(window.location.search);
        const id = urlParams.get('id');
        const user_status = userStatuses.includes(id) ? true : false;

        // Fetch user details
        const fetchUserDetails = async () => {
            const response = await fetch(userGetByIdUrl + "?id=" + id, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem("access_token")}`,
                }
            });
            if (!response.ok) {
                const errorData = await response.json();
                if (errorData.error === 'Token has expired') {
                    console.log('Token expired, refreshing...');
                    await RefreshToken();
                    return fetchUserDetails(); // Retry fetching user details after token refresh
                } else {
                    throw new Error(errorData.error);
                }
            }
            return response.json();
        };

        const userData = await fetchUserDetails();
        const user = userData.data[0];
        console.log(user);

        // Populate user profile
        document.getElementById("profile-pic").src = pictureUrl + "?id=" + user.id + "&timestamp=" + new Date().getTime();
        document.getElementById("full-name").textContent = `${user.first_name} ${user.last_name}`;
        document.getElementById("user-name").textContent = user.username;
        document.getElementById("profile-first-name").textContent = user.first_name;
        document.getElementById("profile-last-name").textContent = user.last_name;
        document.getElementById("phone").textContent = user.phone;
        document.getElementById("profile-status").textContent = user_status ? "Online" : "Offline";

        console.log("Fetching match history");

        // Fetch match history
        const fetchMatchHistory = async () => {
            const response = await fetch(`${matchHistoryUrl}?username=${user.username}&page=${currentPage}&limit=3`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem("access_token")}`,
                }
            });
            if (!response.ok) {
                const errorData = await response.json();
                if (errorData.error === 'Token has expired') {
                    console.log('Token expired, refreshing...');
                    await RefreshToken();
                    return fetchMatchHistory(); // Retry fetching match history after token refresh
                } else {
                    throw new Error(errorData.error);
                }
            }
            return response.json();
        };

        const matchData = await fetchMatchHistory();
        const matches = matchData.data;
        const stats = matchData.stats;
        const paginate_data = matchData.pagination;
        const totalPages = paginate_data.total_pages;

        // Populate match stats
        document.getElementById('total-games').textContent = stats.total_games;
        document.getElementById('win-count').textContent = stats.win_count;
        document.getElementById('lose-count').textContent = stats.lose_count;

        // Render match history
        const matchTableBody = document.querySelector("#match-history-table tbody");
        matchTableBody.innerHTML = "";

        matches.forEach(match => {
            const date = new Date(match.date).toLocaleString();
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>
                    <h6 class="h5 mb-0 text-black">${date}</h6>
                    <hr>
                    <div class="row">
                        <div class="col-md-4 col-lg-4 mb-4 mb-lg-0">
                            <div class="text-center text-lg-left">
                                <div class="d-block d-lg-flex align-items-center">
                                    <div class="text">
                                        <h3 class="h5 mb-0 text-black">${match.player1}</h3>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="col-md-4 col-lg-4 text-center mb-4 mb-lg-0">
                            <div class="d-inline-block">
                                <div class="bg-black py-2 px-4 mb-2 text-white d-inline-block rounded">
                                    <span class="h5">${match.player1_score}:${match.player2_score}</span>
                                </div>
                            </div>
                        </div>
                        <div class="col-md-4 col-lg-4 mb-4 mb-lg-0">
                            <div class="text-center text-lg-right">
                                <div class="d-block d-lg-flex align-items-center">
                                    <div class="text">
                                        <h3 class="h5 mb-0 text-black">${match.player2}</h3>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </td>
            `;
            matchTableBody.appendChild(row);
        });

        // Setup pagination
        goPagination(totalPages, currentPage, async (newPage) => {
            currentPage = newPage;
            fetchOtherprofile();
        }, "pagination-container");
    } catch (err) {
        console.log(err);
        if (err.message === 'Token has expired') {
            console.log('Token expired, refreshing...');
            await RefreshToken();
            return fetchOtherprofile(); // Retry fetching profile after token refresh
        } else {
            alert(err.message);
        }
    }
}
