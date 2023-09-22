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

//comments


document.addEventListener("DOMContentLoaded", async () => {
    console.log("DOM is fully loaded");
    try {
        // Retrieve the user ID from local storage
        const userId = localStorage.getItem("user-id");

        // Get the authentication token from localStorage
        const authToken = localStorage.getItem("auth-token");
        const blogList = document.getElementById("blog-list");
        const noBlog = document.getElementById("no-blog");

        const response = await fetch(`https://blog-backend-6b5y.onrender.com/blog`, {
            headers: {
                Authorization: authToken,
            },
        });

        if (!response.ok) {
            throw new Error("Failed to fetch blogs");
        }

        const data = await response.json();
        let hasPosts = false; // Flag to check if there are matching blog posts

        if (data.success && data.data.length > 0) {
            for (const blog of data.data) {
                let equal = blog.idUser._id == userId;

                if (equal) {
                    // Create a container div for each blog entry with a "card" class
                    const blogEntry = document.createElement("div");
                    blogEntry.classList.add("card"); // Add the "card" class

                    // Create elements for each blog entry
                    const blogTitle = document.createElement("h2");
                    const blogDescription = document.createElement("p");
                    const blogImage = document.createElement("img");
                    const commentsSection = document.createElement("div");
                    commentsSection.classList.add("comments-section");

                    // Set content and attributes for each element
                    blogTitle.textContent = blog.title;
                    blogDescription.textContent = blog.description;
                    blogImage.src = `https://blog-backend-6b5y.onrender.com/${blog.image}`;

                    // Append the elements to the blog entry container
                    blogEntry.appendChild(blogImage);
                    blogEntry.appendChild(blogTitle);
                    blogEntry.appendChild(blogDescription);
                    blogEntry.appendChild(commentsSection);

                    // Fetch comments for the specific blog post
                    const commentsResponse = await fetch(`https://blog-backend-6b5y.onrender.com/comment`, {
                        headers: {
                            Authorization: authToken,
                        },
                    });

                    if (commentsResponse.ok) {
                        const commentsData = await commentsResponse.json();
                        console.log("dataaaaaaaaa", commentsData.data)
                        // Display the fetched comments in the comments section
                        if (commentsData && commentsData.data.length > 0) {
                            commentsData.data.forEach((comment) => {
                                console.log("commm", comment.idBlog._id)
                                console.log("equall", blog._id)
                                let eqaulComment = comment.idBlog._id == blog._id
                                console.log("equalloo", eqaulComment)
                                if (eqaulComment) {
                                    const commentElement = document.createElement("div");
                                    commentElement.classList.add("comment");
                                    commentElement.textContent = comment.comment;
                                    commentsSection.appendChild(commentElement);
                                }
                            });
                        } else {
                            commentsSection.textContent = "No comments found.";
                        }
                    } else {
                        commentsSection.textContent = "Failed to fetch comments.";
                    }

                    // Append the blog entry to the container
                    blogList.appendChild(blogEntry);

                    hasPosts = true; // Set the flag to true if there are matching blog posts
                }
            }
        }

        // Check if there are no matching blog posts
        if (!hasPosts) {
            const noData = document.createElement("div");
            const h1Element = document.createElement("h1");
            h1Element.textContent = "No posts";
            noData.appendChild(h1Element);
            noBlog.appendChild(noData);
        }
    } catch (error) {
        console.error("Error:", error);
    }
});



function OpenCard() {
    const addBlogCard = document.getElementById("add-blog-card");
    addBlogCard.style.display = "block";
    fetchCategories()
}
async function fetchCategories() {
    const authToken = localStorage.getItem("auth-token");
    try {
        const response = await fetch(`https://blog-backend-6b5y.onrender.com/category`, {
            headers: {
                Authorization: authToken,
            },
        });
        if (!response.ok) {
            throw new Error("Failed to fetch categories");
        }
        const categories = await response.json();
        console.log("Categories:", categories);

        const categoryDropdown = document.getElementById("category-dropdown");
        categoryDropdown.innerHTML = "";

        categories.data.forEach(category => {
            const categoryOption = document.createElement("option");
            categoryOption.value = category._id; // Set the 'value' attribute to the category ID
            categoryOption.textContent = category.name; // Display the category name
            categoryDropdown.appendChild(categoryOption);
        });
    } catch (error) {
        console.error("Error:", error.message);
    }
}


document.addEventListener("DOMContentLoaded", () => {
    const blogForm = document.getElementById("blog-form");
    const userId = localStorage.getItem("user-id");

    // Create a variable to store the selected category ID
    let selectedCategoryId = null;

    // Add an event listener to the category dropdown
    const categoryDropdown = document.getElementById("category-dropdown");
    categoryDropdown.addEventListener("change", () => {
        // Update the selectedCategoryId when the user selects a category
        selectedCategoryId = categoryDropdown.value;
        // Save the selectedCategoryId in localStorage
        localStorage.setItem("selected-category-id", selectedCategoryId);
    });

    blogForm.addEventListener("submit", async (event) => {
        event.preventDefault();

        try {
            const title = document.getElementById("title").value.trim();
            const description = document.getElementById("description").value.trim();
            const category = categoryDropdown.value.trim();
            const imageFile = document.getElementById("image").files[0];

            if (!title || !description || !category || !imageFile) {
                alert("Please fill in all fields.");
                return;
            }

            const categoryId = localStorage.getItem("selected-category-id");
            const authToken = localStorage.getItem("auth-token");

            const formData = new FormData();
            formData.append("title", title);
            formData.append("description", description);
            formData.append("idCategory", categoryId);
            formData.append("image", imageFile);
            formData.append("idUser", userId);

            const response = await fetch("https://blog-backend-6b5y.onrender.com/blog/add", {
                method: "POST",
                headers: {
                    Authorization: authToken,
                },
                body: formData,
            });

            if (!response.ok) {
                throw new Error("Failed to add the blog");
            }

            const result = await response.json();

            console.log("Response:", result);

            if (result) {
                localStorage.removeItem("selected-category-id");
                alert("Blog added successfully!");
                blogForm.reset();
                const addBlogCard = document.getElementById("add-blog-card");
                addBlogCard.style.display = "none";
                window.location.reload()
            } else {
                localStorage.removeItem("selected-category-id");
                alert("Blog submission failed.");
            }
        } catch (error) {
            localStorage.removeItem("selected-category-id");
            console.error("Error:", error.message);
            alert("An error occurred while submitting the blog.");
        }
    });

});
