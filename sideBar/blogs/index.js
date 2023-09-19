document.addEventListener("DOMContentLoaded", async () => {
    console.log("DOM is fully loaded");
    try {
        // Get the authentication token from localStorage
        const authToken = localStorage.getItem("auth-token");
        const blogList = document.getElementById("blog-list");

        const response = await fetch("https://blog-backend-6b5y.onrender.com/blog", {
            headers: {
                Authorization: authToken,
            },
        });

        if (!response.ok) {
            throw new Error("Failed to fetch blogs");
        }

        const data = await response.json();

        if (data.success && data.data.length > 0) {
            data.data.forEach((blog) => {
                // Create a container div for each blog entry with a "card" class
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
