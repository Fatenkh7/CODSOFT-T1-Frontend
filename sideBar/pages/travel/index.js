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

// ... (your existing functions)
document.addEventListener("DOMContentLoaded", async () => {
    console.log("DOM is fully loaded");
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
                let equal = blog.idCategory.name === "travel";

                if (equal) {
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
                    addCommentButton.textContent = "Comments";
                    addCommentButton.addEventListener("click", () => {
                        showCommentCard(blog._id);
                    });

                    blogEntry.appendChild(blogImage);
                    blogEntry.appendChild(blogTitle);
                    blogEntry.appendChild(blogDescription);
                    blogEntry.appendChild(commentsSection);
                    blogEntry.appendChild(addCommentButton);
                }
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

function showCommentCard(blogId) {
    const commentPopup = document.getElementById("comment-popup");
    commentPopup.style.display = "block";

    // Fetch and display comments for the selected blog
    fetchCommentsForBlog(blogId);

    // Create a container for comments above the input
    const commentsContainer = document.getElementById("comments-container");

    // Create an input element for adding comments
    const commentInput = document.getElementById("comment-input");
    commentInput.value = ""; // Clear any previous input
    commentInput.placeholder = "Enter your comment";
}


async function fetchCommentsForBlog(blogId) {
    const authToken = localStorage.getItem("auth-token");
    const commentsSection = document.getElementById("comments-section");

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
                    console.log("commentss", comment)
                    let equalComment = comment.idBlog._id == blogId;
                    console.log("eqqqqq", equalComment)
                    if (equalComment) {
                        const userComment = document.getElementById("user-comment");
                        const commentElement = document.getElementById("comment");
                        userComment.textContent = comment.idUser.userName
                        commentElement.textContent = comment.comment;
                        commentsSection.appendChild(userComment)
                        commentsSection.appendChild(commentElement);
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
}



// function addComment(blogId) {
//     const authToken = localStorage.getItem("auth-token");
//     const userId = localStorage.getItem("user-id");

//     // Get the comment from the textarea
//     const comment = document.getElementById("comment-input").value.trim();

//     try {
//         const response = fetch(`https://blog-backend-6b5y.onrender.com/comment/add`, {
//             method: "POST",
//             headers: {
//                 "Content-Type": "application/json",
//                 Authorization: authToken,
//             },
//             body: JSON.stringify({ comment, idBlog: blogId, idUser: userId }),
//         });

//         // Rest of your addComment function...
//     } catch (error) {
//         console.error("Error:", error);
//     }
// }
