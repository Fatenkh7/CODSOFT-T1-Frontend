// async function checkAuthentication(userId) {
//     try {
//         const token = localStorage.getItem("auth-token");

//         if (token) {
//             console.log("Token exists:", token);

//             const userDataResponse = await fetch(`https://blog-backend-6b5y.onrender.com/user/${userId}`, {
//                 method: "GET",
//                 headers: {
//                     "Authorization": `Bearer ${token}`,
//                 },
//             });

//             if (userDataResponse.ok) {
//                 const userData = await userDataResponse.json();
//                 console.log(userData, "auth doneee");
//             } else {
//                 console.log("Authentication failed");
//             }
//         } else {
//             console.log("Token does not exist in local storage");
//             return false;
//         }
//     } catch (error) {
//         console.error("Error during authentication:", error);
//     }
// }