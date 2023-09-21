function toggleSidebar() {
    const sidebar = document.querySelector('.sidebar');
    const content = document.querySelector('.content');
    const toggleBtn = document.querySelector('.toggle-btn');

    if (sidebar.style.display === 'none' || sidebar.style.display === '') {
        sidebar.style.display = 'block';
        content.style.marginLeft = '262px';
        toggleBtn.innerText = 'Close Sidebar';

    } else {
        sidebar.style.display = 'none';
        content.style.marginLeft = '0';
        toggleBtn.innerText = 'Open Sidebar';
    }
}

async function checkAuthentication() {
    const token = localStorage.getItem("auth-token");
    if (!token) {
        window.location.href = "access-denied.html";
        return;
    }
    console.log("Token exists:", token);

    function logout() {
        localStorage.removeItem("auth-token");
        localStorage.removeItem("user-id");
        window.location.href = "../../index.html";
    }

    document.getElementById("logout-btn").addEventListener("click", logout);
}


// Run the authentication check when the page loads
window.onload = checkAuthentication;


document.addEventListener("DOMContentLoaded", async () => {
    console.log("DOM is fully loaded");
    try {
        // Retrieve the user ID from local storage
        // const userId = localStorage.getItem("user-id");

        // Get the authentication token from localStorage
        const authToken = localStorage.getItem("auth-token");
        const blogList = document.getElementById("blog-list");

        const response = await fetch(`https://blog-backend-6b5y.onrender.com/blog`, {
            headers: {
                Authorization: authToken,
            },
        });

        if (!response.ok) {
            throw new Error("Failed to fetch blogs");
        }

        const data = await response.json();
        console.log("dataaaa", data.data)


        if (data.success && data.data.length > 0) {
            data.data.forEach((blog) => {
                console.log(blog)
                let equal = blog.idCategory.name == "design";

                // Create a container div for each blog entry with a "card" class
                if (equal) {
                    console.log("nameee", blog.idCategory.name)
                    console.log("eqqqq", equal)

                    const blogEntry = document.createElement("div");
                    blogEntry.classList.add("card"); // Add the "card" class
                    blogList.appendChild(blogEntry);

                    // Create elements for each blog entry
                    const blogTitle = document.createElement("h2");
                    const blogDescription = document.createElement("p");
                    const blogImage = document.createElement("img");

                    // Set content and attributes for each element
                    blogTitle.textContent = blog.title;
                    blogDescription.textContent = blog.description;
                    blogImage.src = `https://blog-backend-6b5y.onrender.com/${blog.image}`;

                    // Append the elements to the blog entry container
                    blogEntry.appendChild(blogImage);
                    blogEntry.appendChild(blogTitle);
                    blogEntry.appendChild(blogDescription);
                }
            });
        } else {
            const errorMessage = document.createElement("p");
            errorMessage.textContent = "No blogs found.";
            blogList.appendChild(errorMessage);
        }
    } catch (error) {
        console.error("Error:", error);
    }
});
