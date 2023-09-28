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

function subMenuToggle() {
    const submenu = document.getElementById("submenu");
    if (submenu.style.display === 'none' || submenu.style.display === '') {
        submenu.style.display = 'block';
    } else {
        submenu.style.display = 'none';
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

let selectedBlogId = null;

document.addEventListener("DOMContentLoaded", async () => {
    console.log("DOM is fully loaded");
    try {
        const authToken = localStorage.getItem("auth-token");
        const userId = localStorage.getItem("user-id")
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

        if (data.success && data.data.length > 0) {
            for (const blog of data.data) {
                let equal = blog.idUser._id === userId;

                if (equal) {
                    const blogEntry = document.createElement("div");
                    blogEntry.classList.add("card");
                    blogList.appendChild(blogEntry);

                    const blogTitle = document.createElement("h2");
                    const blogDescription = document.createElement("p");
                    const blogImage = document.createElement("img");
                    const commentsSection = document.createElement("div");
                    commentsSection.classList.add("comments-section");
                    const deleteButton = document.createElement("button");
                    deleteButton.classList.add("delete-btn");
                    deleteButton.textContent = "Delete";
                    deleteButton.addEventListener("click", () => {
                        selectedBlogId = blog._id;
                        deleteBlog(selectedBlogId);
                    });

                    blogTitle.textContent = blog.title;
                    blogDescription.textContent = blog.description;
                    blogImage.src = `https://blog-backend-6b5y.onrender.com/${blog.image}`;
                    const addCommentButton = document.createElement("button");
                    addCommentButton.classList.add("comment-btn")
                    addCommentButton.textContent = "Comments";
                    addCommentButton.addEventListener("click", () => {
                        selectedBlogId = blog._id;
                        showCommentCard(blog._id);
                    });

                    blogEntry.appendChild(blogImage);
                    blogEntry.appendChild(blogTitle);
                    blogEntry.appendChild(blogDescription);
                    blogEntry.appendChild(commentsSection);
                    blogEntry.appendChild(addCommentButton);
                    blogEntry.appendChild(deleteButton);
                }
            }
        } else {
            const errorMessage = document.createElement("h1");
            errorMessage.textContent = "No posts found.";
            blogList.appendChild(errorMessage);
        }
    } catch (error) {
        console.error("Error:", error);
    }
});

function showCommentCard(selectedBlogId) {
    const commentPopup = document.getElementById("comment-popup");
    commentPopup.style.display = "block";

    // Fetch and display comments for the selected blog
    fetchCommentsForBlog(selectedBlogId);

    // Create a container for comments above the input
    const commentsContainer = document.getElementById("comments-container");

    // Create an input element for adding comments
    const commentInput = document.getElementById("comment-input");
    commentInput.value = ""; // Clear any previous input
    commentInput.placeholder = "Enter your comment";
}


async function fetchCommentsForBlog(selectedBlogId) {
    const authToken = localStorage.getItem("auth-token");
    const commentsSection = document.getElementById("comments-section");

    // Clear the existing comments
    commentsSection.innerHTML = "";

    try {
        const commentsResponse = await fetch(`https://blog-backend-6b5y.onrender.com/comment`, {
            headers: {
                Authorization: authToken,
            },
        });

        if (commentsResponse.ok) {
            const commentsData = await commentsResponse.json();
            console.log("commmmm", commentsData)

            if (commentsData && commentsData.data.length > 0) {
                commentsData.data.forEach((comment) => {
                    console.log("commentss", comment);
                    if (comment.idBlog && comment.idUser) {
                        let equalComment = comment.idBlog._id == selectedBlogId;
                        console.log("eqqqqq", equalComment);
                        if (equalComment) {
                            const commentContainer = document.createElement("div");
                            commentContainer.classList.add("comment-container");
                            const userComment = document.createElement("h3");
                            const commentElement = document.createElement("h4");
                            userComment.textContent = comment.idUser.userName;
                            commentElement.textContent = comment.comment;

                            commentContainer.appendChild(userComment);
                            commentContainer.appendChild(commentElement);
                            commentsSection.appendChild(commentContainer);
                        }
                    }
                });
            } else {
                commentsSection.textContent = "No comments found.";
            }
        } else {
            commentsSection.textContent = "Failed to fetch comments.";
        }
    } catch (error) {
        console.error("Error fetching comments:", error);
    }
}



function hideCommentCard() {
    const commentPopup = document.getElementById("comment-popup");
    commentPopup.style.display = "none";
    fetchCommentsForBlog(selectedBlogId);
}


async function addComment(selectedBlogId) {
    const authToken = localStorage.getItem("auth-token");
    const userId = localStorage.getItem("user-id");

    // Get the comment from the textarea
    const commentInput = document.getElementById("comment-input");
    const comment = commentInput.value.trim();

    try {
        const response = await fetch(`https://blog-backend-6b5y.onrender.com/comment/add`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: authToken,
            },
            body: JSON.stringify({ comment, idBlog: selectedBlogId, idUser: userId }),
        });

        if (response.ok) {
            // Clear the comment input field after successful submission
            commentInput.value = "";
            await fetchCommentsForBlog(selectedBlogId);
            alert("Comment added successfully");

        } else {
            alert("Failed to add a comment");
        }
    } catch (error) {
        console.error("Error:", error);
    }
}



function toggleAddBlogPopup() {
    const addBlogCard = document.getElementById("add-blog-card");
    if (addBlogCard.style.display === "block") {
        hideBlogCard();
    } else {
        addBlogCard.style.display = "block";
        fetchCategories();
    }
}

function hideBlogCard() {
    const addBlogCard = document.getElementById("add-blog-card");
    addBlogCard.style.display = "none";
}

async function fetchCategories() {
    const authToken = localStorage.getItem("auth-token");
    const categoryDropdown = document.getElementById("category-dropdown");

    try {
        const response = await fetch(`https://blog-backend-6b5y.onrender.com/category`, {
            headers: {
                Authorization: authToken,
            },
        });

        if (!response.ok) {
            throw new Error("Failed to fetch categories");
        }

        const categoriesData = await response.json();
        const categories = categoriesData.data;

        // Clear the existing options in the select element
        categoryDropdown.innerHTML = "";

        // Create a default "Select category" option
        const defaultOption = document.createElement("option");
        defaultOption.value = ""; // Set the value to an empty string or whatever value you prefer
        defaultOption.textContent = "Select category";
        categoryDropdown.appendChild(defaultOption);

        // Populate the select element with category options
        categories.forEach(category => {
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

async function deleteBlog(selectedBlogId) {
    const authToken = localStorage.getItem("auth-token");

    try {
        const response = await fetch(`https://blog-backend-6b5y.onrender.com/blog/${selectedBlogId}`, {
            method: "DELETE",
            headers: {
                Authorization: authToken,
            },
        });

        if (response.ok) {
            // Remove the card from the DOM if the deletion is successful
            const deletedCard = document.querySelector(`.card[data-blog-id="${selectedBlogId}"]`);
            if (deletedCard) {
                deletedCard.remove();
            }

            alert("Blog deleted successfully!");
            window.location.reload()
        } else {
            alert("Failed to delete the blog");
        }
    } catch (error) {
        console.error("Error:", error);
    }
}
