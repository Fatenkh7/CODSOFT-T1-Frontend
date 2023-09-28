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

    function logout() {
        localStorage.removeItem("auth-token");
        localStorage.removeItem("user-id");
        window.location.href = "../../index.html";
    }

    document.getElementById("logout-btn").addEventListener("click", logout);
}

// searchBlogs function to filter blogs by exact match
async function searchBlogs(searchQuery) {
    try {
        const authToken = localStorage.getItem("auth-token");
        const blogList = document.getElementById("blog-list");

        // Fetch blogs that exactly match the search query
        const response = await fetch(`https://blog-backend-6b5y.onrender.com/blog?search=${searchQuery}`, {
            headers: {
                Authorization: authToken,
            },
        });

        if (!response.ok) {
            throw new Error("Failed to fetch blogs");
        }

        const data = await response.json();

        if (data.success && data.data.length > 0) {
            blogList.innerHTML = ''; // Clear previous results

            for (const blog of data.data) {
                const categoryMatch = blog.idCategory.name.toLowerCase() === searchQuery.toLowerCase();
                const titleMatch = blog.title.toLowerCase().includes(searchQuery.toLowerCase());
                const descriptionMatch = blog.description.toLowerCase().includes(searchQuery.toLowerCase());

                if (categoryMatch || titleMatch || descriptionMatch) {

                    const blogEntry = document.createElement("div");
                    blogEntry.classList.add("card");
                    blogList.appendChild(blogEntry);

                    const blogTitle = document.createElement("h2");
                    const blogDescription = document.createElement("p");
                    const blogImage = document.createElement("img");
                    const commentsSection = document.createElement("div");
                    commentsSection.classList.add("comments-section");

                    blogTitle.textContent = blog.title;
                    blogDescription.textContent = blog.description;
                    blogImage.src = `https://blog-backend-6b5y.onrender.com/${blog.image}`;
                    const addCommentButton = document.createElement("button");
                    addCommentButton.classList.add("comment-btn");
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
                }
                else {
                    const errorMessage = document.createElement("h2");
                    errorMessage.textContent = "No blogs found.";
                    blogList.innerHTML = ''; // Clear previous results
                    blogList.appendChild(errorMessage);

                }
            }
        } else {
            const errorMessage = document.createElement("p");
            errorMessage.textContent = "No blogs found.";
            blogList.innerHTML = ''; // Clear previous results
            blogList.appendChild(errorMessage);
        }
    } catch (error) {
        console.error("Error:", error);
    }
}



// Modify the searchPosts function to use searchBlogs
function searchPosts() {
    // Get the search input value
    const searchInput = document.getElementById('searchInput').value;

    if (!searchInput) {
        console.error("Search input is empty");
        return;
    }

    // Call searchBlogs with the search query
    searchBlogs(searchInput);
}


// Run the authentication check when the page loads
window.onload = checkAuthentication;

let selectedBlogId = null;

document.addEventListener("DOMContentLoaded", async () => {
    try {
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

        if (data.success && data.data.length > 0) {
            for (const blog of data.data) {
                const blogEntry = document.createElement("div");
                blogEntry.classList.add("card");
                blogList.appendChild(blogEntry);

                const blogTitle = document.createElement("h2");
                const blogDescription = document.createElement("p");
                const blogImage = document.createElement("img");
                const commentsSection = document.createElement("div");
                commentsSection.classList.add("comments-section");

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
            }
        } else {
            const errorMessage = document.createElement("p");
            errorMessage.textContent = "No blogs found.";
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

            if (commentsData && commentsData.data.length > 0) {
                commentsData.data.forEach((comment) => {
                    if (comment.idBlog && comment.idUser) {
                        let equalComment = comment.idBlog._id == selectedBlogId;
                        if (equalComment == true) {
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


async function addComment() {
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




